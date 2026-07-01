import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Lazily initialize GoogleGenAI inside route handler to prevent startup crashes if GEMINI_API_KEY is missing.
let aiInstance: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is not configured. Please add it to your secrets in the AI Studio settings.');
    }
    aiInstance = new GoogleGenAI({ apiKey: key });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Route: Text-To-Speech (TTS) using Gemini model
  app.post('/api/tts', async (req: Request, res: Response) => {
    try {
      const { text, voiceName } = req.body;
      if (!text) {
        res.status(400).json({ error: 'Text content is required' });
        return;
      }

      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-tts-preview',
        contents: text,
        config: {
          responseModalities: ["audio"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                // Puck, Charon, Kore, Fenrir, Aoede
                voiceName: voiceName || 'Puck'
              }
            }
          }
        }
      });

      const candidate = response.candidates?.[0];
      const part = candidate?.content?.parts?.[0];

      if (part && part.inlineData) {
        const base64Data = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'audio/mp3';
        const buffer = Buffer.from(base64Data, 'base64');
        
        res.set('Content-Type', mimeType);
        res.send(buffer);
      } else {
        res.status(502).json({ error: 'No audio data was returned from the Gemini TTS API' });
      }
    } catch (error: any) {
      console.error('TTS Generation error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate text-to-speech audio' });
    }
  });

  // API Route: Create Google Keep Note (proxied)
  app.post('/api/keep/create', async (req: Request, res: Response) => {
    try {
      const { title, text, accessToken } = req.body;
      if (!accessToken) {
        res.status(401).json({ error: 'Missing access token for authentication' });
        return;
      }
      if (!title || !text) {
        res.status(400).json({ error: 'Title and note text are required' });
        return;
      }

      const response = await fetch('https://keep.googleapis.com/v1/notes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          body: {
            text: {
              text
            }
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Google Keep API responded with status ${response.status}: ${errText}`);
      }

      const data = await response.json();
      res.json({ success: true, data });
    } catch (error: any) {
      console.error('Google Keep Note creation error:', error);
      res.status(500).json({ error: error.message || 'Failed to save to Google Keep' });
    }
  });

  // API Route: Create Google Tasks task (proxied)
  app.post('/api/tasks/create', async (req: Request, res: Response) => {
    try {
      const { title, notes, accessToken } = req.body;
      if (!accessToken) {
        res.status(401).json({ error: 'Missing access token for authentication' });
        return;
      }
      if (!title) {
        res.status(400).json({ error: 'Task title is required' });
        return;
      }

      const response = await fetch('https://tasks.googleapis.com/tasks/v1/lists/@default/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          notes: notes || '',
          status: 'needsAction'
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Google Tasks API responded with status ${response.status}: ${errText}`);
      }

      const data = await response.json();
      res.json({ success: true, data });
    } catch (error: any) {
      console.error('Google Tasks creation error:', error);
      res.status(500).json({ error: error.message || 'Failed to create task in Google Tasks' });
    }
  });

  // API Route: Summarize weaknesses using Gemini
  app.post('/api/gemini/summarize-weaknesses', async (req: Request, res: Response) => {
    try {
      const { incorrectQuestions } = req.body;
      if (!incorrectQuestions || !Array.isArray(incorrectQuestions) || incorrectQuestions.length === 0) {
        res.status(400).json({ error: 'Une liste de questions incorrectes est requise.' });
        return;
      }

      const ai = getAI();
      const prompt = `Voici une liste de questions de l'examen AWS Certified Cloud Practitioner (CCP) auxquelles l'utilisateur a répondu incorrectement. 
Génère un résumé de ses points faibles (3-4 paragraphes courts ou listes à puces) et conseille-le sur les concepts clés à réviser sous forme de plan d'étude court, engageant et structuré en français. 
Réponds directement en texte Markdown. Sois encourageant mais précis sur les lacunes techniques.

Questions incorrectes :
${incorrectQuestions.slice(0, 8).map((q: any, i: number) => `- Catégorie: ${q.rubric}\n  Question: ${q.question}\n  Explication: ${q.explanation}`).join('\n\n')}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      res.json({ success: true, text: response.text });
    } catch (error: any) {
      console.error('Error generating weaknesses summary:', error);
      res.status(500).json({ error: error.message || 'Échec de la génération du résumé des points faibles.' });
    }
  });

  // API Route: Generate 3 reinforcement questions using Gemini
  app.post('/api/gemini/generate-reinforcement-questions', async (req: Request, res: Response) => {
    try {
      const { incorrectQuestions, failedCategories } = req.body;
      const ai = getAI();
      
      const categoriesText = failedCategories && failedCategories.length > 0 
        ? failedCategories.join(', ')
        : "les concepts AWS généraux";

      const prompt = `Génère exactement 3 questions de renforcement à choix multiples (QCM) de niveau AWS Certified Cloud Practitioner (CCP) axées spécifiquement sur les catégories/sujets suivants : ${categoriesText}.
Pour contexte, voici quelques-unes des questions que l'utilisateur a ratées :
${incorrectQuestions && Array.isArray(incorrectQuestions) ? incorrectQuestions.slice(0, 3).map((q: any) => `- ${q.question}`).join('\n') : "Aucun exemple disponible."}

Consignes impératives :
1. Les questions et les options de réponse (options A-D) doivent être rédigées en anglais (fidèle au format officiel de l'examen).
2. L'explication technique détaillée (explanation) doit être rédigée en français.
3. Le champ "rubric" doit être EXACTEMENT l'une de ces 4 chaînes : 'Concepts Cloud', 'Sécurité et Conformité', 'Technologie et Services', 'Facturation et Tarification'.
4. Retourne les données sous forme de tableau JSON correspondant au schéma spécifié.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER, description: "Un ID de 201 à 203" },
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      key: { type: Type.STRING },
                      text: { type: Type.STRING }
                    },
                    required: ["key", "text"]
                  }
                },
                correctAnswer: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                rubric: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["id", "question", "options", "correctAnswer", "rubric", "explanation"]
            }
          }
        }
      });

      if (!response.text) {
        throw new Error('No text returned from Gemini model');
      }

      const questions = JSON.parse(response.text.trim());
      res.json({ success: true, questions });
    } catch (error: any) {
      console.error('Error generating reinforcement questions:', error);
      res.status(500).json({ error: error.message || 'Échec de la génération des questions de renforcement.' });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

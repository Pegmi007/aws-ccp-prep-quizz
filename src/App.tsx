import { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, Auth } from 'firebase/auth';
import { 
  Cloud, 
  ShieldCheck, 
  Database, 
  FileText, 
  Play, 
  Square, 
  RotateCcw, 
  Check, 
  X, 
  Award, 
  BookOpen, 
  Volume2, 
  Bookmark, 
  Plus, 
  CheckCircle, 
  Timer, 
  Users, 
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  HelpCircle,
  FilePlus2,
  Trash2,
  LogOut,
  Info,
  TrendingUp,
  RefreshCw,
  FileQuestion,
  Layers,
  Flame,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import firebaseConfig from '../firebase-applet-config.json';
import { rubricsData, questionsData } from './questionsData';
import { Question, RubricInfo } from './types';
import ProgressionChart from './components/ProgressionChart';

// Safe check for valid Firebase Config
const isFirebasePlaceholder = firebaseConfig.apiKey.includes('placeholder');
let app: any = null;
let auth: Auth | null = null;
const provider = new GoogleAuthProvider();

// Add required scope for Google Tasks (Google Keep scope is restricted by Google's API policies for standard accounts)
provider.addScope('https://www.googleapis.com/auth/tasks');

if (!isFirebasePlaceholder) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

interface ComparisonItem {
  awsConcept: string;
  traditionalEquivalent: string;
  category: 'Réseau & Périmètre' | 'Calcul & Serveurs' | 'Sécurité & Accès' | 'Stockage & Fichiers';
  explanation: string;
  benefits: string;
}

const comparisonData: ComparisonItem[] = [
  {
    awsConcept: "Amazon VPC (Virtual Private Cloud)",
    traditionalEquivalent: "Réseau physique & VLAN",
    category: "Réseau & Périmètre",
    explanation: "Permet de définir un réseau virtuel isolé de manière logique, similaire à un réseau physique traditionnel dans un centre de données.",
    benefits: "Sécurité accrue, contrôle complet des sous-réseaux, tables de routage, et passerelles réseau sans matériel physique."
  },
  {
    awsConcept: "Security Groups (Groupes de sécurité)",
    traditionalEquivalent: "Pare-feu d'hôte (Stateful Firewall)",
    category: "Sécurité & Accès",
    explanation: "Pare-feu virtuel avec état (stateful) qui contrôle le trafic entrant et sortant au niveau de l'instance EC2.",
    benefits: "Si le trafic entrant est autorisé, le trafic sortant correspondant est automatiquement autorisé sans règle explicite supplémentaire."
  },
  {
    awsConcept: "Network ACL (NACL)",
    traditionalEquivalent: "Pare-feu de sous-réseau (Stateless Firewall)",
    category: "Réseau & Périmètre",
    explanation: "Couche de sécurité facultative avec contrôle sans état (stateless) pour contrôler le trafic au niveau du sous-réseau.",
    benefits: "Permet de bloquer explicitement des adresses IP (règles de refus), ce que les Security Groups ne permettent pas de faire."
  },
  {
    awsConcept: "Amazon EC2 (Elastic Compute Cloud)",
    traditionalEquivalent: "Serveur physique / Machine Virtuelle (VM)",
    category: "Calcul & Serveurs",
    explanation: "Fournit une capacité de calcul évolutive sous forme d'instances de serveurs virtuels.",
    benefits: "Déploiement en quelques secondes, redimensionnement à la demande et facturation à la seconde de l'utilisation."
  },
  {
    awsConcept: "Amazon EBS (Elastic Block Store)",
    traditionalEquivalent: "Réseau de Stockage SAN / Disque dur local",
    category: "Stockage & Fichiers",
    explanation: "Volume de stockage par blocs persistant et de haute performance destiné à être rattaché à une instance EC2.",
    benefits: "Sauvegardes faciles via Snapshots incrémentiels sur S3, réplication automatique au sein de la zone de disponibilité."
  },
  {
    awsConcept: "Amazon S3 (Simple Storage Service)",
    traditionalEquivalent: "Serveur de fichiers réseau (NAS) / FTP",
    category: "Stockage & Fichiers",
    explanation: "Service de stockage d'objets offrant une durabilité, une disponibilité et une évolutivité de pointe pour n'importe quel volume de données.",
    benefits: "Durabilité de 99.999999999% (11 9's), accès mondial hautement sécurisé via API, et stockage de volume virtuellement illimité."
  },
  {
    awsConcept: "IAM (Identity and Access Management)",
    traditionalEquivalent: "Active Directory (AD) / Annuaire LDAP",
    category: "Sécurité & Accès",
    explanation: "Permet de gérer de manière sécurisée les accès aux services et ressources AWS de votre organisation.",
    benefits: "Contrôle d'accès granulaire avec le principe de moindre privilège, intégration MFA et rôles d'instances sans stocker de clés d'accès."
  },
  {
    awsConcept: "AWS Route 53",
    traditionalEquivalent: "Serveur DNS physique (ex: BIND DNS)",
    category: "Réseau & Périmètre",
    explanation: "Service de système de noms de domaine (DNS) web hautement disponible et évolutif.",
    benefits: "Routage basé sur la latence, la géolocalisation ou la santé des ressources avec un basculement automatique."
  },
  {
    awsConcept: "AWS Direct Connect",
    traditionalEquivalent: "Ligne louée dédiée / Connexion MPLS",
    category: "Réseau & Périmètre",
    explanation: "Service réseau qui lie votre réseau interne physique à un emplacement AWS Direct Connect par un câble fibre optique standard.",
    benefits: "Bande passante constante, coûts de transfert de données réduits et contournement complet de l'Internet public."
  },
  {
    awsConcept: "Auto Scaling & Load Balancing",
    traditionalEquivalent: "Répartition physique de charge & Cluster manuel",
    category: "Calcul & Serveurs",
    explanation: "Ajuste automatiquement la capacité de calcul (Auto Scaling) et distribue le trafic d'applications (ELB) sur les instances saines.",
    benefits: "Évite les goulots d'étranglement ou pannes, haute disponibilité garantie et optimisation des coûts en éliminant le surprovisionnement."
  },
  {
    awsConcept: "Amazon S3 Glacier Deep Archive",
    traditionalEquivalent: "Stockage sur bandes magnétiques (LTO)",
    category: "Stockage & Fichiers",
    explanation: "Option de stockage cloud la moins chère conçue pour archiver des données rarement consultées nécessitant d'être conservées 7 à 10 ans.",
    benefits: "Élimine le coût d'achat, de maintenance et de rotation physique des bandes magnétiques avec des coûts de stockage infimes."
  }
];

export default function App() {
  // App states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'study' | 'mock-exam' | 'stats' | 'flashcards' | 'comparison' | 'all-questions'>('dashboard');
  const [selectedRubricId, setSelectedRubricId] = useState<string>('concepts-cloud');
  const [selectedVoice, setSelectedVoice] = useState<string>('Puck'); // Puck, Charon, Kore, Fenrir, Aoede
  
  // Audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authStatusMessage, setAuthStatusMessage] = useState<string | null>(null);

  // Study Mode State
  const [studyRubric, setStudyRubric] = useState<string>('all');
  const [studyIndex, setStudyIndex] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isStudyAnswerChecked, setIsStudyAnswerChecked] = useState<boolean>(false);

  // Mock Exam State
  const [isMockActive, setIsMockActive] = useState<boolean>(false);
  const [mockAnswers, setMockAnswers] = useState<{ [id: number]: string[] }>({});
  const [mockIndex, setMockIndex] = useState<number>(0);
  const [mockTimeLeft, setMockTimeLeft] = useState<number>(3600); // 60 minutes
  const [mockScore, setMockScore] = useState<{
    score: number;
    total: number;
    passed: boolean;
    breakdown: { [rubric: string]: { correct: number; total: number } };
  } | null>(null);
  const [isReviewingMistakes, setIsReviewingMistakes] = useState<boolean>(false);
  const mockTimerRef = useRef<any>(null);

  // Stats & Progression Tracker
  const [examHistory, setExamHistory] = useState<{ date: string; score: number; total: number; percentage: number }[]>([]);

  // Adaptive Learning (Gemini summarization and reinforcement)
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);
  
  const [reinforcementQuestions, setReinforcementQuestions] = useState<any[]>([]);
  const [isGeneratingReinforcement, setIsGeneratingReinforcement] = useState<boolean>(false);
  const [isReviewingReinforcement, setIsReviewingReinforcement] = useState<boolean>(false);
  const [reinforcementAnswers, setReinforcementAnswers] = useState<{ [id: number]: string[] }>({});
  const [reinforcementIndex, setReinforcementIndex] = useState<number>(0);
  const [reinforcementChecked, setReinforcementChecked] = useState<boolean>(false);

  // Flashcards state
  const [flashcardSubCategory, setFlashcardSubCategory] = useState<string>('all');
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  // Comparison State
  const [comparisonSearch, setComparisonSearch] = useState<string>('');

  // Notification States
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Initialize Firebase Auth Listener
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setAccessToken(null);
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  // Show Toast Helper
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load stats progression on mount with high-quality defaults if empty
  useEffect(() => {
    const stored = localStorage.getItem('aws_ccp_exam_history');
    if (stored) {
      try {
        setExamHistory(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Default baseline data for visual demonstration
      const defaultHistory = [
        { date: "15 Juin, 14:10", score: 28, total: 50, percentage: 56 },
        { date: "22 Juin, 10:30", score: 34, total: 50, percentage: 68 },
        { date: "28 Juin, 16:45", score: 41, total: 50, percentage: 82 },
      ];
      setExamHistory(defaultHistory);
      localStorage.setItem('aws_ccp_exam_history', JSON.stringify(defaultHistory));
    }
  }, []);

  // Simple and ultra-reliable Markdown inline formatter (React 19 safe)
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      let content = line.trim();
      if (!content) return <div key={i} className="h-2"></div>;

      if (content.startsWith('### ')) {
        return <h4 key={i} className="text-sm font-bold text-slate-900 mt-4 mb-2 font-display">{content.replace('### ', '')}</h4>;
      }
      if (content.startsWith('#### ')) {
        return <h5 key={i} className="text-xs font-bold text-slate-800 mt-3 mb-1 font-display">{content.replace('#### ', '')}</h5>;
      }
      if (content.startsWith('## ')) {
        return <h3 key={i} className="text-base font-bold text-slate-900 mt-5 mb-2.5 font-display">{content.replace('## ', '')}</h3>;
      }

      let isBullet = false;
      if (content.startsWith('- ') || content.startsWith('* ')) {
        content = content.substring(2);
        isBullet = true;
      } else if (/^\d+\.\s/.test(content)) {
        content = content.replace(/^\d+\.\s/, '');
        isBullet = true;
      }

      const parts = content.split('**');
      const renderedLine = parts.map((part, index) => {
        if (index % 2 === 1) {
          return <strong key={index} className="font-bold text-slate-900">{part}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={i} className="flex items-start gap-2.5 my-1.5 ml-2.5 text-xs sm:text-sm text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0"></span>
            <span className="leading-relaxed">{renderedLine}</span>
          </div>
        );
      }

      return (
        <p key={i} className="text-xs sm:text-sm text-slate-600 leading-relaxed my-2">{renderedLine}</p>
      );
    });
  };

  // Weakness analyzer call using Gemini with fully featured programmatic fallback
  const generateWeaknessSummary = async (incorrectQuestions: Question[]) => {
    if (incorrectQuestions.length === 0) {
      setAiSummary("Félicitations ! Vous n'avez commis aucune erreur lors de cet examen blanc. Vous maîtrisez parfaitement les sujets d'examen AWS CCP !");
      return;
    }

    setIsLoadingSummary(true);
    setAiSummary(null);
    try {
      const response = await fetch('/api/gemini/summarize-weaknesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ incorrectQuestions }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      if (data.success && data.text) {
        setAiSummary(data.text);
      } else {
        throw new Error('Invalid summary text returned');
      }
    } catch (error) {
      console.warn("API summary failed, using smart local fallback:", error);
      
      const rubricCounts: { [key: string]: number } = {};
      incorrectQuestions.forEach(q => {
        rubricCounts[q.rubric] = (rubricCounts[q.rubric] || 0) + 1;
      });

      const primaryWeakness = Object.entries(rubricCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Général';

      let fallbackText = `### 📈 Plan d'Étude Personnalisé Automatique

Basé sur vos erreurs récentes, votre zone d'effort principale se situe dans **${primaryWeakness}**.

#### 🎯 Vos lacunes à travailler en priorité :
`;

      Object.entries(rubricCounts).forEach(([rubric, count]) => {
        fallbackText += `- **${rubric}** : ${count} question(s) incorrecte(s). Les concepts liés à cette partie nécessitent une relecture active des définitions.\n`;
      });

      fallbackText += `\n#### 💡 Recommandations immédiates :
1. **Modèle de responsabilité partagée** : Rappelez-vous que la sécurité *du* cloud (bâtiments physiques, hyperviseur, matériel) est à la charge d'AWS, alors que la sécurité *dans* le cloud (systèmes d'exploitation, identités IAM, clés de chiffrement) est de votre ressort.
2. **Gestion de la facturation** : Pour éviter les mauvaises surprises de surcoût, configurez des alertes proactives via **AWS Budgets** et des alarmes CloudWatch reliées à SNS.
3. **Services de mise en cache** : Retenez qu'**Amazon ElastiCache** sert à optimiser la latence de lecture des données en mémoire vive tandis que **CloudFront** est le réseau de diffusion de contenu (CDN) mondial d'AWS.

*Astuce : Insérez votre clé \`GEMINI_API_KEY\` dans vos secrets de projet pour activer la génération dynamique sur mesure par l'IA Gemini 3.5 !*`;

      setAiSummary(fallbackText);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  // Reinforcement questions builder with custom programmatic fallback
  const generateReinforcementQuestions = async (incorrectQuestions: Question[]) => {
    setIsGeneratingReinforcement(true);
    setReinforcementQuestions([]);
    setReinforcementAnswers({});
    setReinforcementIndex(0);
    setReinforcementChecked(false);
    setIsReviewingReinforcement(true);

    const rubricCounts: { [key: string]: number } = {};
    incorrectQuestions.forEach(q => {
      rubricCounts[q.rubric] = (rubricCounts[q.rubric] || 0) + 1;
    });
    const failedCategories = Object.keys(rubricCounts);

    try {
      const response = await fetch('/api/gemini/generate-reinforcement-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          incorrectQuestions: incorrectQuestions.map(q => ({ question: q.question })),
          failedCategories,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.questions)) {
        setReinforcementQuestions(data.questions);
        showToast("3 questions ciblées de renforcement générées par Gemini !", "success");
      } else {
        throw new Error('Invalid questions format');
      }
    } catch (error) {
      console.warn("Gemini question generation error, picking from local pool:", error);
      
      const failedIds = new Set(incorrectQuestions.map(q => q.id));
      const pool = questionsData.filter(q => failedCategories.includes(q.rubric) && !failedIds.has(q.id));
      
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      
      if (selected.length < 3) {
        const remaining = questionsData.filter(q => !failedIds.has(q.id) && !selected.some(s => s.id === q.id));
        const additional = remaining.sort(() => 0.5 - Math.random()).slice(0, 3 - selected.length);
        selected.push(...additional);
      }

      const finalQuestions = selected.map((q, idx) => ({
        ...q,
        id: 400 + idx,
      }));

      setReinforcementQuestions(finalQuestions);
      showToast("Questions de renforcement extraites de notre pool local de questions.", "info");
    } finally {
      setIsGeneratingReinforcement(false);
    }
  };

  const handleReinforcementOptionSelect = (key: string, isMultipleChoice: boolean) => {
    const q = reinforcementQuestions[reinforcementIndex];
    if (!q) return;
    const currentAnswers = reinforcementAnswers[q.id] || [];
    if (isMultipleChoice) {
      if (currentAnswers.includes(key)) {
        setReinforcementAnswers({ ...reinforcementAnswers, [q.id]: currentAnswers.filter(o => o !== key) });
      } else {
        setReinforcementAnswers({ ...reinforcementAnswers, [q.id]: [...currentAnswers, key] });
      }
    } else {
      setReinforcementAnswers({ ...reinforcementAnswers, [q.id]: [key] });
    }
  };

  // Recharts radar calculation
  const getRadarData = () => {
    const categories = [
      { subject: 'Concepts Cloud', fullMark: 100 },
      { subject: 'Sécurité & Conformité', fullMark: 100 },
      { subject: 'Technologie & Services', fullMark: 100 },
      { subject: 'Facturation & Tarification', fullMark: 100 }
    ];

    if (mockScore) {
      return categories.map(cat => {
        let key = cat.subject;
        if (cat.subject === 'Sécurité & Conformité') key = 'Sécurité et Conformité';
        if (cat.subject === 'Technologie & Services') key = 'Technologie et Services';
        if (cat.subject === 'Facturation & Tarification') key = 'Facturation et Tarification';

        const stats = mockScore.breakdown[key];
        const pct = stats && stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
        return {
          ...cat,
          A: pct
        };
      });
    }

    return [
      { subject: 'Concepts Cloud', A: 75, fullMark: 100 },
      { subject: 'Sécurité & Conformité', A: 68, fullMark: 100 },
      { subject: 'Technologie & Services', A: 82, fullMark: 100 },
      { subject: 'Facturation & Tarification', A: 55, fullMark: 100 }
    ];
  };

  // Google Sign In Handler
  const handleSignIn = async () => {
    if (isFirebasePlaceholder || !auth) {
      showToast("La base Firebase n'est pas encore provisionnée ou configurée. Authentification simulée.", "info");
      // Fallback: simulated sign-in for preview experience before deploy
      setUser({
        displayName: "Peg Serges",
        email: "pegserges@gmail.com",
        photoURL: "https://lh3.googleusercontent.com/a/default-user"
      } as any);
      setAccessToken("simulated_access_token");
      return;
    }

    setIsLoggingIn(true);
    setAuthStatusMessage("Connexion Google en cours...");
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setAccessToken(credential.accessToken);
        setUser(result.user);
        showToast(`Connecté en tant que ${result.user.displayName}`, "success");
      } else {
        throw new Error("Impossible d'obtenir le jeton d'accès de Google.");
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      showToast(error.message || "Échec de l'authentification", "error");
    } finally {
      setIsLoggingIn(false);
      setAuthStatusMessage(null);
    }
  };

  // Sign Out Handler
  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
    }
    setUser(null);
    setAccessToken(null);
    showToast("Déconnecté avec succès", "info");
  };

  // Text-To-Speech API Handler using Gemini 3.1 TTS model
  const playTTS = async (text: string) => {
    // If audio is playing, stop it
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    setAudioError(null);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceName: selectedVoice,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la génération audio');
      }

      // Load and play audio blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlayingAudio(false);
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
        fallbackClientTTS(text);
      };

      await audio.play();
    } catch (error: any) {
      console.warn("Gemini TTS non disponible, utilisation du synthétiseur local :", error.message);
      // Fallback to local client SpeechSynthesis
      fallbackClientTTS(text);
    }
  };

  // Browser-based Client SpeechSynthesis Fallback
  const fallbackClientTTS = (text: string) => {
    if (!('speechSynthesis' in window)) {
      showToast("La synthèse vocale n'est pas supportée sur ce navigateur.", "error");
      setIsPlayingAudio(false);
      return;
    }

    // Cancel currently speaking
    window.speechSynthesis.cancel();

    // Clean text from tags or code
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR'; // french
    utterance.rate = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Google Keep Note creation integration (requires confirmation for mutation)
  const saveToGoogleKeep = async (rubric: RubricInfo) => {
    if (!user) {
      showToast("Veuillez d'abord vous connecter à Google Workspace.", "error");
      return;
    }

    const noteContent = `Points clés pour ${rubric.title} :\n\n` + 
      rubric.keyPoints.map((pt, i) => `${i+1}. ${pt}`).join('\n\n') + 
      `\n\n_Généré depuis AWS CCP Practice Exam App_`;

    // Inform user that Google Keep direct API is restricted by Google's API policies for standard accounts,
    // and offer the best alternatives (Google Tasks, Clipboard, or Open Keep).
    const choice = window.confirm(
      `L'API Google Keep directe nécessite un compte Workspace Enterprise sous contrôle d'administrateur.\n\n` +
      `• Cliquez sur "OK" pour copier les points clés dans votre presse-papiers et ouvrir Google Keep.\n` +
      `• Cliquez sur "Annuler" pour enregistrer automatiquement ce résumé complet comme tâche d'étude dans vos Google Tasks.`
    );

    if (choice) {
      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(noteContent);
        showToast("Points clés copiés dans le presse-papiers !", "success");
        // Open Google Keep
        window.open("https://keep.google.com/", "_blank");
      } catch (err) {
        showToast("Échec de la copie. Veuillez copier manuellement.", "error");
      }
    } else {
      // Create as a task in Google Tasks
      showToast("Planification dans Google Tasks...", "info");
      
      if (isFirebasePlaceholder || !accessToken || accessToken === "simulated_access_token") {
        showToast(`[Simulation] Résumé "${rubric.title}" ajouté à Google Tasks !`, "success");
        return;
      }

      try {
        const response = await fetch('/api/tasks/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: `AWS CCP : Réviser ${rubric.title}`,
            notes: noteContent,
            accessToken,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur API Google Tasks');
        }

        showToast(`Résumé "${rubric.title}" ajouté avec succès à vos tâches Google Tasks !`, "success");
      } catch (error: any) {
        showToast(error.message || "Échec d'enregistrement Google Tasks", "error");
      }
    }
  };

  // Google Tasks task creation integration (requires confirmation for mutation)
  const saveToGoogleTasks = async (question: Question) => {
    if (!user) {
      showToast("Veuillez vous connecter à Google Workspace pour ajouter à Google Tasks.", "error");
      return;
    }

    const confirmTask = window.confirm(
      `Voulez-vous planifier une tâche sur Google Tasks pour réviser la question ${question.id} ?`
    );
    if (!confirmTask) return;

    const taskTitle = `Réviser Question AWS ${question.id} (${question.rubric})`;
    const taskNotes = `Question : ${question.question}\n\nOption correcte : ${question.correctAnswer.join(', ')}\nExplication : ${question.explanation}`;

    if (isFirebasePlaceholder || !accessToken || accessToken === "simulated_access_token") {
      // Offline Simulation
      showToast(`[Simulation] Tâche "${taskTitle}" créée dans Google Tasks !`, "success");
      return;
    }

    showToast("Création de la tâche Google Tasks...", "info");

    try {
      const response = await fetch('/api/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskTitle,
          notes: taskNotes,
          accessToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur API Google Tasks');
      }

      showToast(`Tâche créée avec succès dans Google Tasks !`, "success");
    } catch (error: any) {
      showToast(error.message || "Échec de création Google Tasks", "error");
    }
  };

  // Helper to resolve Icons based on rubric config
  const getRubricIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cloud': return <Cloud className="w-5 h-5 text-sky-500" />;
      case 'ShieldAlert': return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case 'Server': return <Database className="w-5 h-5 text-indigo-500" />;
      case 'Receipt': return <FileText className="w-5 h-5 text-amber-500" />;
      default: return <HelpCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  // Filter questions for Study Mode
  const filteredStudyQuestions = questionsData.filter(q => {
    if (studyRubric === 'all') return true;
    return q.rubric === studyRubric;
  });

  // Safe navigation in Study Mode
  const currentStudyQuestion = filteredStudyQuestions[studyIndex] || filteredStudyQuestions[0];

  useEffect(() => {
    // Reset selections on question change
    setSelectedOptions([]);
    setIsStudyAnswerChecked(false);
  }, [studyIndex, studyRubric]);

  // Global Keyboard Navigation (Left/Right arrow, Enter, Space)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Avoid interference if the user is typing in form inputs (like in direct question search, or comparison search)
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA' || 
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (activeTab === 'study') {
        if (event.key === 'ArrowLeft') {
          setStudyIndex(prev => Math.max(0, prev - 1));
        } else if (event.key === 'ArrowRight') {
          setStudyIndex(prev => Math.min(filteredStudyQuestions.length - 1, prev + 1));
        } else if (event.key === 'Enter') {
          if (!isStudyAnswerChecked) {
            setIsStudyAnswerChecked(true);
          }
        }
      } else if (activeTab === 'mock-exam' && isMockActive) {
        if (event.key === 'ArrowLeft') {
          setMockIndex(prev => Math.max(0, prev - 1));
        } else if (event.key === 'ArrowRight') {
          setMockIndex(prev => Math.min(questionsData.length - 1, prev + 1));
        }
      } else if (activeTab === 'flashcards') {
        const filteredCards = rubricsData.flatMap((rubric) => {
          return rubric.keyPoints.map((point, idx) => {
            const parts = point.split(' : ');
            return {
              id: `${rubric.id}-${idx}`,
              category: rubric.title,
              categoryId: rubric.id,
              front: parts[0] || rubric.title,
              back: parts[1] || point,
            };
          });
        }).filter(card => flashcardSubCategory === 'all' || card.categoryId === flashcardSubCategory);

        if (event.key === 'ArrowLeft') {
          setFlashcardIndex(prev => Math.max(0, prev - 1));
          setIsCardFlipped(false);
        } else if (event.key === 'ArrowRight') {
          setFlashcardIndex(prev => Math.min(filteredCards.length - 1, prev + 1));
          setIsCardFlipped(false);
        } else if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault();
          setIsCardFlipped(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, isMockActive, filteredStudyQuestions, isStudyAnswerChecked, flashcardSubCategory, flashcardIndex]);

  // Handle option select in Study Mode
  const handleStudyOptionSelect = (key: string, isMultipleChoice: boolean) => {
    if (isStudyAnswerChecked) return;
    if (isMultipleChoice) {
      if (selectedOptions.includes(key)) {
        setSelectedOptions(selectedOptions.filter(o => o !== key));
      } else {
        setSelectedOptions([...selectedOptions, key]);
      }
    } else {
      setSelectedOptions([key]);
    }
  };

  // Mock Exam Logic
  const startMockExam = () => {
    setIsMockActive(true);
    setMockAnswers({});
    setMockIndex(0);
    setMockTimeLeft(3600); // 60 minutes
    setMockScore(null);
    setIsReviewingMistakes(false);
    showToast("Examen blanc commencé ! Bonne chance.", "info");

    // Launch Timer
    if (mockTimerRef.current) clearInterval(mockTimerRef.current);
    mockTimerRef.current = setInterval(() => {
      setMockTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(mockTimerRef.current);
          submitMockExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleMockOptionSelect = (questionId: number, key: string, isMultipleChoice: boolean) => {
    const currentAnswers = mockAnswers[questionId] || [];
    if (isMultipleChoice) {
      if (currentAnswers.includes(key)) {
        setMockAnswers({ ...mockAnswers, [questionId]: currentAnswers.filter(o => o !== key) });
      } else {
        setMockAnswers({ ...mockAnswers, [questionId]: [...currentAnswers, key] });
      }
    } else {
      setMockAnswers({ ...mockAnswers, [questionId]: [key] });
    }
  };

  const submitMockExam = (isTimeOut = false) => {
    if (mockTimerRef.current) clearInterval(mockTimerRef.current);
    
    // Evaluate Score
    let correctCount = 0;
    const breakdown: { [rubric: string]: { correct: number; total: number } } = {
      'Concepts Cloud': { correct: 0, total: 0 },
      'Sécurité et Conformité': { correct: 0, total: 0 },
      'Technologie et Services': { correct: 0, total: 0 },
      'Facturation et Tarification': { correct: 0, total: 0 }
    };

    questionsData.forEach(q => {
      breakdown[q.rubric].total += 1;
      const userAns = mockAnswers[q.id] || [];
      const correctAns = q.correctAnswer;
      
      // Match sets
      const isCorrect = userAns.length === correctAns.length && 
                        userAns.every(val => correctAns.includes(val));
      
      if (isCorrect) {
        correctCount += 1;
        breakdown[q.rubric].correct += 1;
      }
    });

    const percent = Math.round((correctCount / questionsData.length) * 100);
    const passed = percent >= 70; // AWS standard passing score is roughly 70%

    setMockScore({
      score: correctCount,
      total: questionsData.length,
      passed,
      breakdown
    });
    setIsMockActive(false);

    // Save history entry to local storage
    const newEntry = {
      date: new Date().toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      score: correctCount,
      total: questionsData.length,
      percentage: percent
    };
    const updatedHistory = [...examHistory, newEntry].slice(-10); // keep last 10 attempts
    setExamHistory(updatedHistory);
    localStorage.setItem('aws_ccp_exam_history', JSON.stringify(updatedHistory));

    // Reset adaptive states & generate weakness analysis automatically
    setAiSummary(null);
    setReinforcementQuestions([]);
    setIsReviewingReinforcement(false);

    const incorrect = questionsData.filter(q => {
      const userAns = mockAnswers[q.id] || [];
      const correctAns = q.correctAnswer;
      return !(userAns.length === correctAns.length && userAns.every(val => correctAns.includes(val)));
    });

    generateWeaknessSummary(incorrect);

    if (isTimeOut) {
      showToast("Temps écoulé ! Votre examen a été soumis automatiquement.", "error");
    } else {
      showToast(`Examen soumis ! Score : ${percent}% (${correctCount}/${questionsData.length})`, passed ? "success" : "error");
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 text-white rounded-xl shadow-md shadow-orange-500/20">
              <Award className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-slate-950 flex items-center gap-2">
                AWS CCP <span className="text-orange-500">Exam Prep</span>
              </h1>
              <p className="text-xs text-slate-500 font-mono">Practice Exam 1 • 50 Questions</p>
            </div>
          </div>

          {/* Action Header controls */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Voices selection */}
            <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1 text-xs font-medium text-slate-600 border border-slate-200">
              <Volume2 className="w-3.5 h-3.5 ml-1 text-slate-500" />
              <span className="hidden sm:inline">Voix :</span>
              <select 
                value={selectedVoice} 
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="bg-transparent border-none outline-none pr-1 py-0.5 cursor-pointer font-medium text-slate-700"
              >
                <option value="Puck">Puck (Homme)</option>
                <option value="Charon">Charon (Calme)</option>
                <option value="Kore">Kore (Femme)</option>
                <option value="Fenrir">Fenrir (Monotone)</option>
                <option value="Aoede">Aoede (Expressif)</option>
              </select>
            </div>

            {/* Google workspace OAuth controller */}
            <AnimatePresence mode="wait">
              {user ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl pl-2 pr-1 py-1 text-xs text-emerald-800 font-medium"
                >
                  <span className="max-w-[120px] truncate">{user.displayName || user.email}</span>
                  <button 
                    onClick={handleSignOut}
                    className="p-1 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 rounded-lg transition"
                    title="Se déconnecter"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignIn}
                  disabled={isLoggingIn}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-800 shadow-sm transition disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  <span>Connecter Keep & Tasks</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-4 overflow-x-auto py-2.5 scrollbar-thin">
              <button
                onClick={() => { setActiveTab('dashboard'); if(isMockActive) submitMockExam(); }}
                className={`text-xs sm:text-sm font-semibold whitespace-nowrap px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
                }`}
              >
                Synthèse & Rubriques
              </button>
              <button
                onClick={() => { setActiveTab('study'); if(isMockActive) submitMockExam(); }}
                className={`text-xs sm:text-sm font-semibold whitespace-nowrap px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'study'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
                }`}
              >
                Mode Étude
              </button>
              <button
                onClick={() => setActiveTab('mock-exam')}
                className={`text-xs sm:text-sm font-semibold whitespace-nowrap px-3 py-1.5 rounded-lg transition-all cursor-pointer relative ${
                  activeTab === 'mock-exam'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
                }`}
              >
                Examen Blanc
                {isMockActive && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                )}
              </button>
              <button
                onClick={() => { setActiveTab('stats'); if(isMockActive) submitMockExam(); }}
                className={`text-xs sm:text-sm font-semibold whitespace-nowrap px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'stats'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Statistiques</span>
              </button>
              <button
                onClick={() => { setActiveTab('flashcards'); if(isMockActive) submitMockExam(); }}
                className={`text-xs sm:text-sm font-semibold whitespace-nowrap px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'flashcards'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Flashcards Rapides</span>
              </button>
              <button
                onClick={() => { setActiveTab('comparison'); if(isMockActive) submitMockExam(); }}
                className={`text-xs sm:text-sm font-semibold whitespace-nowrap px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'comparison'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Pont Technique</span>
              </button>
              <button
                onClick={() => { setActiveTab('all-questions'); if(isMockActive) submitMockExam(); }}
                className={`text-xs sm:text-sm font-semibold whitespace-nowrap px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'all-questions'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
                }`}
              >
                Toutes les Questions ({questionsData.length})
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* FLOATING AUDIO STATUS OR TOAST NOTIFICATION */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
        {isPlayingAudio && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="bg-slate-950 text-white px-4 py-3 rounded-2xl flex items-center gap-3 shadow-2xl border border-slate-800"
          >
            <div className="flex gap-1 items-end h-3.5">
              <span className="w-1 bg-orange-500 h-2 animate-bounce"></span>
              <span className="w-1 bg-orange-500 h-4 animate-bounce" style={{ animationDelay: '0.1s' }}></span>
              <span className="w-1 bg-orange-500 h-3 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1 bg-orange-500 h-1 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
            </div>
            <span className="text-xs font-semibold">Gemini lit le texte...</span>
            <button 
              onClick={() => { if(audioRef.current) audioRef.current.pause(); window.speechSynthesis.cancel(); setIsPlayingAudio(false); }}
              className="p-1 hover:bg-slate-800 rounded-lg transition ml-1 text-slate-400 hover:text-white"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          </motion.div>
        )}

        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold border ${
                toastMessage.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : toastMessage.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-indigo-50 text-indigo-800 border-indigo-200'
              }`}
            >
              {toastMessage.type === 'success' && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              {toastMessage.type === 'error' && <X className="w-4 h-4 text-rose-600 shrink-0" />}
              {toastMessage.type === 'info' && <Info className="w-4 h-4 text-indigo-600 shrink-0" />}
              <span>{toastMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CORE FRAME CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: DASHBOARD & RUBRIC SUMMARY */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Quick stats & welcome card */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Cloud className="w-56 h-56" />
              </div>
              <div className="max-w-2xl relative z-10">
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-[11px] font-bold rounded-full border border-orange-500/30 uppercase tracking-widest">
                  Analyse & Extraction d'Examen
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display mt-3 text-white tracking-tight">
                  AWS Practice Exam 1 : Synthèse des Connaissances
                </h2>
                <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">
                  Nous avons extrait et analysé les 50 questions de l'examen de certification d'architecte AWS. 
                  Elles sont classées en 4 rubriques officielles d'évaluation pour vous aider à réviser avec efficacité.
                </p>
                <div className="mt-5 flex flex-wrap gap-4">
                  <button
                    onClick={() => setActiveTab('study')}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-md shadow-orange-500/10 cursor-pointer"
                  >
                    Démarrer le Mode Étude
                  </button>
                  <button
                    onClick={() => {
                      const textToRead = "AWS Certified Cloud Practitioner - Synthèse des rubriques. " + 
                        "Concepts Cloud, Sécurité et Conformité, Technologie et Services, Facturation et Tarification.";
                      playTTS(textToRead);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-orange-400 hover:text-orange-300 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-700 transition flex items-center gap-2 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Écouter la Présentation</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Rubrics Selector Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {rubricsData.map(rubric => {
                const count = questionsData.filter(q => q.rubric === rubric.title).length;
                const isSelected = selectedRubricId === rubric.id;
                return (
                  <button
                    key={rubric.id}
                    onClick={() => setSelectedRubricId(rubric.id)}
                    className={`p-5 rounded-2xl text-left border transition cursor-pointer flex flex-col justify-between h-[155px] ${
                      isSelected 
                        ? 'bg-white border-orange-500 shadow-lg ring-2 ring-orange-500/15' 
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-orange-50 text-orange-500' : 'bg-slate-100 text-slate-600'}`}>
                        {getRubricIcon(rubric.iconName)}
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {count} questions
                      </span>
                    </div>
                    <div className="mt-3">
                      <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{rubric.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{rubric.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Rubric Key Points (Analysis) */}
            {selectedRubricId && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
                {(() => {
                  const rubric = rubricsData.find(r => r.id === selectedRubricId)!;
                  return (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl">
                            {getRubricIcon(rubric.iconName)}
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-orange-500">Rubrique de Certification</span>
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display mt-0.5">{rubric.title}</h3>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2.5">
                          <button
                            onClick={() => {
                              const content = `${rubric.title}. ${rubric.description}. ` + rubric.keyPoints.join('. ');
                              playTTS(content);
                            }}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Lecture Audio</span>
                          </button>
                          
                          <button
                            onClick={() => saveToGoogleKeep(rubric)}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-orange-50 hover:bg-orange-100 text-orange-700 px-3.5 py-2 rounded-xl transition cursor-pointer"
                            title="Exporter ce résumé vers Google Keep"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>Exporter vers Google Keep</span>
                          </button>
                        </div>
                      </div>

                      {/* Points clés listing */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Points Clés à Retenir :</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {rubric.keyPoints.map((point, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3">
                              <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold font-mono">
                                {idx + 1}
                              </div>
                              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{point}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Callout action to test */}
                      <div className="bg-slate-50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-slate-100">
                        <div className="flex items-center gap-2.5 text-slate-600">
                          <HelpCircle className="w-5 h-5 text-slate-400" />
                          <span className="text-xs sm:text-sm">Envie de vous tester immédiatement sur cette rubrique ?</span>
                        </div>
                        <button
                          onClick={() => {
                            setStudyRubric(rubric.title);
                            setStudyIndex(0);
                            setActiveTab('study');
                          }}
                          className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition cursor-pointer self-start sm:self-auto"
                        >
                          Lancer le quizz ({questionsData.filter(q => q.rubric === rubric.title).length} questions)
                        </button>
                      </div>

                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* TAB STATS: DATA-DRIVEN DASHBOARD */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-display text-slate-950 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500 shrink-0" />
                  Tableau de bord de suivi (Data-Driven)
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Suivez vos performances réelles, visualisez votre maîtrise globale et ciblez vos révisions.
                </p>
              </div>
              <button
                onClick={() => {
                  const stored = localStorage.getItem('aws_ccp_exam_history');
                  if (stored) {
                    setExamHistory(JSON.parse(stored));
                  }
                  showToast("Statistiques actualisées !", "success");
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Actualiser</span>
              </button>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block">Examens passés</span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">{examHistory.length}</span>
                <span className="text-[11px] text-slate-500 mt-1 block">Attempts enregistrés</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block">Meilleur Score</span>
                <span className="text-2xl font-bold text-emerald-600 mt-1 block">
                  {examHistory.length > 0 ? `${Math.max(...examHistory.map(h => h.percentage))}%` : 'N/A'}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">Objectif de réussite : 70%</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block">Score Moyen</span>
                <span className="text-2xl font-bold text-slate-900 mt-1 block">
                  {examHistory.length > 0 ? `${Math.round(examHistory.reduce((acc, h) => acc + h.percentage, 0) / examHistory.length)}%` : 'N/A'}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">Moyenne cumulée</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs bg-gradient-to-br from-orange-50 to-orange-100/30 border-orange-200/50">
                <span className="text-xs text-orange-600 font-mono uppercase tracking-wider block">Zone à réviser</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block truncate">
                  {(() => {
                    const radar = getRadarData();
                    const minCat = [...radar].sort((a, b) => a.A - b.A)[0];
                    return minCat ? `${minCat.subject} (${minCat.A}%)` : 'Aucune';
                  })()}
                </span>
                <span className="text-[11px] text-orange-700 mt-1 block">Priorité d'effort</span>
              </div>
            </div>

            {/* Recharts section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* Progress Line AreaChart */}
              <div className="lg:col-span-3">
                <ProgressionChart examHistory={examHistory} />
              </div>

              {/* Radar Chart (Mastery level) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs lg:col-span-2 space-y-4">
                <div>
                  <h3 className="font-bold text-slate-950 text-sm sm:text-base font-display">Maîtrise par Catégorie</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Votre niveau de compréhension par domaine de certification.</p>
                </div>

                <div className="h-64 sm:h-72 w-full flex items-center justify-center text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData()}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" stroke="#64748b" style={{ fontSize: '10px', fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" style={{ fontSize: '9px' }} />
                      <Radar 
                        name="Maîtrise" 
                        dataKey="A" 
                        stroke="#f97316" 
                        fill="#ffedd5" 
                        fillOpacity={0.6} 
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Diagnostic advice card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="space-y-1">
                <h4 className="font-bold text-sm sm:text-base font-display text-orange-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
                  Prêt à valider votre Examen Blanc ?
                </h4>
                <p className="text-xs text-slate-300 max-w-xl">
                  Un score de 70% est généralement requis pour réussir la certification AWS CCP officielle. 
                  Nous vous suggérons de maintenir un taux de réussite régulier de 80% sur cet entraînement avant le grand jour !
                </p>
              </div>
              <button
                onClick={() => setActiveTab('mock-exam')}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-semibold px-4.5 py-2.5 rounded-xl transition cursor-pointer shadow-md shadow-orange-500/10 self-start sm:self-auto"
              >
                Lancer l'Examen Blanc (50 Questions)
              </button>
            </div>
          </div>
        )}

        {/* TAB FLASHCARDS: RAPID REVISION DECK */}
        {activeTab === 'flashcards' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-display text-slate-950 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-orange-500 shrink-0" />
                  Mode Flashcards Rapides
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Familiarisez-vous avec les définitions clés et acronymes AWS via un apprentissage par répétition espacée. Utilisez <kbd className="bg-slate-100 border border-slate-200 px-1 py-0.5 rounded text-[10px] font-mono">Entrée</kbd> ou <kbd className="bg-slate-100 border border-slate-200 px-1 py-0.5 rounded text-[10px] font-mono">Espace</kbd> pour retourner la carte, et les flèches directionnelles pour naviguer.
                </p>
              </div>

              {/* Rubric filter in Flashcard view */}
              <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => { setFlashcardSubCategory('all'); setFlashcardIndex(0); setIsCardFlipped(false); }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                    flashcardSubCategory === 'all' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tout
                </button>
                {rubricsData.map(rub => (
                  <button
                    key={rub.id}
                    onClick={() => { setFlashcardSubCategory(rub.id); setFlashcardIndex(0); setIsCardFlipped(false); }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                      flashcardSubCategory === rub.id ? 'bg-orange-500 text-white' : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    {rub.id === 'concepts-cloud' ? 'Concepts' : rub.id === 'securite-conformite' ? 'Sécurité' : rub.id === 'technologie-services' ? 'Technologie' : 'Facturation'}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Interactive Deck */}
            {(() => {
              const cards = rubricsData.flatMap((rubric) => {
                return rubric.keyPoints.map((point, idx) => {
                  const parts = point.split(' : ');
                  return {
                    id: `${rubric.id}-${idx}`,
                    category: rubric.title,
                    categoryId: rubric.id,
                    front: parts[0] || rubric.title,
                    back: parts[1] || point,
                  };
                });
              }).filter(card => flashcardSubCategory === 'all' || card.categoryId === flashcardSubCategory);

              const currentCard = cards[flashcardIndex];

              if (!currentCard) {
                return (
                  <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500">
                    Aucune flashcard disponible.
                  </div>
                );
              }

              return (
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Progress Counter */}
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>DOMAINE : {currentCard.category}</span>
                    <span>CARTE {flashcardIndex + 1} SUR {cards.length}</span>
                  </div>

                  {/* 3D card layout */}
                  <div 
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="w-full h-80 sm:h-96 [perspective:1000px] cursor-pointer"
                  >
                    <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
                      isCardFlipped ? '[transform:rotateY(180deg)]' : ''
                    }`}>
                      
                      {/* FRONT OF THE CARD */}
                      <div className="absolute inset-0 w-full h-full bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm [backface-visibility:hidden]">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-bold rounded-lg uppercase tracking-wider font-mono">
                            Terme AWS / Acronyme
                          </span>
                          <Brain className="w-5 h-5 text-slate-300" />
                        </div>

                        <div className="text-center py-6">
                          <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 px-4">
                            {currentCard.front}
                          </h3>
                        </div>

                        <div className="text-center text-xs text-slate-400 font-mono uppercase tracking-widest flex items-center justify-center gap-1">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                          <span>Cliquer pour retourner la carte</span>
                        </div>
                      </div>

                      {/* BACK OF THE CARD */}
                      <div className="absolute inset-0 w-full h-full bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)] border-2 border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-900 text-[10px] font-bold rounded-lg uppercase tracking-wider font-mono">
                            Définition / Explication
                          </span>
                          <Sparkles className="w-5 h-5 text-orange-400" />
                        </div>

                        <div className="py-4">
                          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans text-center">
                            {currentCard.back}
                          </p>
                        </div>

                        <div className="text-center text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                          Cliquer pour masquer l'explication
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Navigation controls below card */}
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => {
                        if (flashcardIndex > 0) {
                          setFlashcardIndex(flashcardIndex - 1);
                          setIsCardFlipped(false);
                        }
                      }}
                      disabled={flashcardIndex === 0}
                      className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs transition disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Précédente</span>
                    </button>

                    <button
                      onClick={() => setIsCardFlipped(!isCardFlipped)}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                    >
                      {isCardFlipped ? "Voir la Question" : "Révéler la Réponse"}
                    </button>

                    <button
                      onClick={() => {
                        if (flashcardIndex < cards.length - 1) {
                          setFlashcardIndex(flashcardIndex + 1);
                          setIsCardFlipped(false);
                        }
                      }}
                      disabled={flashcardIndex === cards.length - 1}
                      className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs transition disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Suivante</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })()}
          </div>
        )}

        {/* TAB COMPARISON: BRIDGING TRADITIONAL IT AND CLOUD ARCHITECTURE */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div>
                <h2 className="text-xl font-bold font-display text-slate-950 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-orange-500 shrink-0" />
                  Pont Technique : Traditionnel vs Cloud AWS
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Destiné aux administrateurs systèmes et ingénieurs issus de l'on-premise. Comparez instantanément vos infrastructures physiques traditionnelles avec les équivalences de services managés d'AWS.
                </p>
              </div>

              {/* Search and Category Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Rechercher un concept ou équivalent traditionnel..."
                  value={comparisonSearch}
                  onChange={(e) => setComparisonSearch(e.target.value)}
                  className="bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm border border-slate-200 focus:border-orange-500 rounded-xl px-4 py-2.5 outline-none flex-1 transition"
                />
                
                {comparisonSearch && (
                  <button 
                    onClick={() => setComparisonSearch('')}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition animate-fade-in"
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>

            {/* List of comparisons matching search */}
            {(() => {
              const filtered = comparisonData.filter(item => {
                const searchLower = comparisonSearch.toLowerCase();
                return item.awsConcept.toLowerCase().includes(searchLower) ||
                       item.traditionalEquivalent.toLowerCase().includes(searchLower) ||
                       item.explanation.toLowerCase().includes(searchLower) ||
                       item.category.toLowerCase().includes(searchLower);
              });

              if (filtered.length === 0) {
                return (
                  <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400">
                    Aucun concept correspondant à votre recherche.
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.map((item, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4 transition flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
                            {item.category}
                          </span>
                          <span className="text-xs text-slate-400 font-mono"># {idx + 1}</span>
                        </div>

                        {/* Traditional vs AWS Concept */}
                        <div className="grid grid-cols-2 gap-4 items-stretch py-1 border-y border-slate-100">
                          <div className="pr-3 border-r border-slate-100 flex flex-col justify-center">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Traditionnel (On-Premise)</span>
                            <span className="text-xs sm:text-sm font-bold text-slate-700 mt-1 block">{item.traditionalEquivalent}</span>
                          </div>
                          <div className="pl-1 flex flex-col justify-center">
                            <span className="text-[10px] font-mono text-orange-500 uppercase tracking-wider block">Équivalent AWS Cloud</span>
                            <span className="text-xs sm:text-sm font-bold text-orange-600 mt-1 block">{item.awsConcept}</span>
                          </div>
                        </div>

                        <div className="space-y-2 pt-1">
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                            {item.explanation}
                          </p>
                          <p className="text-xs text-emerald-700 bg-emerald-50 rounded-xl p-3 border border-emerald-100 leading-normal">
                            <strong className="font-bold">Avantages Cloud :</strong> {item.benefits}
                          </p>
                        </div>
                      </div>

                      {/* Study trigger in specific category */}
                      <button
                        onClick={() => {
                          let studyRubricName = 'Concepts Cloud';
                          if (item.category === 'Sécurité & Accès') studyRubricName = 'Sécurité et Conformité';
                          if (item.category === 'Calcul & Serveurs' || item.category === 'Réseau & Périmètre' || item.category === 'Stockage & Fichiers') {
                            studyRubricName = 'Technologie et Services';
                          }
                          setStudyRubric(studyRubricName);
                          setStudyIndex(0);
                          setActiveTab('study');
                        }}
                        className="text-[11px] font-bold text-slate-800 hover:text-orange-500 hover:underline flex items-center gap-1.5 transition pt-2 self-start"
                      >
                        <BookOpen className="w-3.5 h-3.5 shrink-0" />
                        <span>Étudier cette catégorie dans le Quizz ({item.category})</span>
                      </button>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 2: STUDY MODE */}
        {activeTab === 'study' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Sidebar with rubric filters */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                <h3 className="font-bold text-sm text-slate-950 mb-3 font-display">Filtrer par Rubrique :</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => { setStudyRubric('all'); setStudyIndex(0); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                      studyRubric === 'all' 
                        ? 'bg-orange-500 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>Toutes les questions</span>
                    <span className="text-[10px] opacity-75 font-mono">({questionsData.length})</span>
                  </button>

                  {rubricsData.map(rubric => {
                    const count = questionsData.filter(q => q.rubric === rubric.title).length;
                    return (
                      <button
                        key={rubric.id}
                        onClick={() => { setStudyRubric(rubric.title); setStudyIndex(0); }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                          studyRubric === rubric.title 
                            ? 'bg-orange-500 text-white shadow-xs' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate">{rubric.title}</span>
                        <span className="text-[10px] opacity-75 font-mono">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Study Info Card */}
              <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 text-xs text-orange-900">
                <div className="flex items-center gap-2 font-bold mb-1.5 text-orange-800">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Mode Étude Interactif</span>
                </div>
                <p className="leading-relaxed">
                  Sélectionnez vos réponses, puis validez pour afficher instantanément la correction. 
                  Vous pouvez utiliser le haut-parleur pour écouter la question grâce à Gemini, 
                  ou l'ajouter à vos Google Tasks de révision.
                </p>
              </div>
            </div>

            {/* Main Quiz Area */}
            <div className="lg:col-span-2 space-y-4">
              
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs relative">
                
                {/* Topic Header badge */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-200 uppercase tracking-wider">
                    {currentStudyQuestion.rubric}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const content = `Question ${currentStudyQuestion.id}. ${currentStudyQuestion.question} ` + 
                          currentStudyQuestion.options.map(o => `Option ${o.key}: ${o.text}`).join('. ');
                        playTTS(content);
                      }}
                      className="p-2 hover:bg-slate-100 text-slate-600 hover:text-slate-950 rounded-xl transition"
                      title="Écouter la question (Gemini TTS)"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => saveToGoogleTasks(currentStudyQuestion)}
                      className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
                      title="Créer une tâche sur Google Tasks"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Google Tasks</span>
                    </button>

                    <span className="text-xs font-mono font-bold text-slate-400 ml-1">
                      {studyIndex + 1} / {filteredStudyQuestions.length}
                    </span>
                  </div>
                </div>

                {/* Question */}
                <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 leading-snug">
                  Question {currentStudyQuestion.id} : {currentStudyQuestion.question}
                </h2>

                {currentStudyQuestion.correctAnswer.length > 1 && (
                  <p className="text-xs font-bold text-orange-600 mt-2">
                    * Attention, sélectionnez {currentStudyQuestion.correctAnswer.length} réponses pour cette question !
                  </p>
                )}

                {/* Options List */}
                <div className="mt-6 space-y-3">
                  {currentStudyQuestion.options.map(option => {
                    const isSelected = selectedOptions.includes(option.key);
                    const isCorrect = currentStudyQuestion.correctAnswer.includes(option.key);
                    
                    let optionStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50';
                    if (isSelected) {
                      optionStyle = 'border-orange-500 bg-orange-50/50 text-orange-950';
                    }

                    if (isStudyAnswerChecked) {
                      if (isCorrect) {
                        optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'border-rose-500 bg-rose-50 text-rose-950';
                      } else {
                        optionStyle = 'border-slate-200 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={option.key}
                        onClick={() => handleStudyOptionSelect(option.key, currentStudyQuestion.correctAnswer.length > 1)}
                        disabled={isStudyAnswerChecked}
                        className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-semibold flex items-start gap-3 transition cursor-pointer ${optionStyle}`}
                      >
                        <span className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center text-xs font-bold font-mono ${
                          isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {option.key}
                        </span>
                        <span className="flex-1 leading-normal">{option.text}</span>

                        {isStudyAnswerChecked && isCorrect && (
                          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 self-center" />
                        )}
                        {isStudyAnswerChecked && isSelected && !isCorrect && (
                          <X className="w-5 h-5 text-rose-600 shrink-0 self-center" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Correction Explanation Block */}
                {isStudyAnswerChecked && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                      <Sparkles className="w-4 h-4 text-orange-500" />
                      <span>Explication :</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{currentStudyQuestion.explanation}</p>
                  </motion.div>
                )}

                {/* Bottom navigation controls */}
                <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => { if (studyIndex > 0) setStudyIndex(studyIndex - 1); }}
                    disabled={studyIndex === 0}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-40 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Précédente</span>
                  </button>

                  {!isStudyAnswerChecked ? (
                    <button
                      onClick={() => setIsStudyAnswerChecked(true)}
                      disabled={selectedOptions.length === 0}
                      className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold px-5 py-2 rounded-xl shadow-md shadow-orange-500/10 transition cursor-pointer"
                    >
                      Vérifier Réponse
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (studyIndex < filteredStudyQuestions.length - 1) {
                          setStudyIndex(studyIndex + 1);
                        } else {
                          showToast("Félicitations, vous êtes arrivés au bout des questions de cette rubrique !", "success");
                        }
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-5 py-2 rounded-xl shadow-xs transition cursor-pointer"
                    >
                      {studyIndex < filteredStudyQuestions.length - 1 ? "Question Suivante" : "Terminer"}
                    </button>
                  )}

                  <button
                    onClick={() => { if (studyIndex < filteredStudyQuestions.length - 1) setStudyIndex(studyIndex + 1); }}
                    disabled={studyIndex === filteredStudyQuestions.length - 1}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-40 transition cursor-pointer"
                  >
                    <span>Suivante</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 3: MOCK EXAM MODE */}
        {activeTab === 'mock-exam' && (
          <div className="space-y-6">
            
            {/* Standard pre-exam dashboard or active exam view */}
            {!isMockActive && !mockScore ? (
              <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs text-center space-y-6">
                <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Timer className="w-8 h-8 animate-pulse" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-950">Prêt pour un Examen Blanc ?</h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Testez vos connaissances dans des conditions réelles de certification AWS Cloud Practitioner.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-600 text-left border border-slate-100 space-y-2.5">
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Règles de simulation :</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1.5 leading-normal">
                    <li>Contient 50 questions à choix simples et multiples.</li>
                    <li>Temps limite de <strong>60 minutes</strong> (chronomètre actif).</li>
                    <li>Note de passage : <strong>70% minimum</strong> de réponses correctes.</li>
                    <li>Pas de correction instantanée (évaluation globale à la fin).</li>
                  </ul>
                </div>

                <button
                  onClick={startMockExam}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-2xl shadow-md shadow-orange-500/10 transition cursor-pointer"
                >
                  Démarrer le Chronomètre (60min)
                </button>
              </div>
            ) : isMockActive ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                
                {/* Side question map */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Timer className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-mono font-bold text-red-600">{formatTime(mockTimeLeft)}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{Object.keys(mockAnswers).length} / 50 répondus</span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {questionsData.map((q, idx) => {
                      const isAnswered = !!mockAnswers[q.id]?.length;
                      const isCurrent = mockIndex === idx;
                      return (
                        <button
                          key={q.id}
                          onClick={() => setMockIndex(idx)}
                          className={`h-8 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center transition cursor-pointer ${
                            isCurrent
                              ? 'bg-orange-500 text-white shadow-xs'
                              : isAnswered
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {q.id}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      const conf = window.confirm("Êtes-vous sûr de vouloir soumettre l'examen blanc dès maintenant ?");
                      if (conf) submitMockExam();
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Soumettre Examen
                  </button>
                </div>

                {/* Active question */}
                <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  {(() => {
                    const q = questionsData[mockIndex];
                    const countOfCorrect = q.correctAnswer.length;
                    return (
                      <>
                        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-200 uppercase tracking-wider">
                            {q.rubric}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            Question {mockIndex + 1} sur 50
                          </span>
                        </div>

                        <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 leading-snug">
                          {q.question}
                        </h2>

                        {countOfCorrect > 1 && (
                          <p className="text-xs font-bold text-orange-600 mt-2">
                            * Sélectionnez {countOfCorrect} options !
                          </p>
                        )}

                        <div className="space-y-3 mt-4">
                          {q.options.map(option => {
                            const isSelected = (mockAnswers[q.id] || []).includes(option.key);
                            return (
                              <button
                                key={option.key}
                                onClick={() => handleMockOptionSelect(q.id, option.key, countOfCorrect > 1)}
                                className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-semibold flex items-start gap-3 transition cursor-pointer ${
                                  isSelected
                                    ? 'border-orange-500 bg-orange-50/50 text-orange-950 ring-2 ring-orange-500/15'
                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center text-xs font-bold font-mono ${
                                  isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {option.key}
                                </span>
                                <span className="flex-1 leading-normal">{option.text}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Pagination bottom */}
                        <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                          <button
                            onClick={() => { if (mockIndex > 0) setMockIndex(mockIndex - 1); }}
                            disabled={mockIndex === 0}
                            className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-40 transition cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Précédente</span>
                          </button>

                          <button
                            onClick={() => {
                              if (mockIndex < questionsData.length - 1) {
                                setMockIndex(mockIndex + 1);
                              } else {
                                const confirmSub = window.confirm("Vous avez atteint la dernière question. Voulez-vous soumettre l'examen ?");
                                if (confirmSub) submitMockExam();
                              }
                            }}
                            className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                          >
                            {mockIndex < questionsData.length - 1 ? "Suivante" : "Soumettre l'Examen"}
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>

              </div>
            ) : isReviewingReinforcement ? (
              // REINFORCEMENT QUIZ VIEW
              <div className="max-w-3xl mx-auto space-y-6">
                
                {/* Header card with back option and summary */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold font-display text-slate-950 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-orange-500 shrink-0" />
                      Questions de renforcement adaptatif par IA
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Ces questions ciblent spécifiquement vos concepts mal compris détectés lors de l'examen précédent.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsReviewingReinforcement(false);
                      setReinforcementChecked(false);
                      setReinforcementAnswers({});
                      setReinforcementIndex(0);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-2 rounded-xl transition cursor-pointer self-start md:self-auto"
                  >
                    Retour aux Résultats
                  </button>
                </div>

                {/* Question Area */}
                {(() => {
                  const q = reinforcementQuestions[reinforcementIndex];
                  if (!q) {
                    return (
                      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400">
                        Aucune question de renforcement disponible. Veuillez en générer depuis l'écran des résultats.
                      </div>
                    );
                  }

                  const selectedAns = reinforcementAnswers[q.id] || [];
                  const isMultipleChoice = q.correctAnswer && q.correctAnswer.length > 1;

                  return (
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                      
                      {/* Badge and navigation header */}
                      <div className="flex items-center justify-between gap-4">
                        <span className="px-3 py-1 bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-bold rounded-lg uppercase tracking-wider font-mono">
                          {q.rubric || "Concepts renforcés"}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          QUESTION DE RENFORCEMENT {reinforcementIndex + 1} / {reinforcementQuestions.length}
                        </span>
                      </div>

                      {/* Question Text */}
                      <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 leading-snug">
                        {q.question}
                      </h3>

                      {isMultipleChoice && (
                        <p className="text-xs font-bold text-orange-600">
                          * Sélectionnez {q.correctAnswer.length} réponses pour cette question !
                        </p>
                      )}

                      {/* Options List */}
                      <div className="space-y-3">
                        {q.options.map((option: any) => {
                          const isSelected = selectedAns.includes(option.key);
                          const isCorrect = q.correctAnswer.includes(option.key);

                          let optionStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50';
                          if (isSelected) {
                            optionStyle = 'border-orange-500 bg-orange-50/50 text-orange-950 ring-2 ring-orange-500/10';
                          }
                          
                          if (reinforcementChecked) {
                            if (isCorrect) {
                              optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/15';
                            } else if (isSelected && !isCorrect) {
                              optionStyle = 'border-rose-500 bg-rose-50 text-rose-950';
                            } else {
                              optionStyle = 'border-slate-200 opacity-60';
                            }
                          }

                          return (
                            <button
                              key={option.key}
                              disabled={reinforcementChecked}
                              onClick={() => handleReinforcementOptionSelect(option.key, isMultipleChoice)}
                              className={`w-full p-4 rounded-xl border text-xs sm:text-sm font-semibold flex items-start gap-3 text-left transition ${optionStyle}`}
                            >
                              <span className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center text-xs font-bold font-mono ${
                                reinforcementChecked && isCorrect
                                  ? 'bg-emerald-500 text-white'
                                  : reinforcementChecked && isSelected && !isCorrect
                                  ? 'bg-rose-500 text-white'
                                  : isSelected
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {option.key}
                              </span>
                              <span className="flex-1 leading-normal">{option.text}</span>
                              {reinforcementChecked && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 self-center" />}
                              {reinforcementChecked && isSelected && !isCorrect && <X className="w-5 h-5 text-rose-600 shrink-0 self-center" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Block */}
                      {reinforcementChecked && (
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs sm:text-sm space-y-2">
                          <div className="flex items-center gap-2 font-bold text-slate-900">
                            <Sparkles className="w-4 h-4 text-orange-500" />
                            <span>Explication par l'IA :</span>
                          </div>
                          <p className="text-slate-600 leading-relaxed">{q.explanation}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                        <button
                          onClick={() => {
                            if (reinforcementIndex > 0) {
                              setReinforcementIndex(reinforcementIndex - 1);
                              setReinforcementChecked(false);
                            }
                          }}
                          disabled={reinforcementIndex === 0}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Précédent
                        </button>

                        {!reinforcementChecked ? (
                          <button
                            onClick={() => {
                              if (selectedAns.length === 0) {
                                showToast("Veuillez sélectionner au moins une réponse !", "error");
                                return;
                              }
                              setReinforcementChecked(true);
                            }}
                            className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                          >
                            Valider la Réponse
                          </button>
                        ) : reinforcementIndex < reinforcementQuestions.length - 1 ? (
                          <button
                            onClick={() => {
                              setReinforcementIndex(reinforcementIndex + 1);
                              setReinforcementChecked(false);
                            }}
                            className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer"
                          >
                            Question Suivante
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setIsReviewingReinforcement(false);
                              setReinforcementChecked(false);
                              setReinforcementAnswers({});
                              setReinforcementIndex(0);
                              showToast("Félicitations pour avoir complété votre renforcement !", "success");
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                          >
                            Terminer le renforcement
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })()}

              </div>
            ) : isReviewingMistakes ? (
              // MISTAKES REVIEW VIEW
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Header card with back option and summary */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold font-display text-slate-950 flex items-center gap-2">
                      <X className="w-5 h-5 text-rose-500 shrink-0" />
                      Revue de vos erreurs
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Vous avez échoué à {questionsData.length - mockScore!.score} question(s) sur {questionsData.length} au total. Prenez le temps de bien assimiler les explications ci-dessous.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      onClick={() => setIsReviewingMistakes(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Retour aux Résultats
                    </button>
                    <button
                      onClick={startMockExam}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-sm cursor-pointer"
                    >
                      Repasser l'Examen
                    </button>
                  </div>
                </div>

                {/* List of failed questions */}
                <div className="space-y-6">
                  {questionsData.filter(q => {
                    const userAns = mockAnswers[q.id] || [];
                    const correctAns = q.correctAnswer;
                    const isCorrect = userAns.length === correctAns.length && 
                                      userAns.every(val => correctAns.includes(val));
                    return !isCorrect;
                  }).map((q, idx) => {
                    const userAns = mockAnswers[q.id] || [];
                    return (
                      <div key={q.id} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-mono font-bold">
                              {idx + 1}
                            </span>
                            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md border border-slate-200 uppercase tracking-wider">
                              {q.rubric}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const content = `Question ${q.id}. ${q.question} ` + 
                                  q.options.map(o => `Option ${o.key}: ${o.text}`).join('. ');
                                playTTS(content);
                              }}
                              className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition"
                              title="Écouter la question (Gemini TTS)"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => saveToGoogleTasks(q)}
                              className="flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md transition"
                              title="Planifier cette question dans Google Tasks"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Google Tasks</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm sm:text-base font-bold font-display text-slate-900 leading-snug">
                            Question {q.id} : {q.question}
                          </h3>
                        </div>

                        {/* Options rendered with color highlights */}
                        <div className="space-y-3">
                          {q.options.map(option => {
                            const isSelected = userAns.includes(option.key);
                            const isCorrect = q.correctAnswer.includes(option.key);
                            
                            let optionStyle = 'border-slate-200 opacity-70';
                            if (isCorrect) {
                              optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/10';
                            } else if (isSelected && !isCorrect) {
                              optionStyle = 'border-rose-500 bg-rose-50 text-rose-950';
                            }
                            
                            return (
                              <div key={option.key} className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold flex items-start gap-3 ${optionStyle}`}>
                                <span className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center text-xs font-bold font-mono ${
                                  isCorrect 
                                    ? 'bg-emerald-500 text-white' 
                                    : isSelected 
                                    ? 'bg-rose-500 text-white' 
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {option.key}
                                </span>
                                <span className="flex-1 leading-normal">{option.text}</span>
                                {isCorrect && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 self-center" />}
                                {isSelected && !isCorrect && <X className="w-5 h-5 text-rose-600 shrink-0 self-center" />}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation block */}
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs sm:text-sm space-y-2">
                          <div className="flex items-center gap-2 font-bold text-slate-900">
                            <Sparkles className="w-4 h-4 text-orange-500" />
                            <span>Explication :</span>
                          </div>
                          <p className="text-slate-600 leading-relaxed">{q.explanation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom navigation of review */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-xs text-slate-500 font-semibold">
                    Vous avez terminé de revoir vos erreurs. Prêt à retenter ?
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsReviewingMistakes(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                    >
                      Retour aux Résultats
                    </button>
                    <button
                      onClick={startMockExam}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                    >
                      Recommencer l'Examen
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // EXAM REPORT VIEW
              <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
                
                {/* Result header banner */}
                <div className="text-center space-y-3">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm ${
                    mockScore!.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                  }`}>
                    {mockScore!.passed ? <Check className="w-8 h-8" /> : <X className="w-8 h-8" />}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Résultats d'Examen Blanc</span>
                    <h2 className="text-2xl font-bold font-display text-slate-950">
                      {mockScore!.passed ? 'Félicitations, vous avez réussi !' : 'Score insuffisant, continuez à réviser !'}
                    </h2>
                    <p className="text-sm font-semibold text-slate-500">
                      Score global : <span className={`font-bold ${mockScore!.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {Math.round((mockScore!.score / mockScore!.total) * 100)}%
                      </span> ({mockScore!.score} / {mockScore!.total} corrects)
                    </p>
                  </div>
                </div>

                {/* Score breakdown per rubric */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-slate-950 font-display">Détail par Rubrique :</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(Object.entries(mockScore!.breakdown) as [string, { correct: number; total: number }][]).map(([rubricTitle, stats]) => {
                      const rubricPercent = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                      return (
                        <div key={rubricTitle} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-800 truncate">{rubricTitle}</span>
                            <span className={rubricPercent >= 70 ? 'text-emerald-600' : 'text-rose-600'}>
                              {rubricPercent}% ({stats.correct}/{stats.total})
                            </span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${rubricPercent >= 70 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                              style={{ width: `${rubricPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PERSONALISATION PAR IA: ADAPTIVE LEARNING PANEL */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 font-display">Personnalisation par IA (Adaptative Learning)</h3>
                      <p className="text-xs text-slate-500">Un plan d'étude dynamique taillé sur mesure d'après vos erreurs d'examen.</p>
                    </div>
                  </div>

                  {/* Weaknesses Summary */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">1. Résumé personnalisé de vos points faibles :</h4>
                    
                    {isLoadingSummary ? (
                      <div className="p-6 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center space-y-3 shadow-3xs">
                        <RefreshCw className="w-6 h-6 text-orange-500 animate-spin" />
                        <p className="text-xs font-semibold text-orange-800">Analyse intelligente en cours par Gemini 3.5...</p>
                      </div>
                    ) : aiSummary ? (
                      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-3xs space-y-2">
                        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed max-h-72 overflow-y-auto pr-1 space-y-2 select-text">
                          {renderMarkdown(aiSummary)}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 bg-white border border-slate-100 rounded-2xl text-center space-y-3">
                        <p className="text-xs text-slate-500">Aucun résumé généré automatiquement.</p>
                        <button
                          onClick={() => {
                            const failedQ = questionsData.filter(q => {
                              const userAns = mockAnswers[q.id] || [];
                              return !(userAns.length === q.correctAnswer.length && userAns.every(val => q.correctAnswer.includes(val)));
                            });
                            generateWeaknessSummary(failedQ);
                          }}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Générer un Résumé d'Erreurs</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Reinforcement Questions Trigger */}
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-left">
                      <h4 className="text-xs sm:text-sm font-bold text-indigo-950 flex items-center gap-1.5 font-display">
                        <Brain className="w-4 h-4 text-indigo-600" />
                        2. Questions de consolidation ciblées
                      </h4>
                      <p className="text-xs text-slate-600 leading-normal">
                        Entraînez-vous immédiatement sur 3 questions taillées pour renforcer les notions qui vous ont mis en échec.
                      </p>
                    </div>

                    {isGeneratingReinforcement ? (
                      <div className="p-2.5 bg-indigo-100/50 border border-indigo-200 rounded-xl flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                        <span className="text-xs font-semibold text-indigo-800">Génération par l'IA...</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          const failedQ = questionsData.filter(q => {
                            const userAns = mockAnswers[q.id] || [];
                            return !(userAns.length === q.correctAnswer.length && userAns.every(val => q.correctAnswer.includes(val)));
                          });
                          if (failedQ.length === 0) {
                            showToast("Aucune erreur détectée ! Excellent travail.", "success");
                            return;
                          }
                          generateReinforcementQuestions(failedQ);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-4.5 py-2.5 rounded-xl transition shrink-0 cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                        <span>Générer 3 questions de renforcement</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Prompt option */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                  {questionsData.length - mockScore!.score > 0 && (
                    <button
                      onClick={() => setIsReviewingMistakes(true)}
                      className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold py-2.5 rounded-xl transition text-center cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-1.5"
                    >
                      <X className="w-4 h-4 shrink-0" />
                      <span>Revoir mes erreurs ({questionsData.length - mockScore!.score})</span>
                    </button>
                  )}
                  <button
                    onClick={startMockExam}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl shadow-xs transition text-center cursor-pointer text-xs sm:text-sm"
                  >
                    Repasser un Examen Blanc
                  </button>
                  <button
                    onClick={() => { setMockScore(null); setActiveTab('dashboard'); }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition text-center cursor-pointer text-xs sm:text-sm"
                  >
                    Retour au Tableau de Bord
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 4: ALL QUESTIONS (REFERENCE DIRECTORY) */}
        {activeTab === 'all-questions' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-950 font-display text-base">Répertoire Complet des Questions</h3>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Consultez l'ensemble des 50 questions de l'examen d'un seul coup d'œil, triées par rubrique, pour un survol rapide ou une recherche directe.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const textToRead = "AWS Certified Cloud Practitioner - Toutes les cinquante questions de l'examen de certification.";
                    playTTS(textToRead);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Lecture Titre</span>
                </button>
              </div>
            </div>

            {/* Questions categorized grouping list */}
            {rubricsData.map(rubric => {
              const rQuestions = questionsData.filter(q => q.rubric === rubric.title);
              return (
                <div key={rubric.id} className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <div className="p-1 bg-orange-50 text-orange-500 rounded-lg">
                      {getRubricIcon(rubric.iconName)}
                    </div>
                    <h3 className="font-bold text-slate-950 font-display text-sm sm:text-base">{rubric.title} ({rQuestions.length} questions)</h3>
                  </div>

                  <div className="space-y-3">
                    {rQuestions.map(q => (
                      <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
                        <div className="space-y-1.5 flex-1">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-normal">
                            Question {q.id} : {q.question}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2.5">
                            {q.options.map(opt => {
                              const isCorrect = q.correctAnswer.includes(opt.key);
                              return (
                                <div key={opt.key} className={`p-2.5 rounded-xl border text-[11px] sm:text-xs flex items-start gap-2 ${
                                  isCorrect ? 'border-emerald-300 bg-emerald-50/50 text-emerald-950 font-semibold' : 'border-slate-100 text-slate-600'
                                }`}>
                                  <span className={`w-4 h-4 rounded-sm flex items-center justify-center text-[10px] font-bold font-mono ${
                                    isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    {opt.key}
                                  </span>
                                  <span className="flex-1 leading-tight">{opt.text}</span>
                                </div>
                              );
                            })}
                          </div>
                          <div className="text-[10px] sm:text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-xl p-3 mt-3 leading-relaxed">
                            <span className="font-bold text-slate-800">Correct : {q.correctAnswer.join(', ')}</span> — {q.explanation}
                          </div>
                        </div>

                        {/* Keep/Task fast actions per question */}
                        <div className="flex flex-row sm:flex-col gap-2 shrink-0 justify-end sm:justify-start">
                          <button
                            onClick={() => saveToGoogleTasks(q)}
                            className="p-2 hover:bg-slate-100 text-indigo-600 hover:text-indigo-800 rounded-xl transition border border-slate-200 sm:border-none"
                            title="Planifier une tâche dans Google Tasks"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p>© 2026 AWS CCP Exam Prep Applet. Tous droits réservés.</p>
          <div className="flex justify-center gap-4 text-slate-400">
            <span>Peg Serges (pegserges@gmail.com)</span>
            <span>•</span>
            <span>UTC Local Time</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

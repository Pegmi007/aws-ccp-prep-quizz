import { Question, RubricInfo } from './types';

export const rubricsData: RubricInfo[] = [
  {
    id: 'concepts-ai-ml',
    title: 'Fundamentals of AI and ML',
    description: 'Concepts de base en intelligence artificielle et machine learning (types d\'apprentissage, métriques, etc.).',
    iconName: 'Brain',
    keyPoints: [
      'Machine Learning Supervisé : Entraînement avec des données étiquetées (entrées + résultats attendus).',
      'Machine Learning Non Supervisé : Détection de motifs cachés dans des données non étiquettes (ex: clustering).',
      'Apprentissage par Renforcement : Système d\'agents apprenant par essai-erreur via des récompenses et punitions.',
      'Métriques de Classification : Précision (Precision), Rappel (Recall), F1-Score.'
    ]
  },
  {
    id: 'generative-ai',
    title: 'Fundamentals of Generative AI',
    description: 'Bases de l\'IA générative, grands modèles de langage (LLM) et modèles de fondation.',
    iconName: 'Cloud',
    keyPoints: [
      'Modèles de Fondation (FMs) : Modèles massifs pré-entraînés sur d\'immenses volumes de données pouvant être adaptés à diverses tâches.',
      'Prompt Engineering : Optimisation des instructions textuelles (Zero-shot, Few-shot) pour guider le modèle sans modifier ses poids.',
      'RAG (Retrieval-Augmented Generation) : Connecter un modèle à une source de données externe pour récupérer des faits récents avant de répondre.',
      'Fine-Tuning : Ajustement des poids du modèle de fondation sur un jeu de données spécifique pour une spécialisation accrue.'
    ]
  },
  {
    id: 'applications-fm',
    title: 'Applications of Foundation Models',
    description: 'Services AWS pour exploiter les modèles de fondation (Amazon Bedrock, SageMaker JumpStart).',
    iconName: 'Server',
    keyPoints: [
      'Amazon Bedrock : Service entièrement managé pour accéder aux FMs d\'Amazon et de startups leaders (Anthropic, Meta, etc.) via API.',
      'Amazon SageMaker JumpStart : Hub de modèles open-source et propriétaires pour déployer et affiner des modèles au sein de SageMaker.',
      'Amazon CodeWhisperer / Q : Assistants IA pour le développement et la productivité au sein de l\'environnement AWS.'
    ]
  },
  {
    id: 'responsible-ai',
    title: 'Guidelines for Responsible AI',
    description: 'Principes éthiques, réduction des biais, sécurité et gestion des hallucinations.',
    iconName: 'ShieldAlert',
    keyPoints: [
      'Hallucinations : Génération d\'informations fausses ou inventées mais présentées de manière très convaincante par le LLM.',
      'Biais (Bias) : Inégalités de performance ou prédictions faussées découlant de données d\'entraînement non représentatives.',
      'Bedrock Guardrails : Outil pour appliquer des filtres de sécurité, masquer les PII (données personnelles) et bloquer des mots clés.'
    ]
  }
];

export const questionsData: Question[] = [
  {
    id: 1,
    question: "What is the process of training a machine learning model using labeled data where both the inputs and the correct outputs are provided?",
    options: [
      { key: "A", text: "Unsupervised learning" },
      { key: "B", text: "Supervised learning" },
      { key: "C", text: "Reinforcement learning" },
      { key: "D", text: "Semi-supervised learning" }
    ],
    correctAnswer: ["B"],
    rubric: "Fundamentals of AI and ML",
    explanation: "Le machine learning supervisé consiste à entraîner un modèle sur des données étiquetées (labeled data), c'est-à-dire des données pour lesquelles la réponse attendue (l'étiquette) est connue."
  },
  {
    id: 2,
    question: "A company wants to build a generative AI application on AWS. They need to choose a service that provides access to multiple foundation models (FMs) from top AI startups and Amazon via a single API, without needing to manage any underlying infrastructure. Which service should they use?",
    options: [
      { key: "A", text: "Amazon SageMaker JumpStart" },
      { key: "B", text: "Amazon Bedrock" },
      { key: "C", text: "Amazon EC2 UltraClusters" },
      { key: "D", text: "Amazon Kendra" }
    ],
    correctAnswer: ["B"],
    rubric: "Applications of Foundation Models",
    explanation: "Amazon Bedrock est un service entièrement managé d'AWS qui offre un accès à des modèles de fondation (FMs) de premier plan (d'Amazon, Anthropic, Meta, etc.) via une API unique, sans gestion d'infrastructure."
  },
  {
    id: 3,
    question: "A company needs to evaluate if an LLM is generating harmful content, hate speech, or violating safety guidelines before delivering responses to users. Which feature of Amazon Bedrock is designed to implement these safety checks and content filters?",
    options: [
      { key: "A", text: "Bedrock Knowledge Bases" },
      { key: "B", text: "Bedrock Guardrails" },
      { key: "C", text: "Bedrock Agents" },
      { key: "D", text: "Bedrock Studio" }
    ],
    correctAnswer: ["B"],
    rubric: "Guidelines for Responsible AI",
    explanation: "Amazon Bedrock Guardrails permet d'appliquer des filtres de sécurité personnalisés sur les entrées utilisateur et les réponses générées par les modèles de fondation, afin de bloquer les contenus toxiques, les informations personnelles (PII) et de respecter les règles de sécurité."
  },
  {
    id: 4,
    question: "Which of the following techniques is used to improve the accuracy of a foundation model by connecting it to an external, dynamic database or data source to retrieve up-to-date information before generating a response?",
    options: [
      { key: "A", text: "Prompt engineering" },
      { key: "B", text: "Retrieval-Augmented Generation (RAG)" },
      { key: "C", text: "Fine-tuning" },
      { key: "D", text: "Pre-training" }
    ],
    correctAnswer: ["B"],
    rubric: "Fundamentals of Generative AI",
    explanation: "La génération augmentée par récupération (RAG - Retrieval-Augmented Generation) consiste à interroger des bases de données ou sources externes pour récupérer des informations pertinentes et les insérer dans le prompt envoyé au modèle, évitant ainsi les hallucinations et fournissant des réponses à jour."
  },
  {
    id: 5,
    question: "An organization is concerned about 'hallucinations' in their generative AI customer service bot. What does the term 'hallucination' refer to in the context of large language models (LLMs)?",
    options: [
      { key: "A", text: "The model response is delayed due to network traffic." },
      { key: "B", text: "The model generates confident but false or fabricated information." },
      { key: "C", text: "The model fails to recognize the user's input language." },
      { key: "D", text: "The model leaks confidential user data to the internet." }
    ],
    correctAnswer: ["B"],
    rubric: "Guidelines for Responsible AI",
    explanation: "Une hallucination se produit lorsqu'un modèle de langage (LLM) génère des faits erronés ou des affirmations fausses, tout en les présentant de manière logique et grammaticalement correcte."
  }
];

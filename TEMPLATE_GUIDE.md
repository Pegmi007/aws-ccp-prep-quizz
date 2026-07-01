# Guide de Modélisation (Template) de l'Application de Quiz

Ce projet a été conçu pour être **entièrement modulaire**. Vous pouvez l'utiliser comme modèle (template) pour créer rapidement d'autres applications de quiz pour n'importe quelle autre certification (ex: Azure Fundamentals, Google Cloud Digital Leader, Terraform Associate, etc.).

Voici les étapes simples pour personnaliser ce projet pour une autre certification.

---

## Étape 1 : Dupliquer le projet

Pour commencer un nouveau projet de certification à partir de celui-ci :
1. Créez un nouveau dépôt vide sur GitHub.
2. Clonez ce dépôt localement ou dupliquez-le dans un nouveau dossier sur votre machine.
3. Supprimez l'ancien lien Git distant et ajoutez le nouveau :
   ```bash
   git remote remove origin
   git remote add origin https://github.com/VOTRE_PSEUDO/nom-de-votre-nouveau-quiz.git
   ```

---

## Étape 2 : Personnaliser les Catégories et Questions

Tout le contenu pédagogique de l'application est centralisé dans un seul fichier : [src/questionsData.ts](file:///d:/aws/AWS-CCP-App/aws-ccp-practice-exam/src/questionsData.ts).

### 1. Modifier les Catégories (Rubrics)
Dans `rubricsData`, modifiez les objets pour correspondre aux rubriques officielles de votre nouvelle certification :
```typescript
export const rubricsData: RubricInfo[] = [
  {
    id: 'concepts-de-base', // Un identifiant unique en minuscules
    title: 'Concepts Fondamentaux', // Le nom affiché à l'écran
    description: 'Comprendre les bases de la technologie...',
    iconName: 'Cloud', // Icônes supportées : Cloud, ShieldAlert, Server, Receipt
    keyPoints: [
      'Point clé 1 : Définition de...',
      'Point clé 2 : Avantage de...'
    ]
  },
  // Ajoutez ou supprimez des rubriques selon vos besoins
];
```

### 2. Modifier la Base de Questions
Dans le tableau `questionsData`, insérez vos propres questions en suivant cette structure :
```typescript
export const questionsData: Question[] = [
  {
    id: 1,
    question: "Quelle est la définition de... ?", // Votre question (en anglais ou français)
    options: [
      { key: "A", text: "Option A" },
      { key: "B", text: "Option B" },
      { key: "C", text: "Option C" },
      { key: "D", text: "Option D" }
    ],
    correctAnswer: ["A"], // Tableau contenant la ou les bonnes clés (ex: ["A", "C"] pour choix multiples)
    rubric: "Concepts Fondamentaux", // DOIT correspondre exactement au 'title' d'une rubrique ci-dessus
    explanation: "Explication détaillée en français qui s'affiche après validation pour aider à comprendre."
  },
  // Ajoutez autant de questions que vous le souhaitez !
];
```

---

## Étape 3 : Personnaliser l'Identité Visuelle et les Titres

### 1. `index.html`
Modifiez les balises de titre et de description pour la PWA :
* Ligne 8 : `<title>Votre Certification Prep & Quizz</title>`
* Ligne 9 : `<meta name="description" content="Entraînement complet pour réussir la certification..." />`
* Ligne 16 : `<meta name="apple-mobile-web-app-title" content="NomCourt" />`

### 2. `public/manifest.json`
Mettez à jour les métadonnées de l'application Web progressive :
* `"short_name"` : Nom court affiché sous l'icône sur l'écran d'accueil du téléphone.
* `"name"` : Nom complet de l'application.
* `"description"` : Description de l'application.
* `"theme_color"` et `"background_color"` : Les codes couleur hexadécimaux de votre thème.

### 3. Icônes de l'Application
Remplacez le fichier `public/icon.svg` par le logo ou l'icône vectorielle de votre choix. L'application l'utilisera automatiquement partout (favicon, icône PWA sur mobile et tablette).

---

## Étape 4 : Déployer sur Vercel

Une fois vos fichiers modifiés et vos changements poussés sur votre nouveau dépôt GitHub :
1. Allez sur Vercel et importez votre nouveau dépôt.
2. Vercel détectera automatiquement la configuration Vite et déploiera votre nouveau quiz en moins d'une minute !

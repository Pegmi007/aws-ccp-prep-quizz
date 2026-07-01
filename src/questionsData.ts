import { Question, RubricInfo } from './types';

export const rubricsData: RubricInfo[] = [
  {
    id: 'concepts-cloud',
    title: 'Concepts Cloud',
    description: 'Comprendre l\'architecture cloud AWS, la fiabilité, l\'élasticité et le principe de découplage.',
    iconName: 'Cloud',
    keyPoints: [
      'Mise à l\'échelle horizontale (Horizontal Scaling) : Ajout d\'instances supplémentaires de même taille (par opposition à l\'augmentation de taille verticale).',
      'Fiabilité (Reliability) : Capacité d\'un système à récupérer rapidement après des pannes et à provisionner automatiquement les ressources nécessaires.',
      'Élasticité (Elasticity) : Provisionnement et dé-provisionnement automatique des ressources selon la demande pour réduire les coûts et optimiser la performance.',
      'Découplage (Decoupling) : Séparer les composants d\'une application pour s\'assurer qu\'une panne sur un élément n\'affecte pas le reste de l\'application.',
      'Avantages du Cloud : Gain de vitesse, agilité, réduction des dépenses en capital (OpEx vs CapEx) et économies d\'échelle.'
    ]
  },
  {
    id: 'securite-conformite',
    title: 'Sécurité et Conformité',
    description: 'Gestion des accès (IAM), modèle de responsabilité partagée, chiffrement et outils de surveillance de sécurité.',
    iconName: 'ShieldAlert',
    keyPoints: [
      'Modèle de Responsabilité Partagée : AWS gère la sécurité DU cloud (infrastructure physique, hyperviseur, réseau), et le client gère la sécurité DANS le cloud (systèmes invités, données, IAM, configurations).',
      'Contrôles Partagés (Shared Controls) : Pratiques comme la gestion des correctifs (Patch Management) et la gestion de la configuration, appliquées par les deux parties à leurs niveaux respectifs.',
      'Principe de Moindre Privilège : Octroyer aux utilisateurs uniquement les autorisations strictement requises pour effectuer leurs tâches.',
      'IAM (Identity & Access Management) : Utilisation des Groupes d\'utilisateurs (User Groups) pour regrouper les employés techniques et leur assigner des permissions communes.',
      'Protection DDoS : Services comme AWS Shield et AWS WAF pour protéger les infrastructures et applications web contre les attaques.',
      'AWS CloudTrail : Outil d\'audit qui enregistre tous les appels API et permet d\'identifier les actions des utilisateurs (ex. qui a supprimé une instance).'
    ]
  },
  {
    id: 'technologie-services',
    title: 'Technologie et Services',
    description: 'Gamme de services AWS pour le calcul, le stockage, les bases de données, le réseau et l\'automatisation.',
    iconName: 'Server',
    keyPoints: [
      'Réseau Global AWS : Régions (haute disponibilité), Zones de Disponibilité (AZ) multiples pour la redondance, et Emplacements de Bord (Edge Locations) pour le CDN.',
      'Amazon CloudFront : Service de réseau de diffusion de contenu (CDN) mondial utilisant les emplacements de bord pour réduire la latence.',
      'Bases de Données : DynamoDB (NoSQL clé-valeur managé), Amazon Aurora (base relationnelle avec sauvegardes automatisées), ElastiCache (mise en cache en mémoire pour optimiser le temps de réponse).',
      'Sauvegarde & Archivage : S3 Glacier Deep Archive pour le stockage de conformité à très faible coût. Snapshots EBS pour sauvegarder les volumes de stockage par blocs.',
      'Infrastructure as Code (IaC) : AWS CloudFormation permet de modéliser et de configurer toutes les ressources AWS de manière automatisée via des fichiers texte.'
    ]
  },
  {
    id: 'facturation-tarification',
    title: 'Facturation et Tarification',
    description: 'Modèles de tarification d\'instances, plans de support, consolidation de facturation et outils d\'estimation des coûts.',
    iconName: 'Receipt',
    keyPoints: [
      'Modèles d\'achat EC2 : On-Demand (flexible, court terme, sans engagement), Spot (remise élevée pour tâches tolérantes aux pannes), Reserved (engagement de 1-3 ans pour économies substantielles).',
      'Instances Réservées Convertibles (Convertible RI) : Permettent de changer d\'architecture d\'instance (ex. plus de puissance de calcul) pendant la durée d\'engagement.',
      'Facturation Consolidée (Consolidated Billing) : Permet de regrouper plusieurs comptes sous un compte maître pour centraliser le paiement, partager les remises d\'instances réservées, et obtenir des remises sur le volume total.',
      'Plans de Support AWS : Le plan Enterprise comprend un Technical Account Manager (TAM) dédié et l\'accès au service Support Concierge pour les requêtes de facturation.',
      'Suivi Budgétaire : Budgets AWS et Alertes CloudWatch Billing (via notifications SNS) permettent de surveiller et de recevoir des alertes de dépassement de seuil.'
    ]
  }
];

export const questionsData: Question[] = [
  {
    id: 1,
    question: "AWS allows users to manage their resources using a web based user interface. What is the name of this interface?",
    options: [
      { key: "A", text: "AWS CLI." },
      { key: "B", text: "AWS API." },
      { key: "C", text: "AWS SDK." },
      { key: "D", text: "AWS Management Console." }
    ],
    correctAnswer: ["D"],
    rubric: "Technologie et Services",
    explanation: "La console de gestion AWS (AWS Management Console) est l'interface graphique web sécurisée permettant de créer et de gérer les ressources AWS."
  },
  {
    id: 2,
    question: "Which of the following is an example of horizontal scaling in the AWS Cloud?",
    options: [
      { key: "A", text: "Replacing an existing EC2 instance with a larger, more powerful one." },
      { key: "B", text: "Increasing the compute capacity of a single EC2 instance to address the growing demands of an application." },
      { key: "C", text: "Adding more RAM capacity to an EC2 instance." },
      { key: "D", text: "Adding more EC2 instances of the same size to handle an increase in traffic." }
    ],
    correctAnswer: ["D"],
    rubric: "Concepts Cloud",
    explanation: "La mise à l'échelle horizontale (scaling out) consiste à ajouter de nouvelles instances de même taille à votre pool de ressources. Remplacer une instance existante par une plus grande est une mise à l'échelle verticale (scaling up)."
  },
  {
    id: 3,
    question: "You have noticed that several critical Amazon EC2 instances have been terminated. Which of the following AWS services would help you determine who took this action?",
    options: [
      { key: "A", text: "Amazon Inspector." },
      { key: "B", text: "AWS CloudTrail." },
      { key: "C", text: "AWS Trusted Advisor." },
      { key: "D", text: "EC2 Instance Usage Report." }
    ],
    correctAnswer: ["B"],
    rubric: "Sécurité et Conformité",
    explanation: "AWS CloudTrail enregistre l'historique des appels API pour votre compte AWS. Il permet de retracer quel utilisateur ou rôle a effectué des actions, comme la suppression d'instances EC2."
  },
  {
    id: 4,
    question: "Which of the below options are related to the reliability of AWS? (Choose TWO)",
    options: [
      { key: "A", text: "Applying the principle of least privilege to all AWS resources." },
      { key: "B", text: "Automatically provisioning new resources to meet demand." },
      { key: "C", text: "All AWS services are considered Global Services, and this design helps customers serve their international users." },
      { key: "D", text: "Providing compensation to customers if issues occur." },
      { key: "E", text: "Ability to recover quickly from failures." }
    ],
    correctAnswer: ["B", "E"],
    rubric: "Concepts Cloud",
    explanation: "La fiabilité inclut la capacité du système à s'ajuster automatiquement pour répondre à la demande et sa résilience (capacité de récupérer rapidement de n'importe quelle interruption)."
  },
  {
    id: 5,
    question: "Which statement is true regarding the AWS Shared Responsibility Model?",
    options: [
      { key: "A", text: "Responsibilities vary depending on the services used." },
      { key: "B", text: "Security of the IaaS services is the responsibility of AWS." },
      { key: "C", text: "Patching the guest OS is always the responsibility of AWS." },
      { key: "D", text: "Security of the managed services is the responsibility of the customer." }
    ],
    correctAnswer: ["A"],
    rubric: "Sécurité et Conformité",
    explanation: "Le partage de responsabilité varie selon le type de service utilisé (IaaS comme EC2, PaaS comme RDS, ou SaaS). Par exemple, pour l'IaaS, le client applique les correctifs sur l'OS, alors que pour un service entièrement managé, c'est AWS."
  },
  {
    id: 6,
    question: "You have set up consolidated billing for several AWS accounts. One of the accounts has purchased a number of reserved instances for 3 years. Which of the following is true regarding this scenario?",
    options: [
      { key: "A", text: "The Reserved Instance discounts can only be shared with the master account." },
      { key: "B", text: "All accounts can receive the hourly cost benefit of the Reserved Instances." },
      { key: "C", text: "The purchased instances will have better performance than On-demand instances." },
      { key: "D", text: "There are no cost benefits from using consolidated billing; It is for informational purposes only." }
    ],
    correctAnswer: ["B"],
    rubric: "Facturation et Tarification",
    explanation: "La facturation consolidée permet de cumuler et de partager les avantages d'achat d'instances réservées (Reserved Instances) entre tous les comptes rattachés au sein de la même organisation AWS."
  },
  {
    id: 7,
    question: "A company has developed an eCommerce web application in AWS. What should they do to ensure that the application has the highest level of availability?",
    options: [
      { key: "A", text: "Deploy the application across multiple Availability Zones and Edge locations." },
      { key: "B", text: "Deploy the application across multiple Availability Zones and subnets." },
      { key: "C", text: "Deploy the application across multiple Regions and Availability Zones." },
      { key: "D", text: "Deploy the application across multiple VPC’s and subnets." }
    ],
    correctAnswer: ["C"],
    rubric: "Technologie et Services",
    explanation: "Déployer une application sur plusieurs régions et plusieurs zones de disponibilité offre le niveau de tolérance aux pannes et de haute disponibilité le plus élevé, protégeant l'application contre les pannes à l'échelle d'une région entière."
  },
  {
    id: 8,
    question: "What does AWS Snowball provide? (Choose TWO)",
    options: [
      { key: "A", text: "Built-in computing capabilities that allow customers to process data locally." },
      { key: "B", text: "A catalog of third-party software solutions that customers need to build solutions and run their businesses." },
      { key: "C", text: "A hybrid cloud storage between on-premises environments and the AWS Cloud." },
      { key: "D", text: "An Exabyte-scale data transfer service that allows you to move extremely large amounts of data to AWS." },
      { key: "E", text: "Secure transfer of large amounts of data into and out of the AWS." }
    ],
    correctAnswer: ["A", "E"],
    rubric: "Technologie et Services",
    explanation: "AWS Snowball est un service de transfert physique sécurisé de données volumineuses. Certaines versions (Snowball Edge) disposent également de capacités de calcul intégrées pour le traitement local."
  },
  {
    id: 9,
    question: "A company has an AWS Enterprise Support plan. They want quick and efficient guidance with their billing and account inquiries. Which of the following should the company use?",
    options: [
      { key: "A", text: "AWS Health Dashboard." },
      { key: "B", text: "AWS Support Concierge." },
      { key: "C", text: "AWS Customer Service." },
      { key: "D", text: "AWS Operations Support." }
    ],
    correctAnswer: ["B"],
    rubric: "Facturation et Tarification",
    explanation: "Le Support Concierge AWS est une équipe d'experts dédiée aux clients Enterprise pour répondre rapidement à toutes les questions relatives à la facturation et aux comptes."
  },
  {
    id: 10,
    question: "A Japanese company hosts their applications on Amazon EC2 instances in the Tokyo Region. The company has opened new branches in the United States, and the US users are complaining of high latency. What can the company do to reduce latency for the users in the US while minimizing costs?",
    options: [
      { key: "A", text: "Applying the Amazon Connect latency-based routing policy." },
      { key: "B", text: "Registering a new US domain name to serve the users in the US." },
      { key: "C", text: "Building a new data center in the US and implementing a hybrid model." },
      { key: "D", text: "Deploying new Amazon EC2 instances in a Region located in the US." }
    ],
    correctAnswer: ["D"],
    rubric: "Technologie et Services",
    explanation: "Déployer des instances EC2 dans une région physiquement proche des utilisateurs américains (ex: us-east-1) réduit considérablement la distance parcourue par les données et donc la latence, tout en évitant d'investir dans un centre de données physique."
  },
  {
    id: 11,
    question: "An organization has a large number of technical employees who operate their AWS Cloud infrastructure. What does AWS provide to help organize them into teams and then assign the appropriate permissions for each team?",
    options: [
      { key: "A", text: "IAM roles." },
      { key: "B", text: "IAM users." },
      { key: "C", text: "IAM user groups." },
      { key: "D", text: "AWS Organizations." }
    ],
    correctAnswer: ["C"],
    rubric: "Sécurité et Conformité",
    explanation: "Les groupes d'utilisateurs IAM (IAM User Groups) permettent de rassembler plusieurs utilisateurs IAM dans une entité collective afin de gérer et d'attribuer facilement des ensembles de politiques de permissions (ex: groupe d'administrateurs, de développeurs, etc.)."
  },
  {
    id: 12,
    question: "A company has decided to migrate its Oracle database to AWS. Which AWS service can help achieve this without negatively impacting the functionality of the source database?",
    options: [
      { key: "A", text: "AWS OpsWorks." },
      { key: "B", text: "AWS Database Migration Service." },
      { key: "C", text: "AWS Server Migration Service." },
      { key: "D", text: "AWS Application Discovery Service." }
    ],
    correctAnswer: ["B"],
    rubric: "Technologie et Services",
    explanation: "AWS Database Migration Service (AWS DMS) aide à migrer des bases de données vers AWS rapidement et en toute sécurité. La base de données source reste totalement opérationnelle pendant la migration."
  },
  {
    id: 13,
    question: "Adjusting compute capacity dynamically to reduce cost is an implementation of which AWS cloud best practice?",
    options: [
      { key: "A", text: "Build security in every layer." },
      { key: "B", text: "Parallelize tasks." },
      { key: "C", text: "Implement elasticity." },
      { key: "D", text: "Adopt monolithic architecture." }
    ],
    correctAnswer: ["C"],
    rubric: "Concepts Cloud",
    explanation: "Ajuster la capacité de calcul de manière dynamique (par exemple en éteignant des instances non utilisées ou en réduisant le nombre d'instances la nuit) s'inscrit directement dans le principe d'élasticité pour optimiser les coûts."
  },
  {
    id: 14,
    question: "What are the benefits of having infrastructure hosted in AWS? (Choose TWO)",
    options: [
      { key: "A", text: "Increasing speed and agility." },
      { key: "B", text: "There is no need to worry about security." },
      { key: "C", text: "Gaining complete control over the physical infrastructure." },
      { key: "D", text: "Operating applications on behalf of customers." },
      { key: "E", text: "All of the physical security and most of the data/network security are taken care of for you." }
    ],
    correctAnswer: ["A", "E"],
    rubric: "Concepts Cloud",
    explanation: "AWS permet d'accroître la vitesse d'innovation et l'agilité globale. De plus, il prend à sa charge l'entièreté de la sécurité physique des infrastructures ainsi que la sécurité des couches d'infrastructure réseau de base."
  },
  {
    id: 15,
    question: "What is the advantage of the AWS-recommended practice of \"decoupling\" applications?",
    options: [
      { key: "A", text: "Allows treating an application as a single, cohesive unit." },
      { key: "B", text: "Reduces inter-dependencies so that failures do not impact other components of the application." },
      { key: "C", text: "Allows updates of any monolithic application quickly and easily." },
      { key: "D", text: "Allows tracking of any API call made to any AWS service." }
    ],
    correctAnswer: ["B"],
    rubric: "Concepts Cloud",
    explanation: "Le découplage des applications (par exemple avec SQS ou SNS) réduit les interdépendances directes. Si un composant subit une défaillance ou un pic de trafic, les autres composants continuent de fonctionner sans être directement affectés."
  },
  {
    id: 16,
    question: "Which of the following helps a customer view the Amazon EC2 billing activity for the past month?",
    options: [
      { key: "A", text: "AWS Budgets." },
      { key: "B", text: "AWS Pricing Calculator." },
      { key: "C", text: "AWS Systems Manager." },
      { key: "D", text: "AWS Cost & Usage Reports." }
    ],
    correctAnswer: ["D"],
    rubric: "Facturation et Tarification",
    explanation: "Le rapport AWS Cost & Usage Reports (CUR) contient le jeu d'informations de facturation AWS le plus complet et détaillé disponible, idéal pour analyser les dépenses passées par ressource et par service."
  },
  {
    id: 17,
    question: "What do you gain from setting up consolidated billing for five different AWS accounts under another master account?",
    options: [
      { key: "A", text: "AWS services’ costs will be reduced to half the original price." },
      { key: "B", text: "The consolidated billing feature is just for organizational purpose." },
      { key: "C", text: "Each AWS account gets volume discounts." },
      { key: "D", text: "Each AWS account gets five times the free-tier services capacity." }
    ],
    correctAnswer: ["C"],
    rubric: "Facturation et Tarification",
    explanation: "AWS combine le volume d'utilisation de tous les comptes consolidés pour atteindre plus rapidement les paliers de remises sur volume d'utilisation (volume discounts)."
  },
  {
    id: 18,
    question: "What should you do in order to keep the data on EBS volumes safe? (Choose TWO)",
    options: [
      { key: "A", text: "Regularly update firmware on EBS devices." },
      { key: "B", text: "Create EBS snapshots." },
      { key: "C", text: "Ensure that EBS data is encrypted at rest." },
      { key: "D", text: "Store a backup daily in an external drive." },
      { key: "E", text: "Prevent any unauthorized access to AWS data centers." }
    ],
    correctAnswer: ["B", "C"],
    rubric: "Sécurité et Conformité",
    explanation: "La création de snapshots EBS (sauvegardes incrémentielles stockées sur S3) et le chiffrement au repos sont les deux meilleures pratiques recommandées pour protéger les données stockées sur les volumes EBS."
  },
  {
    id: 19,
    question: "One of the most important AWS best-practices to follow is the cloud architecture principle of elasticity. How does this principle improve your architecture’s design?",
    options: [
      { key: "A", text: "By automatically scaling your on-premises resources based on changes in demand." },
      { key: "B", text: "By automatically scaling your AWS resources using an Elastic Load Balancer." },
      { key: "C", text: "By reducing interdependencies between application components wherever possible." },
      { key: "D", text: "By automatically provisioning the required AWS resources based on changes in demand." }
    ],
    correctAnswer: ["D"],
    rubric: "Concepts Cloud",
    explanation: "L'élasticité permet à l'infrastructure d'augmenter ou de diminuer automatiquement ses ressources de calcul pour correspondre exactement à l'évolution de la charge de travail."
  },
  {
    id: 20,
    question: "A startup company is operating on limited funds and is extremely concerned about cost overruns. Which of the below options can be used to notify the company when their monthly AWS bill exceeds $2000? (Choose TWO)",
    options: [
      { key: "A", text: "Setup a CloudWatch billing alarm that triggers an SNS notification when the threshold is exceeded." },
      { key: "B", text: "Configure the Amazon Simple Email Service to send billing alerts to their email address on a daily basis." },
      { key: "C", text: "Configure the AWS Budgets Service to alert the company when the threshold is exceeded." },
      { key: "D", text: "Configure AWS CloudTrail to automatically delete all AWS resources when the threshold is exceeded." },
      { key: "E", text: "Configure the Amazon Connect Service to alert the company when the threshold is exceeded." }
    ],
    correctAnswer: ["A", "C"],
    rubric: "Facturation et Tarification",
    explanation: "Vous pouvez utiliser AWS Budgets pour configurer des alertes de coûts personnalisées, ou configurer des alarmes de facturation CloudWatch (Billing Alarms) qui envoient des notifications via Amazon SNS (Simple Notification Service) lorsque les coûts projetés dépassent votre budget."
  },
  {
    id: 21,
    question: "What does Amazon CloudFront use to distribute content to global users with low latency?",
    options: [
      { key: "A", text: "AWS Global Accelerator." },
      { key: "B", text: "AWS Regions." },
      { key: "C", text: "AWS Edge Locations." },
      { key: "D", text: "AWS Availability Zones." }
    ],
    correctAnswer: ["C"],
    rubric: "Technologie et Services",
    explanation: "Amazon CloudFront utilise un réseau d'emplacements de bord (Edge Locations) répartis mondialement pour mettre en cache et servir le contenu au plus près de l'emplacement physique des utilisateurs, réduisant ainsi considérablement la latence."
  },
  {
    id: 22,
    question: "What does the \"Principle of Least Privilege\" refer to?",
    options: [
      { key: "A", text: "You should grant your users only the permissions they need when they need them and nothing more." },
      { key: "B", text: "All IAM users should have at least the necessary permissions to access the core AWS services." },
      { key: "C", text: "All trusted IAM users should have access to any AWS service in the respective AWS account." },
      { key: "D", text: "IAM users should not be granted any permissions; to keep your account safe." }
    ],
    correctAnswer: ["A"],
    rubric: "Sécurité et Conformité",
    explanation: "Le principe de moindre privilège consiste à accorder uniquement l'accès minimal requis pour accomplir une tâche spécifique, minimisant ainsi l'impact d'une mauvaise manipulation ou d'une compromission de compte."
  },
  {
    id: 23,
    question: "Which of the following does NOT belong to the AWS Cloud Computing models?",
    options: [
      { key: "A", text: "Platform as a Service (PaaS)." },
      { key: "B", text: "Infrastructure as a Service (IaaS)." },
      { key: "C", text: "Software as a Service (SaaS)." },
      { key: "D", text: "Networking as a Service (NaaS)." }
    ],
    correctAnswer: ["D"],
    rubric: "Concepts Cloud",
    explanation: "Les trois principaux modèles de services cloud reconnus sont l'IaaS, le PaaS et le SaaS. Le 'NaaS' n'est pas un modèle de service de base d'AWS."
  },
  {
    id: 24,
    question: "The identification process of an online financial services company requires that new users must complete an online interview with their security team. The completed recorded interviews are only required in the event of a legal issue or a regulatory compliance breach. What is the most cost-effective service to store the recorded videos?",
    options: [
      { key: "A", text: "S3 Intelligent-Tiering." },
      { key: "B", text: "AWS Marketplace." },
      { key: "C", text: "Amazon S3 Glacier Deep Archive." },
      { key: "D", text: "Amazon EBS." }
    ],
    correctAnswer: ["C"],
    rubric: "Technologie et Services",
    explanation: "Amazon S3 Glacier Deep Archive est l'option de stockage la moins chère d'AWS, conçue spécifiquement pour la conservation à long terme de données rarement consultées, nécessitant quelques heures pour la récupération."
  },
  {
    id: 25,
    question: "Which service provides DNS in the AWS cloud?",
    options: [
      { key: "A", text: "Route 53." },
      { key: "B", text: "AWS Config." },
      { key: "C", text: "Amazon CloudFront." },
      { key: "D", text: "Amazon EMR." }
    ],
    correctAnswer: ["A"],
    rubric: "Technologie et Services",
    explanation: "Amazon Route 53 est un service DNS (Domain Name System) web hautement disponible et évolutif fourni par AWS."
  },
  {
    id: 26,
    question: "Hundreds of thousands of DDoS attacks are recorded every month worldwide. What service does AWS provide to help protect AWS Customers from these attacks? (Choose TWO)",
    options: [
      { key: "A", text: "AWS Shield." },
      { key: "B", text: "AWS Config." },
      { key: "C", text: "Amazon Cognito." },
      { key: "D", text: "AWS WAF." },
      { key: "E", text: "AWS KMS." }
    ],
    correctAnswer: ["A", "D"],
    rubric: "Sécurité et Conformité",
    explanation: "AWS Shield offre une protection gérée contre les attaques par déni de service (DDoS). AWS WAF (Web Application Firewall) permet de filtrer le trafic HTTP/HTTPS malveillant pour contrer les exploits courants."
  },
  {
    id: 27,
    question: "A company is deploying a new two-tier web application in AWS. Where should the most frequently accessed data be stored so that the application’s response time is optimal?",
    options: [
      { key: "A", text: "AWS OpsWorks." },
      { key: "B", text: "AWS Storage Gateway." },
      { key: "C", text: "Amazon EBS volume." },
      { key: "D", text: "Amazon ElastiCache." }
    ],
    correctAnswer: ["D"],
    rubric: "Technologie et Services",
    explanation: "Amazon ElastiCache permet de mettre en cache les données fréquemment lues directement en mémoire vive (In-Memory Database), réduisant la charge de la base de données principale et fournissant des temps de réponse ultra-rapides en millisecondes."
  },
  {
    id: 28,
    question: "You want to run a questionnaire application for only one day (without interruption), which Amazon EC2 purchase option should you use?",
    options: [
      { key: "A", text: "Reserved instances." },
      { key: "B", text: "Spot instances." },
      { key: "C", text: "Dedicated instances." },
      { key: "D", text: "On-demand instances." }
    ],
    correctAnswer: ["D"],
    rubric: "Facturation et Tarification",
    explanation: "Les instances On-Demand (à la demande) sont le choix idéal pour les courtes durées (1 jour) car vous ne payez que ce que vous consommez, sans engagement à long terme et sans risque d'interruption (contrairement aux instances Spot)."
  },
  {
    id: 29,
    question: "You are working on a project that involves creating thumbnails of millions of images. Consistent uptime is not an issue, and continuous processing is not required. Which EC2 buying option would be the most cost-effective?",
    options: [
      { key: "A", text: "Reserved Instances." },
      { key: "B", text: "On-demand Instances." },
      { key: "C", text: "Dedicated Instances." },
      { key: "D", text: "Spot Instances." }
    ],
    correctAnswer: ["D"],
    rubric: "Facturation et Tarification",
    explanation: "Les instances Spot permettent de louer la capacité de calcul inutilisée d'AWS avec des remises allant jusqu'à 90 %. Elles sont idéales pour des traitements de masse asynchrones et tolérants aux interruptions, comme la génération de miniatures d'images."
  },
  {
    id: 30,
    question: "Which of the following can be described as a global content delivery network (CDN) service?",
    options: [
      { key: "A", text: "AWS VPN." },
      { key: "B", text: "AWS Direct Connect." },
      { key: "C", text: "AWS Regions." },
      { key: "D", text: "Amazon CloudFront." }
    ],
    correctAnswer: ["D"],
    rubric: "Technologie et Services",
    explanation: "Amazon CloudFront est le service de réseau de diffusion de contenu (Content Delivery Network - CDN) géré par AWS."
  },
  {
    id: 31,
    question: "Which of the following services allows customers to manage their agreements with AWS?",
    options: [
      { key: "A", text: "AWS Artifact." },
      { key: "B", text: "AWS Certificate Manager." },
      { key: "C", text: "AWS Systems Manager." },
      { key: "D", text: "AWS Organizations." }
    ],
    correctAnswer: ["A"],
    rubric: "Technologie et Services",
    explanation: "AWS Artifact est un portail en libre-service centralisé pour accéder aux rapports de conformité de sécurité et de conformité d'AWS, ainsi que pour gérer vos accords (Agreements) avec AWS."
  },
  {
    id: 32,
    question: "Which of the following are examples of AWS-Managed Services, where AWS is responsible for the operational and maintenance burdens of running the service? (Choose TWO)",
    options: [
      { key: "A", text: "Amazon VPC." },
      { key: "B", text: "Amazon DynamoDB." },
      { key: "C", text: "Amazon Elastic MapReduce." },
      { key: "D", text: "AWS IAM." },
      { key: "E", text: "Amazon Elastic Compute Cloud." }
    ],
    correctAnswer: ["B", "C"],
    rubric: "Technologie et Services",
    explanation: "Amazon DynamoDB (base NoSQL entièrement managée) et Amazon EMR (Elastic MapReduce - plateforme Big Data managée) délèguent à AWS la gestion, les correctifs matériels, et la mise à l'échelle automatique."
  },
  {
    id: 33,
    question: "Your company has a data store application that requires access to a NoSQL database. Which AWS database offering would meet this requirement?",
    options: [
      { key: "A", text: "Amazon Aurora." },
      { key: "B", text: "Amazon DynamoDB." },
      { key: "C", text: "Amazon Elastic Block Store." },
      { key: "D", text: "Amazon Redshift." }
    ],
    correctAnswer: ["B"],
    rubric: "Technologie et Services",
    explanation: "Amazon DynamoDB est la base de données de type NoSQL (non relationnelle) de référence proposée et entièrement managée par AWS."
  },
  {
    id: 34,
    question: "As part of the Enterprise support plan, who is the primary point of contact for ongoing support needs?",
    options: [
      { key: "A", text: "AWS Identity and Access Management (IAM) user." },
      { key: "B", text: "Infrastructure Event Management (IEM) engineer." },
      { key: "C", text: "AWS Consulting Partners." },
      { key: "D", text: "Technical Account Manager (TAM)." }
    ],
    correctAnswer: ["D"],
    rubric: "Facturation et Tarification",
    explanation: "Le TAM (Technical Account Manager) est votre point de contact technique principal dédié dans le cadre du support de niveau Enterprise d'AWS, vous aidant à concevoir, planifier et optimiser vos architectures."
  },
  {
    id: 35,
    question: "How can you view the distribution of AWS spending in one of your AWS accounts?",
    options: [
      { key: "A", text: "By using Amazon VPC console." },
      { key: "B", text: "By contacting the AWS Support team." },
      { key: "C", text: "By using AWS Cost Explorer." },
      { key: "D", text: "By contacting the AWS Finance team." }
    ],
    correctAnswer: ["C"],
    rubric: "Facturation et Tarification",
    explanation: "AWS Cost Explorer dispose d'un tableau de bord graphique intuitif pour visualiser, analyser et suivre la répartition de vos coûts d'utilisation d'AWS dans le temps."
  },
  {
    id: 36,
    question: "Which of the following must an IAM user provide to interact with AWS services using the AWS Command Line Interface (AWS CLI)?",
    options: [
      { key: "A", text: "Access keys." },
      { key: "B", text: "Secret token." },
      { key: "C", text: "UserID." },
      { key: "D", text: "User name and password." }
    ],
    correctAnswer: ["A"],
    rubric: "Facturation et Tarification",
    explanation: "Pour utiliser l'AWS CLI (ou le SDK), un utilisateur IAM doit fournir des clés d'accès (Access Key ID et Secret Access Key) pour authentifier par signature cryptographique ses requêtes programmatiques."
  },
  {
    id: 37,
    question: "You have AWS Basic support, and you have discovered that some AWS resources are being used maliciously, and those resources could potentially compromise your data. What should you do?",
    options: [
      { key: "A", text: "Contact the AWS Customer Service team." },
      { key: "B", text: "Contact the AWS Abuse team." },
      { key: "C", text: "Contact the AWS Concierge team." },
      { key: "D", text: "Contact the AWS Security team." }
    ],
    correctAnswer: ["B"],
    rubric: "Facturation et Tarification",
    explanation: "L'équipe AWS Abuse (Abuse Team) est le canal officiel pour signaler toute utilisation abusive, illicite ou malveillante constatée des ressources AWS."
  },
  {
    id: 38,
    question: "Select TWO examples of the AWS shared controls.",
    options: [
      { key: "A", text: "Patch Management." },
      { key: "B", text: "IAM Management." },
      { key: "C", text: "VPC Management." },
      { key: "D", text: "Configuration Management." },
      { key: "E", text: "Data Center operations." }
    ],
    correctAnswer: ["A", "D"],
    rubric: "Sécurité et Conformité",
    explanation: "La gestion des correctifs (Patch Management) et la gestion de la configuration (Configuration Management) sont des contrôles partagés : les deux parties ont des responsabilités d'application à leurs niveaux respectifs d'infrastructure."
  },
  {
    id: 39,
    question: "In order to implement best practices when dealing with a “Single Point of Failure,” you should attempt to build as much automation as possible in both detecting and reacting to failure. Which of the following AWS services would help? (Choose TWO)",
    options: [
      { key: "A", text: "ELB." },
      { key: "B", text: "Auto Scaling." },
      { key: "C", text: "Amazon Athen." },
      { key: "D", text: "ECR." },
      { key: "E", text: "Amazon EC2." }
    ],
    correctAnswer: ["A", "B"],
    rubric: "Technologie et Services",
    explanation: "L'Elastic Load Balancing (ELB) détecte les instances en panne et redirige le trafic. L'Auto Scaling réagit en remplaçant automatiquement les instances défaillantes ou en adaptant la taille du parc d'instances."
  },
  {
    id: 40,
    question: "A company is planning to host an educational website on AWS. Their video courses will be streamed all around the world. Which of the following AWS services will help achieve high transfer speeds?",
    options: [
      { key: "A", text: "Amazon SNS." },
      { key: "B", text: "Amazon Kinesis Video Streams." },
      { key: "C", text: "AWS CloudFormation." },
      { key: "D", text: "Amazon CloudFront." }
    ],
    correctAnswer: ["D"],
    rubric: "Technologie et Services",
    explanation: "Amazon CloudFront est le service de CDN par excellence d'AWS pour accélérer la livraison de fichiers volumineux, d'images et de flux vidéos grâce à la mise en cache mondiale."
  },
  {
    id: 41,
    question: "A developer is planning to build a two-tier web application that has a MySQL database layer. Which of the following AWS database services would provide automated backups for the application?",
    options: [
      { key: "A", text: "A MySQL database installed on an EC2 instance." },
      { key: "B", text: "Amazon Aurora." },
      { key: "C", text: "Amazon DynamoDB." },
      { key: "D", text: "Amazon Neptune." }
    ],
    correctAnswer: ["B"],
    rubric: "Technologie et Services",
    explanation: "Amazon Aurora est une base de données relationnelle gérée compatible avec MySQL et PostgreSQL qui inclut des fonctionnalités de sauvegarde et de restauration continue et automatisée."
  },
  {
    id: 42,
    question: "What is the AWS service that enables AWS architects to manage infrastructure as code?",
    options: [
      { key: "A", text: "AWS CloudFormation." },
      { key: "B", text: "AWS Config." },
      { key: "C", text: "Amazon SES." },
      { key: "D", text: "Amazon EMR." }
    ],
    correctAnswer: ["A"],
    rubric: "Technologie et Services",
    explanation: "AWS CloudFormation permet d'utiliser des fichiers modèles au format JSON ou YAML pour décrire, déployer et mettre à jour de manière automatisée des architectures d'infrastructure."
  },
  {
    id: 43,
    question: "Under the shared responsibility model, which of the following is the responsibility of AWS?",
    options: [
      { key: "A", text: "Client-side encryption." },
      { key: "B", text: "Configuring infrastructure devices." },
      { key: "C", text: "Server-side encryption." },
      { key: "D", text: "Filtering traffic with Security Groups." }
    ],
    correctAnswer: ["B"],
    rubric: "Sécurité et Conformité",
    explanation: "La configuration et la maintenance des périphériques d'infrastructure physiques (switches, routeurs, serveurs physiques) relèvent entièrement de la responsabilité d'AWS."
  },
  {
    id: 44,
    question: "What does the AWS Health Dashboard provide? (Choose TWO)",
    options: [
      { key: "A", text: "Detailed troubleshooting guidance to address AWS events impacting your resources." },
      { key: "B", text: "Health checks for Auto Scaling instances." },
      { key: "C", text: "Recommendations for Cost Optimization." },
      { key: "D", text: "A dashboard detailing vulnerabilities in your applications." },
      { key: "E", text: "Personalized view of AWS service health." }
    ],
    correctAnswer: ["A", "E"],
    rubric: "Technologie et Services",
    explanation: "L'AWS Health Dashboard propose une vue personnalisée et ciblée de la santé de vos services et des alertes de maintenance ou d'incidents impactant précisément vos ressources."
  },
  {
    id: 45,
    question: "You have deployed your application on multiple Amazon EC2 instances. Your customers complain that sometimes they can’t reach your application. Which AWS service allows you to monitor the performance of your EC2 instances to assist in troubleshooting these issues?",
    options: [
      { key: "A", text: "AWS Lambda." },
      { key: "B", text: "AWS Config." },
      { key: "C", text: "Amazon CloudWatch." },
      { key: "D", text: "AWS CloudTrail." }
    ],
    correctAnswer: ["C"],
    rubric: "Technologie et Services",
    explanation: "Amazon CloudWatch est le service de surveillance de l'infrastructure d'AWS. Il collecte des métriques (CPU, réseau, E/S) pour aider à diagnostiquer et résoudre les goulots d'étranglement ou pannes."
  },
  {
    id: 46,
    question: "Your company is developing a critical web application in AWS, and the security of the application is a top priority. Which of the following AWS services will provide infrastructure security optimization recommendations?",
    options: [
      { key: "A", text: "AWS Shield." },
      { key: "B", text: "AWS Management Console." },
      { key: "C", text: "AWS Secrets Manager." },
      { key: "D", text: "AWS Trusted Advisor." }
    ],
    correctAnswer: ["D"],
    rubric: "Sécurité et Conformité",
    explanation: "AWS Trusted Advisor analyse votre compte AWS par rapport aux meilleures pratiques et formule des recommandations dans 5 piliers, dont l'optimisation de la sécurité."
  },
  {
    id: 47,
    question: "Which of the following is not a benefit of Amazon S3? (Choose TWO)",
    options: [
      { key: "A", text: "Amazon S3 provides unlimited storage for any type of data." },
      { key: "B", text: "Amazon S3 can run any type of application or backend system." },
      { key: "C", text: "Amazon S3 stores any number of objects, but with object size limits." },
      { key: "D", text: "Amazon S3 can be scaled manually to store and retrieve any amount of data from anywhere." },
      { key: "E", text: "Amazon S3 provides 99.999999999% (11 9’s) of data durability." }
    ],
    correctAnswer: ["B", "D"],
    rubric: "Technologie et Services",
    explanation: "Amazon S3 est un service de stockage d'objets, il ne peut pas exécuter d'applications (contrairement à EC2). De plus, il s'ajuste automatiquement (auto-scaling) et n'a pas besoin d'être mis à l'échelle manuellement."
  },
  {
    id: 48,
    question: "In the AWS Shared responsibility Model, which of the following are the responsibility of the customer? (Choose TWO)",
    options: [
      { key: "A", text: "Disk disposal." },
      { key: "B", text: "Controlling physical access to compute resources." },
      { key: "C", text: "Patching the Network infrastructure." },
      { key: "D", text: "Setting password complexity rules." },
      { key: "E", text: "Configuring network access rules." }
    ],
    correctAnswer: ["D", "E"],
    rubric: "Sécurité et Conformité",
    explanation: "La configuration des règles de politique de mots de passe de vos utilisateurs IAM et le paramétrage des règles d'accès réseau (ex: security groups) incombent entièrement au client."
  },
  {
    id: 49,
    question: "What does AWS provide to deploy popular technologies such as IBM MQ on AWS with the least amount of effort and time?",
    options: [
      { key: "A", text: "Amazon Aurora." },
      { key: "B", text: "Amazon CloudWatch." },
      { key: "C", text: "AWS Quick Start reference deployments." },
      { key: "D", text: "AWS OpsWorks." }
    ],
    correctAnswer: ["C"],
    rubric: "Technologie et Services",
    explanation: "Les guides de démarrage rapide (AWS Quick Starts / AWS Partner Solutions) proposent des modèles CloudFormation pré-configurés par des architectes pour déployer en un clic des logiciels tiers populaires sur AWS."
  },
  {
    id: 50,
    question: "An organization has decided to purchase an Amazon EC2 Reserved Instance (RI) for three years in order to reduce costs. It is possible that the application workloads could change during the reservation period. What is the EC2 Reserved Instance (RI) type that will allow the company to exchange the purchased reserved instance for another reserved instance with higher computing power if they need to?",
    options: [
      { key: "A", text: "Elastic RI." },
      { key: "B", text: "Premium RI." },
      { key: "C", text: "Standard RI." },
      { key: "D", text: "Convertible RI." }
    ],
    correctAnswer: ["D"],
    rubric: "Facturation et Tarification",
    explanation: "Les instances réservées convertibles (Convertible Reserved Instances) permettent d'échanger l'instance réservée contre une autre ayant des attributs différents (type d'instance, OS, etc.) si vos besoins évoluent."
  }
];

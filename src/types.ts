export interface Question {
  id: number;
  question: string;
  options: {
    key: string;
    text: string;
  }[];
  correctAnswer: string[];
  rubric: 'Concepts Cloud' | 'Sécurité et Conformité' | 'Technologie et Services' | 'Facturation et Tarification';
  explanation?: string;
}

export interface RubricInfo {
  id: string;
  title: string;
  description: string;
  keyPoints: string[];
  iconName: string;
}

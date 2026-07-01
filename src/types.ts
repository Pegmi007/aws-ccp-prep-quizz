export interface Question {
  id: number;
  question: string;
  options: {
    key: string;
    text: string;
  }[];
  correctAnswer: string[];
  rubric: string;
  explanation?: string;
}

export interface RubricInfo {
  id: string;
  title: string;
  description: string;
  keyPoints: string[];
  iconName: string;
}

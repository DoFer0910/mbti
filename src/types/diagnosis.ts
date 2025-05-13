export interface DiagnosisResult {
  id: string;
  userId: string;
  mbtiType: string;
  version: 'short' | 'full';
  answers: {
    questionId: number;
    answer: number;
  }[];
  createdAt: number;
}

export interface DiagnosisHistory {
  [key: string]: DiagnosisResult;
} 
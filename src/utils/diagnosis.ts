import { getDatabase, ref, push, set } from 'firebase/database';
import { DiagnosisResult } from '../types/diagnosis';

export const saveDiagnosisResult = async (
  userId: string,
  mbtiType: string,
  version: 'short' | 'full',
  answers: { questionId: number; answer: number }[]
): Promise<void> => {
  const db = getDatabase();
  const historyRef = ref(db, `diagnosis_history/${userId}`);
  const newResultRef = push(historyRef);

  const result: Omit<DiagnosisResult, 'id'> = {
    userId,
    mbtiType,
    version,
    answers,
    createdAt: Date.now(),
  };

  await set(newResultRef, result);
}; 
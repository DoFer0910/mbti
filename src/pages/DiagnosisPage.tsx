import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Question {
  id: number;
  text: string;
  axis: 'EI' | 'SN' | 'TF' | 'JP';
}

// ショート版の質問（20問）
const shortQuestions: Question[] = [
  // E-I軸の質問
  { id: 1, text: '人と話すのが好きですか？', axis: 'EI' },
  { id: 2, text: '一人で過ごす時間を大切にしますか？', axis: 'EI' },
  { id: 3, text: '大勢の前で話すのが得意ですか？', axis: 'EI' },
  { id: 4, text: '静かな場所で過ごすのが好きですか？', axis: 'EI' },
  { id: 5, text: '新しい人と出会うのが好きですか？', axis: 'EI' },

  // S-N軸の質問
  { id: 6, text: '細部に注意を払うタイプですか？', axis: 'SN' },
  { id: 7, text: '将来の可能性について考えるのが好きですか？', axis: 'SN' },
  { id: 8, text: '具体的な事実を重視しますか？', axis: 'SN' },
  { id: 9, text: '新しいアイデアを考えるのが好きですか？', axis: 'SN' },
  { id: 10, text: '現実的な問題解決を優先しますか？', axis: 'SN' },

  // T-F軸の質問
  { id: 11, text: '論理的に物事を考えるタイプですか？', axis: 'TF' },
  { id: 12, text: '人の気持ちを優先しますか？', axis: 'TF' },
  { id: 13, text: '公平な判断を心がけますか？', axis: 'TF' },
  { id: 14, text: '調和を大切にしますか？', axis: 'TF' },
  { id: 15, text: '効率を重視しますか？', axis: 'TF' },

  // J-P軸の質問
  { id: 16, text: '計画を立てて行動するタイプですか？', axis: 'JP' },
  { id: 17, text: '柔軟に対応するのが好きですか？', axis: 'JP' },
  { id: 18, text: '締め切りを守るタイプですか？', axis: 'JP' },
  { id: 19, text: '新しい選択肢を探求するのが好きですか？', axis: 'JP' },
  { id: 20, text: '決断を先延ばしにするタイプですか？', axis: 'JP' },
];

// フル版の質問（60問）
const fullQuestions: Question[] = [
  // ショート版の質問を含む
  ...shortQuestions,
  // 追加の質問
  // E-I軸の追加質問
  { id: 21, text: 'グループ活動が好きですか？', axis: 'EI' },
  { id: 22, text: '一人で考える時間が必要ですか？', axis: 'EI' },
  { id: 23, text: '社交的な場でエネルギーを得ますか？', axis: 'EI' },
  { id: 24, text: '静かな環境で集中できますか？', axis: 'EI' },
  { id: 25, text: '知らない人と話すのが苦手ですか？', axis: 'EI' },

  // S-N軸の追加質問
  { id: 26, text: '具体的な手順を重視しますか？', axis: 'SN' },
  { id: 27, text: '抽象的な概念を理解するのが好きですか？', axis: 'SN' },
  { id: 28, text: '実践的な経験を大切にしますか？', axis: 'SN' },
  { id: 29, text: '理論的な説明を好みますか？', axis: 'SN' },
  { id: 30, text: '現実的な問題に焦点を当てますか？', axis: 'SN' },

  // T-F軸の追加質問
  { id: 31, text: '客観的な判断を心がけますか？', axis: 'TF' },
  { id: 32, text: '人の感情に共感しやすいですか？', axis: 'TF' },
  { id: 33, text: '論理的な議論を楽しみますか？', axis: 'TF' },
  { id: 34, text: '調和を乱すことを避けますか？', axis: 'TF' },
  { id: 35, text: '効率性を重視しますか？', axis: 'TF' },

  // J-P軸の追加質問
  { id: 36, text: '計画通りに進めるのが好きですか？', axis: 'JP' },
  { id: 37, text: '臨機応変に対応できますか？', axis: 'JP' },
  { id: 38, text: '締め切りを守ることを重視しますか？', axis: 'JP' },
  { id: 39, text: '選択肢を残しておきたいですか？', axis: 'JP' },
  { id: 40, text: '決断を急ぎますか？', axis: 'JP' },

  // さらに追加の質問（41-60）
  // E-I軸
  { id: 41, text: '人前で発表するのが得意ですか？', axis: 'EI' },
  { id: 42, text: '一人の時間を大切にしますか？', axis: 'EI' },
  { id: 43, text: '社交的な場で疲れを感じますか？', axis: 'EI' },
  { id: 44, text: '静かな環境でリラックスできますか？', axis: 'EI' },
  { id: 45, text: '新しい出会いを楽しみますか？', axis: 'EI' },

  // S-N軸
  { id: 46, text: '具体的な事実を重視しますか？', axis: 'SN' },
  { id: 47, text: '将来の可能性を考えますか？', axis: 'SN' },
  { id: 48, text: '実践的な経験を大切にしますか？', axis: 'SN' },
  { id: 49, text: '新しいアイデアを探求しますか？', axis: 'SN' },
  { id: 50, text: '現実的な問題解決を優先しますか？', axis: 'SN' },

  // T-F軸
  { id: 51, text: '論理的な判断を重視しますか？', axis: 'TF' },
  { id: 52, text: '人の気持ちを優先しますか？', axis: 'TF' },
  { id: 53, text: '公平な判断を心がけますか？', axis: 'TF' },
  { id: 54, text: '調和を大切にしますか？', axis: 'TF' },
  { id: 55, text: '効率を重視しますか？', axis: 'TF' },

  // J-P軸
  { id: 56, text: '計画を立てるのが好きですか？', axis: 'JP' },
  { id: 57, text: '柔軟に対応するのが得意ですか？', axis: 'JP' },
  { id: 58, text: '締め切りを守ることを重視しますか？', axis: 'JP' },
  { id: 59, text: '選択肢を残しておきたいですか？', axis: 'JP' },
  { id: 60, text: '決断を急ぎますか？', axis: 'JP' },
];

const DiagnosisPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { version = 'full' } = (location.state as { version?: 'short' | 'full' }) || {};
  const questions = version === 'short' ? shortQuestions : fullQuestions;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0
  });
  const [answerHistory, setAnswerHistory] = useState<number[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState(0);

  const handleAnswer = (value: number) => {
    const question = questions[currentQuestion];
    const axis = question.axis;
    const newAnswers = { ...answers };

    // 回答の強さに応じてスコアを加算
    if (axis === 'EI') {
      if (value > 0) {
        newAnswers.E += Math.abs(value);
      } else {
        newAnswers.I += Math.abs(value);
      }
    } else if (axis === 'SN') {
      if (value > 0) {
        newAnswers.S += Math.abs(value);
      } else {
        newAnswers.N += Math.abs(value);
      }
    } else if (axis === 'TF') {
      if (value > 0) {
        newAnswers.T += Math.abs(value);
      } else {
        newAnswers.F += Math.abs(value);
      }
    } else if (axis === 'JP') {
      if (value > 0) {
        newAnswers.J += Math.abs(value);
      } else {
        newAnswers.P += Math.abs(value);
      }
    }

    setAnswers(newAnswers);
    setAnswerHistory([...answerHistory, value]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer(0); // 次の質問のためにスライダーをリセット
    } else {
      // 結果を計算して結果ページへ遷移
      const result = calculateResult(newAnswers);
      navigate('/result', { 
        state: { 
          mbtiType: result,
          version,
          answers: answerHistory.map((value, index) => ({
            questionId: questions[index].id,
            answer: value
          }))
        } 
      });
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      const previousAnswer = answerHistory[answerHistory.length - 1];
      const previousQuestion = questions[currentQuestion - 1];
      const axis = previousQuestion.axis;
      const newAnswers = { ...answers };

      // 前の回答のスコアを減算
      if (axis === 'EI') {
        if (previousAnswer > 0) {
          newAnswers.E -= Math.abs(previousAnswer);
        } else {
          newAnswers.I -= Math.abs(previousAnswer);
        }
      } else if (axis === 'SN') {
        if (previousAnswer > 0) {
          newAnswers.S -= Math.abs(previousAnswer);
        } else {
          newAnswers.N -= Math.abs(previousAnswer);
        }
      } else if (axis === 'TF') {
        if (previousAnswer > 0) {
          newAnswers.T -= Math.abs(previousAnswer);
        } else {
          newAnswers.F -= Math.abs(previousAnswer);
        }
      } else if (axis === 'JP') {
        if (previousAnswer > 0) {
          newAnswers.J -= Math.abs(previousAnswer);
        } else {
          newAnswers.P -= Math.abs(previousAnswer);
        }
      }

      setAnswers(newAnswers);
      setAnswerHistory(answerHistory.slice(0, -1));
      setCurrentQuestion(currentQuestion - 1);
      setCurrentAnswer(previousAnswer); // 前の回答をスライダーに反映
    }
  };

  const calculateResult = (answers: { [key: string]: number }) => {
    // 各軸のスコアを計算
    const eiScore = (answers.E - answers.I) / (answers.E + answers.I);
    const snScore = (answers.S - answers.N) / (answers.S + answers.N);
    const tfScore = (answers.T - answers.F) / (answers.T + answers.F);
    const jpScore = (answers.J - answers.P) / (answers.J + answers.P);

    // スコアに基づいてタイプを決定
    const type = [
      eiScore > 0 ? 'E' : 'I',
      snScore > 0 ? 'S' : 'N',
      tfScore > 0 ? 'T' : 'F',
      jpScore > 0 ? 'J' : 'P'
    ].join('');

    return type;
  };

  const getAnswerLabel = (value: number) => {
    switch (value) {
      case -4: return '完全に反対';
      case -3: return 'かなり反対';
      case -2: return 'やや反対';
      case -1: return '少し反対';
      case 0: return 'どちらでもない';
      case 1: return '少し同意';
      case 2: return 'やや同意';
      case 3: return 'かなり同意';
      case 4: return '完全に同意';
      default: return 'どちらでもない';
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-center mt-2">
            質問 {currentQuestion + 1} / {questions.length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-8 text-center">
            {questions[currentQuestion].text}
          </h2>

          <div className="mb-8">
            <input
              type="range"
              min="-4"
              max="4"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>完全に反対</span>
              <span>どちらでもない</span>
              <span>完全に同意</span>
            </div>
            <p className="text-center mt-4 text-lg font-medium">
              {getAnswerLabel(currentAnswer)}
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className={`px-6 py-2 rounded ${
                currentQuestion === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gray-500 hover:bg-gray-600 text-white'
              }`}
            >
              前の質問に戻る
            </button>
            <button
              onClick={() => handleAnswer(currentAnswer)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
            >
              次の質問へ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisPage; 
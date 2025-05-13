import React, { useEffect, useState, useRef } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import Chart from 'chart.js/auto';

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

interface DiagnosisResult {
  id: string;
  userId: string;
  mbtiType: string;
  version: 'short' | 'full';
  answers: { questionId: number; answer: number }[];
  createdAt: number;
}

const DiagnosisHistory: React.FC = () => {
  const { currentUser } = useAuth();
  const [results, setResults] = useState<DiagnosisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<DiagnosisResult | null>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const historyRef = ref(database, `diagnosis_history/${currentUser.uid}`);
    
    // 一度だけリスナーを設定
    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // データを配列に変換し、作成日時でソート
        const resultsArray = Object.entries(data).map(([id, result]: [string, any]) => ({
          id,
          ...result
        })).sort((a, b) => b.createdAt - a.createdAt);
        
        setResults(resultsArray);
      } else {
        setResults([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('診断履歴の取得に失敗しました:', error);
      setLoading(false);
    });

    // クリーンアップ関数
    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  // 選択された結果が変更されたときにチャートを更新
  useEffect(() => {
    if (selectedResult && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // 既存のチャートを破棄
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        // スコアの計算
        const scores = calculateScores(selectedResult.answers, selectedResult.version);

        // 新しいチャートを作成
        chartInstance.current = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: ['外向性', '内向性', '感覚', '直感', '思考', '感情', '判断', '知覚'],
            datasets: [{
              label: 'MBTIスコア',
              data: [
                scores.E, scores.I,
                scores.S, scores.N,
                scores.T, scores.F,
                scores.J, scores.P
              ],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              pointBackgroundColor: 'rgba(54, 162, 235, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
            }]
          },
          options: {
            scales: {
              r: {
                angleLines: {
                  display: true
                },
                suggestedMin: 0,
                suggestedMax: 10
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      }
    }
  }, [selectedResult]);

  const handleDelete = async (id: string) => {
    if (!currentUser) return;

    try {
      setDeletingId(id);
      const resultRef = ref(database, `diagnosis_history/${currentUser.uid}/${id}`);
      await remove(resultRef);
      
      // 削除が成功したら、選択中の結果をクリア
      if (selectedResult?.id === id) {
        setSelectedResult(null);
      }
    } catch (error) {
      console.error('診断結果の削除に失敗しました:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const calculateScores = (answers: { questionId: number; answer: number }[], version: 'short' | 'full') => {
    const scores = {
      E: 0, I: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    };

    // 各質問の回答を集計
    answers.forEach(({ questionId, answer }) => {
      const question = version === 'short' ? shortQuestions : fullQuestions;
      const q = question.find(q => q.id === questionId);
      if (q) {
        const axis = q.axis;
        const value = Math.abs(answer); // 回答の強さ

        switch (axis) {
          case 'EI':
            if (answer > 0) {
              scores.E += value;
              scores.I += (4 - value);
            } else {
              scores.I += value;
              scores.E += (4 - value);
            }
            break;
          case 'SN':
            if (answer > 0) {
              scores.S += value;
              scores.N += (4 - value);
            } else {
              scores.N += value;
              scores.S += (4 - value);
            }
            break;
          case 'TF':
            if (answer > 0) {
              scores.T += value;
              scores.F += (4 - value);
            } else {
              scores.F += value;
              scores.T += (4 - value);
            }
            break;
          case 'JP':
            if (answer > 0) {
              scores.J += value;
              scores.P += (4 - value);
            } else {
              scores.P += value;
              scores.J += (4 - value);
            }
            break;
        }
      }
    });

    // スコアを正規化（0-10の範囲に）
    const maxScore = version === 'short' ? 20 : 60;
    Object.keys(scores).forEach(key => {
      scores[key as keyof typeof scores] = (scores[key as keyof typeof scores] / maxScore) * 10;
    });

    return scores;
  };

  if (loading) {
    return <div className="text-center py-4">読み込み中...</div>;
  }

  if (!currentUser) {
    return <div className="text-center py-4">ログインすると診断履歴を確認できます</div>;
  }

  if (results.length === 0) {
    return <div className="text-center py-4">診断履歴はありません</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((result) => (
          <div
            key={result.id}
            className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-colors ${
              selectedResult?.id === result.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedResult(result)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">{result.mbtiType}</h3>
                <p className="text-sm text-gray-600">
                  {result.version === 'short' ? 'ショート版' : 'フル版'} - 
                  {new Date(result.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(result.id);
                }}
                disabled={deletingId === result.id}
                className="text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedResult && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">診断結果の詳細</h2>
          <div className="mb-6">
            <canvas ref={chartRef} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold mb-2">MBTIタイプ</h3>
              <p>{selectedResult.mbtiType}</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">診断バージョン</h3>
              <p>{selectedResult.version === 'short' ? 'ショート版' : 'フル版'}</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">診断日時</h3>
              <p>{new Date(selectedResult.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosisHistory; 
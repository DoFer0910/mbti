import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { useAuth } from '../contexts/AuthContext';
import { saveDiagnosisResult } from '../utils/diagnosis';

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

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [isResultSaved, setIsResultSaved] = useState(false);

  const { mbtiType, version, answers } = location.state as {
    mbtiType: string;
    version: 'short' | 'full';
    answers: { questionId: number; answer: number }[];
  };

  useEffect(() => {
    if (!mbtiType) {
      navigate('/');
      return;
    }

    // スコアの計算
    const scores = calculateScores(answers);

    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // 既存のチャートを破棄
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

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

    // ログイン済みの場合、結果を保存（一度だけ）
    if (currentUser && !isResultSaved) {
      saveDiagnosisResult(currentUser.uid, mbtiType, version, answers)
        .then(() => {
          setIsResultSaved(true);
        })
        .catch((error) => {
          console.error('診断結果の保存に失敗しました:', error);
        });
    }
  }, [mbtiType, version, answers, currentUser, navigate, isResultSaved]);

  const calculateScores = (answers: { questionId: number; answer: number }[]) => {
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
              scores.I += (4 - value); // 反対側のスコアを補完
            } else {
              scores.I += value;
              scores.E += (4 - value); // 反対側のスコアを補完
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
    const maxScore = version === 'short' ? 20 : 60; // 各軸の最大スコアを調整
    Object.keys(scores).forEach(key => {
      scores[key as keyof typeof scores] = (scores[key as keyof typeof scores] / maxScore) * 10;
    });

    return scores;
  };

  const typeDescriptions: { [key: string]: string } = {
    ISTJ: '堅実な管理者タイプ：責任感が強く、伝統を重んじ、秩序を大切にする人です。',
    ISFJ: '献身的な守護者タイプ：思いやりがあり、誠実で、他者のために尽くす人です。',
    INFJ: 'カウンセラー：洞察力があり、理想主義的で、他者を助けることに情熱を持つ人です。',
    INTJ: '戦略的思考家タイプ：独創的で、戦略的思考を持ち、自己完結的な人です。',
    ISTP: '職人タイプ：現実的で、問題解決能力が高く、実践的な人です。',
    ISFP: '芸術家タイプ：芸術的センスがあり、自由を愛し、穏やかな人です。',
    INFP: '理想主義者タイプ：共感力が高く、創造的で、個人的な価値観を大切にする人です。',
    INTP: '論理的な探求者タイプ：論理的で、創造的、新しいアイデアを探求する人です。',
    ESTP: '起業家タイプ：行動力があり、現実的で、機転が利く人です。',
    ESFP: 'エンターテイナータイプ：明るく、社交的で、人生を楽しむ人です。',
    ENFP: '自由な精神の持ち主：創造的で、熱意があり、新しい可能性を探求する人です。',
    ENTP: '討論者タイプ：知的好奇心が強く、機知に富み、新しいアイデアを生み出す人です。',
    ESTJ: '管理者タイプ：組織力があり、効率的で、伝統を重んじる人です。',
    ESFJ: '世話役タイプ：社交的で、思いやりがあり、調和を大切にする人です。',
    ENFJ: '教師タイプ：カリスマ的で、他者を導くことに長け、思いやりのある人です。',
    ENTJ: '指揮官タイプ：リーダーシップがあり、戦略的で、効率を重視する人です。'
  };

  const handleRetry = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            あなたのタイプは「{mbtiType}」です！
          </h1>

          <div className="mb-8">
            <canvas ref={chartRef} />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">タイプの特徴</h2>
            <p className="text-gray-700">{typeDescriptions[mbtiType]}</p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleRetry}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
            >
              もう一度診断する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage; 
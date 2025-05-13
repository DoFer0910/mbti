import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const TopPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showVersionSelection, setShowVersionSelection] = useState(false);

  const handleStartDiagnosis = (version: 'short' | 'full') => {
    navigate('/diagnosis', { state: { version } });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8">
          MBTI診断サイト
        </h1>
        
        <p className="text-xl mb-12">
          あなたの性格タイプを発見しましょう。<br />
          質問に答えることで、あなたのMBTIタイプを判定します。
        </p>

        {currentUser ? (
          <div className="space-y-8">
            <div className="space-y-4">
              {!showVersionSelection ? (
                <button
                  onClick={() => setShowVersionSelection(true)}
                  className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
                >
                  診断をはじめる
                </button>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-4">診断バージョンを選択</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleStartDiagnosis('short')}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-colors"
                    >
                      <div className="text-xl mb-2">ショート版</div>
                      <div className="text-sm">20問（約5分）</div>
                    </button>
                    <button
                      onClick={() => handleStartDiagnosis('full')}
                      className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-6 rounded-lg transition-colors"
                    >
                      <div className="text-xl mb-2">フル版</div>
                      <div className="text-sm">60問（約15分）</div>
                    </button>
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center space-y-2">
                <p className="text-gray-600">
                  ログイン中: {currentUser.email}
                </p>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  ログアウト
                </button>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
              <Link
                to="/history"
                className="block text-center text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                診断履歴を確認する →
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Link
              to="/login"
              className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              ログイン / 新規登録
            </Link>
            <p className="text-gray-600">
              アカウントを作成すると、診断履歴を保存できます
            </p>
          </div>
        )}

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">質問バージョン</h3>
            <p className="text-gray-600">
              ショート版（20問）とフル版（60問）から選択できます
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">詳細な解説</h3>
            <p className="text-gray-600">
              あなたの性格タイプについて詳しく解説します
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">履歴の保存</h3>
            <p className="text-gray-600">
              アカウントを作成すると診断履歴を保存できます
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPage; 
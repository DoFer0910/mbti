import React from 'react';
import DiagnosisHistory from '../components/DiagnosisHistory';
import { Link } from 'react-router-dom';

const HistoryPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">診断履歴</h1>
          <Link
            to="/"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            トップに戻る
          </Link>
        </div>
        <DiagnosisHistory />
      </div>
    </div>
  );
};

export default HistoryPage; 
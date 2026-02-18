
import React from 'react';
import { SpinRecord } from '../types';
import { format } from 'date-fns';

interface HistoryTableProps {
  history: SpinRecord[];
  onClear: () => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ history, onClear }) => {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden flex flex-col h-full border border-white/20">
      <div className="p-4 bg-mpt-blue flex justify-between items-center">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <span>📜</span> Recent Winners
        </h2>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-xs text-mpt-yellow hover:text-white underline transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="overflow-y-auto flex-1 p-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
             <span className="text-4xl mb-2">🎈</span>
             <p className="text-sm">No spins yet!</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
              <tr>
                <th className="px-3 py-2">Item</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((record) => (
                <tr key={record.id} className="hover:bg-blue-50/30 transition-colors animate-in fade-in slide-in-from-left duration-300">
                  <td className="px-3 py-3 font-semibold text-gray-700">{record.title}</td>
                  <td className="px-3 py-3 text-green-600 font-bold">{record.amount}</td>
                  <td className="px-3 py-3 text-xs text-gray-400">
                    {format(record.timestamp, 'HH:mm:ss')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoryTable;

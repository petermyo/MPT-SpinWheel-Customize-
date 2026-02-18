
import React from 'react';
import { SpinRecord } from '../types';
import { format } from 'date-fns';

interface HistoryTableProps {
  history: SpinRecord[];
  onClear: () => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ history, onClear }) => {
  return (
    <div className="bg-white/95 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full border-2 border-white/50">
      <div className="p-3 bg-mpt-blue flex justify-between items-center shrink-0">
        <h2 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
            <span>📜</span> Recent Winners
        </h2>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-[9px] font-black uppercase text-mpt-yellow hover:text-white underline transition-colors"
          >
            Reset
          </button>
        )}
      </div>
      <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[150px] text-gray-300">
             <span className="text-3xl mb-1 opacity-50">🎈</span>
             <p className="text-[10px] font-black uppercase tracking-widest">No spins yet</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="text-[9px] text-gray-400 uppercase font-black bg-gray-50/50">
              <tr>
                <th className="px-3 py-2">Item</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((record) => (
                <tr key={record.id} className="hover:bg-blue-50/50 transition-colors animate-in fade-in duration-300">
                  <td className="px-3 py-2 text-xs font-black text-gray-700 truncate max-w-[80px]">{record.title}</td>
                  <td className="px-3 py-2 text-xs text-blue-600 font-black">{record.amount}</td>
                  <td className="px-3 py-2 text-[9px] font-bold text-gray-400 text-right">
                    {format(record.timestamp, 'HH:mm')}
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

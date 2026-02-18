
import React, { useState } from 'react';
import { SpinSlice } from '../types';
import { COLORS } from '../constants';
import { Plus, Trash2, Save, RotateCcw } from 'lucide-react';

interface AdminPanelProps {
  slices: SpinSlice[];
  onSave: (slices: SpinSlice[]) => void;
  onReset: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ slices, onSave, onReset }) => {
  const [localSlices, setLocalSlices] = useState<SpinSlice[]>(slices);

  const handleAdd = () => {
    const newSlice: SpinSlice = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Reward',
      amount: '0',
      icon: '🎁',
      chance: 10,
      color: localSlices.length % 3 === 0 ? COLORS.MPT_YELLOW : (localSlices.length % 3 === 1 ? COLORS.WHITE : COLORS.MPT_BLUE)
    };
    setLocalSlices([...localSlices, newSlice]);
  };

  const handleRemove = (id: string) => {
    setLocalSlices(localSlices.filter(s => s.id !== id));
  };

  const handleChange = (id: string, field: keyof SpinSlice, value: string | number) => {
    setLocalSlices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const totalChance = localSlices.reduce((sum, s) => sum + s.chance, 0);

  const inputBaseClass = "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium";

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 flex flex-col max-h-[90vh]">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h2 className="text-2xl font-black text-blue-900 flex items-center gap-2">
            ⚙️ Wheel Settings
          </h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Configure Rewards & Odds</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={onReset}
                className="flex items-center gap-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl transition-all active:scale-95"
                title="Reset to defaults"
            >
                <RotateCcw size={16} /> Reset
            </button>
            <button 
                onClick={() => onSave(localSlices)}
                className="flex items-center gap-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg active:scale-95 shadow-blue-200"
            >
                <Save size={16} /> Save Changes
            </button>
        </div>
      </div>

      <div className="space-y-6 overflow-y-auto pr-3 custom-scrollbar flex-1 pb-4">
        {localSlices.map((slice, idx) => (
          <div key={slice.id} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-black italic">
                {idx + 1}
              </span>
              <div className="flex-1 relative">
                <input 
                  value={slice.title}
                  onChange={(e) => handleChange(slice.id, 'title', e.target.value)}
                  className={inputBaseClass}
                  placeholder="Slice Title (e.g., 500 MMK)"
                />
              </div>
              <button 
                onClick={() => handleRemove(slice.id)}
                className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Delete Slice"
              >
                <Trash2 size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-black text-gray-500 tracking-widest px-1">Amount</label>
                <input 
                  type="text"
                  value={slice.amount}
                  onChange={(e) => handleChange(slice.id, 'amount', e.target.value)}
                  className={inputBaseClass}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-black text-gray-500 tracking-widest px-1">Weight (%)</label>
                <input 
                  type="number"
                  value={slice.chance}
                  onChange={(e) => handleChange(slice.id, 'chance', parseInt(e.target.value) || 0)}
                  className={inputBaseClass}
                  placeholder="10"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-black text-gray-500 tracking-widest px-1">Icon</label>
                <input 
                  value={slice.icon}
                  onChange={(e) => handleChange(slice.id, 'icon', e.target.value)}
                  className={`${inputBaseClass} text-center text-lg`}
                  placeholder="🎁"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 px-1">
                <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Theme:</span>
                <div className="flex gap-2">
                    {[COLORS.MPT_YELLOW, COLORS.WHITE, COLORS.MPT_BLUE].map(c => (
                        <button 
                            key={c}
                            onClick={() => handleChange(slice.id, 'color', c)}
                            className={`w-7 h-7 rounded-lg border-2 transition-all shadow-sm ${slice.color === c ? 'border-blue-600 scale-110' : 'border-white opacity-60'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between shrink-0">
        <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
           <span className="text-xs font-bold text-blue-400 uppercase tracking-tighter mr-2">Total Probability</span>
           <span className={`text-lg font-black ${totalChance === 100 ? 'text-green-600' : 'text-blue-800'}`}>
              {totalChance}
           </span>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-mpt-yellow hover:bg-yellow-400 text-blue-900 px-6 py-3 rounded-2xl font-black transition-all shadow-lg active:scale-95 uppercase tracking-tight"
        >
          <Plus size={20} strokeWidth={3} /> Add New Slice
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;

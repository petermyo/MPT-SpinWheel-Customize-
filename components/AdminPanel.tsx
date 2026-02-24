
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

  const inputBaseClass = "w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-bold shadow-sm";

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-10 flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-10 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-blue-900 flex items-center gap-3">
            <span>⚙️</span> Wheel Configuration
          </h2>
          <p className="text-sm text-gray-400 font-black uppercase tracking-widest mt-2">Manage Rewards & Winning Odds</p>
        </div>
        <div className="flex gap-4">
            <button 
                onClick={onReset}
                className="flex items-center gap-2 text-sm font-black bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-3 rounded-2xl transition-all active:scale-95"
            >
                <RotateCcw size={20} /> Reset
            </button>
            <button 
                onClick={() => onSave(localSlices)}
                className="flex items-center gap-2 text-sm font-black bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl transition-all shadow-xl active:scale-95 shadow-blue-200"
            >
                <Save size={20} /> Save Changes
            </button>
        </div>
      </div>

      <div className="space-y-8 overflow-y-auto pr-4 custom-scrollbar flex-1 pb-6">
        {localSlices.map((slice, idx) => (
          <div key={slice.id} className="p-8 rounded-3xl border border-gray-100 bg-gray-50/50 flex flex-col gap-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-5">
              <span className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-lg font-black italic shadow-inner">
                {idx + 1}
              </span>
              <div className="flex-1">
                <input 
                  value={slice.title}
                  onChange={(e) => handleChange(slice.id, 'title', e.target.value)}
                  className={inputBaseClass}
                  placeholder="Reward Title"
                />
              </div>
              <button 
                onClick={() => handleRemove(slice.id)}
                className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                title="Delete Slice"
              >
                <Trash2 size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-xs uppercase font-black text-gray-500 tracking-widest px-1">Value Amount</label>
                <input 
                  type="text"
                  value={slice.amount}
                  onChange={(e) => handleChange(slice.id, 'amount', e.target.value)}
                  className={inputBaseClass}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs uppercase font-black text-gray-500 tracking-widest px-1">Chance (%)</label>
                <input 
                  type="number"
                  value={slice.chance}
                  onChange={(e) => handleChange(slice.id, 'chance', parseInt(e.target.value) || 0)}
                  className={inputBaseClass}
                  placeholder="10"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs uppercase font-black text-gray-500 tracking-widest px-1">Display Icon</label>
                <input 
                  value={slice.icon}
                  onChange={(e) => handleChange(slice.id, 'icon', e.target.value)}
                  className={`${inputBaseClass} text-center text-2xl`}
                  placeholder="🎁"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-5 px-1">
                <span className="text-xs uppercase font-black text-gray-400 tracking-widest">Slice Theme:</span>
                <div className="flex gap-4">
                    {[COLORS.MPT_YELLOW, COLORS.WHITE, COLORS.MPT_BLUE].map(c => (
                        <button 
                            key={c}
                            onClick={() => handleChange(slice.id, 'color', c)}
                            className={`w-10 h-10 rounded-xl border-4 transition-all shadow-md ${slice.color === c ? 'border-blue-600 scale-110' : 'border-white opacity-40 hover:opacity-100'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between shrink-0">
        <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100 flex items-center gap-4">
           <span className="text-sm font-black text-blue-400 uppercase tracking-widest">Total Weight</span>
           <span className={`text-2xl font-black ${totalChance === 100 ? 'text-green-600' : 'text-blue-800'}`}>
              {totalChance}%
           </span>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-3 bg-mpt-yellow hover:bg-yellow-400 text-blue-900 px-10 py-4 rounded-[1.5rem] font-black transition-all shadow-xl active:scale-95 uppercase tracking-tighter text-lg"
        >
          <Plus size={24} strokeWidth={4} /> Add New Reward
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;


import { SpinSlice, SpinRecord } from '../types';
import { INITIAL_SLICES } from '../constants';

const SLICES_KEY = 'mpt_spin_slices';
const HISTORY_KEY = 'mpt_spin_history';

export const dbService = {
  getSlices: (): SpinSlice[] => {
    const data = localStorage.getItem(SLICES_KEY);
    return data ? JSON.parse(data) : INITIAL_SLICES;
  },

  saveSlices: (slices: SpinSlice[]) => {
    localStorage.setItem(SLICES_KEY, JSON.stringify(slices));
  },

  getHistory: (): SpinRecord[] => {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  },

  addSpinRecord: (record: SpinRecord) => {
    const history = dbService.getHistory();
    const updated = [record, ...history].slice(0, 50); // Keep last 50
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  },

  clearHistory: () => {
    localStorage.removeItem(HISTORY_KEY);
  }
};

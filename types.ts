
export interface SpinSlice {
  id: string;
  title: string;
  amount: string;
  icon: string;
  chance: number; // Weight for probability
  color: string;
}

export interface SpinRecord {
  id: string;
  sliceId: string;
  title: string;
  amount: string;
  timestamp: number;
}

export interface AppState {
  slices: SpinSlice[];
  history: SpinRecord[];
}


import { SpinSlice } from './types';

export const COLORS = {
  MPT_YELLOW: '#FFD100',
  MPT_BLUE: '#005BAA',
  WHITE: '#FFFFFF',
  DARK_BLUE: '#003d73',
  LIGHT_BLUE: '#337cbb'
};

export const INITIAL_SLICES: SpinSlice[] = [
  { id: '1', title: '500MB', amount: '1500', icon: '📶', chance: 40, color: COLORS.MPT_YELLOW },
  { id: '2', title: '1 GB', amount: '3000', icon: '🌐', chance: 25, color: COLORS.MPT_BLUE },
  { id: '3', title: '2 GB', amount: '5500', icon: '🚀', chance: 10, color: COLORS.MPT_YELLOW },
  { id: '4', title: '10 GB', amount: '15000', icon: '⚡', chance: 5, color: COLORS.WHITE },
  { id: '5', title: 'Book', amount: '2500', icon: '📖', chance: 10, color: COLORS.MPT_YELLOW },
  { id: '6', title: 'Pen', amount: '250', icon: '🖊️', chance: 10, color: COLORS.MPT_BLUE },
];

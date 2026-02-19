
import { SpinSlice } from './types';

export const COLORS = {
  MPT_YELLOW: '#FFD100',
  MPT_BLUE: '#005BAA',
  WHITE: '#FFFFFF',
  DARK_BLUE: '#003d73',
  LIGHT_BLUE: '#337cbb'
};

export const INITIAL_SLICES: SpinSlice[] = [
  { id: '1', title: '500MB', amount: '1500', icon: '📶', chance: 50, color: COLORS.MPT_YELLOW },
  { id: '2', title: '1 GB', amount: '3000', icon: '🌐', chance: 9, color: COLORS.MPT_BLUE },
  { id: '1', title: '500MB', amount: '1500', icon: '📶', chance: 25, color: COLORS.MPT_YELLOW },
  { id: '2', title: '1 GB', amount: '3000', icon: '🌐', chance: 8, color: COLORS.MPT_BLUE },
  { id: '4', title: '5 GB', amount: '15000', icon: '⚡', chance: 8, color: COLORS.WHITE },
];

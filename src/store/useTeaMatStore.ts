import { create } from 'zustand';
import { Seat, Violation } from '@/types';
import { DEFAULT_SEATS } from '@/utils/defaultLayout';
import { generateViolationSummary } from '@/utils/violationSummary';

interface TeaMatState {
  seats: Seat[];
  violations: Violation[];
  isAllCompliant: boolean;
  setSeatPosition: (id: number, x: number, y: number) => void;
  resetToDefault: () => void;
  validateAll: () => void;
}

const initialState = () => {
  const result = generateViolationSummary(DEFAULT_SEATS);
  return {
    seats: [...DEFAULT_SEATS],
    violations: result.violations,
    isAllCompliant: result.isAllCompliant,
  };
};

export const useTeaMatStore = create<TeaMatState>((set, get) => ({
  ...initialState(),

  setSeatPosition: (id: number, x: number, y: number) => {
    const seats = get().seats.map((seat) =>
      seat.id === id ? { ...seat, x, y } : seat
    );
    const result = generateViolationSummary(seats);
    set({
      seats,
      violations: result.violations,
      isAllCompliant: result.isAllCompliant,
    });
  },

  resetToDefault: () => {
    const result = generateViolationSummary(DEFAULT_SEATS);
    set({
      seats: [...DEFAULT_SEATS],
      violations: result.violations,
      isAllCompliant: result.isAllCompliant,
    });
  },

  validateAll: () => {
    const seats = get().seats;
    const result = generateViolationSummary(seats);
    set({
      violations: result.violations,
      isAllCompliant: result.isAllCompliant,
    });
  },
}));

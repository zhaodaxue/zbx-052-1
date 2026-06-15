export interface Seat {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Violation {
  seatId: number;
  reason: string;
  type: 'distance' | 'boundary' | 'mainArea';
}

export const TEA_MAT_WIDTH = 800;
export const TEA_MAT_HEIGHT = 500;
export const SEAT_SIZE = 40;
export const MIN_CENTER_DISTANCE = 120;
export const MAIN_AREA_MAX_TOP = 80;
export const MAIN_SEAT_ID = 1;

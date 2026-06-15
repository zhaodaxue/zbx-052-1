import { Seat, Violation, MAIN_AREA_MAX_TOP, MAIN_SEAT_ID } from '@/types';

export function validateMainArea(seat: Seat): Violation | null {
  if (seat.id !== MAIN_SEAT_ID) {
    return null;
  }

  if (seat.y > MAIN_AREA_MAX_TOP) {
    return {
      seatId: seat.id,
      reason: `1号席（主泡）须位于距上边 ${MAIN_AREA_MAX_TOP}px 区域内`,
      type: 'mainArea',
    };
  }

  return null;
}

export function validateAllMainAreas(seats: Seat[]): Violation[] {
  const violations: Violation[] = [];

  seats.forEach((seat) => {
    const violation = validateMainArea(seat);
    if (violation) {
      violations.push(violation);
    }
  });

  return violations;
}

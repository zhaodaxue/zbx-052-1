import { Seat, Violation, TEA_MAT_WIDTH, TEA_MAT_HEIGHT } from '@/types';

export function validateBoundary(seat: Seat): Violation | null {
  const { x, y, width, height, id } = seat;

  if (x < 0) {
    return {
      seatId: id,
      reason: '超出茶席左边界',
      type: 'boundary',
    };
  }

  if (x + width > TEA_MAT_WIDTH) {
    return {
      seatId: id,
      reason: '超出茶席右边界',
      type: 'boundary',
    };
  }

  if (y < 0) {
    return {
      seatId: id,
      reason: '超出茶席上边界',
      type: 'boundary',
    };
  }

  if (y + height > TEA_MAT_HEIGHT) {
    return {
      seatId: id,
      reason: '超出茶席下边界',
      type: 'boundary',
    };
  }

  return null;
}

export function validateAllBoundaries(seats: Seat[]): Violation[] {
  const violations: Violation[] = [];

  seats.forEach((seat) => {
    const violation = validateBoundary(seat);
    if (violation) {
      violations.push(violation);
    }
  });

  return violations;
}

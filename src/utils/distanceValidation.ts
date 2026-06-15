import { Seat, Violation, MIN_CENTER_DISTANCE } from '@/types';

export function validateDistance(seats: Seat[]): Violation[] {
  const violations: Violation[] = [];
  const violatingSeatIds = new Set<number>();

  for (let i = 0; i < seats.length; i++) {
    for (let j = i + 1; j < seats.length; j++) {
      const seatA = seats[i];
      const seatB = seats[j];

      const centerAX = seatA.x + seatA.width / 2;
      const centerAY = seatA.y + seatA.height / 2;
      const centerBX = seatB.x + seatB.width / 2;
      const centerBY = seatB.y + seatB.height / 2;

      const distance = Math.sqrt(
        Math.pow(centerAX - centerBX, 2) + Math.pow(centerAY - centerBY, 2)
      );

      if (distance < MIN_CENTER_DISTANCE) {
        violatingSeatIds.add(seatA.id);
        violatingSeatIds.add(seatB.id);
      }
    }
  }

  violatingSeatIds.forEach((seatId) => {
    violations.push({
      seatId,
      reason: `与其他席位中心距离小于 ${MIN_CENTER_DISTANCE}px`,
      type: 'distance',
    });
  });

  return violations;
}

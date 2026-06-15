import { Seat, Violation, MIN_CENTER_DISTANCE } from '@/types';

export function validateDistance(seats: Seat[]): Violation[] {
  const seatViolatingPairs = new Map<number, number[]>();

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
        if (!seatViolatingPairs.has(seatA.id)) {
          seatViolatingPairs.set(seatA.id, []);
        }
        if (!seatViolatingPairs.has(seatB.id)) {
          seatViolatingPairs.set(seatB.id, []);
        }
        seatViolatingPairs.get(seatA.id)!.push(seatB.id);
        seatViolatingPairs.get(seatB.id)!.push(seatA.id);
      }
    }
  }

  const violations: Violation[] = [];
  seatViolatingPairs.forEach((conflictingIds, seatId) => {
    const sortedIds = conflictingIds.sort((a, b) => a - b);
    const idsStr = sortedIds.map((id) => `${id}号席`).join('、');
    violations.push({
      seatId,
      reason: `与${idsStr}中心距离小于 ${MIN_CENTER_DISTANCE}px`,
      type: 'distance',
    });
  });

  return violations;
}

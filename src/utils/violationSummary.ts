import { Seat, Violation } from '@/types';
import { validateDistance } from './distanceValidation';
import { validateAllBoundaries } from './boundaryValidation';
import { validateAllMainAreas } from './mainAreaValidation';

export function generateViolationSummary(seats: Seat[]): {
  violations: Violation[];
  isAllCompliant: boolean;
} {
  const distanceViolations = validateDistance(seats);
  const boundaryViolations = validateAllBoundaries(seats);
  const mainAreaViolations = validateAllMainAreas(seats);

  const allViolations = [
    ...distanceViolations,
    ...boundaryViolations,
    ...mainAreaViolations,
  ];

  const mergedViolations = mergeViolationsBySeat(allViolations);

  return {
    violations: mergedViolations,
    isAllCompliant: mergedViolations.length === 0,
  };
}

function mergeViolationsBySeat(violations: Violation[]): Violation[] {
  const seatViolationsMap = new Map<number, string[]>();

  violations.forEach((violation) => {
    if (!seatViolationsMap.has(violation.seatId)) {
      seatViolationsMap.set(violation.seatId, []);
    }
    seatViolationsMap.get(violation.seatId)!.push(violation.reason);
  });

  const merged: Violation[] = [];
  seatViolationsMap.forEach((reasons, seatId) => {
    merged.push({
      seatId,
      reason: reasons.join('；'),
      type: getPrimaryViolationType(violations, seatId),
    });
  });

  return merged.sort((a, b) => a.seatId - b.seatId);
}

function getPrimaryViolationType(
  violations: Violation[],
  seatId: number
): 'distance' | 'boundary' | 'mainArea' {
  const seatViolations = violations.filter((v) => v.seatId === seatId);

  if (seatViolations.some((v) => v.type === 'mainArea')) return 'mainArea';
  if (seatViolations.some((v) => v.type === 'boundary')) return 'boundary';
  return 'distance';
}

export function isSeatViolating(
  violations: Violation[],
  seatId: number
): boolean {
  return violations.some((v) => v.seatId === seatId);
}

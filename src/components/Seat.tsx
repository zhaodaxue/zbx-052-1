import React from 'react';
import { Seat as SeatType } from '@/types';
import { useDrag } from '@/hooks/useDrag';
import { isSeatViolating } from '@/utils/violationSummary';
import { Violation } from '@/types';
import { MAIN_SEAT_ID } from '@/types';

interface SeatProps {
  seat: SeatType;
  violations: Violation[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  onDragEnd: (id: number, x: number, y: number) => void;
}

export const Seat: React.FC<SeatProps> = ({
  seat,
  violations,
  containerRef,
  onDragEnd,
}) => {
  const { isDragging, position, handleMouseDown } = useDrag(seat, {
    onDragEnd,
    containerRef,
  });

  const isViolating = isSeatViolating(violations, seat.id);
  const isMainSeat = seat.id === MAIN_SEAT_ID;

  return (
    <div
      className={`absolute flex items-center justify-center rounded-full cursor-move select-none transition-all duration-200
        ${isDragging ? 'opacity-60 scale-110 z-50' : 'opacity-100 z-10'}
        ${isViolating
          ? 'border-[3px] border-red-500 shadow-lg shadow-red-200'
          : 'border-[3px] border-amber-900 shadow-md'
        }
        ${isMainSeat
          ? 'bg-gradient-to-br from-amber-100 to-amber-200'
          : 'bg-gradient-to-br from-stone-100 to-stone-200'
        }
        hover:shadow-lg active:cursor-grabbing
      `}
      style={{
        left: position.x,
        top: position.y,
        width: seat.width,
        height: seat.height,
      }}
      onMouseDown={handleMouseDown}
    >
      <span
        className={`font-bold text-sm ${
          isViolating ? 'text-red-600' : 'text-amber-900'
        }`}
      >
        {seat.id}
      </span>
      {isMainSeat && (
        <div className="absolute -top-6 text-xs text-amber-800 font-medium whitespace-nowrap">
          主泡
        </div>
      )}
    </div>
  );
};

import React, { useRef } from 'react';
import { Seat } from './Seat';
import { useTeaMatStore } from '@/store/useTeaMatStore';
import {
  TEA_MAT_WIDTH,
  TEA_MAT_HEIGHT,
  MAIN_AREA_MAX_TOP,
} from '@/types';

export const TeaMat: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { seats, violations, setSeatPosition } = useTeaMatStore();

  const handleDragEnd = (id: number, x: number, y: number) => {
    setSeatPosition(id, x, y);
  };

  return (
    <div className="relative">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-amber-900 mb-1">茶席布局区</h2>
        <p className="text-sm text-stone-600">
          拖拽席位调整位置，顶部虚线区域为主泡区（1号席须落在此区域）
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative rounded-lg shadow-2xl overflow-hidden"
        style={{
          width: TEA_MAT_WIDTH,
          height: TEA_MAT_HEIGHT,
          background: `
            linear-gradient(135deg, #f5f0e6 0%, #e8e0d0 100%)
          `,
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 40px,
              rgba(139, 119, 101, 0.03) 40px,
              rgba(139, 119, 101, 0.03) 41px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 40px,
              rgba(139, 119, 101, 0.03) 40px,
              rgba(139, 119, 101, 0.03) 41px
            ),
            linear-gradient(135deg, #f5f0e6 0%, #e8e0d0 100%)
          `,
        }}
      >
        <div
          className="absolute left-0 right-0 border-b-2 border-dashed border-amber-400 bg-amber-50 bg-opacity-50"
          style={{
            top: 0,
            height: MAIN_AREA_MAX_TOP,
          }}
        >
          <span className="absolute right-2 top-1 text-xs text-amber-700 font-medium">
            主泡区
          </span>
        </div>

        <div className="absolute inset-0 border-4 border-amber-800 rounded-lg pointer-events-none" />

        {seats.map((seat) => (
          <Seat
            key={seat.id}
            seat={seat}
            violations={violations}
            containerRef={containerRef}
            onDragEnd={handleDragEnd}
          />
        ))}

        <div className="absolute bottom-2 right-2 text-xs text-stone-500">
          {TEA_MAT_WIDTH} × {TEA_MAT_HEIGHT}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-stone-600">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full border-2 border-amber-900 bg-amber-100" />
          <span>正常席位</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full border-2 border-red-500 bg-amber-100" />
          <span>违规席位</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-8 h-0.5 border-t-2 border-dashed border-amber-400" />
          <span>主泡区边界</span>
        </div>
      </div>
    </div>
  );
};

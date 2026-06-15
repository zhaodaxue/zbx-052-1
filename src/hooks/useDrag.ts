import { useState, useCallback, useRef, useEffect } from 'react';
import { Seat, TEA_MAT_WIDTH, TEA_MAT_HEIGHT, SEAT_SIZE } from '@/types';

interface UseDragOptions {
  onDragEnd: (id: number, x: number, y: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useDrag(seat: Seat, options: UseDragOptions) {
  const { onDragEnd, containerRef } = options;
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: seat.x, y: seat.y });
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setPosition({ x: seat.x, y: seat.y });
  }, [seat.x, seat.y]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      dragOffset.current = {
        x: e.clientX - rect.left - position.x,
        y: e.clientY - rect.top - position.y,
      };

      setIsDragging(true);
    },
    [position, containerRef]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      let newX = e.clientX - rect.left - dragOffset.current.x;
      let newY = e.clientY - rect.top - dragOffset.current.y;

      newX = Math.max(0, Math.min(newX, TEA_MAT_WIDTH - SEAT_SIZE));
      newY = Math.max(0, Math.min(newY, TEA_MAT_HEIGHT - SEAT_SIZE));

      setPosition({ x: newX, y: newY });
    },
    [isDragging, containerRef]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd(seat.id, position.x, position.y);
    }
  }, [isDragging, seat.id, position, onDragEnd]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mouseleave', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    isDragging,
    position,
    handleMouseDown,
  };
}

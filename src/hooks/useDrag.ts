import { useState, useRef, useEffect, useCallback } from 'react';
import { Seat, TEA_MAT_WIDTH, TEA_MAT_HEIGHT, SEAT_SIZE } from '@/types';

interface UseDragOptions {
  onDragEnd: (id: number, x: number, y: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useDrag(seat: Seat, options: UseDragOptions) {
  const { onDragEnd, containerRef } = options;
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: seat.x, y: seat.y });

  const stateRef = useRef({
    offset: { x: 0, y: 0 },
    currentPosition: { x: seat.x, y: seat.y },
    isDragging: false,
    onDragEnd,
    containerRef,
  });

  useEffect(() => {
    stateRef.current.onDragEnd = onDragEnd;
    stateRef.current.containerRef = containerRef;
  }, [onDragEnd, containerRef]);

  useEffect(() => {
    if (!stateRef.current.isDragging) {
      setPosition({ x: seat.x, y: seat.y });
      stateRef.current.currentPosition = { x: seat.x, y: seat.y };
    }
  }, [seat.x, seat.y]);

  const clampPosition = useCallback((x: number, y: number) => {
    return {
      x: Math.max(0, Math.min(x, TEA_MAT_WIDTH - SEAT_SIZE)),
      y: Math.max(0, Math.min(y, TEA_MAT_HEIGHT - SEAT_SIZE)),
    };
  }, []);

  const getPointerPosition = useCallback((e: MouseEvent | TouchEvent) => {
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return { clientX: touch.clientX, clientY: touch.clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  }, []);

  const handlePointerDown = useCallback(
    (clientX: number, clientY: number) => {
      const rect = stateRef.current.containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const currentPos = stateRef.current.currentPosition;
      stateRef.current.offset = {
        x: clientX - rect.left - currentPos.x,
        y: clientY - rect.top - currentPos.y,
      };
      stateRef.current.isDragging = true;
      setIsDragging(true);
    },
    []
  );

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!stateRef.current.isDragging) return;
      const rect = stateRef.current.containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      let newX = clientX - rect.left - stateRef.current.offset.x;
      let newY = clientY - rect.top - stateRef.current.offset.y;

      const clamped = clampPosition(newX, newY);
      stateRef.current.currentPosition = clamped;
      setPosition(clamped);
    },
    [clampPosition]
  );

  const handlePointerUp = useCallback(() => {
    if (stateRef.current.isDragging) {
      stateRef.current.isDragging = false;
      setIsDragging(false);
      const { x, y } = stateRef.current.currentPosition;
      stateRef.current.onDragEnd(seat.id, x, y);
    }
  }, [seat.id]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      handlePointerDown(e.clientX, e.clientY);
    },
    [handlePointerDown]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const { clientX, clientY } = getPointerPosition(e.nativeEvent);
      handlePointerDown(clientX, clientY);
    },
    [handlePointerDown, getPointerPosition]
  );

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };
    const handleWindowTouchMove = (e: TouchEvent) => {
      if (stateRef.current.isDragging) {
        e.preventDefault();
      }
      const { clientX, clientY } = getPointerPosition(e);
      handlePointerMove(clientX, clientY);
    };
    const handleWindowPointerUp = () => {
      handlePointerUp();
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowPointerUp);
    window.addEventListener('mouseleave', handleWindowPointerUp);
    window.addEventListener('touchmove', handleWindowTouchMove, { passive: false });
    window.addEventListener('touchend', handleWindowPointerUp);
    window.addEventListener('touchcancel', handleWindowPointerUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowPointerUp);
      window.removeEventListener('mouseleave', handleWindowPointerUp);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('touchend', handleWindowPointerUp);
      window.removeEventListener('touchcancel', handleWindowPointerUp);
    };
  }, [handlePointerMove, handlePointerUp, getPointerPosition]);

  return {
    isDragging,
    position,
    handleMouseDown,
    handleTouchStart,
  };
}

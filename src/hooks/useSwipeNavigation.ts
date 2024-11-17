import { useEffect, TouchEvent } from 'react';

interface SwipeConfig {
  onSwipeRight?: () => void;
  threshold?: number;
}

export function useSwipeNavigation({ onSwipeRight, threshold = 50 }: SwipeConfig) {
  let touchStart = { x: 0, y: 0 };
  let touchEnd = { x: 0, y: 0 };

  const onTouchStart = (e: TouchEvent) => {
    const touch = e.targetTouches[0];
    touchStart = {
      x: touch.clientX,
      y: touch.clientY
    };
    touchEnd = { ...touchStart };
  };

  const onTouchMove = (e: TouchEvent) => {
    touchEnd = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  };

  const onTouchEnd = () => {
    if (!onSwipeRight) return;

    const screenWidth = window.innerWidth;
    const swipeStartFromLeftEdge = touchStart.x < screenWidth * 0.15; // 15% from left edge
    const swipeDistance = touchEnd.x - touchStart.x;
    const swipeVerticalDistance = Math.abs(touchEnd.y - touchStart.y);

    // Only trigger if:
    // 1. Swipe started from left edge
    // 2. Swipe distance is greater than threshold
    // 3. Vertical movement is less than horizontal (to prevent diagonal swipes)
    if (swipeStartFromLeftEdge && swipeDistance > threshold && swipeDistance > swipeVerticalDistance) {
      onSwipeRight();
    }
    
    // Reset values
    touchStart = { x: 0, y: 0 };
    touchEnd = { x: 0, y: 0 };
  };

  useEffect(() => {
    const element = document.documentElement;

    element.addEventListener('touchstart', onTouchStart as any);
    element.addEventListener('touchmove', onTouchMove as any);
    element.addEventListener('touchend', onTouchEnd as any);

    return () => {
      element.removeEventListener('touchstart', onTouchStart as any);
      element.removeEventListener('touchmove', onTouchMove as any);
      element.removeEventListener('touchend', onTouchEnd as any);
    };
  }, [onSwipeRight]);
}
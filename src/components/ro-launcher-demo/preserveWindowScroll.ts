import { useCallback, useLayoutEffect, useRef, type Dispatch } from 'react';
import type { DemoAction } from './types';

const scrollLockRef: { current: { x: number; y: number } | null } = { current: null };

function restoreWindowScroll(x: number, y: number): void {
  const html = document.documentElement;
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  window.scrollTo(x, y);
  html.style.scrollBehavior = previous;
}

/** Call from pointerdown capture on demo actions before focus can scroll the document. */
export function captureWindowScrollFromPointer(): void {
  if (typeof window === 'undefined') {
    return;
  }
  scrollLockRef.current = { x: window.scrollX, y: window.scrollY };
}

export function usePreservedWindowScrollDispatch(
  dispatch: Dispatch<DemoAction>
): Dispatch<DemoAction> {
  const savedRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number[]>([]);
  const clearLockAfterRestoreRef = useRef(false);

  useLayoutEffect(() => {
    const saved = savedRef.current;
    if (!saved || typeof window === 'undefined') {
      return;
    }

    restoreWindowScroll(saved.x, saved.y);

    rafRef.current.forEach(id => window.cancelAnimationFrame(id));
    rafRef.current = [];

    const raf1 = window.requestAnimationFrame(() => {
      restoreWindowScroll(saved.x, saved.y);
      const raf2 = window.requestAnimationFrame(() => {
        restoreWindowScroll(saved.x, saved.y);
        savedRef.current = null;
        if (clearLockAfterRestoreRef.current) {
          scrollLockRef.current = null;
          clearLockAfterRestoreRef.current = false;
        }
      });
      rafRef.current.push(raf2);
    });
    rafRef.current.push(raf1);

    return () => {
      rafRef.current.forEach(id => window.cancelAnimationFrame(id));
      rafRef.current = [];
    };
  });

  return useCallback(
    (action: DemoAction) => {
      if (typeof window !== 'undefined') {
        savedRef.current = scrollLockRef.current ?? {
          x: window.scrollX,
          y: window.scrollY,
        };
      }
      if (action.type === 'prepareDone' || action.type === 'resetPrefix') {
        clearLockAfterRestoreRef.current = true;
      }
      dispatch(action);
    },
    [dispatch]
  );
}

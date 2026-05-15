'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isHoverRef = useRef(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      // Direct positioning for zero lag
      if (cursor) {
        const size = isHoverRef.current ? 32 : 16;
        cursor.style.left = `${e.clientX - size / 2}px`;
        cursor.style.top = `${e.clientY - size / 2}px`;
        cursor.style.width = `${size}px`;
        cursor.style.height = `${size}px`;
        cursor.style.transform = isHoverRef.current ? 'rotate(90deg) scale(1.2)' : 'rotate(0deg) scale(1)';
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('project-card') ||
        target.classList.contains('experience-card') ||
        target.classList.contains('certification-card') ||
        target.closest('.project-card') ||
        target.closest('.experience-card') ||
        target.closest('.certification-card') ||
        target.style.cursor === 'pointer';

      isHoverRef.current = !!isHoverable;
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[10000] transition-transform duration-200"
      style={{
        width: '16px',
        height: '16px',
        left: '-100px',
        top: '-100px',
        mixBlendMode: 'screen',
      }}
    >
      <svg viewBox="0 0 24 24" fill="#ff9a24" width="100%" height="100%" style={{ filter: 'drop-shadow(0 0 5px #ff9a24)' }}>
        <path d="M12 0 L13.5 8.5 L22 10 L13.5 11.5 L12 20 L10.5 11.5 L2 10 L10.5 8.5 Z" />
      </svg>
    </div>
  );
}

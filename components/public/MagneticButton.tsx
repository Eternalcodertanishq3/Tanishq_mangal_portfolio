'use client';

import { useRef, useEffect } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  radius?: number;
}

export default function MagneticButton({
  children,
  onClick,
  className = '',
  radius = 100,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const btn = btnRef.current;
    if (!wrapper || !btn) return;

    let gsapModule: typeof import('gsap') | null = null;

    import('gsap').then((mod) => {
      gsapModule = mod;
    });

    const onMouseMove = (e: MouseEvent) => {
      if (!gsapModule) return;

      const rect = wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < radius) {
        const pullFactor = (radius - distance) / radius;
        gsapModule.gsap.to(btn, {
          x: distX * pullFactor * 0.4,
          y: distY * pullFactor * 0.4,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const onMouseLeave = () => {
      if (!gsapModule) return;
      gsapModule.gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    wrapper.addEventListener('mousemove', onMouseMove);
    wrapper.addEventListener('mouseleave', onMouseLeave);

    return () => {
      wrapper.removeEventListener('mousemove', onMouseMove);
      wrapper.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [radius]);

  return (
    <div ref={wrapperRef} className="inline-block" style={{ padding: `${radius / 2}px` }}> {/* NOSONAR */}
      <button ref={btnRef} onClick={onClick} className={className}>
        {children}
      </button>
    </div>
  );
}

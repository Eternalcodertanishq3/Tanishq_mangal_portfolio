'use client';

import { useState, useEffect, useCallback } from 'react';

interface TypewriterTextProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

export default function TypewriterText({
  texts,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseTime = 2000,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const fullText = texts[currentIndex];

    if (isDeleting) {
      setDisplayText((prev) => prev.substring(0, prev.length - 1));
    } else {
      setDisplayText((prev) => fullText.substring(0, prev.length + 1));
    }
  }, [currentIndex, isDeleting, texts]);

  useEffect(() => {
    const fullText = texts[currentIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText === fullText) {
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    } else {
      timeout = setTimeout(tick, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, texts, tick, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className="typewriter-text">
      {displayText}
      <span className="typewriter-cursor inline-block w-[3px] h-[1.2em] bg-[#ff9a24] ml-[2px] align-text-bottom animate-[blink_0.8s_infinite]" />
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}

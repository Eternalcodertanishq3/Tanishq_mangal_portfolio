'use client';

import { useEffect, useRef } from 'react';
import { trackPageView, setupSectionObserver } from '@/lib/firestore/analytics';

export function useAnalytics() {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    // Track page view on load
    trackPageView('/');

    // Set up section observer
    const cleanup = setupSectionObserver();

    return cleanup;
  }, []);
}

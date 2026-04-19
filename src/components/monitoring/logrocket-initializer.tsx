'use client';

import { useEffect } from 'react';
import { initLogRocket } from '@/lib/logrocket';

export function LogRocketInitializer() {
  useEffect(() => {
    initLogRocket();
  }, []);

  return null;
}

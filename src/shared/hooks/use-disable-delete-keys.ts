'use client';

import { useCallback } from 'react';

export const useDisableDeleteKeys = () => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Prevent backspace and delete keys
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
    }
  }, []);

  return handleKeyDown;
};

import { useState, useEffect } from 'react';

// Generate a unique viewer ID
const generateViewerId = (): string => {
  return 'viewer_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Get or create viewer ID from localStorage
export const getViewerId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let viewerId = localStorage.getItem('quran_viewer_id');
  if (!viewerId) {
    viewerId = generateViewerId();
    localStorage.setItem('quran_viewer_id', viewerId);
  }
  return viewerId;
};

export const useViewerId = () => {
  const [viewerId, setViewerId] = useState<string>('');

  useEffect(() => {
    setViewerId(getViewerId());
  }, []);

  return viewerId;
};

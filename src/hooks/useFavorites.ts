import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "yasin_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // ignore storage errors
    }
  }, [favorites]);

  const toggleFavorite = useCallback((verseNumber: number) => {
    setFavorites((prev) =>
      prev.includes(verseNumber)
        ? prev.filter((n) => n !== verseNumber)
        : [...prev, verseNumber]
    );
  }, []);

  const isFavorite = useCallback(
    (verseNumber: number) => favorites.includes(verseNumber),
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return { favorites, toggleFavorite, isFavorite, clearFavorites };
};

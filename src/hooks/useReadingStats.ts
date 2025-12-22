import { useCallback, useEffect, useState } from "react";

const STATS_KEY = "quran_reading_stats";

export interface ReadingStats {
  totalListeningTimeSeconds: number;
  versesListened: number;
  surahsCompleted: number;
  lastListenedSurah: number | null;
  lastListenedVerse: number | null;
  lastListenedDate: string | null;
  surahProgress: Record<number, {
    versesListened: number;
    totalVerses: number;
    completed: boolean;
    timeSpentSeconds: number;
  }>;
  favorites: Array<{
    surahId: number;
    surahName: string;
    verseNumber?: number;
    arabicText?: string;
    addedAt: string;
  }>;
}

const defaultStats: ReadingStats = {
  totalListeningTimeSeconds: 0,
  versesListened: 0,
  surahsCompleted: 0,
  lastListenedSurah: null,
  lastListenedVerse: null,
  lastListenedDate: null,
  surahProgress: {},
  favorites: [],
};

export const useReadingStats = () => {
  const [stats, setStats] = useState<ReadingStats>(defaultStats);

  // تحميل الإحصائيات من localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STATS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setStats({ ...defaultStats, ...parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  // حفظ الإحصائيات عند التغيير
  const saveStats = useCallback((newStats: ReadingStats) => {
    setStats(newStats);
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
    } catch {
      // ignore
    }
  }, []);

  // تسجيل استماع لآية
  const recordVerseListened = useCallback((surahId: number, verseNumber: number, totalVerses: number) => {
    setStats((prev) => {
      const surahProgress = { ...prev.surahProgress };
      const current = surahProgress[surahId] || {
        versesListened: 0,
        totalVerses,
        completed: false,
        timeSpentSeconds: 0,
      };

      const newVersesListened = current.versesListened + 1;
      const isCompleted = verseNumber >= totalVerses;

      surahProgress[surahId] = {
        ...current,
        versesListened: newVersesListened,
        totalVerses,
        completed: isCompleted || current.completed,
      };

      const newStats: ReadingStats = {
        ...prev,
        versesListened: prev.versesListened + 1,
        surahsCompleted: isCompleted && !current.completed 
          ? prev.surahsCompleted + 1 
          : prev.surahsCompleted,
        lastListenedSurah: surahId,
        lastListenedVerse: verseNumber,
        lastListenedDate: new Date().toISOString(),
        surahProgress,
      };

      try {
        localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
      } catch {
        // ignore
      }

      return newStats;
    });
  }, []);

  // إضافة وقت الاستماع
  const addListeningTime = useCallback((seconds: number, surahId?: number) => {
    setStats((prev) => {
      const surahProgress = { ...prev.surahProgress };
      
      if (surahId && surahProgress[surahId]) {
        surahProgress[surahId] = {
          ...surahProgress[surahId],
          timeSpentSeconds: surahProgress[surahId].timeSpentSeconds + seconds,
        };
      }

      const newStats: ReadingStats = {
        ...prev,
        totalListeningTimeSeconds: prev.totalListeningTimeSeconds + seconds,
        surahProgress,
      };

      try {
        localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
      } catch {
        // ignore
      }

      return newStats;
    });
  }, []);

  // إضافة إلى المفضلة
  const addToFavorites = useCallback((
    surahId: number,
    surahName: string,
    verseNumber?: number,
    arabicText?: string
  ) => {
    setStats((prev) => {
      // التحقق من عدم التكرار
      const exists = prev.favorites.some(
        (f) => f.surahId === surahId && f.verseNumber === verseNumber
      );
      if (exists) return prev;

      const newFavorite = {
        surahId,
        surahName,
        verseNumber,
        arabicText,
        addedAt: new Date().toISOString(),
      };

      const newStats: ReadingStats = {
        ...prev,
        favorites: [...prev.favorites, newFavorite],
      };

      try {
        localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
      } catch {
        // ignore
      }

      return newStats;
    });
  }, []);

  // إزالة من المفضلة
  const removeFromFavorites = useCallback((surahId: number, verseNumber?: number) => {
    setStats((prev) => {
      const newStats: ReadingStats = {
        ...prev,
        favorites: prev.favorites.filter(
          (f) => !(f.surahId === surahId && f.verseNumber === verseNumber)
        ),
      };

      try {
        localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
      } catch {
        // ignore
      }

      return newStats;
    });
  }, []);

  // التحقق من وجود عنصر في المفضلة
  const isFavorite = useCallback((surahId: number, verseNumber?: number) => {
    return stats.favorites.some(
      (f) => f.surahId === surahId && f.verseNumber === verseNumber
    );
  }, [stats.favorites]);

  // مسح الإحصائيات
  const clearStats = useCallback(() => {
    saveStats(defaultStats);
  }, [saveStats]);

  // تنسيق الوقت
  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours} ساعة ${minutes} دقيقة`;
    } else if (minutes > 0) {
      return `${minutes} دقيقة ${secs} ثانية`;
    } else {
      return `${secs} ثانية`;
    }
  }, []);

  return {
    stats,
    recordVerseListened,
    addListeningTime,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearStats,
    formatTime,
  };
};

import { useState, useEffect, useCallback } from 'react';
import { 
  fetchSurahTafsir, 
  AVAILABLE_TAFSIRS,
} from '@/services/tafsirApi';

export type TafsirSource = 'local' | string;

interface UseTafsirOptions {
  surahNumber: number;
  versesCount?: number;
  autoLoad?: boolean;
}

interface TafsirSourceInfo {
  id: TafsirSource;
  name: string;
  description: string;
  author: string;
}

interface UseTafsirReturn {
  selectedSource: TafsirSource;
  setSelectedSource: (source: TafsirSource) => void;
  getTafsir: (verseNumber: number, localTafsir: string) => string;
  isLoading: boolean;
  error: string | null;
  availableSources: TafsirSourceInfo[];
}

export const useTafsir = ({ surahNumber, versesCount = 286, autoLoad = true }: UseTafsirOptions): UseTafsirReturn => {
  const [selectedSource, setSelectedSource] = useState<TafsirSource>('local');
  const [tafsirCache, setTafsirCache] = useState<Map<string, Map<number, string>>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableSources: TafsirSourceInfo[] = [
    { 
      id: 'local', 
      name: 'التفسير المحلي ⚠️', 
      description: '⚠️ مُولَّد بالذكاء الاصطناعي - غير موثق علمياً',
      author: 'ذكاء اصطناعي (غير موثق)'
    },
    ...AVAILABLE_TAFSIRS.map(t => ({ 
      id: t.id, 
      name: t.name, 
      description: t.description,
      author: t.author
    })),
  ];

  // تحميل التفسير عند تغيير المصدر
  const loadTafsir = useCallback(async (source: TafsirSource) => {
    if (source === 'local') return;
    
    const cacheKey = `${surahNumber}-${source}`;
    if (tafsirCache.has(cacheKey)) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const tafsirMap = await fetchSurahTafsir(surahNumber, source, versesCount);
      
      if (tafsirMap.size === 0) {
        throw new Error('لم يتم العثور على تفسير');
      }
      
      setTafsirCache(prev => {
        const newCache = new Map(prev);
        newCache.set(cacheKey, tafsirMap);
        return newCache;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في تحميل التفسير');
    } finally {
      setIsLoading(false);
    }
  }, [surahNumber, versesCount, tafsirCache]);

  // تحميل التفسير عند تغيير المصدر
  useEffect(() => {
    if (autoLoad && selectedSource !== 'local') {
      loadTafsir(selectedSource);
    }
  }, [selectedSource, autoLoad, loadTafsir]);

  // إعادة تعيين عند تغيير السورة
  useEffect(() => {
    setSelectedSource('local');
    setError(null);
  }, [surahNumber]);

  const getTafsir = useCallback((verseNumber: number, localTafsir: string): string => {
    if (selectedSource === 'local') {
      return localTafsir;
    }
    
    const cacheKey = `${surahNumber}-${selectedSource}`;
    const cachedTafsir = tafsirCache.get(cacheKey);
    
    if (cachedTafsir && cachedTafsir.has(verseNumber)) {
      return cachedTafsir.get(verseNumber)!;
    }
    
    // إذا لم يكن متاحاً، أعد التفسير المحلي
    return localTafsir;
  }, [selectedSource, surahNumber, tafsirCache]);

  return {
    selectedSource,
    setSelectedSource,
    getTafsir,
    isLoading,
    error,
    availableSources,
  };
};

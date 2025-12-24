import { useState, useEffect, useCallback } from 'react';
import { 
  fetchSurahTafsir, 
  AVAILABLE_TAFSIRS,
  type ExternalTafsir 
} from '@/services/tafsirApi';

export type TafsirSource = 'local' | 'ar.muyassar' | 'ar.jalalayn';

interface UseTafsirOptions {
  surahNumber: number;
  autoLoad?: boolean;
}

interface UseTafsirReturn {
  selectedSource: TafsirSource;
  setSelectedSource: (source: TafsirSource) => void;
  getTafsir: (verseNumber: number, localTafsir: string) => string;
  isLoading: boolean;
  error: string | null;
  availableSources: { id: TafsirSource; name: string }[];
}

export const useTafsir = ({ surahNumber, autoLoad = true }: UseTafsirOptions): UseTafsirReturn => {
  const [selectedSource, setSelectedSource] = useState<TafsirSource>('local');
  const [tafsirCache, setTafsirCache] = useState<Map<string, Map<number, string>>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableSources: { id: TafsirSource; name: string }[] = [
    { id: 'local', name: 'التفسير المحلي' },
    ...AVAILABLE_TAFSIRS.map(t => ({ id: t.id as TafsirSource, name: t.name })),
  ];

  // تحميل التفسير عند تغيير المصدر
  const loadTafsir = useCallback(async (source: TafsirSource) => {
    if (source === 'local') return;
    
    const cacheKey = `${surahNumber}-${source}`;
    if (tafsirCache.has(cacheKey)) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const tafsirMap = await fetchSurahTafsir(surahNumber, source);
      
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
  }, [surahNumber, tafsirCache]);

  // تحميل التفسير عند تغيير المصدر
  useEffect(() => {
    if (autoLoad && selectedSource !== 'local') {
      loadTafsir(selectedSource);
    }
  }, [selectedSource, autoLoad, loadTafsir]);

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

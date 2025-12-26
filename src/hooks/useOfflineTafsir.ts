import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface CachedTafsir {
  surahId: number;
  verseId: number;
  tafsirSource: string;
  content: string;
  cachedAt: number;
}

const DB_NAME = 'quran-tafsir-db';
const STORE_NAME = 'tafsir-cache';

export const useOfflineTafsir = () => {
  const [cachedTafsirs, setCachedTafsirs] = useState<CachedTafsir[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // فتح قاعدة البيانات IndexedDB
  const openDB = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
          store.createIndex('surahVerse', ['surahId', 'verseId', 'tafsirSource'], { unique: true });
        }
      };
    });
  }, []);

  // جلب قائمة التفاسير المحفوظة
  const loadCachedTafsirs = useCallback(async () => {
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      return new Promise<CachedTafsir[]>((resolve) => {
        request.onsuccess = () => {
          setCachedTafsirs(request.result || []);
          resolve(request.result || []);
        };
        request.onerror = () => resolve([]);
      });
    } catch (error) {
      console.error('Error loading cached tafsirs:', error);
      return [];
    }
  }, [openDB]);

  useEffect(() => {
    loadCachedTafsirs();
  }, [loadCachedTafsirs]);

  // حفظ تفسير للقراءة أوفلاين
  const saveTafsir = useCallback(async (
    surahId: number,
    verseId: number,
    tafsirSource: string,
    content: string
  ): Promise<boolean> => {
    setIsSaving(true);

    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const tafsir: Omit<CachedTafsir, 'id'> = {
        surahId,
        verseId,
        tafsirSource,
        content,
        cachedAt: Date.now(),
      };
      
      store.put(tafsir);
      
      await loadCachedTafsirs();
      toast.success('تم حفظ التفسير للقراءة بدون إنترنت');
      return true;
    } catch (error) {
      console.error('Error saving tafsir:', error);
      toast.error('فشل في حفظ التفسير');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [openDB, loadCachedTafsirs]);

  // التحقق إذا كان التفسير محفوظ
  const isTafsirCached = useCallback(async (
    surahId: number,
    verseId: number,
    tafsirSource: string
  ): Promise<boolean> => {
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('surahVerse');
      const request = index.get([surahId, verseId, tafsirSource]);
      
      return new Promise((resolve) => {
        request.onsuccess = () => resolve(!!request.result);
        request.onerror = () => resolve(false);
      });
    } catch {
      return false;
    }
  }, [openDB]);

  // الحصول على تفسير من الكاش
  const getCachedTafsir = useCallback(async (
    surahId: number,
    verseId: number,
    tafsirSource: string
  ): Promise<string | null> => {
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('surahVerse');
      const request = index.get([surahId, verseId, tafsirSource]);
      
      return new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result?.content || null);
        request.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }, [openDB]);

  // حفظ تفسير سورة كاملة
  const saveSurahTafsir = useCallback(async (
    surahId: number,
    tafsirSource: string,
    verses: Array<{ verseId: number; content: string }>
  ): Promise<boolean> => {
    setIsSaving(true);

    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      for (const verse of verses) {
        const tafsir: Omit<CachedTafsir, 'id'> = {
          surahId,
          verseId: verse.verseId,
          tafsirSource,
          content: verse.content,
          cachedAt: Date.now(),
        };
        store.put(tafsir);
      }
      
      await loadCachedTafsirs();
      toast.success(`تم حفظ تفسير السورة (${verses.length} آية)`);
      return true;
    } catch (error) {
      console.error('Error saving surah tafsir:', error);
      toast.error('فشل في حفظ تفسير السورة');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [openDB, loadCachedTafsirs]);

  // تصدير التفسير كملف نصي
  const exportTafsirAsText = useCallback((
    surahName: string,
    verses: Array<{ verseId: number; arabicText: string; tafsir: string }>
  ) => {
    let content = `${surahName}\n${'='.repeat(50)}\n\n`;
    
    verses.forEach(verse => {
      content += `﴿ ${verse.arabicText} ﴾ (${verse.verseId})\n`;
      content += `التفسير: ${verse.tafsir}\n\n`;
      content += '-'.repeat(40) + '\n\n';
    });
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${surahName}-تفسير.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('تم تحميل التفسير');
  }, []);

  // مسح كل التفاسير المحفوظة
  const clearAllTafsirs = useCallback(async (): Promise<boolean> => {
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.clear();
      
      setCachedTafsirs([]);
      toast.success('تم مسح جميع التفاسير المحفوظة');
      return true;
    } catch (error) {
      console.error('Error clearing tafsirs:', error);
      return false;
    }
  }, [openDB]);

  return {
    cachedTafsirs,
    isSaving,
    saveTafsir,
    isTafsirCached,
    getCachedTafsir,
    saveSurahTafsir,
    exportTafsirAsText,
    clearAllTafsirs,
    refreshCache: loadCachedTafsirs,
  };
};

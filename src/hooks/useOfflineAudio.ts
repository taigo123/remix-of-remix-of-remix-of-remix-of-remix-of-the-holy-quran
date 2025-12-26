import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface CachedAudio {
  surahId: number;
  verseId?: number;
  reciter: string;
  url: string;
  cachedAt: number;
}

const CACHE_NAME = 'quran-audio-cache';
const DB_NAME = 'quran-offline-db';
const STORE_NAME = 'audio-metadata';

export const useOfflineAudio = () => {
  const [cachedItems, setCachedItems] = useState<CachedAudio[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // فتح قاعدة البيانات IndexedDB
  const openDB = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'url' });
        }
      };
    });
  }, []);

  // جلب قائمة الملفات المحفوظة
  const loadCachedItems = useCallback(async () => {
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      return new Promise<CachedAudio[]>((resolve) => {
        request.onsuccess = () => {
          setCachedItems(request.result || []);
          resolve(request.result || []);
        };
        request.onerror = () => resolve([]);
      });
    } catch (error) {
      console.error('Error loading cached items:', error);
      return [];
    }
  }, [openDB]);

  useEffect(() => {
    loadCachedItems();
  }, [loadCachedItems]);

  // تحميل ملف صوتي للاستماع أوفلاين
  const downloadAudio = useCallback(async (
    url: string,
    surahId: number,
    reciter: string,
    verseId?: number
  ): Promise<boolean> => {
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // فتح الكاش
      const cache = await caches.open(CACHE_NAME);
      
      // التحقق إذا كان الملف موجود بالفعل
      const existingResponse = await cache.match(url);
      if (existingResponse) {
        toast.info('هذا الملف محفوظ بالفعل');
        setIsDownloading(false);
        return true;
      }

      // تحميل الملف
      const response = await fetch(url);
      if (!response.ok) throw new Error('فشل تحميل الملف');

      const reader = response.body?.getReader();
      const contentLength = +(response.headers.get('Content-Length') || 0);
      
      if (reader && contentLength > 0) {
        let receivedLength = 0;
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          chunks.push(value);
          receivedLength += value.length;
          setDownloadProgress(Math.round((receivedLength / contentLength) * 100));
        }

        const blob = new Blob(chunks as BlobPart[], { type: 'audio/mpeg' });
        const cacheResponse = new Response(blob);
        await cache.put(url, cacheResponse);
      } else {
        // إذا لم نستطع قراءة الحجم، نحفظ مباشرة
        const blob = await response.clone().blob();
        await cache.put(url, new Response(blob));
      }

      // حفظ البيانات الوصفية في IndexedDB
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const metadata: CachedAudio = {
        surahId,
        verseId,
        reciter,
        url,
        cachedAt: Date.now(),
      };
      
      store.put(metadata);
      
      await loadCachedItems();
      toast.success('تم حفظ الملف للاستماع بدون إنترنت');
      return true;
    } catch (error) {
      console.error('Error downloading audio:', error);
      toast.error('فشل في تحميل الملف');
      return false;
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  }, [openDB, loadCachedItems]);

  // التحقق إذا كان الملف محفوظ
  const isAudioCached = useCallback(async (url: string): Promise<boolean> => {
    try {
      const cache = await caches.open(CACHE_NAME);
      const response = await cache.match(url);
      return !!response;
    } catch {
      return false;
    }
  }, []);

  // الحصول على ملف صوتي من الكاش
  const getCachedAudio = useCallback(async (url: string): Promise<Blob | null> => {
    try {
      const cache = await caches.open(CACHE_NAME);
      const response = await cache.match(url);
      if (response) {
        return await response.blob();
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  // حذف ملف من الكاش
  const removeFromCache = useCallback(async (url: string): Promise<boolean> => {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.delete(url);
      
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.delete(url);
      
      await loadCachedItems();
      toast.success('تم حذف الملف من الذاكرة');
      return true;
    } catch (error) {
      console.error('Error removing from cache:', error);
      return false;
    }
  }, [openDB, loadCachedItems]);

  // مسح كل الكاش
  const clearAllCache = useCallback(async (): Promise<boolean> => {
    try {
      await caches.delete(CACHE_NAME);
      
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.clear();
      
      setCachedItems([]);
      toast.success('تم مسح جميع الملفات المحفوظة');
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }, [openDB]);

  // حساب حجم الكاش
  const getCacheSize = useCallback(async (): Promise<number> => {
    try {
      const cache = await caches.open(CACHE_NAME);
      const keys = await cache.keys();
      let totalSize = 0;
      
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
      
      return totalSize;
    } catch {
      return 0;
    }
  }, []);

  return {
    cachedItems,
    isDownloading,
    downloadProgress,
    downloadAudio,
    isAudioCached,
    getCachedAudio,
    removeFromCache,
    clearAllCache,
    getCacheSize,
    refreshCache: loadCachedItems,
  };
};

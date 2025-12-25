import { useState, useEffect } from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface TranslatedVerse {
  number: number;
  translation: string;
}

interface TranslationCache {
  [key: string]: TranslatedVerse[];
}

// Language codes mapping for AlQuran API
const languageCodeMap: Record<Language, string> = {
  ar: 'ar', // Arabic (original - no translation needed)
  en: 'en',
  fr: 'fr',
  ur: 'ur',
  id: 'id',
  tr: 'tr',
  it: 'en', // Italian fallback to English (not available in API)
};

const translationCache: TranslationCache = {};

export const useVerseTranslation = (surahNumber: number) => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<TranslatedVerse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch translation for Arabic
    if (language === 'ar') {
      setTranslations([]);
      return;
    }

    const langCode = languageCodeMap[language];
    const cacheKey = `${surahNumber}-${langCode}`;

    // Check cache first
    if (translationCache[cacheKey]) {
      setTranslations(translationCache[cacheKey]);
      return;
    }

    const fetchTranslation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fnError } = await supabase.functions.invoke('get-verse-translation', {
          body: { surahNumber, language: langCode }
        });

        if (fnError) {
          throw new Error(fnError.message);
        }

        const verses: TranslatedVerse[] = data?.translations || [];

        // Cache the result
        translationCache[cacheKey] = verses;
        setTranslations(verses);
      } catch (err) {
        console.error('Translation fetch error:', err);
        setError('Failed to load translation');
        setTranslations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslation();
  }, [surahNumber, language]);

  const getTranslation = (verseNumber: number): string | null => {
    if (language === 'ar') return null;
    const verse = translations.find(v => v.number === verseNumber);
    return verse?.translation || null;
  };

  return {
    translations,
    getTranslation,
    isLoading,
    error,
    showTranslation: language !== 'ar',
  };
};

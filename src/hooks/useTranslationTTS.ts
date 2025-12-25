import { useState, useRef, useCallback, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UseTranslationTTSReturn {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  playTranslation: (text: string, onComplete?: () => void) => Promise<void>;
  stopPlayback: () => void;
}

// Language to speech synthesis voice mapping
const languageVoiceMap: Record<string, string> = {
  en: 'en',
  fr: 'fr',
  ur: 'ur',
  id: 'id',
  tr: 'tr',
  it: 'it',
};

// Common male voice name patterns
const maleVoicePatterns = [
  'david', 'james', 'daniel', 'george', 'thomas', 'mark', 'paul', 'john',
  'microsoft david', 'google uk english male', 'male', 'homme', 'uomo',
  'erkek', 'pria', 'mard', 'ahmed', 'mehdi', 'rajan'
];

// Female voice patterns to avoid
const femaleVoicePatterns = [
  'female', 'woman', 'girl', 'zira', 'hazel', 'susan', 'samantha',
  'karen', 'moira', 'tessa', 'fiona', 'kate', 'victoria', 'alice',
  'femme', 'donna', 'kadın', 'wanita', 'aurat'
];

export const useTranslationTTS = (): UseTranslationTTSReturn => {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const onCompleteRef = useRef<(() => void) | null>(null);
  const maleVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Find and cache a male voice for the current language
  useEffect(() => {
    const findMaleVoice = () => {
      if (!('speechSynthesis' in window)) return;
      
      const voices = window.speechSynthesis.getVoices();
      const langPrefix = languageVoiceMap[language] || 'en';
      
      console.log('Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));
      
      // Filter voices for current language
      const langVoices = voices.filter(v => 
        v.lang.toLowerCase().startsWith(langPrefix.toLowerCase())
      );
      
      console.log('Language voices:', langVoices.map(v => v.name));
      
      // First, try to find explicitly male voices
      let selectedVoice = langVoices.find(v => {
        const name = v.name.toLowerCase();
        return maleVoicePatterns.some(pattern => name.includes(pattern));
      });
      
      // If no explicit male voice, find one that's not female
      if (!selectedVoice) {
        selectedVoice = langVoices.find(v => {
          const name = v.name.toLowerCase();
          return !femaleVoicePatterns.some(pattern => name.includes(pattern));
        });
      }
      
      // Fallback to first available voice
      if (!selectedVoice && langVoices.length > 0) {
        selectedVoice = langVoices[0];
      }
      
      console.log('Selected voice:', selectedVoice?.name);
      maleVoiceRef.current = selectedVoice || null;
    };

    // Initial load
    findMaleVoice();
    
    // Chrome loads voices asynchronously
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = findMaleVoice;
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [language]);

  const stopPlayback = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    onCompleteRef.current = null;
    setIsPlaying(false);
  }, []);

  const playTranslation = useCallback(async (text: string, onComplete?: () => void) => {
    // Don't play for Arabic
    if (language === 'ar') {
      return;
    }

    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      setError('المتصفح لا يدعم تحويل النص إلى صوت');
      return;
    }

    // Stop any existing playback
    stopPlayback();

    setIsLoading(true);
    setError(null);
    onCompleteRef.current = onComplete || null;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Set the language
      const langPrefix = languageVoiceMap[language] || 'en';
      utterance.lang = langPrefix;
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 0.85; // Lower pitch for more masculine voice

      // Use cached male voice
      if (maleVoiceRef.current) {
        utterance.voice = maleVoiceRef.current;
        utterance.lang = maleVoiceRef.current.lang;
        console.log('Using voice:', maleVoiceRef.current.name);
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        utteranceRef.current = null;
        console.log('TTS playback ended');
        // Call completion callback
        if (onCompleteRef.current) {
          onCompleteRef.current();
          onCompleteRef.current = null;
        }
      };

      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        setError('فشل في تشغيل الصوت');
        stopPlayback();
        setIsLoading(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('TTS error:', err);
      setError('فشل في تحويل النص إلى صوت');
      stopPlayback();
      setIsLoading(false);
    }
  }, [language, stopPlayback]);

  return {
    isPlaying,
    isLoading,
    error,
    playTranslation,
    stopPlayback,
  };
};

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
      
      // Filter voices for current language
      const langVoices = voices.filter(v => 
        v.lang.toLowerCase().startsWith(langPrefix.toLowerCase())
      );
      
      // Try to find a male voice (common patterns in voice names)
      const maleVoice = langVoices.find(v => {
        const name = v.name.toLowerCase();
        return name.includes('male') || 
               name.includes('david') || 
               name.includes('james') ||
               name.includes('daniel') ||
               name.includes('george') ||
               name.includes('thomas') ||
               name.includes('microsoft david') ||
               name.includes('google us english') ||
               name.includes('ahmed') ||
               name.includes('mehdi') ||
               (!name.includes('female') && !name.includes('woman') && !name.includes('girl'));
      });
      
      // Use male voice if found, otherwise use first available voice
      maleVoiceRef.current = maleVoice || langVoices[0] || null;
    };

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
      utterance.pitch = 0.9; // Slightly lower pitch for male voice

      // Use cached male voice
      if (maleVoiceRef.current) {
        utterance.voice = maleVoiceRef.current;
        utterance.lang = maleVoiceRef.current.lang;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        utteranceRef.current = null;
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

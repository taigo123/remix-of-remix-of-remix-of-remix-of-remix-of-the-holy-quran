import { useState, useRef, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UseTranslationTTSReturn {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  playTranslation: (text: string) => Promise<void>;
  stopPlayback: () => void;
}

// Language to speech synthesis voice mapping
const languageVoiceMap: Record<string, string> = {
  en: 'en-US',
  fr: 'fr-FR',
  ur: 'ur-PK',
  id: 'id-ID',
  tr: 'tr-TR',
  it: 'it-IT',
};

export const useTranslationTTS = (): UseTranslationTTSReturn => {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stopPlayback = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setIsPlaying(false);
  }, []);

  const playTranslation = useCallback(async (text: string) => {
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

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Set the language
      const voiceLang = languageVoiceMap[language] || 'en-US';
      utterance.lang = voiceLang;
      utterance.rate = 0.9; // Slightly slower for clarity

      // Try to find a voice for the language
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith(voiceLang.split('-')[0]));
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };

      utterance.onend = () => {
        stopPlayback();
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

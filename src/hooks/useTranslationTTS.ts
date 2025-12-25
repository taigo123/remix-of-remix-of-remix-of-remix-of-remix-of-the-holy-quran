import { useState, useRef, useCallback, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface TTSVoice {
  name: string;
  lang: string;
  voiceURI: string;
}

interface UseTranslationTTSReturn {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  availableVoices: TTSVoice[];
  selectedVoice: string | null;
  setSelectedVoice: (voiceURI: string) => void;
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
  const [availableVoices, setAvailableVoices] = useState<TTSVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const onCompleteRef = useRef<(() => void) | null>(null);

  // Load available voices for current language
  useEffect(() => {
    const loadVoices = () => {
      if (!('speechSynthesis' in window)) return;
      
      const voices = window.speechSynthesis.getVoices();
      const langPrefix = languageVoiceMap[language] || 'en';
      
      const filteredVoices = voices
        .filter(v => v.lang.toLowerCase().startsWith(langPrefix.toLowerCase()))
        .map(v => ({
          name: v.name,
          lang: v.lang,
          voiceURI: v.voiceURI,
        }));
      
      setAvailableVoices(filteredVoices);
      
      // Auto-select first voice if none selected
      if (filteredVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(filteredVoices[0].voiceURI);
      }
    };

    loadVoices();
    
    // Chrome loads voices asynchronously
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [language, selectedVoice]);

  // Reset selected voice when language changes
  useEffect(() => {
    setSelectedVoice(null);
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

      // Use selected voice if available
      const voices = window.speechSynthesis.getVoices();
      if (selectedVoice) {
        const voice = voices.find(v => v.voiceURI === selectedVoice);
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
        }
      } else {
        // Fallback to first matching voice
        const voice = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix.toLowerCase()));
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
        }
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
  }, [language, selectedVoice, stopPlayback]);

  return {
    isPlaying,
    isLoading,
    error,
    availableVoices,
    selectedVoice,
    setSelectedVoice,
    playTranslation,
    stopPlayback,
  };
};

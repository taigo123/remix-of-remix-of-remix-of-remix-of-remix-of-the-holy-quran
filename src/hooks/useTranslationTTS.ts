import { useState, useRef, useCallback, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UseTranslationTTSReturn {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  playTranslation: (text: string, onComplete?: () => void) => Promise<void>;
  stopPlayback: () => void;
}

// Get the best male voice for a language
const getMaleVoice = (voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | null => {
  // Male voice name patterns
  const malePatterns = [
    /male/i, /man/i, /david/i, /james/i, /john/i, /mark/i, /paul/i,
    /michael/i, /daniel/i, /george/i, /richard/i, /thomas/i, /robert/i,
    /ahmed/i, /mohammad/i, /ali/i, /omar/i, /khalid/i, /youssef/i,
    /majed/i, /fahad/i, /naayf/i, /maged/i
  ];
  
  // Female voice name patterns to exclude
  const femalePatterns = [
    /female/i, /woman/i, /girl/i, /samantha/i, /victoria/i, /karen/i,
    /susan/i, /linda/i, /sarah/i, /emma/i, /olivia/i, /sophia/i,
    /zira/i, /hazel/i, /alice/i, /ellen/i, /fiona/i, /kate/i,
    /moira/i, /veena/i, /tessa/i, /mariam/i, /laila/i, /fatima/i,
    /amira/i, /nora/i, /hala/i, /mona/i, /dalia/i
  ];
  
  // Filter voices by language
  const langCode = lang === 'en' ? 'en' : lang === 'ar' ? 'ar' : lang;
  const langVoices = voices.filter(v => v.lang.startsWith(langCode));
  
  if (langVoices.length === 0) return null;
  
  // First: try to find explicitly male voices
  const maleVoice = langVoices.find(v => 
    malePatterns.some(pattern => pattern.test(v.name))
  );
  if (maleVoice) {
    console.log('Found male voice:', maleVoice.name);
    return maleVoice;
  }
  
  // Second: find voices that are NOT female
  const nonFemaleVoice = langVoices.find(v => 
    !femalePatterns.some(pattern => pattern.test(v.name))
  );
  if (nonFemaleVoice) {
    console.log('Found non-female voice:', nonFemaleVoice.name);
    return nonFemaleVoice;
  }
  
  // Fallback: return first available voice for the language
  console.log('Using fallback voice:', langVoices[0].name);
  return langVoices[0];
};

export const useTranslationTTS = (): UseTranslationTTSReturn => {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const onCompleteRef = useRef<(() => void) | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        console.log('Loaded voices:', availableVoices.map(v => `${v.name} (${v.lang})`));
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const stopPlayback = useCallback(() => {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    onCompleteRef.current = null;
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const playTranslation = useCallback(async (text: string, onComplete?: () => void) => {
    // Don't play for Arabic (we use Quran recitation for Arabic)
    if (language === 'ar') {
      onComplete?.();
      return;
    }

    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      setError('متصفحك لا يدعم تحويل النص إلى صوت');
      onComplete?.();
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

      // Find the best male voice for the current language
      const selectedVoice = getMaleVoice(voices, language);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
        console.log('Using voice:', selectedVoice.name, 'lang:', selectedVoice.lang);
      } else {
        // Fallback to language code if no voice found
        utterance.lang = language === 'en' ? 'en-US' : language;
        console.log('No specific voice found, using lang:', utterance.lang);
      }

      // Voice settings for better quality
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 0.9; // Slightly lower pitch for male voice

      utterance.onstart = () => {
        console.log('TTS started');
        setIsPlaying(true);
        setIsLoading(false);
      };

      utterance.onend = () => {
        console.log('TTS ended, calling onComplete');
        setIsPlaying(false);
        utteranceRef.current = null;
        if (onCompleteRef.current) {
          const callback = onCompleteRef.current;
          onCompleteRef.current = null;
          callback();
        }
      };

      utterance.onerror = (event) => {
        console.error('TTS error:', event.error);
        setError('فشل في تشغيل الصوت');
        setIsPlaying(false);
        setIsLoading(false);
        utteranceRef.current = null;
        onCompleteRef.current = null;
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('TTS error:', err);
      setError('فشل في تحويل النص إلى صوت');
      setIsPlaying(false);
      setIsLoading(false);
      onCompleteRef.current = null;
    }
  }, [language, voices, stopPlayback]);

  return {
    isPlaying,
    isLoading,
    error,
    playTranslation,
    stopPlayback,
  };
};

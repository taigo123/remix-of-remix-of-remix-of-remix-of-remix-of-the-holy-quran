import { useState, useRef, useCallback } from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';

interface UseTranslationTTSReturn {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  playTranslation: (text: string) => Promise<void>;
  stopPlayback: () => void;
}

export const useTranslationTTS = (): UseTranslationTTSReturn => {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentUrlRef = useRef<string | null>(null);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const playTranslation = useCallback(async (text: string) => {
    console.log('playTranslation called', { language, text: text.substring(0, 50) });
    
    // Don't play for Arabic
    if (language === 'ar') {
      console.log('Skipping TTS for Arabic');
      return;
    }

    // Stop any existing playback
    stopPlayback();

    setIsLoading(true);
    setError(null);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/text-to-speech`;
      console.log('Fetching TTS from:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text, language }),
      });

      console.log('TTS response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('TTS error response:', errorText);
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      console.log('Audio blob size:', audioBlob.size);
      
      const audioUrl = URL.createObjectURL(audioBlob);
      currentUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        stopPlayback();
      };

      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setError('Failed to play audio');
        stopPlayback();
      };

      setIsPlaying(true);
      await audio.play();
      console.log('Audio playing');
    } catch (err) {
      console.error('TTS error:', err);
      setError('Failed to generate speech');
      stopPlayback();
    } finally {
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

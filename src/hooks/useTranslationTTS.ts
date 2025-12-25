import { useState, useRef, useCallback, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UseTranslationTTSReturn {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  playTranslation: (text: string, onComplete?: () => void) => Promise<void>;
  stopPlayback: () => void;
}

// Priority list of known male voice names/patterns
const MALE_VOICE_PRIORITY = [
  // English male voices (most common)
  'david', 'james', 'john', 'mark', 'paul', 'michael', 'daniel', 'george', 
  'richard', 'thomas', 'robert', 'william', 'alex', 'fred', 'tom', 'bruce',
  'lee', 'guy', 'grandpa', 'grandma', 'reed', 'rocko', 'sandy', 'shelley',
  'aaron', 'reed', 'rishi', 'samson', 'gordon', 'junior', 'ralph',
  // Arabic male voices
  'ahmed', 'mohammad', 'ali', 'omar', 'khalid', 'youssef', 'majed', 'fahad', 
  'naayf', 'maged', 'tarik', 'hamed', 'saleh', 'fares', 'nasser',
  // Generic male patterns
  'male', 'man', 'boy',
  // Google voices that tend to be male
  'uk english male', 'us english male', 'australian male',
];

// Known female voice patterns to definitely avoid
const FEMALE_VOICE_PATTERNS = [
  'female', 'woman', 'girl', 'samantha', 'victoria', 'karen', 'susan', 
  'linda', 'sarah', 'emma', 'olivia', 'sophia', 'zira', 'hazel', 'alice', 
  'ellen', 'fiona', 'kate', 'moira', 'veena', 'tessa', 'mariam', 'laila', 
  'fatima', 'amira', 'nora', 'hala', 'mona', 'dalia', 'siri', 'cortana',
  'alexa', 'jenny', 'emily', 'mary', 'anna', 'lisa', 'nancy', 'helen',
  'margaret', 'elizabeth', 'barbara', 'betty', 'dorothy', 'ruth', 'rose',
  'martha', 'marie', 'catherine', 'ann', 'carol', 'janet', 'joyce', 'diane',
  'frances', 'gloria', 'marie', 'teresa', 'julia', 'judy', 'megan', 'amy',
  'melissa', 'michelle', 'angela', 'stephanie', 'rebecca', 'laura', 'sharon',
  'cynthia', 'jessica', 'rachel', 'nicole', 'amanda', 'kelly', 'natalie',
];

const isFemaleVoice = (voiceName: string): boolean => {
  const lowerName = voiceName.toLowerCase();
  return FEMALE_VOICE_PATTERNS.some(pattern => lowerName.includes(pattern));
};

const getMaleVoiceScore = (voiceName: string): number => {
  const lowerName = voiceName.toLowerCase();
  
  // High penalty for female voices
  if (isFemaleVoice(voiceName)) {
    return -1000;
  }
  
  // Score based on male voice priority list
  for (let i = 0; i < MALE_VOICE_PRIORITY.length; i++) {
    if (lowerName.includes(MALE_VOICE_PRIORITY[i])) {
      return 100 - i; // Higher score for earlier matches
    }
  }
  
  return 0; // Neutral score for unknown voices
};

// Get the best male voice for a language
const getMaleVoice = (voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | null => {
  // Filter voices by language
  const langCode = lang === 'en' ? 'en' : lang === 'ar' ? 'ar' : lang;
  const langVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langCode.toLowerCase()));
  
  if (langVoices.length === 0) {
    // Try broader match
    const broadVoices = voices.filter(v => 
      v.lang.toLowerCase().includes(langCode.toLowerCase()) ||
      langCode.toLowerCase().includes(v.lang.toLowerCase().split('-')[0])
    );
    if (broadVoices.length === 0) return null;
    
    // Score and sort
    const scored = broadVoices.map(v => ({ voice: v, score: getMaleVoiceScore(v.name) }));
    scored.sort((a, b) => b.score - a.score);
    
    console.log('Broad voice scores:', scored.map(s => `${s.voice.name}: ${s.score}`));
    return scored[0]?.voice || null;
  }
  
  // Score all language voices
  const scoredVoices = langVoices.map(v => ({ voice: v, score: getMaleVoiceScore(v.name) }));
  scoredVoices.sort((a, b) => b.score - a.score);
  
  console.log('Voice scores:', scoredVoices.map(s => `${s.voice.name}: ${s.score}`));
  
  // Return highest scoring non-female voice
  const bestVoice = scoredVoices.find(s => s.score > -1000);
  if (bestVoice) {
    console.log('Selected voice:', bestVoice.voice.name, 'score:', bestVoice.score);
    return bestVoice.voice;
  }
  
  // All voices are female, return first one anyway
  console.log('All voices appear female, using first:', langVoices[0].name);
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
        console.log('Available voices:', availableVoices.map(v => `${v.name} (${v.lang})`));
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

      // Voice settings - MUCH lower pitch to sound more masculine
      utterance.rate = 0.85; // Slightly slower for clarity
      utterance.pitch = 0.5; // Very low pitch for deep male voice

      utterance.onstart = () => {
        console.log('TTS started with pitch:', utterance.pitch);
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

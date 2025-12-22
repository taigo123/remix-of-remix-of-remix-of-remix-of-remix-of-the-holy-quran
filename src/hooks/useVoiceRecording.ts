import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface UseVoiceRecordingReturn {
  isRecording: boolean;
  isProcessing: boolean;
  startRecording: () => void;
  stopRecording: () => Promise<string | null>;
}

// Extend Window interface for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export const useVoiceRecording = (): UseVoiceRecordingReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const resolveRef = useRef<((value: string | null) => void) | null>(null);
  const transcriptRef = useRef<string>('');

  const startRecording = useCallback(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error('المتصفح لا يدعم التعرف على الصوت');
      console.error('Speech recognition not supported in this browser');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'ar-SA'; // Arabic (Saudi Arabia)

      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsRecording(true);
        transcriptRef.current = '';
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[event.resultIndex];
        if (result.isFinal) {
          transcriptRef.current = result[0].transcript;
          console.log('Transcript:', transcriptRef.current);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setIsProcessing(false);
        
        if (event.error === 'no-speech') {
          toast.error('لم يتم اكتشاف أي صوت');
        } else if (event.error === 'not-allowed') {
          toast.error('لم يتم السماح بالوصول للميكروفون');
        } else {
          toast.error('حدث خطأ في التعرف على الصوت');
        }
        
        if (resolveRef.current) {
          resolveRef.current(null);
          resolveRef.current = null;
        }
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsRecording(false);
        setIsProcessing(false);
        if (resolveRef.current) {
          resolveRef.current(transcriptRef.current || null);
          resolveRef.current = null;
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast.error('فشل في بدء التعرف على الصوت');
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!recognitionRef.current) {
        resolve(null);
        return;
      }

      setIsProcessing(true);
      resolveRef.current = resolve;
      recognitionRef.current.stop();
    });
  }, []);

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
  };
};

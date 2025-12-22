import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { cn } from '@/lib/utils';

interface VoiceSearchButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export const VoiceSearchButton = ({ onTranscript, className }: VoiceSearchButtonProps) => {
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording();

  const handleClick = async () => {
    if (isRecording) {
      const text = await stopRecording();
      if (text) {
        onTranscript(text);
      }
    } else {
      await startRecording();
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isProcessing}
      className={cn(
        'h-8 w-8 p-0 rounded-full transition-all',
        isRecording && 'bg-destructive text-destructive-foreground animate-pulse',
        className
      )}
      aria-label={isRecording ? 'إيقاف التسجيل' : 'البحث الصوتي'}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isRecording ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};

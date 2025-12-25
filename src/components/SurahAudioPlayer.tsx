import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { Download, Loader2, Pause, Play, Repeat, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SurahAudioPlayerProps {
  surahId: number;
  verseNumber: number;
  surahName?: string;
  onPlaybackComplete?: () => void;
}

export interface SurahAudioPlayerRef {
  play: () => void;
  pause: () => void;
}

// القراء المتاحون في Islamic Network API للآيات (تم توحيدها مع باقي التطبيق)
const RECITERS = [
  { id: "ar.alafasy", name: "مشاري العفاسي" },
  { id: "ar.abdurrahmaansudais", name: "عبد الرحمن السديس" },
  { id: "ar.saoodshuraym", name: "سعود الشريم" },
  { id: "ar.mahermuaiqly", name: "ماهر المعيقلي" },
  { id: "ar.ahmedajamy", name: "أحمد العجمي" },
  { id: "ar.abdulsamad", name: "عبد الباسط عبد الصمد" },
  { id: "ar.husary", name: "محمود خليل الحصري (مرتل)" },
  { id: "ar.husarymujawwad", name: "الحصري (مجود)" },
  { id: "ar.hudhaify", name: "علي الحذيفي" },
  { id: "ar.abdullahbasfar", name: "عبدالله بصفر" },
  { id: "ar.muhammadayyoub", name: "محمد أيوب" },
  { id: "ar.shaatree", name: "أبو بكر الشاطري" },
  { id: "ar.muhammadjibreel", name: "محمد جبريل" },
  { id: "ar.aymanswoaid", name: "أيمن سويد" },
];

const RECITER_BITRATE: Record<string, number> = {
  "ar.abdulsamad": 64,
  "ar.saoodshuraym": 64,
  "ar.aymanswoaid": 64,
  "ar.abdurrahmaansudais": 64,
  "ar.abdullahbasfar": 64,
};

const REPEAT_OPTIONS = [0, 2, 3, 5, 7, 10];

// عدد الآيات في كل سورة (للحساب الصحيح)
const VERSE_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128,
  111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73,
  54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60,
  49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52,
  44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19,
  26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3,
  6, 3, 5, 4, 5, 6
];

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const SurahAudioPlayer = forwardRef<SurahAudioPlayerRef, SurahAudioPlayerProps>(
  ({ surahId, verseNumber, surahName, onPlaybackComplete }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0].id);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0);
  const [currentRepeat, setCurrentRepeat] = useState(0);

  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onPlaybackCompleteRef = useRef(onPlaybackComplete);
  const repeatCountRef = useRef(repeatCount);
  const currentRepeatRef = useRef(currentRepeat);
  const selectedReciterRef = useRef(selectedReciter);

  // Keep refs updated
  useEffect(() => {
    onPlaybackCompleteRef.current = onPlaybackComplete;
  }, [onPlaybackComplete]);

  useEffect(() => {
    repeatCountRef.current = repeatCount;
  }, [repeatCount]);

  useEffect(() => {
    currentRepeatRef.current = currentRepeat;
  }, [currentRepeat]);

  useEffect(() => {
    selectedReciterRef.current = selectedReciter;
  }, [selectedReciter]);

  const getGlobalVerseNumber = useCallback(() => {
    let globalVerse = 0;
    for (let i = 0; i < surahId - 1; i++) {
      globalVerse += VERSE_COUNTS[i];
    }
    return globalVerse + verseNumber;
  }, [surahId, verseNumber]);

  const getAudioUrl = useCallback(() => {
    const bitrate = RECITER_BITRATE[selectedReciterRef.current] ?? 128;
    return `https://cdn.islamic.network/quran/audio/${bitrate}/${selectedReciterRef.current}/${getGlobalVerseNumber()}.mp3`;
  }, [getGlobalVerseNumber]);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;

    const onEnded = () => {
      const currentRepeatVal = currentRepeatRef.current;
      const repeatCountVal = repeatCountRef.current;
      
      if (repeatCountVal > 0 && currentRepeatVal < repeatCountVal - 1) {
        setCurrentRepeat((prev) => prev + 1);
        audio.currentTime = 0;
        audio.play().catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(false);
        setCurrentRepeat(0);
        // Call the completion callback when playback finishes
        console.log('Audio ended, calling onPlaybackComplete');
        if (onPlaybackCompleteRef.current) {
          // Use setTimeout to avoid state update issues
          setTimeout(() => {
            onPlaybackCompleteRef.current?.();
          }, 100);
        }
      }
    };

    const onError = () => {
      setError("فشل تحميل التلاوة");
      setIsLoading(false);
      setIsPlaying(false);
    };

    const onCanPlayThrough = () => setIsLoading(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const onLoadedMetadata = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    audio.addEventListener("canplaythrough", onCanPlayThrough);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio.pause();
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("canplaythrough", onCanPlayThrough);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audioRef.current = null;
    };
  }, []); // Only run once

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setIsLoading(false);
    setError(null);
    setCurrentRepeat(0);
  }, [surahId, verseNumber]);

  const togglePlay = useCallback(async () => {
    if (!audioRef.current) return;
    setError(null);

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    setCurrentRepeat(0);

    const url = getAudioUrl();
    if (audioRef.current.src !== url) {
      setCurrentTime(0);
      setDuration(0);
      audioRef.current.currentTime = 0;
      audioRef.current.src = url;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch {
      setError("فشل تشغيل التلاوة");
      setIsLoading(false);
    }
  }, [isPlaying, getAudioUrl]);

  // Expose play/pause methods via ref
  useImperativeHandle(ref, () => ({
    play: () => {
      if (!isPlaying) {
        togglePlay();
      }
    },
    pause: () => {
      if (audioRef.current && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }), [isPlaying, togglePlay]);

  const handleReciterChange = (reciterId: string) => {
    setSelectedReciter(reciterId);
    setError(null);
    setCurrentTime(0);
    setDuration(0);
    setCurrentRepeat(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleSeekPercent = (percent: number) => {
    if (!audioRef.current || !duration) return;
    const nextTime = Math.min(duration, Math.max(0, (percent / 100) * duration));
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleDownload = () => {
    const url = getAudioUrl();
    setIsDownloading(true);
    
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "جاري فتح التلاوة",
      description: "اضغط على زر الحفظ في المتصفح لتنزيل الملف",
    });

    setIsDownloading(false);
  };

  const cycleRepeat = () => {
    const currentIndex = REPEAT_OPTIONS.indexOf(repeatCount);
    const nextIndex = (currentIndex + 1) % REPEAT_OPTIONS.length;
    setRepeatCount(REPEAT_OPTIONS[nextIndex]);
    setCurrentRepeat(0);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={selectedReciter}
          onChange={(e) => handleReciterChange(e.target.value)}
          className="text-xs bg-muted border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          dir="rtl"
        >
          {RECITERS.map((reciter) => (
            <option key={reciter.id} value={reciter.id}>
              {reciter.name}
            </option>
          ))}
        </select>

        <Button
          variant="outline"
          size="sm"
          onClick={togglePlay}
          disabled={isLoading}
          className="h-8 w-8 p-0 rounded-full border-primary/30 hover:bg-primary/10"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4 text-primary" />
          ) : (
            <Play className="w-4 h-4 text-primary" />
          )}
        </Button>

        <div className="flex items-center gap-2 min-w-[180px]" dir="ltr">
          <Slider
            value={[duration ? (currentTime / duration) * 100 : 0]}
            max={100}
            step={0.1}
            onValueChange={(v) => handleSeekPercent(v[0] ?? 0)}
            aria-label="شريط تقدّم التلاوة"
            className="w-28 sm:w-40"
          />
          <span className="text-[11px] tabular-nums text-muted-foreground whitespace-nowrap">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={cycleRepeat}
          className={cn(
            "h-8 px-2 rounded-full hover:bg-primary/10 gap-1",
            repeatCount > 0 ? "text-primary" : "text-muted-foreground"
          )}
          aria-label="تكرار الآية"
          title={repeatCount > 0 ? `تكرار ${repeatCount} مرات` : "بدون تكرار"}
        >
          <Repeat className="w-4 h-4" />
          {repeatCount > 0 && <span className="text-xs font-medium">{repeatCount}</span>}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          disabled={isDownloading}
          className="h-8 w-8 p-0 rounded-full hover:bg-primary/10"
          aria-label="تحميل تلاوة الآية"
          title="تحميل mp3"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <Download className="w-4 h-4 text-primary" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMuted(!isMuted)}
          className="h-8 w-8 p-0 rounded-full hover:bg-primary/10"
          aria-label={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Volume2 className="w-4 h-4 text-primary" />
          )}
        </Button>
      </div>

      {repeatCount > 0 && isPlaying && (
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground" dir="rtl">
          <span>التكرار:</span>
          <span className="font-bold text-primary">{currentRepeat + 1}</span>
          <span>من</span>
          <span className="font-bold">{repeatCount}</span>
        </div>
      )}

      {error && <span className="text-xs text-destructive text-center">{error}</span>}
    </div>
  );
});

SurahAudioPlayer.displayName = "SurahAudioPlayer";

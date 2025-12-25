import { useEffect, useRef, useState } from "react";
import { Download, Loader2, Pause, Play, Repeat, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  verseNumber: number;
  onRecitationEnd?: () => void;
}

const RECITERS = [
  // القراء المميزون - الأفضل في المقدمة
  { id: "ar.yasserdossari", name: "ياسر الدوسري" },
  { id: "ar.alafasy", name: "مشاري العفاسي" },
  { id: "ar.abdurrahmaansudais", name: "عبد الرحمن السديس" },
  { id: "ar.saaborimaa", name: "سعود الشريم" },
  { id: "ar.mahermuaiqly", name: "ماهر المعيقلي" },
  { id: "ar.saaborim", name: "سعد الغامدي" },
  { id: "ar.ahmedajamy", name: "أحمد العجمي" },
  { id: "ar.nasserqatami", name: "ناصر القطامي" },
  { id: "ar.faresabbad", name: "فارس عباد" },
  { id: "ar.abdulbasitmurattal", name: "عبد الباسط عبد الصمد (مرتل)" },
  { id: "ar.abdulsamad", name: "عبد الباسط عبد الصمد (مجود)" },
  { id: "ar.minshawi", name: "محمد صديق المنشاوي" },
  { id: "ar.husary", name: "محمود خليل الحصري" },
  { id: "ar.hudhaify", name: "علي الحذيفي" },
  { id: "ar.abdullahbasfar", name: "عبدالله بصفر" },
  { id: "ar.ibrahimakhdar", name: "إبراهيم الأخضر" },
  { id: "ar.bandarbalila", name: "بندر بليلة" },
  { id: "ar.haborimo", name: "هاني الرفاعي" },
  { id: "ar.idreesakbar", name: "إدريس أبكر" },
  { id: "ar.muhammadluhaidan", name: "محمد اللحيدان" },
  { id: "ar.muhammadayyub", name: "محمد أيوب" },
  { id: "ar.abdulmohsenqasim", name: "عبد المحسن القاسم" },
  { id: "ar.khalidjalil", name: "خالد الجليل" },
  { id: "ar.abdullahjuhany", name: "عبدالله الجهني" },
  { id: "ar.abdulazizahmed", name: "عبد العزيز الأحمد" },
  { id: "ar.nabilrifa3i", name: "نبيل الرفاعي" },
  { id: "ar.salahbukhatir", name: "صلاح بوخاطر" },
  { id: "ar.muhammadtablawi", name: "محمد الطبلاوي" },
];

const RECITER_BITRATE: Record<string, number> = {
  "ar.abdulsamad": 64,
  "ar.abdulbasitmurattal": 64,
};

const REPEAT_OPTIONS = [0, 2, 3, 5, 7, 10]; // 0 = no repeat

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const AudioPlayer = ({ verseNumber, onRecitationEnd }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0].id);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  // Repeat state
  const [repeatCount, setRepeatCount] = useState(0); // 0 = off
  const [currentRepeat, setCurrentRepeat] = useState(0);

  const { toast } = useToast();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;

    const onEnded = () => {
      // Check if we need to repeat
      if (repeatCount > 0 && currentRepeat < repeatCount - 1) {
        setCurrentRepeat((prev) => prev + 1);
        audio.currentTime = 0;
        audio.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        setIsPlaying(false);
        setCurrentRepeat(0);
        // Call the callback when recitation ends (after all repeats)
        onRecitationEnd?.();
      }
    };

    const onError = () => {
      setError("فشل تحميل التلاوة");
      setIsLoading(false);
      setIsPlaying(false);
    };

    const onCanPlayThrough = () => {
      setIsLoading(false);
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const onLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };

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
  }, [repeatCount, currentRepeat]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
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
  }, [verseNumber]);

  const getAudioUrl = () => {
    const bitrate = RECITER_BITRATE[selectedReciter] ?? 128;
    return `https://cdn.islamic.network/quran/audio/${bitrate}/${selectedReciter}/${getGlobalVerseNumber()}.mp3`;
  };

  const getGlobalVerseNumber = () => {
    const verseCounts = [
      7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128,
      111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73,
      54, 45,
    ];

    let globalVerse = 0;
    for (let i = 0; i < 35; i++) {
      globalVerse += verseCounts[i];
    }
    return globalVerse + verseNumber;
  };

  const togglePlay = async () => {
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
  };

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
    if (!audioRef.current) return;
    if (!duration) return;
    const nextTime = Math.min(duration, Math.max(0, (percent / 100) * duration));
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleDownload = () => {
    const url = getAudioUrl();
    const filename = `سورة يس - آية ${verseNumber}.mp3`;

    setIsDownloading(true);
    
    // Open in new tab for direct download (avoids CORS issues)
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
        {/* Reciter Select */}
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

        {/* Play/Pause Button */}
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

        {/* Progress + Duration */}
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

        {/* Repeat Button */}
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
          {repeatCount > 0 && (
            <span className="text-xs font-medium">{repeatCount}</span>
          )}
        </Button>

        {/* Download Button */}
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

        {/* Mute Button */}
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

      {/* Repeat Counter Display */}
      {repeatCount > 0 && isPlaying && (
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground" dir="rtl">
          <span>التكرار:</span>
          <span className="font-bold text-primary">{currentRepeat + 1}</span>
          <span>من</span>
          <span className="font-bold">{repeatCount}</span>
        </div>
      )}

      {/* Error Message */}
      {error && <span className="text-xs text-destructive text-center">{error}</span>}
    </div>
  );
};


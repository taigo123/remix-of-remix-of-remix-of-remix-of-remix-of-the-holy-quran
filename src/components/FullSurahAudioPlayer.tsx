import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Download,
  Heart,
  ListMusic,
  Loader2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  RotateCcw,
  Share2,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  BookOpen,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Progress } from "./ui/progress";
import { Surah } from "@/data/types";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useReadingStats } from "@/hooks/useReadingStats";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

// القراء المتاحون - متوافقون مع Islamic Network API و MP3Quran
const RECITERS = [
  { id: "ar.alafasy", name: "مشاري العفاسي", downloadServer: "https://server8.mp3quran.net/afs" },
  { id: "ar.abdurrahmaansudais", name: "عبد الرحمن السديس", downloadServer: "https://server11.mp3quran.net/sds" },
  { id: "ar.saoodshuraym", name: "سعود الشريم", downloadServer: "https://server7.mp3quran.net/shur" },
  { id: "ar.mahermuaiqly", name: "ماهر المعيقلي", downloadServer: "https://server12.mp3quran.net/maher" },
  { id: "ar.ahmedajamy", name: "أحمد العجمي", downloadServer: "https://server10.mp3quran.net/ajm" },
  { id: "ar.abdulbasitmurattal", name: "عبد الباسط عبد الصمد (مرتل)", downloadServer: "https://server7.mp3quran.net/basit" },
  { id: "ar.abdulsamad", name: "عبد الباسط عبد الصمد (مجود)", downloadServer: "https://server7.mp3quran.net/basit_mjwd" },
  { id: "ar.minshawi", name: "محمد صديق المنشاوي", downloadServer: "https://server10.mp3quran.net/minsh" },
  { id: "ar.minshawimujawwad", name: "المنشاوي (مجود)", downloadServer: "https://server10.mp3quran.net/minsh_mjwd" },
  { id: "ar.husary", name: "محمود خليل الحصري", downloadServer: "https://server13.mp3quran.net/husr" },
  { id: "ar.husarymujawwad", name: "الحصري (مجود)", downloadServer: "https://server13.mp3quran.net/husr_mjwd" },
  { id: "ar.hudhaify", name: "علي الحذيفي", downloadServer: "https://server11.mp3quran.net/hthfi" },
  { id: "ar.abdullahbasfar", name: "عبدالله بصفر", downloadServer: "https://server11.mp3quran.net/basf" },
  { id: "ar.hanirifai", name: "هاني الرفاعي", downloadServer: "https://server8.mp3quran.net/hani" },
  { id: "ar.muhammadayyoub", name: "محمد أيوب", downloadServer: "https://server8.mp3quran.net/ayyub" },
  { id: "ar.shaatree", name: "أبو بكر الشاطري", downloadServer: "https://server11.mp3quran.net/shatri" },
  { id: "ar.muhammadjibreel", name: "محمد جبريل", downloadServer: "https://server8.mp3quran.net/jbrl" },
  { id: "ar.aymanswoaid", name: "أيمن سويد", downloadServer: "https://server6.mp3quran.net/ayman" },
];

const RECITER_BITRATE: Record<string, number> = {
  "ar.abdulsamad": 64,
  "ar.abdulbasitmurattal": 64,
  "ar.saoodshuraym": 64,
  "ar.minshawimujawwad": 64,
  "ar.aymanswoaid": 64,
};

const VERSE_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128,
  111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73,
  54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60,
  49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52,
  44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19,
  26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3,
  6, 3, 5, 4, 5, 6,
];

type RepeatMode = "none" | "verse" | "surah";

interface FullSurahAudioPlayerProps {
  surah: Surah;
  onVerseChange?: (verseNumber: number) => void;
}

interface SavedProgress {
  verseIndex: number;
  reciter: string;
  timestamp: number;
}

const getStorageKey = (surahId: number) => `quran_progress_surah_${surahId}`;

export const FullSurahAudioPlayer = ({ surah, onVerseChange }: FullSurahAudioPlayerProps) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const { 
    stats, 
    recordVerseListened, 
    addListeningTime, 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite, 
    formatTime 
  } = useReadingStats();

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [isExpanded, setIsExpanded] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0].id);
  const [error, setError] = useState<string | null>(null);

  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [savedVerseIndex, setSavedVerseIndex] = useState<number | null>(null);

  const [autoScroll, setAutoScroll] = useState(true);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("none");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prefetchAudioRef = useRef<HTMLAudioElement | null>(null);
  const listeningStartRef = useRef<number | null>(null);

  // استخدام refs للقيم المتغيرة داخل event handlers
  const repeatModeRef = useRef(repeatMode);
  const currentVerseIndexRef = useRef(currentVerseIndex);
  const autoScrollRef = useRef(autoScroll);
  const selectedReciterRef = useRef(selectedReciter);
  const isPlayingRef = useRef(isPlaying);
  const pendingPlayRef = useRef(false);

  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);
  useEffect(() => {
    currentVerseIndexRef.current = currentVerseIndex;
  }, [currentVerseIndex]);
  useEffect(() => {
    autoScrollRef.current = autoScroll;
  }, [autoScroll]);
  useEffect(() => {
    selectedReciterRef.current = selectedReciter;
  }, [selectedReciter]);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);


  const totalVerses = surah.verses.length;

  const verseNumbers = useMemo(
    () => surah.verses.map((v, idx) => (typeof v.id === "number" ? v.id : idx + 1)),
    [surah.verses]
  );

  const isSurahFavorite = isFavorite(surah.id);

  const getGlobalVerseNumber = useCallback(
    (verseNumber: number) => {
      let globalVerse = 0;
      for (let i = 0; i < surah.id - 1; i++) {
        globalVerse += VERSE_COUNTS[i] ?? 0;
      }
      return globalVerse + verseNumber;
    },
    [surah.id]
  );

  const getAudioUrl = useCallback(
    (verseNumber: number, reciter: string) => {
      const bitrate = RECITER_BITRATE[reciter] ?? 128;
      return `https://cdn.islamic.network/quran/audio/${bitrate}/${reciter}/${getGlobalVerseNumber(verseNumber)}.mp3`;
    },
    [getGlobalVerseNumber]
  );

  // إنشاء عنصر الصوت مرة واحدة فقط
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    const prefetch = new Audio();
    prefetch.preload = "auto";
    prefetchAudioRef.current = prefetch;

    return () => {
      audio.pause();
      audio.src = "";
      prefetch.pause();
      prefetch.src = "";
      audioRef.current = null;
      prefetchAudioRef.current = null;
    };
  }, []);

  // تسجيل event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      // تسجيل الإحصائيات
      if (listeningStartRef.current) {
        const elapsed = Math.floor((Date.now() - listeningStartRef.current) / 1000);
        addListeningTime(elapsed, surah.id);
        listeningStartRef.current = Date.now();
      }

      const currentIdx = currentVerseIndexRef.current;
      const currentVerse = verseNumbers[currentIdx] ?? currentIdx + 1;
      recordVerseListened(surah.id, currentVerse, totalVerses);

      const mode = repeatModeRef.current;

      if (mode === "verse") {
        // تكرار نفس الآية - أعد التشغيل
        audio.currentTime = 0;
        audio.play().catch(() => {
          setIsPlaying(false);
        });
        return;
      }

      const nextIdx = currentIdx + 1;
      if (nextIdx >= totalVerses) {
        if (mode === "surah") {
          setCurrentVerseIndex(0);
        } else {
          setIsPlaying(false);
          setCurrentVerseIndex(0);
        }
      } else {
        setCurrentVerseIndex(nextIdx);
      }
    };

    const onError = () => {
      setError("فشل تحميل التلاوة");
      setIsLoading(false);
      setIsPlaying(false);
    };

    const onCanPlayThrough = async () => {
      setIsLoading(false);

      if (!pendingPlayRef.current || !isPlayingRef.current) return;
      pendingPlayRef.current = false;

      try {
        await audio.play();
        listeningStartRef.current = Date.now();

        const verseNumber = verseNumbers[currentVerseIndexRef.current] ?? currentVerseIndexRef.current + 1;
        if (autoScrollRef.current) {
          const verseElement = document.getElementById(`verse-${verseNumber}`);
          if (verseElement) {
            // حساب موضع الآية مع مراعاة الهيدر الثابت
            const headerHeight = 100;
            const elementTop = verseElement.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
              top: elementTop - headerHeight,
              behavior: "smooth"
            });
          }
        }
      } catch {
        setError("فشل تشغيل التلاوة");
        setIsPlaying(false);
      }
    };

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    audio.addEventListener("canplaythrough", onCanPlayThrough);

    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("canplaythrough", onCanPlayThrough);
    };
  }, [surah.id, totalVerses, verseNumbers, recordVerseListened, addListeningTime]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  // المسبق التحميل دائماً صامت
  useEffect(() => {
    if (prefetchAudioRef.current) prefetchAudioRef.current.muted = true;
  }, []);

  // تحميل موضع محفوظ
  useEffect(() => {
    try {
      const saved = localStorage.getItem(getStorageKey(surah.id));
      if (!saved) return;
      const progress: SavedProgress = JSON.parse(saved);
      if (progress.verseIndex > 0 && progress.verseIndex < totalVerses) {
        setHasSavedProgress(true);
        setSavedVerseIndex(progress.verseIndex);
        if (progress.reciter) setSelectedReciter(progress.reciter);
      }
    } catch {
      // ignore
    }
  }, [surah.id, totalVerses]);

  // تحميل مسبق للآية التالية لتقليل الفواصل
  useEffect(() => {
    if (!isPlaying) return;
    const prefetch = prefetchAudioRef.current;
    if (!prefetch) return;

    const mode = repeatModeRef.current;
    if (mode === "verse") return;

    let nextIdx = currentVerseIndex + 1;
    if (nextIdx >= totalVerses) {
      if (mode === "surah") nextIdx = 0;
      else return;
    }

    const nextVerse = verseNumbers[nextIdx] ?? nextIdx + 1;
    const nextUrl = getAudioUrl(nextVerse, selectedReciterRef.current);

    if (prefetch.src !== nextUrl) {
      prefetch.src = nextUrl;
      prefetch.load();
    }
  }, [currentVerseIndex, isPlaying, getAudioUrl, totalVerses, verseNumbers]);

  // حفظ الموضع الحالي
  useEffect(() => {
    if (currentVerseIndex <= 0) return;
    const progress: SavedProgress = {
      verseIndex: currentVerseIndex,
      reciter: selectedReciter,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(getStorageKey(surah.id), JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [currentVerseIndex, selectedReciter, surah.id]);

  const resumeFromSaved = () => {
    if (savedVerseIndex === null) return;
    setCurrentVerseIndex(savedVerseIndex);
    setHasSavedProgress(false);
    if (!isExpanded) setIsExpanded(true);
  };

  const startFromBeginning = () => {
    setCurrentVerseIndex(0);
    setHasSavedProgress(false);
    setSavedVerseIndex(null);
    localStorage.removeItem(getStorageKey(surah.id));
  };

  // تشغيل آية عند تغيير index أو عند بدء التشغيل
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      pendingPlayRef.current = false;
      audio.pause();
      return;
    }

    const verseNumber = verseNumbers[currentVerseIndex] ?? currentVerseIndex + 1;
    onVerseChange?.(verseNumber);

    const url = getAudioUrl(verseNumber, selectedReciterRef.current);
    setIsLoading(true);
    setError(null);

    pendingPlayRef.current = true;

    // لو نفس الملف محمّل/مُعد مسبقاً لا تعيد تحميله
    if (audio.src !== url) {
      audio.src = url;
      audio.load();
    }

    // لو الملف جاهز سريعاً حاول التشغيل مباشرة
    if (audio.readyState >= 3) {
      audio
        .play()
        .then(() => {
          pendingPlayRef.current = false;
          setIsLoading(false);
          listeningStartRef.current = Date.now();
          if (autoScrollRef.current) {
            const verseElement = document.getElementById(`verse-${verseNumber}`);
            if (verseElement) {
              const headerHeight = 100;
              const elementTop = verseElement.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({
                top: elementTop - headerHeight,
                behavior: "smooth"
              });
            }
          }
        })
        .catch(() => {
          // سيحاول مجدداً عند canplaythrough
        });
    }
  }, [currentVerseIndex, isPlaying, getAudioUrl, onVerseChange, verseNumbers]);


  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (listeningStartRef.current) {
        const elapsed = Math.floor((Date.now() - listeningStartRef.current) / 1000);
        addListeningTime(elapsed, surah.id);
        listeningStartRef.current = null;
      }
    } else {
      setIsPlaying(true);
    }
  };

  const handlePrev = () => setCurrentVerseIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentVerseIndex((prev) => Math.min(totalVerses - 1, prev + 1));

  const handleReciterChange = (reciterId: string) => {
    setSelectedReciter(reciterId);
    if (audioRef.current && isPlaying) {
      // سيتم إعادة التشغيل تلقائياً بسبب تغيير selectedReciter في useEffect
    }
  };

  const handleSliderChange = (value: number[]) => {
    const index = Math.round((value[0] / 100) * (totalVerses - 1));
    setCurrentVerseIndex(index);
  };

  const cycleRepeatMode = () => {
    setRepeatMode((prev) => {
      if (prev === "none") return "verse";
      if (prev === "verse") return "surah";
      return "none";
    });
  };

  const handleShare = async () => {
    const currentVerse = verseNumbers[currentVerseIndex];
    const shareText = `استمع إلى سورة ${surah.name} - الآية ${currentVerse}`;
    const shareUrl = `${window.location.origin}/surah/${surah.id}#verse-${currentVerse}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `سورة ${surah.name}`,
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast({
          title: "تم النسخ",
          description: "تم نسخ رابط السورة إلى الحافظة",
        });
      }
    } catch {
      // ignore
    }
  };

  const toggleFavorite = () => {
    if (isSurahFavorite) {
      removeFromFavorites(surah.id);
      toast({ title: "تمت الإزالة", description: `تم إزالة سورة ${surah.name} من المفضلة` });
    } else {
      addToFavorites(surah.id, surah.name);
      toast({ title: "تمت الإضافة", description: `تم إضافة سورة ${surah.name} إلى المفضلة` });
    }
  };

  const handleDownload = async () => {
    const reciter = RECITERS.find(r => r.id === selectedReciter);
    if (!reciter) return;

    const surahNumber = String(surah.id).padStart(3, '0');
    const downloadUrl = `${reciter.downloadServer}/${surahNumber}.mp3`;
    const fileName = `${surah.name}_${reciter.name}.mp3`;

    setIsDownloading(true);
    setDownloadProgress(0);
    
    const downloadLabels = {
      ar: { started: 'جاري التحميل...', success: 'تم التحميل بنجاح', error: 'فشل التحميل' },
      en: { started: 'Downloading...', success: 'Download complete', error: 'Download failed' },
    };
    const labels = downloadLabels[language as keyof typeof downloadLabels] || downloadLabels.en;

    try {
      toast({ title: labels.started, description: fileName });
      
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Download failed');
      
      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');
      
      const chunks: BlobPart[] = [];
      let received = 0;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        chunks.push(value);
        received += value.length;
        
        if (total > 0) {
          setDownloadProgress(Math.round((received / total) * 100));
        } else {
          // If no content-length, show indeterminate progress
          setDownloadProgress(Math.min(received / 10000, 95));
        }
      }
      
      const blob = new Blob(chunks, { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setDownloadProgress(100);
      toast({ title: labels.success, description: fileName });
    } catch (error) {
      console.error('Download error:', error);
      // Fallback: open in new tab
      window.open(downloadUrl, '_blank');
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 1000);
    }
  };

  const surahStats = stats.surahProgress[surah.id];

  if (!isExpanded) {
    return (
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => {
            setIsExpanded(true);
            // تشغيل تلقائي عند فتح المشغل
            setTimeout(() => setIsPlaying(true), 100);
          }}
          className="w-full gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
          variant="outline"
        >
          <ListMusic className="w-5 h-5" />
          <span className="font-bold">تشغيل السورة كاملة</span>
        </Button>

        {hasSavedProgress && savedVerseIndex !== null && (
          <div className="flex items-center justify-between p-3 bg-accent/50 border border-accent rounded-xl text-sm" dir="rtl">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-primary" />
              <span>
                توقفت عند الآية <strong className="text-primary">{(savedVerseIndex ?? 0) + 1}</strong>
              </span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="default" onClick={resumeFromSaved} className="h-7 text-xs">
                استئناف
              </Button>
              <Button size="sm" variant="ghost" onClick={startFromBeginning} className="h-7 text-xs">
                من البداية
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-primary/20">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg text-primary" dir="rtl">
              تشغيل سورة {surah.name} كاملة
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedReciter}
              onChange={(e) => handleReciterChange(e.target.value)}
              className="text-xs bg-background border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              dir="rtl"
            >
              {RECITERS.map((reciter) => (
                <option key={reciter.id} value={reciter.id}>
                  {reciter.name}
                </option>
              ))}
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                setIsPlaying(false);
                setIsExpanded(false);
              }}
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              إغلاق
            </Button>
          </div>
        </div>

        {/* Resume inside player */}
        {hasSavedProgress && savedVerseIndex !== null && currentVerseIndex !== savedVerseIndex && (
          <div className="flex items-center justify-between p-2 bg-accent/30 rounded-lg text-sm" dir="rtl">
            <span className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-primary" />
              موضع محفوظ: الآية {savedVerseIndex + 1}
            </span>
            <Button size="sm" variant="outline" onClick={resumeFromSaved} className="h-6 text-xs">
              انتقال
            </Button>
          </div>
        )}

        {/* Progress */}
        <div className="flex items-center gap-3" dir="ltr">
          <span className="text-xs text-muted-foreground w-8 text-center">{currentVerseIndex + 1}</span>
          <Slider
            value={[(currentVerseIndex / Math.max(totalVerses - 1, 1)) * 100]}
            max={100}
            step={100 / Math.max(totalVerses - 1, 1)}
            onValueChange={handleSliderChange}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-8 text-center">{totalVerses}</span>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={currentVerseIndex === 0}
            className="h-10 w-10 p-0 rounded-full hover:bg-primary/20"
            aria-label="الآية السابقة"
          >
            <SkipForward className="w-5 h-5 text-primary" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={togglePlay}
            disabled={isLoading}
            className="h-14 w-14 p-0 rounded-full border-primary/50 bg-primary/20 hover:bg-primary/30"
            aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6 text-primary" />
            ) : (
              <Play className="w-6 h-6 text-primary" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            disabled={currentVerseIndex === totalVerses - 1}
            className="h-10 w-10 p-0 rounded-full hover:bg-primary/20"
            aria-label="الآية التالية"
          >
            <SkipBack className="w-5 h-5 text-primary" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMuted((v) => !v)}
            className="h-10 w-10 p-0 rounded-full hover:bg-primary/20"
            aria-label={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Volume2 className="w-5 h-5 text-primary" />
            )}
          </Button>
        </div>

        {/* Current Verse Info */}
        <div className="text-center text-muted-foreground text-sm" dir="rtl">
          الآية <span className="font-bold text-primary">{verseNumbers[currentVerseIndex] ?? currentVerseIndex + 1}</span> من {totalVerses}
        </div>

        {/* Extra Controls Row */}
        <div className="flex items-center justify-center gap-1 flex-wrap">
          {/* Repeat */}
          <Button
            variant="ghost"
            size="sm"
            onClick={cycleRepeatMode}
            className={cn("h-9 px-3 rounded-full gap-1", repeatMode !== "none" && "text-primary bg-primary/10")}
            title={repeatMode === "none" ? "بدون تكرار" : repeatMode === "verse" ? "تكرار الآية" : "تكرار السورة"}
          >
            {repeatMode === "verse" ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
            <span className="text-xs">
              {repeatMode === "none" ? "تكرار" : repeatMode === "verse" ? "الآية" : "السورة"}
            </span>
          </Button>

          {/* Auto Scroll */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
            <span className="text-xs text-muted-foreground">تمرير تلقائي</span>
            <Switch checked={autoScroll} onCheckedChange={setAutoScroll} className="scale-75" />
          </div>

          {/* Download */}
          <div className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              className="h-9 px-3 rounded-full gap-1 text-green-600 hover:text-green-700 hover:bg-green-500/10"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span className="text-xs">{language === 'ar' ? 'تحميل' : 'Download'}</span>
            </Button>
            {isDownloading && (
              <div className="w-20">
                <Progress value={downloadProgress} className="h-1" />
                <span className="text-[10px] text-muted-foreground">{downloadProgress}%</span>
              </div>
            )}
          </div>

          {/* Share */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-9 px-3 rounded-full gap-1"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-xs">مشاركة</span>
          </Button>

          {/* Favorite */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFavorite}
            className={cn("h-9 px-3 rounded-full gap-1", isSurahFavorite && "text-red-500")}
          >
            <Heart className={cn("w-4 h-4", isSurahFavorite && "fill-current")} />
            <span className="text-xs">المفضلة</span>
          </Button>

          {/* Stats Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowStats((v) => !v)}
            className={cn("h-9 px-3 rounded-full gap-1", showStats && "text-primary bg-primary/10")}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">إحصائيات</span>
            {showStats ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </Button>
        </div>

        {/* Stats Panel */}
        {showStats && (
          <div className="bg-background/50 rounded-xl p-4 border border-border" dir="rtl">
            <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              إحصائيات الاستماع
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="bg-primary/5 rounded-lg p-3">
                <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">وقت الاستماع الكلي</p>
                <p className="font-bold text-sm">{formatTime(stats.totalListeningTimeSeconds)}</p>
              </div>
              <div className="bg-primary/5 rounded-lg p-3">
                <BookOpen className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">الآيات المستمع إليها</p>
                <p className="font-bold text-sm">{stats.versesListened}</p>
              </div>
              <div className="bg-primary/5 rounded-lg p-3">
                <ListMusic className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">السور المكتملة</p>
                <p className="font-bold text-sm">{stats.surahsCompleted}</p>
              </div>
              <div className="bg-primary/5 rounded-lg p-3">
                <Heart className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">المفضلة</p>
                <p className="font-bold text-sm">{stats.favorites.length}</p>
              </div>
            </div>

            {surahStats && (
              <div className="mt-3 p-3 bg-accent/30 rounded-lg">
                <p className="text-sm font-medium">سورة {surah.name}:</p>
                <p className="text-xs text-muted-foreground">
                  استمعت إلى {surahStats.versesListened} آية • {formatTime(surahStats.timeSpentSeconds)}
                  {surahStats.completed && <span className="text-green-600 mr-2">✓ مكتملة</span>}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && <p className="text-center text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
};

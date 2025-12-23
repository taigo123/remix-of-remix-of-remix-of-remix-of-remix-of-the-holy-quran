import { useState, useRef, useEffect, useCallback } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
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
  TrendingUp,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { getSurahData } from "@/data/surahsData";
import { useToast } from "@/hooks/use-toast";
import { useReadingStats } from "@/hooks/useReadingStats";
import { cn } from "@/lib/utils";

const RECITERS = [
  { id: "ar.alafasy", name: "مشاري العفاسي" },
  { id: "ar.abdulbasitmurattal", name: "عبد الباسط عبد الصمد (مرتل)" },
  { id: "ar.abdulsamad", name: "عبد الباسط عبد الصمد (مجود)" },
  { id: "ar.minshawi", name: "محمد صديق المنشاوي" },
  { id: "ar.husary", name: "محمود خليل الحصري" },
  { id: "ar.mahermuaiqly", name: "ماهر المعيقلي" },
];

const RECITER_BITRATE: Record<string, number> = {
  "ar.abdulsamad": 64,
  "ar.abdulbasitmurattal": 64,
};

const surahYasin = getSurahData(36);
const allVerses = surahYasin ? surahYasin.verses.map((v) => v.id) : [];
const TOTAL_VERSES = allVerses.length;
const SURAH_ID = 36;
const SURAH_NAME = "يس";

type RepeatMode = "none" | "verse" | "surah";

interface FullSurahPlayerProps {
  onVerseChange: (verseNumber: number) => void;
  currentHighlightedVerse: number | null;
}

const YASIN_STORAGE_KEY = "quran_progress_surah_36";

interface SavedProgress {
  verseIndex: number;
  reciter: string;
  timestamp: number;
}

export const FullSurahPlayer = ({
  onVerseChange,
}: FullSurahPlayerProps) => {
  const { toast } = useToast();
  const {
    stats,
    recordVerseListened,
    addListeningTime,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    formatTime,
  } = useReadingStats();

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
  const [showStats, setShowStats] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prefetchAudioRef = useRef<HTMLAudioElement | null>(null);
  const listeningStartRef = useRef<number | null>(null);

  // refs للقيم المتغيرة داخل event handlers
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

  const isSurahFavorite = isFavorite(SURAH_ID);

  // تحميل الموضع المحفوظ
  useEffect(() => {
    try {
      const saved = localStorage.getItem(YASIN_STORAGE_KEY);
      if (saved) {
        const progress: SavedProgress = JSON.parse(saved);
        if (progress.verseIndex > 0 && progress.verseIndex < TOTAL_VERSES) {
          setHasSavedProgress(true);
          setSavedVerseIndex(progress.verseIndex);
          setSelectedReciter(progress.reciter || RECITERS[0].id);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // حفظ الموضع
  useEffect(() => {
    if (currentVerseIndex > 0) {
      const progress: SavedProgress = {
        verseIndex: currentVerseIndex,
        reciter: selectedReciter,
        timestamp: Date.now(),
      };
      try {
        localStorage.setItem(YASIN_STORAGE_KEY, JSON.stringify(progress));
      } catch {
        // ignore
      }
    }
  }, [currentVerseIndex, selectedReciter]);

  const resumeFromSaved = () => {
    if (savedVerseIndex !== null) {
      setCurrentVerseIndex(savedVerseIndex);
      setHasSavedProgress(false);
    }
  };

  const startFromBeginning = () => {
    setCurrentVerseIndex(0);
    setHasSavedProgress(false);
    localStorage.removeItem(YASIN_STORAGE_KEY);
  };

  const getGlobalVerseNumber = (verseNumber: number) => {
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

  const getAudioUrl = useCallback(
    (verseNumber: number, reciter: string) => {
      const bitrate = RECITER_BITRATE[reciter] ?? 128;
      return `https://cdn.islamic.network/quran/audio/${bitrate}/${reciter}/${getGlobalVerseNumber(verseNumber)}.mp3`;
    },
    []
  );

  // إنشاء عنصر الصوت مرة واحدة
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
        addListeningTime(elapsed, SURAH_ID);
        listeningStartRef.current = Date.now();
      }

      const currentIdx = currentVerseIndexRef.current;
      const currentVerse = allVerses[currentIdx];
      recordVerseListened(SURAH_ID, currentVerse, TOTAL_VERSES);

      const mode = repeatModeRef.current;

      if (mode === "verse") {
        audio.currentTime = 0;
        audio.play().catch(() => setIsPlaying(false));
        return;
      }

      const nextIdx = currentIdx + 1;
      if (nextIdx >= TOTAL_VERSES) {
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

        const verseNumber = allVerses[currentVerseIndexRef.current];
        if (autoScrollRef.current) {
          const verseElement = document.getElementById(`verse-${verseNumber}`);
          if (verseElement) {
            verseElement.scrollIntoView({ behavior: "smooth", block: "center" });
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
  }, [recordVerseListened, addListeningTime]);

  // تهيئة الكتم
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // تهيئة الكتم للمسبق التحميل
  useEffect(() => {
    if (prefetchAudioRef.current) {
      prefetchAudioRef.current.muted = true;
    }
  }, []);

  // تحميل مسبق للآية التالية لتقليل الفواصل بين الآيات
  useEffect(() => {
    if (!isPlaying) return;
    const prefetch = prefetchAudioRef.current;
    if (!prefetch) return;

    const mode = repeatModeRef.current;
    if (mode === "verse") return;

    let nextIdx = currentVerseIndex + 1;
    if (nextIdx >= TOTAL_VERSES) {
      if (mode === "surah") nextIdx = 0;
      else return;
    }

    const nextVerse = allVerses[nextIdx];
    const nextUrl = getAudioUrl(nextVerse, selectedReciterRef.current);

    if (prefetch.src !== nextUrl) {
      prefetch.src = nextUrl;
      prefetch.load();
    }
  }, [currentVerseIndex, isPlaying, getAudioUrl]);

  // تشغيل الآية
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      pendingPlayRef.current = false;
      audio.pause();
      return;
    }

    const verseNumber = allVerses[currentVerseIndex];
    onVerseChange(verseNumber);

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
              verseElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }
        })
        .catch(() => {
          // سيحاول مجدداً عند canplaythrough
        });
    }
  }, [currentVerseIndex, isPlaying, getAudioUrl, onVerseChange]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (listeningStartRef.current) {
        const elapsed = Math.floor((Date.now() - listeningStartRef.current) / 1000);
        addListeningTime(elapsed, SURAH_ID);
        listeningStartRef.current = null;
      }
    } else {
      setIsPlaying(true);
    }
  };

  const handlePrev = () => setCurrentVerseIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentVerseIndex((prev) => Math.min(TOTAL_VERSES - 1, prev + 1));

  const handleReciterChange = (reciterId: string) => {
    setSelectedReciter(reciterId);
  };

  const handleSliderChange = (value: number[]) => {
    const index = Math.round((value[0] / 100) * (TOTAL_VERSES - 1));
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
    const currentVerse = allVerses[currentVerseIndex];
    const shareText = `استمع إلى سورة ${SURAH_NAME} - الآية ${currentVerse}`;
    const shareUrl = `${window.location.origin}/#verse-${currentVerse}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `سورة ${SURAH_NAME}`,
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
      removeFromFavorites(SURAH_ID);
      toast({ title: "تمت الإزالة", description: `تم إزالة سورة ${SURAH_NAME} من المفضلة` });
    } else {
      addToFavorites(SURAH_ID, SURAH_NAME);
      toast({ title: "تمت الإضافة", description: `تم إضافة سورة ${SURAH_NAME} إلى المفضلة` });
    }
  };

  const surahStats = stats.surahProgress[SURAH_ID];

  return (
    <div className="flex flex-col gap-3">
      {/* Resume Banner */}
      {hasSavedProgress && savedVerseIndex !== null && currentVerseIndex !== savedVerseIndex && (
        <div
          className="flex items-center justify-between p-3 bg-accent/50 border border-accent rounded-xl text-sm"
          dir="rtl"
        >
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-primary" />
            <span>
              توقفت عند الآية <strong className="text-primary">{allVerses[savedVerseIndex]}</strong>
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

      <div className="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-primary/20">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <ListMusic className="w-5 h-5 text-primary" />
              <h3 className="font-amiri font-bold text-lg text-primary" dir="rtl">
                تشغيل سورة {SURAH_NAME} كاملة
              </h3>
            </div>
            <select
              value={selectedReciter}
              onChange={(e) => handleReciterChange(e.target.value)}
              className="text-xs bg-background/50 border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              dir="rtl"
            >
              {RECITERS.map((reciter) => (
                <option key={reciter.id} value={reciter.id}>
                  {reciter.name}
                </option>
              ))}
            </select>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3" dir="ltr">
            <span className="text-xs text-muted-foreground w-8 text-center">{currentVerseIndex + 1}</span>
            <Slider
              value={[(currentVerseIndex / (TOTAL_VERSES - 1)) * 100]}
              max={100}
              step={100 / (TOTAL_VERSES - 1)}
              onValueChange={handleSliderChange}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-8 text-center">{TOTAL_VERSES}</span>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrev}
              disabled={currentVerseIndex === 0}
              className="h-10 w-10 p-0 rounded-full hover:bg-primary/20"
            >
              <SkipForward className="w-5 h-5 text-primary" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={togglePlay}
              disabled={isLoading}
              className="h-14 w-14 p-0 rounded-full border-primary/50 bg-primary/20 hover:bg-primary/30"
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
              disabled={currentVerseIndex === TOTAL_VERSES - 1}
              className="h-10 w-10 p-0 rounded-full hover:bg-primary/20"
            >
              <SkipBack className="w-5 h-5 text-primary" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted((v) => !v)}
              className="h-10 w-10 p-0 rounded-full hover:bg-primary/20"
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
            الآية <span className="font-bold text-primary">{allVerses[currentVerseIndex]}</span> من {TOTAL_VERSES}
          </div>

          {/* Extra Controls */}
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {/* Repeat */}
            <Button
              variant="ghost"
              size="sm"
              onClick={cycleRepeatMode}
              className={cn("h-9 px-3 rounded-full gap-1", repeatMode !== "none" && "text-primary bg-primary/10")}
              title={repeatMode === "none" ? "بدون تكرار" : repeatMode === "verse" ? "تكرار الآية" : "تكرار السورة"}
            >
              {repeatMode === "verse" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
              <span className="text-xs">
                {repeatMode === "none" ? "تكرار" : repeatMode === "verse" ? "الآية" : "السورة"}
              </span>
            </Button>

            {/* Auto Scroll */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
              <span className="text-xs text-muted-foreground">تمرير تلقائي</span>
              <Switch checked={autoScroll} onCheckedChange={setAutoScroll} className="scale-75" />
            </div>

            {/* Share */}
            <Button variant="ghost" size="sm" onClick={handleShare} className="h-9 px-3 rounded-full gap-1">
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
                  <p className="text-sm font-medium">سورة {SURAH_NAME}:</p>
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
    </div>
  );
};

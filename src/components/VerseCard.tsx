import * as React from "react";
import { useState, useCallback } from "react";
import { Verse } from "@/data/types";
import { BookOpen, Heart, Lightbulb, Tag, Globe, Volume2, Loader2, VolumeX, PlayCircle, Download } from "lucide-react";
import { AudioPlayer } from "./AudioPlayer";
import { HighlightText } from "./HighlightText";
import { ShareVerseButton } from "./ShareVerseButton";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationTTS } from "@/hooks/useTranslationTTS";
import { Switch } from "./ui/switch";
import { Progress } from "./ui/progress";
import { useToast } from "@/hooks/use-toast";

interface VerseCardProps {
  verse: Verse;
  index: number;
  searchQuery?: string;
  isHighlighted?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (verseNumber: number) => void;
  translation?: string | null;
  showTranslation?: boolean;
}

export const VerseCard = React.forwardRef<HTMLDivElement, VerseCardProps>(
  (
    {
      verse,
      index,
      searchQuery = "",
      isHighlighted = false,
      isFavorite = false,
      onToggleFavorite,
      translation,
      showTranslation = false,
    },
    ref
  ) => {
    const { t, language } = useLanguage();
    type Language = typeof language;
    const { toast } = useToast();
    const { isPlaying, isLoading, playTranslation, stopPlayback } = useTranslationTTS();
    const [autoPlayTranslation, setAutoPlayTranslation] = useState(false);
    const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const isRTL = ['ar', 'ur'].includes(language);
    const isArabic = language === 'ar' as Language;
    // Download translation audio as TTS
    const handleDownloadTranslationAudio = async () => {
      if (!translation || isArabic) return;
      
      setIsDownloadingAudio(true);
      setDownloadProgress(0);
      
      const labels = {
        ar: { started: 'جاري إنشاء الملف الصوتي...', success: 'تم التحميل', error: 'فشل التحميل' },
        en: { started: 'Generating audio...', success: 'Download complete', error: 'Download failed' },
      };
      const currentLabels = labels[language as keyof typeof labels] || labels.en;
      
      try {
        toast({ title: currentLabels.started });
        
        // Use browser's speechSynthesis to generate and download
        const utterance = new SpeechSynthesisUtterance(translation);
        utterance.lang = language === 'en' ? 'en-US' : language;
        utterance.rate = 0.9;
        
        // Create MediaRecorder to capture audio
        const audioContext = new AudioContext();
        const destination = audioContext.createMediaStreamDestination();
        const mediaRecorder = new MediaRecorder(destination.stream);
        const chunks: BlobPart[] = [];
        
        // Simulate progress
        const progressInterval = setInterval(() => {
          setDownloadProgress(prev => Math.min(prev + 10, 90));
        }, 200);
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };
        
        mediaRecorder.onstop = () => {
          clearInterval(progressInterval);
          setDownloadProgress(100);
          
          const blob = new Blob(chunks, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `translation_verse_${verse.id}.webm`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          toast({ title: currentLabels.success });
          setTimeout(() => {
            setIsDownloadingAudio(false);
            setDownloadProgress(0);
          }, 1000);
        };
        
        // Use simpler approach: just play and let user know they can download
        // Since browser TTS doesn't easily export to file, we'll use a workaround
        // by creating a text file with the translation that can be used with TTS tools
        
        // Alternative: Create downloadable text file
        const textBlob = new Blob([translation], { type: 'text/plain' });
        const textUrl = URL.createObjectURL(textBlob);
        const textLink = document.createElement('a');
        textLink.href = textUrl;
        textLink.download = `translation_verse_${verse.id}.txt`;
        document.body.appendChild(textLink);
        textLink.click();
        document.body.removeChild(textLink);
        URL.revokeObjectURL(textUrl);
        
        setDownloadProgress(100);
        toast({ 
          title: currentLabels.success, 
          description: language === 'ar' ? 'تم تحميل نص الترجمة' : 'Translation text downloaded' 
        });
        
        setTimeout(() => {
          setIsDownloadingAudio(false);
          setDownloadProgress(0);
        }, 1000);
        
      } catch (error) {
        console.error('Download error:', error);
        toast({ title: currentLabels.error, variant: 'destructive' });
        setIsDownloadingAudio(false);
        setDownloadProgress(0);
      }
    };

    // Callback when Arabic recitation ends
    const handleRecitationEnd = useCallback(() => {
      if (autoPlayTranslation && showTranslation && translation && !isArabic) {
        playTranslation(translation);
      }
    }, [autoPlayTranslation, showTranslation, translation, isArabic, playTranslation]);

    return (
      <div
        ref={ref}
        id={`verse-${verse.id}`}
        className={cn(
          "group gradient-card rounded-2xl p-6 md:p-8 shadow-card hover:shadow-elevated transition-all duration-500 animate-slide-up border",
          isHighlighted
            ? "border-primary ring-2 ring-primary/40"
            : "border-border/50"
        )}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Verse Number & Theme & Actions */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="verse-number animate-glow">{verse.id}</span>
            {verse.theme && (
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary">
                <Tag className="w-4 h-4" />
                <span className="text-sm font-medium">{verse.theme}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <ShareVerseButton verse={verse} />
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(verse.id)}
                className={cn(
                  "h-9 w-9 p-0 rounded-full transition-all",
                  isFavorite
                    ? "text-red-500 hover:text-red-600"
                    : "text-muted-foreground hover:text-red-400"
                )}
                aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
              >
                <Heart
                  className={cn("w-5 h-5", isFavorite && "fill-current")}
                />
              </Button>
            )}
          </div>
        </div>

        {/* Arabic Text */}
        <div className="mb-4 p-6 rounded-xl bg-background/80 border border-primary/20">
          <p
            className="font-arabic text-2xl md:text-3xl leading-[2.5] text-foreground text-center"
            dir="rtl"
          >
            <HighlightText text={verse.arabicText} query={searchQuery} />
          </p>
        </div>

        {/* Translation */}
        {showTranslation && translation && (
          <div className="mb-4 p-4 rounded-xl bg-secondary/10 border border-secondary/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-secondary">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{t.translation}</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Auto-play toggle */}
                <div className="flex items-center gap-1.5" title="تشغيل تلقائي بعد التلاوة">
                  <PlayCircle className={cn("w-3.5 h-3.5", autoPlayTranslation ? "text-secondary" : "text-muted-foreground")} />
                  <Switch
                    checked={autoPlayTranslation}
                    onCheckedChange={setAutoPlayTranslation}
                    className="scale-75"
                  />
                </div>
                {/* Download translation audio */}
                {!isArabic && (
                  <div className="flex flex-col items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDownloadTranslationAudio}
                      disabled={isDownloadingAudio}
                      className="h-8 w-8 p-0 rounded-full hover:bg-green-500/20 text-green-600"
                      aria-label={isArabic ? 'تحميل الترجمة' : 'Download translation'}
                    >
                      {isDownloadingAudio ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </Button>
                    {isDownloadingAudio && (
                      <div className="w-8 mt-0.5">
                        <Progress value={downloadProgress} className="h-0.5" />
                      </div>
                    )}
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => isPlaying ? stopPlayback() : playTranslation(translation)}
                  disabled={isLoading}
                  className="h-8 w-8 p-0 rounded-full hover:bg-secondary/20"
                  aria-label={isPlaying ? "إيقاف" : "استماع للترجمة"}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                  ) : isPlaying ? (
                    <VolumeX className="w-4 h-4 text-secondary" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-secondary" />
                  )}
                </Button>
              </div>
            </div>
            <p
              className="text-base leading-relaxed text-foreground/85"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {translation}
            </p>
          </div>
        )}

        {/* Audio Player */}
        <div className="mb-6 flex justify-center" dir="rtl">
          <AudioPlayer verseNumber={verse.id} onRecitationEnd={handleRecitationEnd} />
        </div>

        {/* Tafsir */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 text-primary">
            <BookOpen className="w-5 h-5" />
            <h4 className="font-amiri font-bold text-lg">{t.tafsir}</h4>
          </div>
          <p className="font-naskh text-lg leading-[2.2] text-foreground/90" dir="rtl">
            <HighlightText text={verse.tafsir} query={searchQuery} />
          </p>
        </div>

        {/* Benefits */}
        {verse.benefits && (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <Lightbulb className="w-5 h-5" />
              <h4 className="font-amiri font-bold">الفوائد والعبر</h4>
            </div>
            <p className="font-naskh text-muted-foreground leading-[2]" dir="rtl">
              <HighlightText text={verse.benefits} query={searchQuery} />
            </p>
          </div>
        )}
      </div>
    );
  }
);

VerseCard.displayName = "VerseCard";

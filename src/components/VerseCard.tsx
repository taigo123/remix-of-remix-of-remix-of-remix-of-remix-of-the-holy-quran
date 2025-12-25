import * as React from "react";
import { Verse } from "@/data/types";
import { BookOpen, Heart, Lightbulb, Tag, Globe } from "lucide-react";
import { AudioPlayer } from "./AudioPlayer";
import { HighlightText } from "./HighlightText";
import { ShareVerseButton } from "./ShareVerseButton";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
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
    const isRTL = ['ar', 'ur'].includes(language);
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
            <div className="flex items-center gap-2 mb-2 text-secondary">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{t.translation}</span>
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
          <AudioPlayer verseNumber={verse.id} />
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


import { getSurahData } from "@/data/surahsData";
import { BookOpen, MapPin, ScrollText, Star } from "lucide-react";
import { FullSurahPlayer } from "./FullSurahPlayer";

interface HeroSectionProps {
  onVerseChange?: (verseNumber: number) => void;
  currentHighlightedVerse?: number | null;
}

export const HeroSection = ({
  onVerseChange,
  currentHighlightedVerse,
}: HeroSectionProps) => {
  const surahInfo = getSurahData(36);
  
  if (!surahInfo) return null;
  
  const virtuesArray = surahInfo.virtues ? surahInfo.virtues.split(' | ') : [];
  
  return (
    <header className="relative gradient-hero text-primary-foreground overflow-hidden">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 islamic-pattern opacity-30" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />

      <div className="container relative z-10 py-16 md:py-24">
        {/* Main Title */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full gradient-gold flex items-center justify-center shadow-gold animate-glow">
              <span className="font-arabic text-4xl md:text-5xl text-primary-foreground font-bold">
                يس
              </span>
            </div>
          </div>

          <h1 className="font-arabic text-4xl md:text-6xl font-bold mb-4" dir="rtl">
            تفسير سورة ياسين
          </h1>

          <p
            className="font-amiri text-xl md:text-2xl text-primary-foreground/80 max-w-2xl mx-auto mb-6"
            dir="rtl"
          >
            قلب القرآن الكريم - تفسير مفصل آية بآية
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center border border-primary-foreground/20">
            <ScrollText className="w-6 h-6 mx-auto mb-2 text-primary" />
            <span className="block font-bold text-2xl">
              {surahInfo.versesCount}
            </span>
            <span className="text-sm text-primary-foreground/70" dir="rtl">
              آية
            </span>
          </div>
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center border border-primary-foreground/20">
            <MapPin className="w-6 h-6 mx-auto mb-2 text-primary" />
            <span className="block font-bold text-lg" dir="rtl">
              {surahInfo.revelationType}
            </span>
            <span className="text-sm text-primary-foreground/70" dir="rtl">
              مكان النزول
            </span>
          </div>
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center border border-primary-foreground/20">
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
            <span className="block font-bold text-2xl">{surahInfo.order}</span>
            <span className="text-sm text-primary-foreground/70" dir="rtl">
              ترتيب السورة
            </span>
          </div>
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center border border-primary-foreground/20">
            <Star className="w-6 h-6 mx-auto mb-2 text-primary" />
            <span className="block font-bold text-lg" dir="rtl">
              قلب القرآن
            </span>
            <span className="text-sm text-primary-foreground/70" dir="rtl">
              لقبها
            </span>
          </div>
        </div>

        {/* Full Surah Player */}
        {onVerseChange && (
          <div className="max-w-2xl mx-auto mb-12">
            <FullSurahPlayer
              onVerseChange={onVerseChange}
              currentHighlightedVerse={currentHighlightedVerse ?? null}
            />
          </div>
        )}

        {/* Introduction */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-primary-foreground/20">
            <h2 className="font-amiri font-bold text-xl mb-4 text-primary" dir="rtl">
              مقدمة السورة
            </h2>
            <p
              className="font-naskh text-lg leading-[2.2] text-primary-foreground"
              dir="rtl"
            >
              {surahInfo.description}
            </p>

            <div className="mt-6 pt-6 border-t border-primary-foreground/20">
              <h3 className="font-amiri font-bold text-lg mb-4 text-primary" dir="rtl">
                فضائل السورة
              </h3>
              <ul className="space-y-3" dir="rtl">
                {virtuesArray.map((virtue, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 font-naskh text-primary-foreground"
                  >
                    <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span>{virtue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};


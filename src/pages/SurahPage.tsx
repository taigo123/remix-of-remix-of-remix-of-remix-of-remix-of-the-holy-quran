import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Book, BookOpen, Home, ChevronRight, ChevronLeft, Music, Settings2, Columns2, Sparkles } from 'lucide-react';
import { getSurahData, isDataAvailable } from '@/data/surahsData';
import { getSurahById } from '@/data/surahIndex';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SurahAudioPlayer } from '@/components/SurahAudioPlayer';
import { FullSurahAudioPlayer } from '@/components/FullSurahAudioPlayer';
import { useState } from 'react';
import { useQuranSettings } from '@/hooks/useQuranSettings';
import { QuranSettingsPanel } from '@/components/QuranSettingsPanel';
import { QuickSettingsBar } from '@/components/QuickSettingsBar';
import { TafsirSourceSelector } from '@/components/TafsirSourceSelector';
import { TafsirComparisonPanel } from '@/components/TafsirComparisonPanel';
import { useTafsir } from '@/hooks/useTafsir';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const SurahPage = () => {
  const { id } = useParams<{ id: string }>();
  const surahId = parseInt(id || '1');
  const surah = getSurahData(surahId);
  const surahInfo = getSurahById(surahId);
  const [showAudioNotice, setShowAudioNotice] = useState(true);
  const [currentPlayingVerse, setCurrentPlayingVerse] = useState<number | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const { settings, isLoaded } = useQuranSettings();
  
  const {
    selectedSource,
    setSelectedSource,
    getTafsir,
    isLoading: isTafsirLoading,
    error: tafsirError,
    availableSources,
  } = useTafsir({ surahNumber: surahId, versesCount: surah?.versesCount || 7 });

  // تطبيق إعدادات حجم الخط
  const arabicFontClasses = {
    small: 'text-xl md:text-2xl',
    medium: 'text-2xl md:text-3xl',
    large: 'text-3xl md:text-4xl',
    xlarge: 'text-4xl md:text-5xl',
  };

  // تطبيق إعدادات المسافة بين السطور
  const lineSpacingStyles = {
    tight: 'leading-relaxed',
    normal: 'leading-loose',
    relaxed: 'leading-[2.5]',
    loose: 'leading-[3]',
  };

  // تطبيق إعدادات السطوع
  const brightnessStyles = {
    dim: { filter: 'brightness(0.75)' },
    normal: { filter: 'brightness(1)' },
    bright: { filter: 'brightness(1.1)' },
  };

  if (!surah || !surahInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center p-8">
          <Book className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">السورة غير متوفرة حالياً</h1>
          <p className="text-muted-foreground mb-6">سيتم إضافة سورة {surahInfo?.name || ''} قريباً إن شاء الله</p>
          <div className="flex gap-3 justify-center">
            <Link to="/quran">
              <Button>
                <BookOpen className="w-4 h-4 ml-2" />
                فهرس القرآن
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline">
                <Home className="w-4 h-4 ml-2" />
                الرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const prevSurah = surahId > 1 ? getSurahById(surahId - 1) : null;
  const nextSurah = surahId < 114 ? getSurahById(surahId + 1) : null;

  return (
    <div 
      className="min-h-screen bg-background transition-all duration-500" 
      style={isLoaded ? brightnessStyles[settings.brightness] : undefined}
      dir="rtl"
    >
      {/* خلفية */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="diamond-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M10 0L20 10L10 20L0 10Z" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-primary" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diamond-pattern)" />
        </svg>
      </div>

      {/* هيدر */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-primary" />
        
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* التنقل */}
            <div className="flex items-center gap-2">
              <Link to="/quran">
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                  <ArrowRight className="w-4 h-4" />
                  <span className="hidden sm:inline">الفهرس</span>
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" size="sm" className="w-9 h-9 p-0 text-muted-foreground hover:text-foreground">
                  <Home className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* اسم السورة */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
                <span className="text-sm font-bold text-primary-foreground">{surah.id}</span>
              </div>
              <div className="text-center">
                <h1 className="text-lg font-bold font-amiri text-foreground">سورة {surah.name}</h1>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{surah.versesCount} آية</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                  <span>{surah.revelationType}</span>
                </div>
              </div>
            </div>

            {/* الإعدادات السريعة + الإعدادات الكاملة */}
            <div className="flex items-center gap-2">
              <QuickSettingsBar />
              <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                    <Settings2 className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[340px] overflow-y-auto" dir="rtl">
                  <SheetHeader>
                    <SheetTitle className="text-right font-amiri flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
                        <Settings2 className="w-4 h-4 text-primary-foreground" />
                      </div>
                      إعدادات العرض
                    </SheetTitle>
                  </SheetHeader>
                  <QuranSettingsPanel className="mt-6" />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 relative z-10">
        {/* إشعار القراءة الصوتية */}
        {showAudioNotice && (
          <div className="mb-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Music className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                استمع لتلاوة كل آية بصوت 6 قراء مختلفين
              </p>
            </div>
            <button 
              onClick={() => setShowAudioNotice(false)}
              className="text-muted-foreground hover:text-foreground text-sm px-3 py-1 rounded-lg hover:bg-muted/50 transition-colors shrink-0"
            >
              إخفاء
            </button>
          </div>
        )}

        {/* مشغل السورة الكاملة */}
        <div className="mb-6">
          <FullSurahAudioPlayer 
            surah={surah} 
            onVerseChange={(verseNum) => setCurrentPlayingVerse(verseNum)}
          />
        </div>

        {/* نبذة عن السورة */}
        {surah.description && (
          <div className="mb-6 p-5 bg-primary/5 border border-primary/10 rounded-2xl">
            <h2 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              نبذة عن السورة
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{surah.description}</p>
            {surah.virtues && (
              <p className="mt-3 text-sm text-primary bg-primary/5 p-3 rounded-xl">{surah.virtues}</p>
            )}
          </div>
        )}

        {/* اختيار التفسير */}
        <div className="mb-6 p-5 bg-card rounded-2xl border border-border/50 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <TafsirSourceSelector
              selectedSource={selectedSource}
              onSourceChange={setSelectedSource}
              availableSources={availableSources}
              isLoading={isTafsirLoading}
            />
            <Button 
              variant="outline" 
              onClick={() => setIsComparisonOpen(true)}
              className="gap-2 rounded-xl"
            >
              <Columns2 className="w-4 h-4" />
              مقارنة تفسيرين
            </Button>
          </div>
          {tafsirError && (
            <p className="mt-3 text-sm text-destructive bg-destructive/10 p-3 rounded-xl">{tafsirError}</p>
          )}
        </div>

        {/* لوحة مقارنة التفاسير */}
        <TafsirComparisonPanel
          surahNumber={surahId}
          surahName={surah.name}
          versesCount={surah.versesCount}
          verses={surah.verses}
          isOpen={isComparisonOpen}
          onClose={() => setIsComparisonOpen(false)}
        />

        {/* الآيات */}
        <div className="space-y-4">
          {surah.verses.map((verse) => (
            <div 
              key={verse.id} 
              id={`verse-${verse.id}`} 
              className={cn(
                'bg-card rounded-2xl border border-border/50 overflow-hidden transition-all duration-300',
                currentPlayingVerse === verse.id && 'ring-2 ring-primary border-primary/30 shadow-lg',
                settings.enableAnimations && 'animate-fade-in'
              )}
            >
              {/* رقم الآية والموضوع */}
              <div className="p-4 border-b border-border/30 bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
                    <span className="text-sm font-bold text-primary-foreground">{verse.id}</span>
                  </div>
                  {verse.theme && (
                    <Badge variant="outline" className="text-xs border-primary/20 text-primary bg-primary/5">
                      {verse.theme}
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* النص القرآني */}
              <div className="p-6">
                <p className={cn(
                  'font-arabic text-foreground text-right transition-all duration-300 mb-6',
                  arabicFontClasses[settings.fontSize],
                  lineSpacingStyles[settings.lineSpacing]
                )}>
                  {verse.arabicText}
                </p>
                
                {/* مشغل الصوت */}
                {settings.showAudioIcon && (
                  <div className="p-4 bg-muted/30 rounded-xl mb-6">
                    <SurahAudioPlayer 
                      surahId={surahId} 
                      verseNumber={verse.id} 
                      surahName={surah.name}
                    />
                  </div>
                )}

                {/* التفسير */}
                <div className="p-4 bg-secondary/5 rounded-xl border border-secondary/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-secondary flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      التفسير
                    </h4>
                    {selectedSource !== 'local' && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                        {availableSources.find(s => s.id === selectedSource)?.name}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {getTafsir(verse.id, verse.tafsir)}
                  </p>
                </div>

                {/* الفوائد */}
                {verse.benefits && (
                  <div className="mt-4 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                    <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      الفوائد
                    </h4>
                    <p className="text-sm text-muted-foreground">{verse.benefits}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* التنقل بين السور */}
        <div className="flex justify-between mt-10 gap-4">
          {prevSurah && isDataAvailable(prevSurah.id) ? (
            <Link to={`/surah/${prevSurah.id}`}>
              <Button variant="outline" className="gap-2 rounded-xl">
                <ChevronRight className="w-5 h-5" />
                سورة {prevSurah.name}
              </Button>
            </Link>
          ) : <div />}
          {nextSurah && isDataAvailable(nextSurah.id) ? (
            <Link to={`/surah/${nextSurah.id}`}>
              <Button variant="outline" className="gap-2 rounded-xl">
                سورة {nextSurah.name}
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
          ) : <div />}
        </div>
      </main>

      {/* الفوتر */}
      <footer className="bg-muted/30 border-t border-border/50 py-6 px-4 mt-8">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-amiri text-foreground">المصحف الإلكتروني</span>
          </div>
          <p className="text-xs text-muted-foreground">
            التفاسير الموثوقة: ابن كثير | الطبري | السعدي | التفسير الميسر | الجلالين
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SurahPage;
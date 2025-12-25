import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Book, BookOpen, Home, ChevronRight, ChevronLeft, Music, Settings2, Columns2 } from 'lucide-react';
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
  
  // إعدادات التفسير
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
    small: 'text-lg md:text-xl',
    medium: 'text-xl md:text-2xl',
    large: 'text-2xl md:text-3xl',
    xlarge: 'text-3xl md:text-4xl',
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
      {/* هيدر رفيع وأنيق */}
      <header className="bg-gradient-to-l from-primary/95 to-primary py-2 px-4 text-primary-foreground sticky top-0 z-20 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            {/* التنقل */}
            <div className="flex items-center gap-2">
              <Link
                to="/quran"
                className="flex items-center gap-1 text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
              >
                <ArrowRight className="w-4 h-4" />
                <span className="hidden sm:inline">الفهرس</span>
              </Link>
              <span className="text-primary-foreground/30">|</span>
              <Link
                to="/"
                className="flex items-center gap-1 text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
              >
                <Home className="w-4 h-4" />
              </Link>
            </div>

            {/* اسم السورة */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center text-sm font-bold">
                {surah.id}
              </div>
              <div className="text-center">
                <h1 className="text-lg font-bold leading-tight">سورة {surah.name}</h1>
                <div className="flex items-center gap-2 text-[10px] text-primary-foreground/80">
                  <span>{surah.versesCount} آية</span>
                  <span className="w-1 h-1 rounded-full bg-primary-foreground/50" />
                  <span>{surah.revelationType}</span>
                </div>
              </div>
            </div>

            {/* زر الإعدادات */}
            <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Settings2 className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto" dir="rtl">
                <SheetHeader>
                  <SheetTitle className="text-right font-amiri flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    إعدادات العرض
                  </SheetTitle>
                </SheetHeader>
                <QuranSettingsPanel className="mt-4" />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        {/* إشعار القراءة الصوتية */}
        {showAudioNotice && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Music className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">
                استمع لتلاوة كل آية بصوت 6 قراء مختلفين - اضغط على زر التشغيل أسفل كل آية
              </span>
            </div>
            <button 
              onClick={() => setShowAudioNotice(false)}
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              إخفاء
            </button>
          </div>
        )}

        {/* Full Surah Player */}
        <div className="mb-6">
          <FullSurahAudioPlayer 
            surah={surah} 
            onVerseChange={(verseNum) => setCurrentPlayingVerse(verseNum)}
          />
        </div>

        {surah.description && (
          <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
            <h2 className="font-bold mb-2">نبذة عن السورة</h2>
            <p className="text-muted-foreground">{surah.description}</p>
            {surah.virtues && (
              <p className="mt-2 text-sm text-primary">{surah.virtues}</p>
            )}
          </Card>
        )}

        {/* اختيار مصدر التفسير */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <TafsirSourceSelector
              selectedSource={selectedSource}
              onSourceChange={setSelectedSource}
              availableSources={availableSources}
              isLoading={isTafsirLoading}
            />
            <Button 
              variant="outline" 
              onClick={() => setIsComparisonOpen(true)}
              className="gap-2"
            >
              <Columns2 className="w-4 h-4" />
              مقارنة تفسيرين
            </Button>
          </div>
          {tafsirError && (
            <p className="mt-2 text-sm text-destructive">{tafsirError}</p>
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

        <div className="space-y-4">
          {surah.verses.map((verse) => (
            <Card 
              key={verse.id} 
              id={`verse-${verse.id}`} 
              className={cn(
                'p-4 transition-all duration-300',
                currentPlayingVerse === verse.id && 'ring-2 ring-primary bg-primary/5',
                settings.enableAnimations && 'animate-fade-in'
              )}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  {verse.id}
                </span>
                {verse.theme && (
                  <Badge variant="outline" className="text-xs">{verse.theme}</Badge>
                )}
              </div>
              
              {/* النص القرآني مع تطبيق الإعدادات */}
              <p className={cn(
                'font-arabic text-foreground mb-4 text-right transition-all duration-300',
                arabicFontClasses[settings.fontSize],
                lineSpacingStyles[settings.lineSpacing]
              )}>
                {verse.arabicText}
              </p>
              
              {/* Audio Player */}
              {settings.showAudioIcon && (
                <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                  <SurahAudioPlayer 
                    surahId={surahId} 
                    verseNumber={verse.id} 
                    surahName={surah.name}
                  />
                </div>
              )}

              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-primary">التفسير:</h4>
                  {selectedSource !== 'local' && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {availableSources.find(s => s.id === selectedSource)?.name}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {getTafsir(verse.id, verse.tafsir)}
                </p>
              </div>
              {verse.benefits && (
                <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <h4 className="text-sm font-bold text-primary mb-1">الفوائد:</h4>
                  <p className="text-sm text-muted-foreground">{verse.benefits}</p>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="flex justify-between mt-8 gap-4">
          {prevSurah && isDataAvailable(prevSurah.id) ? (
            <Link to={`/surah/${prevSurah.id}`}>
              <Button variant="outline" className="gap-2">
                <ChevronRight className="w-4 h-4" />
                سورة {prevSurah.name}
              </Button>
            </Link>
          ) : <div />}
          {nextSurah && isDataAvailable(nextSurah.id) ? (
            <Link to={`/surah/${nextSurah.id}`}>
              <Button variant="outline" className="gap-2">
                سورة {nextSurah.name}
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </Link>
          ) : <div />}
        </div>
      </main>

      <footer className="bg-muted/50 border-t py-6 px-4 mt-8">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>التفاسير الموثوقة: ابن كثير | الطبري | السعدي | التفسير الميسر | الجلالين</p>
          <p className="mt-1 text-xs">مصدر البيانات: quran.com | alquran.cloud</p>
        </div>
      </footer>
    </div>
  );
};

export default SurahPage;

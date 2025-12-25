import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Book, BookOpen, Home, ChevronRight, ChevronLeft, Music, Columns2, Sparkles, Eye, EyeOff, Globe, Volume2, VolumeX, Loader2, PlayCircle, SkipForward, Square } from 'lucide-react';
import { getSurahData, isDataAvailable } from '@/data/surahsData';
import { getSurahById } from '@/data/surahIndex';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SurahAudioPlayer } from '@/components/SurahAudioPlayer';
import { FullSurahAudioPlayer } from '@/components/FullSurahAudioPlayer';
import { useState, useRef, useCallback, useEffect } from 'react';
import { TafsirSourceSelector } from '@/components/TafsirSourceSelector';
import { TafsirComparisonPanel } from '@/components/TafsirComparisonPanel';
import { useTafsir } from '@/hooks/useTafsir';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVerseTranslation } from '@/hooks/useVerseTranslation';
import { useTranslationTTS } from '@/hooks/useTranslationTTS';
import { Switch } from '@/components/ui/switch';

const SurahPage = () => {
  const { id } = useParams<{ id: string }>();
  const surahId = parseInt(id || '1');
  const surah = getSurahData(surahId);
  const surahInfo = getSurahById(surahId);
  const [showAudioNotice, setShowAudioNotice] = useState(true);
  const [currentPlayingVerse, setCurrentPlayingVerse] = useState<number | null>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [showTafsir, setShowTafsir] = useState(true);
  const { t, isRtl, dir, language } = useLanguage();
  
  // Verse translations
  const { getTranslation, showTranslation, isLoading: isTranslationLoading } = useVerseTranslation(surahId);
  
  // Translation TTS
  const { 
    isPlaying: isTTSPlaying, 
    isLoading: isTTSLoading, 
    playTranslation, 
    stopPlayback
  } = useTranslationTTS();
  const [currentTTSVerse, setCurrentTTSVerse] = useState<number | null>(null);
  const [showTTSWarning, setShowTTSWarning] = useState(true);
  const [autoPlayTranslation, setAutoPlayTranslation] = useState(false);
  
  // Auto-play chain state
  const [isAutoPlayChainActive, setIsAutoPlayChainActive] = useState(false);
  const [autoPlayStartVerse, setAutoPlayStartVerse] = useState<number | null>(null);
  const audioPlayerRefs = useRef<{ [key: number]: { play: () => void; pause: () => void } }>({});
  const autoPlayChainRef = useRef(false);
  
  const {
    selectedSource,
    setSelectedSource,
    getTafsir,
    isLoading: isTafsirLoading,
    error: tafsirError,
    availableSources,
  } = useTafsir({ surahNumber: surahId, versesCount: surah?.versesCount || 7 });

  // Keep ref in sync
  useEffect(() => {
    autoPlayChainRef.current = isAutoPlayChainActive;
  }, [isAutoPlayChainActive]);

  // Function to play the next verse in chain
  const playNextVerseInChain = useCallback((currentVerseId: number) => {
    if (!autoPlayChainRef.current || !surah) return;
    
    const nextVerseId = currentVerseId + 1;
    if (nextVerseId <= surah.versesCount) {
      console.log('Playing next verse in chain:', nextVerseId);
      // Scroll to next verse
      const nextVerseElement = document.getElementById(`verse-${nextVerseId}`);
      if (nextVerseElement) {
        nextVerseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // Trigger play on the next verse's audio player
      setTimeout(() => {
        const nextPlayer = audioPlayerRefs.current[nextVerseId];
        if (nextPlayer) {
          nextPlayer.play();
        }
      }, 500);
    } else {
      // End of surah
      console.log('End of surah, stopping auto-play chain');
      setIsAutoPlayChainActive(false);
      setAutoPlayStartVerse(null);
    }
  }, [surah]);

  // Start auto-play chain from a specific verse
  const startAutoPlayChain = useCallback((startVerseId: number) => {
    console.log('Starting auto-play chain from verse:', startVerseId);
    setIsAutoPlayChainActive(true);
    setAutoPlayStartVerse(startVerseId);
    autoPlayChainRef.current = true;
    
    // Scroll to the verse
    const verseElement = document.getElementById(`verse-${startVerseId}`);
    if (verseElement) {
      verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Start playing
    setTimeout(() => {
      const player = audioPlayerRefs.current[startVerseId];
      if (player) {
        player.play();
      }
    }, 300);
  }, []);

  // Stop auto-play chain
  const stopAutoPlayChain = useCallback(() => {
    console.log('Stopping auto-play chain');
    setIsAutoPlayChainActive(false);
    setAutoPlayStartVerse(null);
    autoPlayChainRef.current = false;
    stopPlayback();
  }, [stopPlayback]);
  
  // Handle TTS play for a specific verse
  const handlePlayTranslation = async (verseId: number, text: string) => {
    if (currentTTSVerse === verseId && isTTSPlaying) {
      stopPlayback();
      setCurrentTTSVerse(null);
    } else {
      setCurrentTTSVerse(verseId);
      await playTranslation(text);
      setCurrentTTSVerse(null);
    }
  };


  if (!surah || !surahInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir={dir}>
        <div className="text-center p-8">
          <Book className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">{isRtl ? 'السورة غير متوفرة حالياً' : 'Surah not available'}</h1>
          <p className="text-muted-foreground mb-6">{isRtl ? `سيتم إضافة سورة ${surahInfo?.name || ''} قريباً إن شاء الله` : `Surah ${surahInfo?.name || ''} will be added soon`}</p>
          <div className="flex gap-3 justify-center">
            <Link to="/quran">
              <Button>
                <BookOpen className={cn("w-4 h-4", isRtl ? "ml-2" : "mr-2")} />
                {t.surahIndex}
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline">
                <Home className={cn("w-4 h-4", isRtl ? "ml-2" : "mr-2")} />
                {t.home}
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
      className="min-h-screen bg-background" 
      dir={dir}
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
                  {isRtl ? <ArrowRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  <span className="hidden sm:inline">{t.index}</span>
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
                <h1 className="text-lg font-bold font-amiri text-foreground">{t.surah} {surah.name}</h1>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{surah.versesCount} {t.verse}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                  <span>{surah.revelationType === 'مكية' ? t.meccan : t.medinan}</span>
                </div>
              </div>
            </div>

            {/* زر إظهار/إخفاء التفسير */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowTafsir(!showTafsir)}
              className={cn(
                "gap-1.5 text-sm",
                showTafsir ? "text-primary" : "text-muted-foreground"
              )}
            >
              {showTafsir ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.hideTafsir}</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.showTafsir}</span>
                </>
              )}
            </Button>
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
                {t.listenToRecitation}
              </p>
            </div>
            <button 
              onClick={() => setShowAudioNotice(false)}
              className="text-muted-foreground hover:text-foreground text-sm px-3 py-1 rounded-lg hover:bg-muted/50 transition-colors shrink-0"
            >
              {isRtl ? 'إخفاء' : 'Hide'}
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
              {t.aboutSurah}
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
              {t.compareTafsirs}
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
                currentPlayingVerse === verse.id && 'ring-2 ring-primary border-primary/30 shadow-lg'
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
                <p className="font-arabic text-foreground text-right text-2xl md:text-3xl leading-loose mb-4" dir="rtl">
                  {verse.arabicText}
                </p>
                
                {/* Translation */}
                {showTranslation && (
                  <div className="mb-6 p-4 bg-secondary/10 border border-secondary/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-secondary">
                        <Globe className="w-4 h-4" />
                        <span className="text-sm font-medium">{t.translation}</span>
                        {isTranslationLoading && (
                          <span className="text-xs text-muted-foreground animate-pulse">{isRtl ? 'جاري التحميل...' : 'Loading...'}</span>
                        )}
                      </div>
                      {getTranslation(verse.id) && language !== 'ar' && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* TTS Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePlayTranslation(verse.id, getTranslation(verse.id) || '')}
                            disabled={isTTSLoading && currentTTSVerse === verse.id}
                            className="h-8 w-8 p-0 rounded-full hover:bg-secondary/20"
                            aria-label={currentTTSVerse === verse.id && isTTSPlaying ? "إيقاف" : "استماع للترجمة"}
                          >
                            {isTTSLoading && currentTTSVerse === verse.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                            ) : currentTTSVerse === verse.id && isTTSPlaying ? (
                              <VolumeX className="w-4 h-4 text-secondary" />
                            ) : (
                              <Volume2 className="w-4 h-4 text-secondary" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {/* TTS Warning */}
                    {showTTSWarning && language !== 'ar' && (
                      <div className="mb-3 p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start justify-between gap-2">
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                          ⚠️ {t.ttsWarning}
                        </p>
                        <button 
                          onClick={() => setShowTTSWarning(false)}
                          className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 text-xs shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    
                    <p
                      className="text-base leading-relaxed text-foreground/85"
                      dir={isRtl ? 'rtl' : 'ltr'}
                    >
                      {getTranslation(verse.id) || (isTranslationLoading ? '...' : '')}
                    </p>
                  </div>
                )}
                
                {/* مشغل الصوت */}
                <div className="p-4 bg-muted/30 rounded-xl mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <SurahAudioPlayer 
                      surahId={surahId} 
                      verseNumber={verse.id} 
                      surahName={surah.name}
                      ref={(playerRef) => {
                        if (playerRef) {
                          audioPlayerRefs.current[verse.id] = playerRef;
                        }
                      }}
                      onPlaybackComplete={() => {
                        console.log('Verse playback complete, autoPlay:', autoPlayTranslation, 'language:', language, 'chainActive:', isAutoPlayChainActive);
                        
                        // If auto-play translation is enabled
                        if ((autoPlayTranslation || isAutoPlayChainActive) && language !== 'ar') {
                          const translationText = getTranslation(verse.id);
                          console.log('Translation text:', translationText?.substring(0, 50));
                          if (translationText) {
                            setCurrentTTSVerse(verse.id);
                            playTranslation(translationText, () => {
                              setCurrentTTSVerse(null);
                              // If chain is active, play next verse
                              if (autoPlayChainRef.current) {
                                playNextVerseInChain(verse.id);
                              }
                            });
                          } else if (autoPlayChainRef.current) {
                            // No translation, just move to next verse
                            playNextVerseInChain(verse.id);
                          }
                        } else if (isAutoPlayChainActive && language === 'ar') {
                          // Arabic mode: just play next verse without TTS
                          playNextVerseInChain(verse.id);
                        }
                      }}
                    />
                  </div>
                  
                  {/* Auto-play controls */}
                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-border/30">
                    {/* Start/Stop chain play button */}
                    <Button
                      variant={isAutoPlayChainActive && autoPlayStartVerse === verse.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (isAutoPlayChainActive) {
                          stopAutoPlayChain();
                        } else {
                          startAutoPlayChain(verse.id);
                        }
                      }}
                      className={cn(
                        "h-7 gap-1.5 text-xs rounded-full",
                        isAutoPlayChainActive && "bg-primary text-primary-foreground"
                      )}
                    >
                      {isAutoPlayChainActive ? (
                        <>
                          <Square className="w-3 h-3" />
                          {isRtl ? 'إيقاف' : 'Stop'}
                        </>
                      ) : (
                        <>
                          <SkipForward className="w-3 h-3" />
                          {isRtl ? 'تشغيل متتابع' : 'Auto-play'}
                        </>
                      )}
                    </Button>
                    
                    {/* Auto-play translation toggle */}
                    {language !== 'ar' && getTranslation(verse.id) && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {isRtl ? 'مع الترجمة' : 'With translation'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <PlayCircle className={cn("w-3.5 h-3.5", autoPlayTranslation ? "text-primary" : "text-muted-foreground")} />
                          <Switch
                            checked={autoPlayTranslation}
                            onCheckedChange={setAutoPlayTranslation}
                            className="scale-75"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* التفسير */}
                {showTafsir && (
                  <div className="p-4 bg-secondary/5 rounded-xl border border-secondary/10">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-secondary flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {t.tafsir}
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
                )}

                {/* الفوائد */}
                {verse.benefits && (
                  <div className="mt-4 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                    <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {t.benefits}
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
                {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                {t.surah} {prevSurah.name}
              </Button>
            </Link>
          ) : <div />}
          {nextSurah && isDataAvailable(nextSurah.id) ? (
            <Link to={`/surah/${nextSurah.id}`}>
              <Button variant="outline" className="gap-2 rounded-xl">
                {t.surah} {nextSurah.name}
                {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
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
            <span className="font-amiri text-foreground">{t.electronicMushaf}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {t.trustedTafsirsList}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SurahPage;

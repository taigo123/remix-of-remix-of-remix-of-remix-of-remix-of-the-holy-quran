import { 
  BookOpen, 
  Home, 
  Moon, 
  Sun, 
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Grid3X3,
  Headphones,
  ChevronDown,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { surahIndex } from '@/data/surahIndex';
import { isDataAvailable } from '@/data/surahsData';
import { Button } from '@/components/ui/button';
import { QuranSearch } from '@/components/QuranSearch';
import { useTheme } from 'next-themes';
import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

type CardStyle = 'grid' | 'list' | 'compact';
type ViewMode = 'all' | 'juz';

const QuranIndex = () => {
  const { theme, setTheme } = useTheme();
  const { t, isRtl, dir } = useLanguage();
  const [cardStyle, setCardStyle] = useState<CardStyle>(() => {
    const saved = localStorage.getItem('quran-card-style');
    return (saved as CardStyle) || 'grid';
  });
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('quran-view-mode');
    return (saved as ViewMode) || 'all';
  });
  const [expandedJuz, setExpandedJuz] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('quran-card-style', cardStyle);
  }, [cardStyle]);

  useEffect(() => {
    localStorage.setItem('quran-view-mode', viewMode);
  }, [viewMode]);

  // أسماء الأجزاء الثلاثين
  const juzNames: Record<number, string> = {
    1: 'الم', 2: 'سيقول', 3: 'تلك الرسل', 4: 'لن تنالوا', 5: 'والمحصنات',
    6: 'لا يحب الله', 7: 'وإذا سمعوا', 8: 'ولو أننا', 9: 'قال الملأ', 10: 'واعلموا',
    11: 'يعتذرون', 12: 'وما من دابة', 13: 'وما أبرئ', 14: 'ربما', 15: 'سبحان الذي',
    16: 'قال ألم', 17: 'اقترب للناس', 18: 'قد أفلح', 19: 'وقال الذين', 20: 'أمن خلق',
    21: 'اتل ما أوحي', 22: 'ومن يقنت', 23: 'وما لي', 24: 'فمن أظلم', 25: 'إليه يرد',
    26: 'حم', 27: 'قال فما خطبكم', 28: 'قد سمع الله', 29: 'تبارك الذي', 30: 'عم'
  };

  // تنظيم السور حسب الأجزاء الـ 30
  const surahsByJuz = useMemo(() => {
    const juzMap: Record<number, typeof surahIndex> = {};
    
    for (let j = 1; j <= 30; j++) {
      juzMap[j] = surahIndex.filter(surah => surah.juz.includes(j));
    }
    
    return juzMap;
  }, []);
  
  return (
    <div 
      className="min-h-screen bg-background transition-all duration-500"
      dir={dir}
    >
      {/* خلفية النمط */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="hex-pattern" x="0" y="0" width="16" height="14" patternUnits="userSpaceOnUse">
              <path d="M8 0L16 4L16 10L8 14L0 10L0 4Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex-pattern)" />
        </svg>
      </div>
      
      {/* هيدر */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-primary" />
        
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* العودة */}
            <Link to="/">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">{t.home}</span>
              </Button>
            </Link>

            {/* العنوان */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="text-center">
                <h1 className="text-lg font-bold font-amiri bg-gradient-to-l from-primary to-foreground bg-clip-text text-transparent">
                  {t.surahIndex}
                </h1>
              </div>
            </div>

            {/* الأزرار */}
            <div className="flex items-center gap-1">
              {/* طريقة العرض: كل السور / حسب الجزء */}
              <div className="flex items-center bg-muted/50 rounded-xl p-1 mr-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3 rounded-lg transition-all text-xs gap-1",
                    viewMode === 'all' && 'bg-primary text-primary-foreground shadow-sm'
                  )}
                  onClick={() => setViewMode('all')}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isRtl ? 'الكل' : 'All'}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3 rounded-lg transition-all text-xs gap-1",
                    viewMode === 'juz' && 'bg-primary text-primary-foreground shadow-sm'
                  )}
                  onClick={() => setViewMode('juz')}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isRtl ? 'الأجزاء' : 'Juz'}</span>
                </Button>
              </div>

              {/* نمط العرض */}
              <div className="flex items-center bg-muted/50 rounded-xl p-1">
                {[
                  { style: 'grid' as const, icon: LayoutGrid },
                  { style: 'list' as const, icon: List },
                  { style: 'compact' as const, icon: Grid3X3 },
                ].map(({ style, icon: Icon }) => (
                  <Button
                    key={style}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0 rounded-lg transition-all",
                      cardStyle === style && 'bg-primary text-primary-foreground shadow-sm'
                    )}
                    onClick={() => setCardStyle(style)}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>

              {/* الوضع الليلي */}
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-primary" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 relative z-10">
        {/* شريط البحث */}
        <div className="mb-6">
          <QuranSearch />
        </div>

        {/* الفهرس */}
        {viewMode === 'juz' ? (
          // عرض حسب الأجزاء الـ 30
          <div className="space-y-4">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNum) => (
              <div key={juzNum} className="bg-card/80 rounded-2xl border border-border/50 overflow-hidden">
                <button
                  onClick={() => setExpandedJuz(expandedJuz === juzNum ? null : juzNum)}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                      {juzNum}
                    </div>
                    <div className={cn("text-right", !isRtl && "text-left")}>
                      <h3 className="font-bold text-foreground">{isRtl ? `الجزء ${juzNum}` : `Juz ${juzNum}`} - <span className="font-amiri text-primary">{juzNames[juzNum]}</span></h3>
                      <p className="text-sm text-muted-foreground">{surahsByJuz[juzNum]?.length || 0} {isRtl ? 'سورة' : 'Surahs'}</p>
                    </div>
                  </div>
                  <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", expandedJuz === juzNum && "rotate-180")} />
                </button>
                {expandedJuz === juzNum && (
                  <div className="p-4 pt-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 animate-fade-in">
                    {surahsByJuz[juzNum]?.map((surah) => {
                      const hasData = isDataAvailable(surah.id);
                      return (
                        <Link
                          key={surah.id}
                          to={hasData ? `/surah/${surah.id}` : '#'}
                          onClick={(e) => !hasData && e.preventDefault()}
                          className={cn(
                            'p-3 rounded-xl border text-center transition-all group',
                            hasData ? 'bg-muted/30 hover:bg-primary/10 hover:border-primary/30' : 'opacity-40 cursor-not-allowed'
                          )}
                        >
                          <div className={cn(
                            'mx-auto mb-2 rounded-lg flex items-center justify-center font-bold w-8 h-8 text-sm',
                            hasData ? 'gradient-gold text-primary-foreground' : 'bg-muted text-muted-foreground'
                          )}>{surah.id}</div>
                          <h4 className="font-amiri font-bold text-sm truncate">{surah.name}</h4>
                          <p className="text-xs text-muted-foreground">{surah.versesCount} {t.verse}</p>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // العرض العادي
          <div className={cn(
            'transition-all duration-300',
            cardStyle === 'grid' && 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3',
            cardStyle === 'list' && 'space-y-2',
            cardStyle === 'compact' && 'grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2'
          )}>
          {surahIndex.map((surah, index) => {
            const hasData = isDataAvailable(surah.id);
            
            // نمط القائمة
            if (cardStyle === 'list') {
              return (
                <Link
                  key={surah.id}
                  to={hasData ? `/surah/${surah.id}` : '#'}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 group animate-fade-in',
                    hasData 
                      ? 'bg-card hover:bg-card/80 hover:shadow-lg hover:border-primary/30 cursor-pointer' 
                      : 'bg-muted/20 cursor-not-allowed opacity-40'
                  )}
                  style={{ animationDelay: `${index * 15}ms` }}
                  onClick={(e) => !hasData && e.preventDefault()}
                >
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center font-bold shrink-0 transition-all',
                    hasData ? 'gradient-gold text-primary-foreground shadow-gold group-hover:scale-105' : 'bg-muted text-muted-foreground'
                  )}>
                    {surah.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      'font-bold font-amiri truncate text-lg transition-colors',
                      hasData ? 'text-foreground group-hover:text-primary' : 'text-muted-foreground'
                    )}>
                      {surah.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{surah.englishName}</p>
                  </div>
                  <div className={cn("shrink-0 flex flex-col items-end gap-2", isRtl ? "text-left" : "text-right")}>
                    <span className="text-sm text-muted-foreground">{surah.versesCount} {t.verse}</span>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-xs',
                        surah.revelationType === 'مكية' 
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      )}>
                        {surah.revelationType === 'مكية' ? t.meccan : t.medinan}
                      </span>
                      {hasData && <Headphones className="w-4 h-4 text-emerald-500" />}
                    </div>
                  </div>
                  {isRtl ? (
                    <ChevronLeft className={cn(
                      'w-5 h-5 text-muted-foreground transition-transform',
                      hasData && 'group-hover:-translate-x-1 group-hover:text-primary'
                    )} />
                  ) : (
                    <ChevronRight className={cn(
                      'w-5 h-5 text-muted-foreground transition-transform',
                      hasData && 'group-hover:translate-x-1 group-hover:text-primary'
                    )} />
                  )}
                </Link>
              );
            }

            // نمط مضغوط
            if (cardStyle === 'compact') {
              return (
                <Link
                  key={surah.id}
                  to={hasData ? `/surah/${surah.id}` : '#'}
                  className={cn(
                    'group p-3 rounded-xl border text-center transition-all animate-fade-in',
                    hasData 
                      ? 'bg-card hover:bg-card/80 hover:shadow-md hover:border-primary/30 cursor-pointer' 
                      : 'bg-muted/20 cursor-not-allowed opacity-40'
                  )}
                  style={{ animationDelay: `${index * 10}ms` }}
                  onClick={(e) => !hasData && e.preventDefault()}
                >
                  <div className={cn(
                    'mx-auto mb-2 rounded-lg flex items-center justify-center font-bold w-8 h-8 text-sm transition-all',
                    hasData ? 'gradient-gold text-primary-foreground shadow-gold group-hover:scale-110' : 'bg-muted text-muted-foreground'
                  )}>
                    {surah.id}
                  </div>
                  <h3 className={cn(
                    'font-bold font-amiri truncate text-sm',
                    hasData ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {surah.name.replace('سورة ', '')}
                  </h3>
                </Link>
              );
            }

            // نمط الشبكة (الافتراضي)
            return (
              <Link
                key={surah.id}
                to={hasData ? `/surah/${surah.id}` : '#'}
                className={cn(
                  'group block p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden animate-fade-in',
                  hasData 
                    ? 'bg-card hover:bg-card/80 hover:shadow-lg hover:border-primary/30 cursor-pointer' 
                    : 'bg-muted/20 cursor-not-allowed opacity-40'
                )}
                style={{ animationDelay: `${index * 15}ms` }}
                onClick={(e) => !hasData && e.preventDefault()}
              >
                {hasData && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 to-transparent" />
                )}
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all',
                      hasData 
                        ? 'gradient-gold text-primary-foreground shadow-gold group-hover:scale-110' 
                        : 'bg-muted text-muted-foreground'
                    )}>
                      {surah.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        'font-bold font-amiri truncate text-base transition-colors',
                        hasData ? 'text-foreground group-hover:text-primary' : 'text-muted-foreground'
                      )}>
                        {surah.name}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{surah.versesCount} {t.verse}</span>
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs',
                      surah.revelationType === 'مكية' 
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    )}>
                      {surah.revelationType === 'مكية' ? t.meccan : t.medinan}
                    </span>
                  </div>
                  
                  {hasData && (
                    <div className="mt-2 flex items-center gap-1.5 text-emerald-500 text-xs">
                      <Headphones className="w-3.5 h-3.5" />
                      <span>{t.available}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
          </div>
        )}
      </main>

      {/* الفوتر */}
      <footer className="relative z-10 bg-muted/30 border-t border-border/50 py-6 px-4 mt-8">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-amiri text-foreground">{t.electronicMushaf}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {t.allRightsReserved} © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default QuranIndex;

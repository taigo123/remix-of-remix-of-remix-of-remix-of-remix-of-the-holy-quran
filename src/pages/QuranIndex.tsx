import { 
  BookOpen, 
  Home, 
  Clock, 
  CheckCircle2, 
  Music, 
  Moon, 
  Sun, 
  ChevronLeft,
  LayoutGrid,
  List,
  Grid3X3,
  Headphones
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { surahIndex } from '@/data/surahIndex';
import { isDataAvailable, availableSurahs } from '@/data/surahsData';
import { Button } from '@/components/ui/button';
import { QuranSearch } from '@/components/QuranSearch';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type CardStyle = 'grid' | 'list' | 'compact';

const QuranIndex = () => {
  const availableCount = Object.keys(availableSurahs).length;
  const { theme, setTheme } = useTheme();
  const [cardStyle, setCardStyle] = useState<CardStyle>(() => {
    const saved = localStorage.getItem('quran-card-style');
    return (saved as CardStyle) || 'grid';
  });

  // حفظ نمط العرض
  useEffect(() => {
    localStorage.setItem('quran-card-style', cardStyle);
  }, [cardStyle]);
  
  return (
    <div 
      className="min-h-screen bg-background transition-all duration-500"
      dir="rtl"
    >
      {/* خلفية النمط الإسلامي */}
      <div className="fixed inset-0 islamic-pattern-ornate opacity-30 pointer-events-none" />
      
      {/* هيدر احترافي رفيع */}
      <header className="sticky top-0 z-30">
        {/* الشريط الذهبي العلوي */}
        <div className="h-1 bg-gradient-to-l from-primary via-gold-light to-primary" />
        
        <div className="glass border-b border-primary/10 py-2 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              {/* اليمين - العودة للرئيسية */}
              <Link to="/">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-foreground/80 hover:text-foreground hover:bg-primary/5 h-8 px-2 gap-1"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">الرئيسية</span>
                </Button>
              </Link>

              {/* الوسط - العنوان */}
              <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
                  <BookOpen className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-center">
                  <h1 className="text-lg font-bold font-amiri bg-gradient-to-l from-primary to-gold-dark bg-clip-text text-transparent">
                    القرآن الكريم
                  </h1>
                  <p className="text-[10px] text-muted-foreground">
                    {availableCount} سورة متوفرة
                  </p>
                </div>
              </div>

              {/* اليسار - أزرار العرض والوضع الليلي */}
              <div className="flex items-center gap-0.5">
                {/* أزرار تبديل نمط العرض */}
                <div className="flex items-center bg-muted/50 rounded-lg p-0.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-7 w-7 p-0 rounded-md transition-all",
                      cardStyle === 'grid' && 'bg-primary text-primary-foreground shadow-sm'
                    )}
                    onClick={() => setCardStyle('grid')}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-7 w-7 p-0 rounded-md transition-all",
                      cardStyle === 'list' && 'bg-primary text-primary-foreground shadow-sm'
                    )}
                    onClick={() => setCardStyle('list')}
                  >
                    <List className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-7 w-7 p-0 rounded-md transition-all",
                      cardStyle === 'compact' && 'bg-primary text-primary-foreground shadow-sm'
                    )}
                    onClick={() => setCardStyle('compact')}
                  >
                    <Grid3X3 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* زر الوضع الليلي */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-foreground/80 hover:text-foreground hover:bg-primary/5"
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
        </div>
      </header>

      <main className="container mx-auto py-4 px-4 relative z-10">
        {/* شريط البحث */}
        <div className="mb-4">
          <QuranSearch />
        </div>

        {/* بطاقة ترحيبية عامة */}
        <div className="relative overflow-hidden rounded-xl shadow-lg mb-4">
          {/* الخلفية المتدرجة */}
          <div className="absolute inset-0 bg-gradient-to-l from-primary via-primary/90 to-primary/80" />
          <div className="absolute inset-0 islamic-pattern-ornate opacity-10" />
          
          {/* المحتوى */}
          <div className="relative px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary-foreground font-amiri">القرآن الكريم</h2>
                <p className="text-primary-foreground/70 text-xs">تفسير وتلاوة آية بآية</p>
              </div>
            </div>
            <p className="text-primary-foreground/60 text-xs hidden sm:block">اختر سورة للبدء</p>
          </div>
        </div>

        {/* إشعار السور المتوفرة */}
        <div className="mb-4 p-3 glass-gold rounded-xl border-gradient-gold">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-gold rounded-full flex items-center justify-center shrink-0 shadow-gold">
              <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">
                السور المتوفرة: الفاتحة • البقرة (كاملة) • يس • جزء عمّ
              </p>
            </div>
          </div>
        </div>

        {/* قائمة السور */}
        <div className={cn(
          'transition-all duration-300',
          cardStyle === 'grid' && 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3',
          cardStyle === 'list' && 'space-y-2',
          cardStyle === 'compact' && 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2'
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
                    'flex items-center gap-3 p-3 rounded-xl border transition-all group animate-fade-in',
                    hasData 
                      ? 'bg-card/80 hover:bg-card hover:shadow-card hover:border-primary/30 cursor-pointer' 
                      : 'bg-muted/30 cursor-not-allowed opacity-50'
                  )}
                  style={{ animationDelay: `${index * 20}ms` }}
                  onClick={(e) => !hasData && e.preventDefault()}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-all',
                    hasData ? 'gradient-gold text-primary-foreground shadow-gold' : 'bg-muted text-muted-foreground'
                  )}>
                    {surah.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      'font-bold font-amiri truncate transition-colors text-base',
                      hasData ? 'text-foreground group-hover:text-primary' : 'text-muted-foreground'
                    )}>
                      {surah.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {surah.englishName}
                    </p>
                  </div>
                  <div className="text-left shrink-0 flex flex-col items-end gap-1">
                    <span className="text-xs text-muted-foreground">{surah.versesCount} آية</span>
                    {hasData && <Music className="w-3 h-3 text-emerald-500" />}
                  </div>
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
                    'group p-2 rounded-xl border text-center transition-all animate-fade-in',
                    hasData 
                      ? 'bg-card/80 hover:bg-card hover:shadow-card hover:border-primary/30 cursor-pointer' 
                      : 'bg-muted/30 cursor-not-allowed opacity-50'
                  )}
                  style={{ animationDelay: `${index * 15}ms` }}
                  onClick={(e) => !hasData && e.preventDefault()}
                >
                  <div className={cn(
                    'mx-auto mb-1 rounded-lg flex items-center justify-center font-bold w-7 h-7 text-xs',
                    hasData ? 'gradient-gold text-primary-foreground shadow-gold' : 'bg-muted text-muted-foreground'
                  )}>
                    {surah.id}
                  </div>
                  <h3 className={cn(
                    'font-bold font-amiri truncate text-xs',
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
                  'group block p-3 rounded-xl border transition-all relative overflow-hidden animate-fade-in',
                  hasData 
                    ? 'bg-card/80 hover:bg-card hover:shadow-card hover:border-primary/30 cursor-pointer' 
                    : 'bg-muted/30 cursor-not-allowed opacity-50'
                )}
                style={{ animationDelay: `${index * 20}ms` }}
                onClick={(e) => !hasData && e.preventDefault()}
              >
                {hasData && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 to-transparent" />
                )}
                
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-all',
                      hasData 
                        ? 'gradient-gold text-primary-foreground shadow-gold group-hover:scale-110' 
                        : 'bg-muted text-muted-foreground'
                    )}>
                      {surah.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        'font-bold font-amiri truncate transition-colors text-base',
                        hasData ? 'text-foreground group-hover:text-primary' : 'text-muted-foreground'
                      )}>
                        {surah.name}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs">{surah.versesCount} آية</span>
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-xs',
                      surah.revelationType === 'مكية' 
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    )}>
                      {surah.revelationType}
                    </span>
                  </div>
                  
                  {hasData && (
                    <div className="mt-1.5 flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs">
                      <Music className="w-3 h-3" />
                      <span>صوت</span>
                    </div>
                  )}
                  
                  {!hasData && (
                    <div className="mt-1.5 flex items-center gap-1 text-muted-foreground text-xs">
                      <Clock className="w-3 h-3" />
                      <span>قريباً</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {/* الفوتر */}
      <footer className="relative z-10 bg-muted/30 border-t border-border/50 py-4 px-4 mt-8">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-amiri text-foreground">المصحف الإلكتروني</span>
          </div>
          <p className="text-xs text-muted-foreground">
            جميع الحقوق محفوظة © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default QuranIndex;

import { Link } from "react-router-dom";
import { useRef } from "react";
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Moon, 
  Sparkles, 
  Star, 
  Sun, 
  Book, 
  Feather,
  Headphones,
  Languages,
  Search,
  Heart,
  Volume2,
  BookMarked,
  Users,
  Mic2,
  FileText,
  GripHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Helmet } from "react-helmet";
import { surahIndex } from "@/data/surahIndex";
import { isDataAvailable } from "@/data/surahsData";
import { cn } from "@/lib/utils";

const Landing = () => {
  const { theme, setTheme } = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  // قائمة التفاسير الـ 14 الموجودة فعلياً
  const tafsirs = [
    { name: "تفسير ابن كثير", author: "الإمام ابن كثير" },
    { name: "تفسير الطبري", author: "الإمام الطبري" },
    { name: "تفسير السعدي", author: "الشيخ السعدي" },
    { name: "التفسير الميسر", author: "مجمع الملك فهد" },
    { name: "تفسير الجلالين", author: "المحلي والسيوطي" },
    { name: "تفسير القرطبي", author: "الإمام القرطبي" },
    { name: "تفسير البغوي", author: "الإمام البغوي" },
    { name: "التفسير الوسيط", author: "مجمع البحوث الإسلامية" },
    { name: "تنوير المقباس", author: "منسوب لابن عباس" },
    { name: "التفسير الميسر (مفصل)", author: "مجمع الملك فهد" },
    { name: "تفسير القرطبي (مفصل)", author: "الإمام القرطبي" },
    { name: "تفسير البغوي (مفصل)", author: "الإمام البغوي" },
    { name: "التفسير الوسيط للطنطاوي", author: "الشيخ الطنطاوي" },
  ];

  // قائمة القراء الـ 6 الموجودين فعلياً
  const reciters = [
    { name: "مشاري العفاسي", style: "المرتل" },
    { name: "عبد الباسط عبد الصمد", style: "المرتل" },
    { name: "عبد الباسط عبد الصمد", style: "المجود" },
    { name: "محمد صديق المنشاوي", style: "المرتل" },
    { name: "محمود خليل الحصري", style: "المعلم" },
    { name: "ماهر المعيقلي", style: "المرتل" },
  ];

  // المميزات
  const features = [
    { icon: BookMarked, title: "114 سورة كاملة", desc: "القرآن الكريم بالرسم العثماني" },
    { icon: Languages, title: "14 تفسير موثوق", desc: "من أمهات كتب التفسير" },
    { icon: Headphones, title: "6 قراء مميزين", desc: "تلاوات بأصوات عذبة" },
    { icon: Search, title: "بحث متقدم", desc: "ابحث في الآيات والتفاسير" },
    { icon: Heart, title: "المفضلة", desc: "احفظ آياتك المفضلة" },
    { icon: Volume2, title: "استماع آية بآية", desc: "أو السورة كاملة" },
  ];

  return (
    <>
      <Helmet>
        <title>القرآن الكريم - تفسير وتلاوة | أفضل تطبيق للقرآن</title>
        <meta
          name="description"
          content="تطبيق القرآن الكريم مع 14 تفسير موثوق و6 قراء مميزين - اقرأ واستمع وتدبر آيات الله بتصميم عصري فريد"
        />
        <html lang="ar" dir="rtl" />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Geometric Islamic Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="islamic-star" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M10 0L12.5 7.5L20 10L12.5 12.5L10 20L7.5 12.5L0 10L7.5 7.5Z" fill="currentColor" className="text-primary" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamic-star)" />
          </svg>

          {/* Floating Orbs */}
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-40 left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/10 to-transparent rounded-full" />
        </div>

        {/* Theme Toggle */}
        <div className="absolute top-6 left-6 z-20">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-12 w-12 p-0 rounded-2xl border-primary/20 bg-background/50 backdrop-blur-xl hover:bg-primary/10 transition-all duration-300 hover:scale-110 hover:border-primary shadow-lg"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-primary" />
            ) : (
              <Moon className="w-5 h-5 text-primary" />
            )}
          </Button>
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen">
          {/* Hero Section */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              {/* Bismillah Header */}
              <div className="text-center mb-12 animate-fade-in">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/5 border border-primary/10 mb-8">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="font-amiri text-primary">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
              </div>

              {/* Main Hero Card */}
              <div className="relative max-w-3xl mx-auto">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-[3rem] blur-2xl opacity-50" />
                
                <div className="relative bg-gradient-to-br from-card via-card to-muted/50 rounded-[2.5rem] border border-primary/10 shadow-2xl overflow-hidden">
                  {/* Decorative Top Border */}
                  <div className="h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
                  
                  <div className="p-8 md:p-12">
                    {/* Quran Icon */}
                    <div className="flex justify-center mb-8">
                      <div className="relative">
                        <div className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary/20 blur-2xl animate-pulse" />
                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full gradient-gold flex items-center justify-center shadow-2xl animate-pulse-gold">
                          <div className="absolute inset-2 rounded-full border-2 border-primary-foreground/30" />
                          <div className="absolute inset-4 rounded-full border border-primary-foreground/20" />
                          <Book className="w-14 h-14 md:w-16 md:h-16 text-primary-foreground drop-shadow-lg" />
                        </div>
                        {/* Orbiting Stars */}
                        <div className="absolute inset-0 animate-[spin_15s_linear_infinite]">
                          <Star className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 text-primary fill-primary/50" />
                          <Star className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 text-primary fill-primary/30" />
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                      <h1 className="font-arabic text-4xl md:text-6xl font-bold text-foreground mb-4" dir="rtl">
                        القرآن الكريم
                      </h1>
                      <p className="font-amiri text-xl md:text-2xl text-primary mb-4 animate-shimmer-text" dir="rtl">
                        كتاب الله المبين
                      </p>
                      <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                        اقرأ واستمع وتدبر آيات الله بتفسير شامل من أمهات كتب التفسير
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-6 md:gap-10 mb-10">
                      {[
                        { num: "114", label: "سورة" },
                        { num: "30", label: "جزء" },
                        { num: "6236", label: "آية" },
                      ].map((stat, i) => (
                        <div key={i} className="text-center">
                          <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-2 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <span className="text-xl md:text-2xl font-bold text-primary">{stat.num}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{stat.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Link to="/athkar">
                        <Button
                          size="lg"
                          className="group relative overflow-hidden gradient-gold text-primary-foreground gap-4 px-10 py-7 text-lg rounded-2xl shadow-[0_15px_50px_-12px_hsl(var(--primary)/0.5)] transition-all duration-500 hover:shadow-[0_25px_70px_-15px_hsl(var(--primary)/0.6)] hover:scale-105"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                          <Heart className="w-6 h-6 relative z-10" />
                          <span className="font-amiri font-bold text-xl relative z-10">الأذكار والأدعية</span>
                          <ChevronLeft className="w-6 h-6 relative z-10 transition-transform group-hover:-translate-x-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Surah Index - Horizontal Scrollable */}
          <section className="py-12 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-4">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">فهرس السور</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-arabic text-foreground mb-2">
                  تصفح سور القرآن الكريم
                </h2>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <GripHorizontal className="w-4 h-4" />
                  اسحب للتصفح أو استخدم الأسهم
                </p>
              </div>

              {/* Navigation Arrows */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg border-primary/20 hover:bg-primary hover:text-primary-foreground hidden md:flex"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg border-primary/20 hover:bg-primary hover:text-primary-foreground hidden md:flex"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                {/* Scrollable Container */}
                <div 
                  ref={scrollContainerRef}
                  className="flex gap-3 overflow-x-auto pb-4 px-2 md:px-12 scrollbar-hide scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {surahIndex.map((surah) => {
                    const hasData = isDataAvailable(surah.id);
                    return (
                      <Link
                        key={surah.id}
                        to={hasData ? `/surah/${surah.id}` : '#'}
                        onClick={(e) => !hasData && e.preventDefault()}
                        className={cn(
                          'shrink-0 w-28 p-4 rounded-2xl border text-center transition-all duration-200 group',
                          hasData 
                            ? 'bg-card hover:bg-card/80 hover:shadow-lg hover:border-primary/30 cursor-pointer hover:scale-105' 
                            : 'bg-muted/20 cursor-not-allowed opacity-40'
                        )}
                      >
                        <div className={cn(
                          'mx-auto mb-2 rounded-xl flex items-center justify-center font-bold w-10 h-10 text-sm transition-all',
                          hasData ? 'gradient-gold text-primary-foreground shadow-gold group-hover:scale-110' : 'bg-muted text-muted-foreground'
                        )}>
                          {surah.id}
                        </div>
                        <h3 className={cn(
                          'font-bold font-amiri truncate text-sm',
                          hasData ? 'text-foreground' : 'text-muted-foreground'
                        )}>
                          {surah.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">{surah.versesCount} آية</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Full Index Link */}
              <div className="text-center mt-6">
                <Link to="/quran">
                  <Button variant="outline" className="gap-2 rounded-xl">
                    <BookOpen className="w-4 h-4" />
                    عرض الفهرس الكامل
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 px-4 bg-gradient-to-b from-transparent via-muted/20 to-transparent">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-4">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">مميزات التطبيق</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-arabic text-foreground mb-4">
                  كل ما تحتاجه في مكان واحد
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  تطبيق شامل للقرآن الكريم يجمع بين القراءة والاستماع والتفسير
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {features.map((feature, i) => (
                  <div 
                    key={i} 
                    className="group p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card transition-all duration-300 hover:shadow-lg animate-fade-in"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-4 shadow-gold group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Tafsirs Section */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="grid md:grid-cols-2 gap-8">
                {/* التفاسير */}
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl blur-xl opacity-50" />
                  <div className="relative bg-card/80 rounded-3xl border border-primary/10 p-6 md:p-8 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
                    
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
                        <FileText className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">التفاسير الموثوقة</h3>
                        <p className="text-sm text-muted-foreground">{tafsirs.length} تفاسير من أمهات الكتب</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {tafsirs.map((tafsir, i) => (
                        <div 
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm">{tafsir.name}</p>
                            <p className="text-xs text-muted-foreground">{tafsir.author}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* القراء */}
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-3xl blur-xl opacity-50" />
                  <div className="relative bg-card/80 rounded-3xl border border-emerald-500/10 p-6 md:p-8 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-500/50 to-transparent" />
                    
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                        <Mic2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">القراء المميزون</h3>
                        <p className="text-sm text-muted-foreground">{reciters.length} قراء بأصوات عذبة</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {reciters.map((reciter, i) => (
                        <div 
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <Headphones className="w-4 h-4 text-emerald-500" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm">{reciter.name}</p>
                            <p className="text-xs text-muted-foreground">{reciter.style}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quote Section */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-4xl">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl" />
                <div className="relative p-8 md:p-12 text-center">
                  <Star className="w-8 h-8 text-primary mx-auto mb-6" />
                  <blockquote className="font-arabic text-2xl md:text-3xl text-foreground leading-relaxed mb-6">
                    ﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾
                  </blockquote>
                  <cite className="text-muted-foreground">— سورة المزمل، الآية 4</cite>
                </div>
              </div>
            </div>
          </section>

          {/* Footer CTA */}
          <section className="py-16 px-4 bg-gradient-to-b from-transparent to-muted/30">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-2xl md:text-3xl font-bold font-arabic text-foreground mb-6">
                ابدأ رحلتك مع كتاب الله
              </h2>
              <Link to="/quran">
                <Button
                  size="lg"
                  className="gradient-gold text-primary-foreground gap-3 px-10 py-7 text-lg rounded-2xl shadow-gold hover:scale-105 transition-transform"
                >
                  <BookOpen className="w-6 h-6" />
                  <span className="font-amiri font-bold">افتح الفهرس</span>
                  <ChevronLeft className="w-6 h-6" />
                </Button>
              </Link>
              <p className="mt-8 text-sm text-muted-foreground">
                تفسير مجمّع من أمهات كتب التفسير الإسلامية
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Landing;
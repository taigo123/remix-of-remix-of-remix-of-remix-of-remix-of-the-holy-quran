import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Sparkles, 
  Star, 
  Book, 
  Headphones,
  Languages,
  Search,
  Heart,
  Volume2,
  BookMarked,
  Mic2,
  FileText,
  GripHorizontal,
  Eye,
  EyeOff,
  Globe,
  Bookmark,
  Download,
  Repeat,
  Share2,
  Moon,
  Sun,
  Clock,
  TrendingUp,
  Smartphone,
  Wifi,
  Shield,
  Users,
  PlayCircle,
  HelpCircle,
  ChevronDown,
  HardDrive,
  WifiOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { surahIndex } from "@/data/surahIndex";
import { isDataAvailable } from "@/data/surahsData";
import { cn } from "@/lib/utils";
import LandingSidebar from "@/components/LandingSidebar";
import { useLanguage, languages, regionLabels, LanguageRegion } from "@/contexts/LanguageContext";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { useVisitorStats } from "@/hooks/useVisitorStats";
import { useRecitationStats } from "@/hooks/useRecitationStats";


const Landing = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { t, isRtl, dir, language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { stats: visitorStats, loading: visitorLoading } = useVisitorStats();
  const { stats: recitationStats, loading: recitationLoading } = useRecitationStats();

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: isRtl ? 300 : -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: isRtl ? -300 : 300, behavior: 'smooth' });
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

  // قائمة القراء الـ 14 المتاحين
  const reciters = [
    { name: "مشاري العفاسي", style: "الافتراضي" },
    { name: "عبد الرحمن السديس", style: "إمام الحرم المكي" },
    { name: "محمد صديق المنشاوي", style: "المرتل" },
    { name: "محمود خليل الحصري", style: "المرتل" },
    { name: "الحصري", style: "المجود" },
    { name: "سعود الشريم", style: "إمام الحرم المكي" },
    { name: "ماهر المعيقلي", style: "المرتل" },
    { name: "أحمد العجمي", style: "المرتل" },
    { name: "عبد الباسط عبد الصمد", style: "المرتل" },
    { name: "علي الحذيفي", style: "إمام المسجد النبوي" },
    { name: "عبدالله بصفر", style: "المرتل" },
    { name: "محمد أيوب", style: "إمام المسجد النبوي" },
    { name: "أبو بكر الشاطري", style: "المرتل" },
    { name: "محمد جبريل", style: "المرتل" },
  ];

  // اللغات المدعومة مجمعة حسب المنطقة
  const languagesByRegion = languages.reduce((acc, lang) => {
    if (!acc[lang.region]) acc[lang.region] = [];
    acc[lang.region].push(lang);
    return acc;
  }, {} as Record<LanguageRegion, typeof languages>);

  // المميزات الأساسية
  const features = [
    { icon: BookMarked, title: `114 ${t.fullSurahs}`, desc: t.uthmaniScript },
    { icon: Languages, title: `14 ${t.trustedTafsirs}`, desc: t.fromMajorBooks },
    { icon: Headphones, title: `14 ${isRtl ? 'قارئ مميز' : 'Distinguished Reciters'}`, desc: t.beautifulRecitations },
    { icon: Globe, title: `41 ${isRtl ? 'لغة مدعومة' : 'Languages Supported'}`, desc: isRtl ? 'ترجمات من مصادر موثوقة' : 'Translations from trusted sources' },
    { icon: Search, title: t.advancedSearch, desc: t.searchInVerses },
    { icon: Heart, title: t.favorites, desc: t.saveYourFavorites },
  ];

  // الميزات المتقدمة
  const advancedFeatures = [
    { icon: EyeOff, title: isRtl ? 'إخفاء/إظهار التفسير' : 'Hide/Show Tafsir', desc: isRtl ? 'للقراءة المركزة دون تشتت' : 'For focused reading without distractions' },
    { icon: Globe, title: isRtl ? 'ترجمة الآيات' : 'Verse Translation', desc: isRtl ? 'ترجمة فورية موثوقة لـ 41 لغة' : 'Trusted instant translation to 41 languages' },
    { icon: Bookmark, title: isRtl ? 'حفظ القارئ المفضل' : 'Save Preferred Reciter', desc: isRtl ? 'يُحفظ تلقائياً في المتصفح' : 'Automatically saved in browser' },
    { icon: Repeat, title: isRtl ? 'تكرار الآيات' : 'Verse Repeat', desc: isRtl ? 'كرر الآية 2-10 مرات للحفظ' : 'Repeat verse 2-10 times for memorization' },
    { icon: Volume2, title: t.listenVerseByVerse, desc: t.orFullSurah },
    { icon: Download, title: isRtl ? 'تحميل التلاوات' : 'Download Recitations', desc: isRtl ? 'حمّل الصوت للاستماع دون إنترنت' : 'Download audio for offline listening' },
    { icon: HardDrive, title: isRtl ? 'حفظ التفسير أوفلاين' : 'Offline Tafsir', desc: isRtl ? 'احفظ التفسير للقراءة بدون إنترنت' : 'Save tafsir for offline reading' },
    { icon: WifiOff, title: isRtl ? 'استماع بدون إنترنت' : 'Offline Listening', desc: isRtl ? 'استمع للتلاوات المحفوظة أوفلاين' : 'Listen to saved recitations offline' },
    { icon: Share2, title: isRtl ? 'مشاركة الآيات' : 'Share Verses', desc: isRtl ? 'شارك الآيات مع الآخرين' : 'Share verses with others' },
    { icon: Moon, title: isRtl ? 'الوضع الليلي' : 'Dark Mode', desc: isRtl ? 'راحة للعين في الإضاءة المنخفضة' : 'Easy on eyes in low light' },
    { icon: Clock, title: isRtl ? 'إحصائيات الاستماع' : 'Listening Stats', desc: isRtl ? 'تتبع وقت الاستماع والتقدم' : 'Track listening time and progress' },
    { icon: TrendingUp, title: isRtl ? 'حفظ التقدم' : 'Save Progress', desc: isRtl ? 'استأنف من حيث توقفت' : 'Resume from where you left off' },
    { icon: Search, title: isRtl ? 'البحث بأسماء الأجزاء' : 'Search by Juz Name', desc: isRtl ? 'ابحث عن الجزء بالاسم أو الرقم' : 'Search juz by name or number' },
    { icon: Smartphone, title: isRtl ? 'تطبيق PWA' : 'PWA App', desc: isRtl ? 'ثبّته على جهازك كتطبيق' : 'Install on your device as an app' },
    { icon: Shield, title: isRtl ? 'بدون إعلانات' : 'Ad-Free', desc: isRtl ? 'تجربة نقية بدون مقاطعة' : 'Pure experience without interruption' },
  ];

  // إحصائيات التطبيق (حقيقية فقط)
  const appStats = [
    { 
      icon: Users, 
      number: visitorLoading ? '...' : `${visitorStats.uniqueVisitors}`, 
      label: isRtl ? 'زائر فريد' : 'Unique Visitors', 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      icon: PlayCircle, 
      number: recitationLoading ? '...' : `${recitationStats.totalRecitations}`, 
      label: isRtl ? 'تلاوة مكتملة' : 'Recitations Completed', 
      color: 'from-green-500 to-emerald-500' 
    },
    { icon: Globe, number: '41', label: isRtl ? 'لغة مدعومة' : 'Supported Languages', color: 'from-purple-500 to-pink-500' },
    { icon: BookOpen, number: '14', label: isRtl ? 'تفسير موثوق' : 'Trusted Tafsirs', color: 'from-amber-500 to-orange-500' },
  ];

  // الأسئلة الشائعة
  const faqs = [
    {
      q: isRtl ? 'هل التطبيق مجاني؟' : 'Is the app free?',
      a: isRtl ? 'نعم، التطبيق مجاني بالكامل بدون أي إعلانات أو اشتراكات.' : 'Yes, the app is completely free with no ads or subscriptions.'
    },
    {
      q: isRtl ? 'هل يمكنني الاستماع بدون إنترنت؟' : 'Can I listen offline?',
      a: isRtl ? 'نعم، يمكنك تحميل التلاوات للاستماع لاحقاً بدون اتصال بالإنترنت.' : 'Yes, you can download recitations to listen later without internet.'
    },
    {
      q: isRtl ? 'كم عدد القراء المتاحين؟' : 'How many reciters are available?',
      a: isRtl ? 'يتوفر 14 قارئ مميز من أشهر القراء في العالم الإسلامي.' : '14 distinguished reciters from the most famous reciters in the Islamic world.'
    },
    {
      q: isRtl ? 'هل يدعم التطبيق لغتي؟' : 'Does the app support my language?',
      a: isRtl ? 'ندعم 41 لغة تشمل العربية والإنجليزية والفرنسية والأردية وغيرها الكثير.' : 'We support 41 languages including Arabic, English, French, Urdu, and many more.'
    },
    {
      q: isRtl ? 'كيف أحفظ تقدمي في القراءة؟' : 'How do I save my reading progress?',
      a: isRtl ? 'يتم حفظ تقدمك تلقائياً في المتصفح، ويمكنك استئناف القراءة من حيث توقفت.' : 'Your progress is automatically saved in the browser, and you can resume reading from where you left off.'
    },
    {
      q: isRtl ? 'هل يمكنني مشاركة الآيات؟' : 'Can I share verses?',
      a: isRtl ? 'نعم، يمكنك مشاركة أي آية بسهولة عبر وسائل التواصل الاجتماعي أو نسخها.' : 'Yes, you can easily share any verse via social media or copy it.'
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t.holyQuran} - {t.tafsir}</title>
        <meta
          name="description"
          content={t.aboutText}
        />
        <html lang={language} dir={dir} />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30" dir={dir}>
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

        {/* Sidebar */}
        <LandingSidebar />

        {/* Main Content */}
        <div className="relative z-10 min-h-screen">
          {/* Hero Section */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              {/* Bismillah Header */}
              <div className="text-center mb-12 animate-fade-in">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/5 border border-primary/10 mb-8">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="font-amiri text-primary">{t.bismillah}</span>
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
                      <h1 className="font-arabic text-4xl md:text-6xl font-bold text-foreground mb-4">
                        {t.holyQuran}
                      </h1>
                      <p className="font-amiri text-xl md:text-2xl text-primary mb-4 animate-shimmer-text">
                        {t.bookOfAllah}
                      </p>
                      <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                        {t.readListenReflect}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-6 md:gap-10 mb-10">
                      {[
                        { num: "114", label: t.surah },
                        { num: "30", label: t.juz },
                        { num: "6236", label: t.verse },
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
                          <span className="font-amiri font-bold text-xl relative z-10">{t.athkarAndDuas}</span>
                          {isRtl ? (
                            <ChevronLeft className="w-6 h-6 relative z-10 transition-transform group-hover:-translate-x-2" />
                          ) : (
                            <ChevronRight className="w-6 h-6 relative z-10 transition-transform group-hover:translate-x-2" />
                          )}
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
                  <span className="text-sm text-primary font-medium">{t.surahIndex}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-arabic text-foreground mb-2">
                  {t.browseSurahs}
                </h2>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <GripHorizontal className="w-4 h-4" />
                  {t.dragToScroll}
                </p>
              </div>

              {/* Navigation Arrows */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollRight}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg border-primary/20 hover:bg-primary hover:text-primary-foreground hidden md:flex",
                    isRtl ? "right-0" : "left-0"
                  )}
                >
                  {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollLeft}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg border-primary/20 hover:bg-primary hover:text-primary-foreground hidden md:flex",
                    isRtl ? "left-0" : "right-0"
                  )}
                >
                  {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
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
                        <span className="text-xs text-muted-foreground">{surah.versesCount} {t.verse}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Full Index Button */}
              <div className="text-center mt-8">
                <Link to="/quran">
                  <Button
                    size="lg"
                    className="gradient-gold text-primary-foreground gap-3 px-8 py-6 text-base rounded-2xl shadow-gold hover:scale-105 transition-transform"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span className="font-amiri font-bold">{t.viewFullIndex}</span>
                    {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
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
                  <span className="text-sm text-primary font-medium">{t.features}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-arabic text-foreground mb-4">
                  {t.allInOnePlace}
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  {t.comprehensiveApp}
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

              {/* الميزات المتقدمة */}
              <div className="mt-12">
                <h3 className="text-xl font-bold text-center text-foreground mb-8">
                  {isRtl ? '✨ ميزات متقدمة' : '✨ Advanced Features'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {advancedFeatures.map((feature, i) => (
                    <div 
                      key={i} 
                      className="group p-4 rounded-xl bg-card/30 border border-border/30 hover:border-primary/20 hover:bg-card/50 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-medium text-foreground text-sm mb-1">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Tafsirs & Reciters Section */}
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
                        <h3 className="text-xl font-bold text-foreground">{t.trustedTafsirs}</h3>
                        <p className="text-sm text-muted-foreground">{tafsirs.length} {t.fromMajorBooks}</p>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
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

                {/* القراء - بألوان أنيقة */}
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-3xl blur-xl opacity-50" />
                  <div className="relative bg-card/80 rounded-3xl border border-emerald-500/10 p-6 md:p-8 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
                    
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                        <Mic2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{isRtl ? 'قراء مميزون' : 'Distinguished Reciters'}</h3>
                        <p className="text-sm text-muted-foreground">{reciters.length} {t.reciters}</p>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      {reciters.map((reciter, i) => {
                        // ألوان متدرجة أنيقة لكل قارئ
                        const colors = [
                          'from-emerald-500 to-teal-500',
                          'from-cyan-500 to-blue-500',
                          'from-violet-500 to-purple-500',
                          'from-pink-500 to-rose-500',
                          'from-amber-500 to-orange-500',
                          'from-green-500 to-emerald-500',
                          'from-blue-500 to-indigo-500',
                          'from-fuchsia-500 to-pink-500',
                          'from-teal-500 to-cyan-500',
                          'from-rose-500 to-red-500',
                          'from-indigo-500 to-violet-500',
                          'from-orange-500 to-amber-500',
                          'from-purple-500 to-fuchsia-500',
                          'from-red-500 to-rose-500',
                        ];
                        const colorClass = colors[i % colors.length];
                        
                        return (
                          <div 
                            key={i}
                            className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-300 group hover:scale-[1.02] cursor-pointer"
                          >
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-xl transition-all`}>
                              {i + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{reciter.name}</p>
                              <p className="text-xs text-muted-foreground">{reciter.style}</p>
                            </div>
                            <Headphones className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Languages Section */}
          <section className="py-16 px-4 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-500 font-medium">{isRtl ? 'دعم متعدد اللغات' : 'Multi-Language Support'}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-arabic text-foreground mb-4">
                  {isRtl ? '41 لغة مدعومة' : '41 Languages Supported'}
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  {isRtl ? 'ترجمات موثوقة من مصادر معتمدة حول العالم' : 'Trusted translations from accredited sources worldwide'}
                </p>
              </div>

              <div className="grid gap-6">
                {(['european', 'asian', 'middleeast', 'african'] as LanguageRegion[]).map((region) => (
                  <div key={region} className="bg-card/50 rounded-2xl border border-border/50 p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Languages className="w-5 h-5 text-blue-500" />
                      {isRtl ? regionLabels[region].ar : regionLabels[region].en}
                      <span className="text-sm font-normal text-muted-foreground">({languagesByRegion[region]?.length || 0})</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {languagesByRegion[region]?.map((lang) => (
                        <div 
                          key={lang.code}
                          className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-foreground hover:bg-blue-500/20 transition-colors cursor-default"
                          title={lang.translator}
                        >
                          {lang.nativeName}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* App Statistics Section */}
          <section className="py-16 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">{isRtl ? 'إحصائيات التطبيق' : 'App Statistics'}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-arabic text-foreground mb-4">
                  {isRtl ? 'انضم إلينا' : 'Join Our Community'}
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {appStats.map((stat, i) => (
                  <div 
                    key={i}
                    className="relative group p-6 rounded-2xl bg-card/80 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl animate-fade-in text-center"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <AnimatedCounter value={stat.number} className="text-2xl md:text-3xl font-bold text-foreground mb-1" duration={2000} />
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-3xl">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-amber-500 font-medium">{isRtl ? 'الأسئلة الشائعة' : 'FAQ'}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-arabic text-foreground mb-4">
                  {isRtl ? 'أسئلة متكررة' : 'Frequently Asked Questions'}
                </h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="bg-card/80 rounded-2xl border border-border/50 overflow-hidden transition-all duration-300 hover:border-amber-500/30"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full p-5 flex items-center justify-between gap-4 text-right"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold shrink-0">
                          {i + 1}
                        </div>
                        <span className="font-medium text-foreground">{faq.q}</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 pb-5' : 'max-h-0'}`}>
                      <p className="px-5 text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                ))}
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
                  <blockquote className="font-arabic text-2xl md:text-3xl text-foreground leading-relaxed mb-6" dir="rtl">
                    ﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾
                  </blockquote>
                  <cite className="text-muted-foreground">— {isRtl ? 'سورة المزمل، الآية 4' : 'Surah Al-Muzzammil, Verse 4'}</cite>
                </div>
              </div>
            </div>
          </section>

          {/* Quote Footer */}
          <section className="py-12 px-4 bg-gradient-to-b from-transparent to-muted/30">
            <div className="container mx-auto max-w-4xl text-center">
              <p className="text-sm text-muted-foreground">
                {t.trustedTafsirsList}
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Landing;

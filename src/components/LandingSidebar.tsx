import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Menu, 
  X, 
  BookOpen, 
  Heart, 
  Moon, 
  Sun,
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
  Info,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { surahIndex } from "@/data/surahIndex";
import { isDataAvailable } from "@/data/surahsData";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type Language = 'ar' | 'en' | 'fr' | 'ur' | 'id' | 'tr' | 'it';

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
];

const translations: Record<Language, {
  title: string;
  index: string;
  settings: string;
  home: string;
  athkar: string;
  search: string;
  appearance: string;
  lightMode: string;
  darkMode: string;
  language: string;
  about: string;
  aboutText: string;
  verses: string;
}> = {
  ar: {
    title: 'القرآن الكريم',
    index: 'فهرس السور',
    settings: 'الإعدادات',
    home: 'الرئيسية',
    athkar: 'الأذكار والأدعية',
    search: 'البحث',
    appearance: 'المظهر',
    lightMode: 'الوضع النهاري',
    darkMode: 'الوضع الليلي',
    language: 'اللغة',
    about: 'عن التطبيق',
    aboutText: 'تطبيق القرآن الكريم مع 14 تفسير موثوق و6 قراء مميزين. اقرأ واستمع وتدبر آيات الله.',
    verses: 'آية',
  },
  en: {
    title: 'The Holy Quran',
    index: 'Surah Index',
    settings: 'Settings',
    home: 'Home',
    athkar: 'Athkar & Duas',
    search: 'Search',
    appearance: 'Appearance',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    language: 'Language',
    about: 'About App',
    aboutText: 'Quran app with 14 trusted Tafsirs and 6 distinguished reciters. Read, listen and reflect on the verses of Allah.',
    verses: 'verses',
  },
  fr: {
    title: 'Le Saint Coran',
    index: 'Index des Sourates',
    settings: 'Paramètres',
    home: 'Accueil',
    athkar: 'Athkar & Duas',
    search: 'Recherche',
    appearance: 'Apparence',
    lightMode: 'Mode Clair',
    darkMode: 'Mode Sombre',
    language: 'Langue',
    about: 'À propos',
    aboutText: 'Application Coran avec 14 Tafsirs fiables et 6 réciteurs distingués. Lisez, écoutez et méditez les versets d\'Allah.',
    verses: 'versets',
  },
  ur: {
    title: 'قرآن پاک',
    index: 'سورتوں کا اشاریہ',
    settings: 'ترتیبات',
    home: 'ہوم',
    athkar: 'اذکار و دعائیں',
    search: 'تلاش',
    appearance: 'ظاہری شکل',
    lightMode: 'روشن موڈ',
    darkMode: 'تاریک موڈ',
    language: 'زبان',
    about: 'ایپ کے بارے میں',
    aboutText: '14 معتبر تفاسیر اور 6 ممتاز قاریوں کے ساتھ قرآن ایپ۔ اللہ کی آیات پڑھیں، سنیں اور غور کریں۔',
    verses: 'آیات',
  },
  id: {
    title: 'Al-Quran Al-Karim',
    index: 'Indeks Surah',
    settings: 'Pengaturan',
    home: 'Beranda',
    athkar: 'Dzikir & Doa',
    search: 'Pencarian',
    appearance: 'Tampilan',
    lightMode: 'Mode Terang',
    darkMode: 'Mode Gelap',
    language: 'Bahasa',
    about: 'Tentang Aplikasi',
    aboutText: 'Aplikasi Al-Quran dengan 14 Tafsir terpercaya dan 6 qari pilihan. Baca, dengarkan dan renungkan ayat-ayat Allah.',
    verses: 'ayat',
  },
  tr: {
    title: 'Kur\'an-ı Kerim',
    index: 'Sure İndeksi',
    settings: 'Ayarlar',
    home: 'Ana Sayfa',
    athkar: 'Zikirler ve Dualar',
    search: 'Arama',
    appearance: 'Görünüm',
    lightMode: 'Açık Mod',
    darkMode: 'Karanlık Mod',
    language: 'Dil',
    about: 'Uygulama Hakkında',
    aboutText: '14 güvenilir tefsir ve 6 seçkin hafız ile Kur\'an uygulaması. Allah\'ın ayetlerini okuyun, dinleyin ve tefekkür edin.',
    verses: 'ayet',
  },
  it: {
    title: 'Il Sacro Corano',
    index: 'Indice delle Sure',
    settings: 'Impostazioni',
    home: 'Home',
    athkar: 'Athkar e Dua',
    search: 'Cerca',
    appearance: 'Aspetto',
    lightMode: 'Modalità Chiara',
    darkMode: 'Modalità Scura',
    language: 'Lingua',
    about: 'Informazioni',
    aboutText: 'App del Corano con 14 Tafsir affidabili e 6 recitatori distinti. Leggi, ascolta e rifletti sui versetti di Allah.',
    verses: 'versetti',
  },
};

const LandingSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState<Language>('ar');
  const [showLanguages, setShowLanguages] = useState(false);

  const t = translations[language];
  const isRtl = language === 'ar' || language === 'ur';

  const menuItems = [
    { icon: Home, label: t.home, to: "/" },
    { icon: Heart, label: t.athkar, to: "/athkar" },
    { icon: Search, label: t.search, to: "/quran" },
  ];

  return (
    <>
      {/* Toggle Button - Right Side */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-50 h-12 w-12 rounded-2xl border-primary/20 bg-background/80 backdrop-blur-xl hover:bg-primary/10 transition-all duration-300 hover:scale-110 hover:border-primary shadow-lg"
      >
        <Menu className="w-5 h-5 text-primary" />
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Opens from Right */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-card border-l border-primary/10 shadow-2xl z-50 transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b border-primary/10",
          isRtl ? "flex-row" : "flex-row-reverse"
        )}>
          <div className={cn("flex items-center gap-2", isRtl ? "flex-row" : "flex-row-reverse")}>
            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold font-arabic text-foreground">{t.title}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-10 w-10 rounded-xl hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-4 space-y-4">
            {/* Quick Links */}
            <div className="space-y-2">
              <p className={cn(
                "text-xs text-muted-foreground font-medium px-1 mb-3",
                isRtl ? "text-right" : "text-left"
              )}>
                {isRtl ? 'التنقل السريع' : 'Quick Navigation'}
              </p>
              {menuItems.map((item, i) => (
                <Link
                  key={i}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors group",
                    isRtl ? "flex-row" : "flex-row-reverse"
                  )}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <item.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <span className={cn(
                    "font-medium text-foreground flex-1",
                    isRtl ? "text-right" : "text-left"
                  )}>{item.label}</span>
                  {isRtl ? (
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-primary/10 my-4" />

            {/* Settings Header */}
            <p className={cn(
              "text-xs text-muted-foreground font-medium px-1 mb-3",
              isRtl ? "text-right" : "text-left"
            )}>{t.settings}</p>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors w-full group",
                isRtl ? "flex-row text-right" : "flex-row-reverse text-left"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors",
                isRtl ? "order-first" : "order-last"
              )}>
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                ) : (
                  <Moon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                )}
              </div>
              <span className={cn(
                "font-medium text-foreground flex-1",
                isRtl ? "text-right" : "text-left"
              )}>
                {theme === "dark" ? t.lightMode : t.darkMode}
              </span>
            </button>

            {/* Language Selector */}
            <div className="space-y-2">
              <button
                onClick={() => setShowLanguages(!showLanguages)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors w-full group",
                  isRtl ? "flex-row text-right" : "flex-row-reverse text-left"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors",
                  isRtl ? "order-first" : "order-last"
                )}>
                  <Globe className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className={cn(
                  "font-medium text-foreground flex-1",
                  isRtl ? "text-right" : "text-left"
                )}>{t.language}</span>
                <span className="text-sm text-muted-foreground">
                  {languages.find(l => l.code === language)?.nativeName}
                </span>
                {isRtl ? (
                  <ChevronLeft className={cn("w-4 h-4 text-muted-foreground transition-transform", showLanguages && "-rotate-90")} />
                ) : (
                  <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", showLanguages && "rotate-90")} />
                )}
              </button>

              {showLanguages && (
                <div className="space-y-1 px-2 animate-fade-in">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLanguages(false);
                      }}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-colors w-full",
                        language === lang.code 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted/50 text-foreground",
                        isRtl ? "flex-row justify-end" : "flex-row-reverse justify-start"
                      )}
                    >
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-sm text-muted-foreground">({lang.name})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-primary/10 my-4" />

            {/* App Info */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-primary/10">
              <div className={cn(
                "flex items-center gap-3 mb-3",
                isRtl ? "flex-row text-right" : "flex-row-reverse text-left"
              )}>
                <Info className={cn("w-5 h-5 text-primary", isRtl ? "order-first" : "order-last")} />
                <span className="font-medium text-foreground">{t.about}</span>
              </div>
              <p className={cn(
                "text-sm text-muted-foreground leading-relaxed",
                isRtl ? "text-right" : "text-left"
              )}>
                {t.aboutText}
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default LandingSidebar;

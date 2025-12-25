import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Sun, 
  Moon, 
  Cloud, 
  Sunrise,
  Star,
  Heart,
  BookOpen,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Helmet } from "react-helmet";

interface Thikr {
  id: number;
  text: string;
  count: number;
  reference?: string;
}

interface AthkarCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  athkar: Thikr[];
}

const athkarData: AthkarCategory[] = [
  {
    id: "morning",
    title: "أذكار الصباح",
    icon: <Sunrise className="w-6 h-6" />,
    color: "from-amber-500 to-orange-500",
    athkar: [
      { id: 1, text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1, reference: "رواه أبو داود" },
      { id: 2, text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ", count: 1, reference: "رواه الترمذي" },
      { id: 3, text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100, reference: "متفق عليه" },
      { id: 4, text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 10, reference: "متفق عليه" },
      { id: 5, text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", count: 3, reference: "رواه مسلم" },
    ]
  },
  {
    id: "evening",
    title: "أذكار المساء",
    icon: <Moon className="w-6 h-6" />,
    color: "from-indigo-500 to-purple-500",
    athkar: [
      { id: 1, text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1, reference: "رواه أبو داود" },
      { id: 2, text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ", count: 1, reference: "رواه الترمذي" },
      { id: 3, text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", count: 3, reference: "رواه مسلم" },
      { id: 4, text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", count: 3, reference: "رواه أبو داود والترمذي" },
    ]
  },
  {
    id: "sleep",
    title: "أذكار النوم",
    icon: <Star className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    athkar: [
      { id: 1, text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", count: 1, reference: "متفق عليه" },
      { id: 2, text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", count: 3, reference: "رواه أبو داود والترمذي" },
      { id: 3, text: "سُبْحَانَ اللَّهِ", count: 33, reference: "متفق عليه" },
      { id: 4, text: "الْحَمْدُ لِلَّهِ", count: 33, reference: "متفق عليه" },
      { id: 5, text: "اللَّهُ أَكْبَرُ", count: 34, reference: "متفق عليه" },
    ]
  },
  {
    id: "general",
    title: "أذكار متنوعة",
    icon: <Heart className="w-6 h-6" />,
    color: "from-rose-500 to-pink-500",
    athkar: [
      { id: 1, text: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ", count: 3, reference: "رواه أبو داود والترمذي" },
      { id: 2, text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", count: 10, reference: "متفق عليه" },
      { id: 3, text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ", count: 10, reference: "متفق عليه" },
      { id: 4, text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ", count: 10, reference: "رواه الترمذي" },
    ]
  },
];

const Athkar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <Helmet>
        <title>الأذكار والأدعية - القرآن الكريم</title>
        <meta
          name="description"
          content="أذكار الصباح والمساء والنوم والأدعية اليومية من السنة النبوية"
        />
        <html lang="ar" dir="rtl" />
      </Helmet>

      <div className="min-h-screen bg-background" dir="rtl">
        {/* خلفية */}
        <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="star-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M10 0L12.5 7.5L20 10L12.5 12.5L10 20L7.5 12.5L0 10L7.5 7.5Z" fill="currentColor" className="text-primary" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#star-pattern)" />
          </svg>
        </div>

        {/* هيدر */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-primary" />
          
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link to="/">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                    <ArrowRight className="w-4 h-4" />
                    <span className="hidden sm:inline">الرئيسية</span>
                  </Button>
                </Link>
                <Link to="/quran">
                  <Button variant="ghost" size="sm" className="w-9 h-9 p-0 text-muted-foreground hover:text-foreground">
                    <BookOpen className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
                  <Heart className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-lg font-bold font-amiri text-foreground">الأذكار والأدعية</h1>
              </div>

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
        </header>

        <main className="container mx-auto py-8 px-4 relative z-10">
          {/* مقدمة */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold font-arabic text-foreground mb-3">
              حَصِّن نفسك بذكر الله
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              أذكار من السنة النبوية الشريفة للحفظ والتحصين
            </p>
          </div>

          {/* الأقسام */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {athkarData.map((category) => (
              <div 
                key={category.id}
                className="bg-card rounded-3xl border border-border/50 overflow-hidden"
              >
                {/* رأس القسم */}
                <div className={`p-5 bg-gradient-to-r ${category.color}`}>
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-amiri">{category.title}</h3>
                      <p className="text-sm opacity-80">{category.athkar.length} أذكار</p>
                    </div>
                  </div>
                </div>

                {/* الأذكار */}
                <div className="p-4 space-y-3">
                  {category.athkar.map((thikr, index) => (
                    <div 
                      key={thikr.id}
                      className="p-4 bg-muted/30 rounded-xl border border-border/30 hover:border-primary/30 transition-colors"
                    >
                      <p className="font-arabic text-lg text-foreground leading-loose mb-3">
                        {thikr.text}
                      </p>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                          {thikr.reference}
                        </span>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {thikr.count} {thikr.count === 1 ? "مرة" : thikr.count <= 10 ? "مرات" : "مرة"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* الفوتر */}
        <footer className="bg-muted/30 border-t border-border/50 py-6 px-4 mt-8">
          <div className="container mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="font-amiri text-foreground">المصحف الإلكتروني</span>
            </div>
            <p className="text-sm text-muted-foreground">
              جميع الحقوق محفوظة © {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Athkar;

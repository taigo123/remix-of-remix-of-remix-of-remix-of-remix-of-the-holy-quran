import { Link } from "react-router-dom";
import { BookOpen, ChevronLeft, Moon, Sparkles, Star, Sun, Book, Feather } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Helmet } from "react-helmet";

const Landing = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <Helmet>
        <title>القرآن الكريم - تفسير وتلاوة</title>
        <meta
          name="description"
          content="تطبيق القرآن الكريم مع التفسير الشامل والتلاوة الصوتية - اقرأ واستمع وتدبر آيات الله"
        />
        <html lang="ar" dir="rtl" />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950 via-[#1a1a2e] to-[#0f0f1a]" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Islamic Geometric Pattern Overlay */}
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="islamic-geo" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M10 0L20 10L10 20L0 10Z" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-primary" />
                <circle cx="10" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-primary" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamic-geo)" />
          </svg>
        </div>

        {/* Radial Light Effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl" />
        
        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background/90 to-transparent" />

        {/* Theme Toggle */}
        <div className="absolute top-6 left-6 z-20">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-12 w-12 p-0 rounded-full border-primary/40 bg-background/10 backdrop-blur-xl hover:bg-primary/30 transition-all duration-300 hover:scale-110 hover:border-primary"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-primary" />
            ) : (
              <Moon className="w-5 h-5 text-primary" />
            )}
          </Button>
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
          {/* Premium Book/Mushaf Design */}
          <div className="relative w-full max-w-2xl perspective-1000">
            {/* Outer Book Frame with 3D Effect */}
            <div className="relative transform-gpu transition-transform duration-500 hover:scale-[1.02]">
              {/* Book Shadow */}
              <div className="absolute -inset-4 bg-gradient-to-b from-primary/20 to-transparent blur-2xl rounded-3xl opacity-50" />
              
              {/* Leather Texture Frame */}
              <div className="relative bg-gradient-to-br from-amber-800 via-amber-900 to-amber-950 rounded-3xl p-1.5 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.1)]">
                {/* Gold Embossed Border */}
                <div className="absolute inset-0 rounded-3xl">
                  <div className="absolute inset-1 rounded-[22px] border-2 border-primary/60" />
                  <div className="absolute inset-2 rounded-[20px] border border-primary/30" />
                </div>

                {/* Inner Parchment Page */}
                <div className="relative bg-gradient-to-b from-[hsl(40,40%,96%)] via-[hsl(38,35%,93%)] to-[hsl(35,30%,88%)] dark:from-[hsl(215,30%,14%)] dark:via-[hsl(215,35%,12%)] dark:to-[hsl(215,40%,10%)] rounded-[20px] p-8 md:p-12 overflow-hidden">
                  
                  {/* Ornate Corner Decorations */}
                  <div className="absolute top-3 right-3 w-20 h-20">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-primary/40">
                      <path d="M0,0 Q50,0 100,0 Q100,50 100,100 Q75,75 50,100 Q50,50 0,50 Q0,25 0,0" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="85" cy="15" r="3" fill="currentColor" fillOpacity="0.5" />
                    </svg>
                  </div>
                  <div className="absolute top-3 left-3 w-20 h-20 transform -scale-x-100">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-primary/40">
                      <path d="M0,0 Q50,0 100,0 Q100,50 100,100 Q75,75 50,100 Q50,50 0,50 Q0,25 0,0" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="85" cy="15" r="3" fill="currentColor" fillOpacity="0.5" />
                    </svg>
                  </div>
                  <div className="absolute bottom-3 right-3 w-20 h-20 transform -scale-y-100">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-primary/40">
                      <path d="M0,0 Q50,0 100,0 Q100,50 100,100 Q75,75 50,100 Q50,50 0,50 Q0,25 0,0" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="85" cy="15" r="3" fill="currentColor" fillOpacity="0.5" />
                    </svg>
                  </div>
                  <div className="absolute bottom-3 left-3 w-20 h-20 transform scale-x-[-1] scale-y-[-1]">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-primary/40">
                      <path d="M0,0 Q50,0 100,0 Q100,50 100,100 Q75,75 50,100 Q50,50 0,50 Q0,25 0,0" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="85" cy="15" r="3" fill="currentColor" fillOpacity="0.5" />
                    </svg>
                  </div>

                  {/* Bismillah with Elegant Styling */}
                  <div className="text-center mb-6 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-64 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    </div>
                    <p className="font-arabic text-xl md:text-2xl text-primary relative bg-[hsl(40,40%,96%)] dark:bg-[hsl(215,30%,14%)] px-4 inline-block">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                  </div>

                  {/* Main Circle with Quran Symbol - Enhanced */}
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      {/* Multi-layer Glow Effect */}
                      <div className="absolute inset-0 w-44 h-44 md:w-56 md:h-56 rounded-full bg-primary/30 blur-3xl animate-pulse" />
                      <div className="absolute inset-4 w-36 h-36 md:w-48 md:h-48 rounded-full bg-primary/40 blur-xl" />

                      {/* Main Circle with Intricate Border */}
                      <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-primary via-amber-500 to-primary flex items-center justify-center shadow-[0_0_60px_rgba(202,138,4,0.4)] animate-pulse-gold">
                        {/* Decorative Rings */}
                        <div className="absolute inset-1 rounded-full border-2 border-primary-foreground/40" />
                        <div className="absolute inset-3 rounded-full border border-primary-foreground/25" />
                        <div className="absolute inset-5 rounded-full border border-dashed border-primary-foreground/15" />
                        <div className="absolute inset-7 rounded-full bg-gradient-to-br from-primary-foreground/10 to-transparent" />

                        {/* Central Icon */}
                        <div className="relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center">
                          <Book className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]" />
                        </div>
                      </div>

                      {/* Orbiting Decorations */}
                      <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
                        <Sparkles className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-5 text-primary drop-shadow-lg" />
                        <Star className="absolute top-1/2 -right-1 -translate-y-1/2 w-4 h-4 text-primary fill-primary/50 drop-shadow-lg" />
                        <Sparkles className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 text-primary drop-shadow-lg" />
                        <Star className="absolute top-1/2 -left-1 -translate-y-1/2 w-4 h-4 text-primary fill-primary/50 drop-shadow-lg" />
                      </div>
                    </div>
                  </div>

                  {/* Title with Premium Typography */}
                  <div className="text-center mb-6">
                    <h1 className="font-arabic text-4xl md:text-5xl font-bold text-foreground mb-3 drop-shadow-sm" dir="rtl">
                      القرآن الكريم
                    </h1>
                    <p className="font-amiri text-xl md:text-2xl text-primary mb-3 animate-shimmer-text" dir="rtl">
                      كتاب الله المبين
                    </p>
                    <div className="flex items-center justify-center gap-6 text-muted-foreground text-sm">
                      <span className="flex items-center gap-1" dir="rtl">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">114</span>
                        سورة
                      </span>
                      <span className="flex items-center gap-1" dir="rtl">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">30</span>
                        جزء
                      </span>
                      <span className="flex items-center gap-1" dir="rtl">
                        <span className="w-7 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">6236</span>
                        آية
                      </span>
                    </div>
                  </div>

                  {/* Elegant Divider */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-primary/20" />
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/30">
                        <Feather className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-primary/40 to-primary/20" />
                  </div>

                  {/* Description */}
                  <p className="font-naskh text-center text-muted-foreground leading-loose mb-8 max-w-md mx-auto text-sm md:text-base" dir="rtl">
                    اقرأ القرآن الكريم بتفسير شامل من أمهات كتب التفسير، واستمع للتلاوات بأصوات القراء المميزين
                  </p>

                  {/* Premium CTA Button */}
                  <div className="flex justify-center">
                    <Link to="/quran">
                      <Button
                        size="lg"
                        className="group relative overflow-hidden gradient-gold text-primary-foreground gap-3 px-10 py-7 text-lg rounded-2xl shadow-[0_10px_40px_-10px_rgba(202,138,4,0.5)] transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(202,138,4,0.6)] hover:scale-105"
                      >
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        
                        <BookOpen className="w-6 h-6 relative z-10" />
                        <span className="font-amiri font-bold text-xl relative z-10">ابدأ القراءة</span>
                        <ChevronLeft className="w-6 h-6 relative z-10 transition-transform group-hover:-translate-x-2" />
                      </Button>
                    </Link>
                  </div>

                  {/* Verse Preview - Enhanced */}
                  <div className="mt-10 pt-6 border-t border-primary/15 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[hsl(40,40%,96%)] dark:bg-[hsl(215,30%,14%)] px-3">
                      <Star className="w-4 h-4 text-primary/50 fill-primary/20" />
                    </div>
                    <p className="font-amiri text-center text-primary/80 text-sm mb-3" dir="rtl">
                      من سورة الفاتحة
                    </p>
                    <p className="font-arabic text-center text-lg text-foreground/80 leading-relaxed" dir="rtl">
                      ﴿ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴾
                    </p>
                  </div>
                </div>
              </div>

              {/* Book Spine Effect */}
              <div className="absolute left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-gradient-to-b from-transparent via-black/20 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Footer Credit */}
          <p className="mt-12 text-center text-sm text-muted-foreground/50 font-amiri" dir="rtl">
            تفسير مجمّع من أمهات كتب التفسير الإسلامية
          </p>
        </div>
      </div>
    </>
  );
};

export default Landing;

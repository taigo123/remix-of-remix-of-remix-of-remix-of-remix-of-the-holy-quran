import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Menu, 
  X, 
  BookOpen, 
  Settings, 
  Heart, 
  Moon, 
  Sun,
  ChevronLeft,
  Home,
  Search,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { surahIndex } from "@/data/surahIndex";
import { isDataAvailable } from "@/data/surahsData";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const LandingSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'index' | 'settings'>('index');

  const menuItems = [
    { icon: Home, label: "الرئيسية", to: "/" },
    { icon: BookOpen, label: "فهرس السور", to: "/quran" },
    { icon: Heart, label: "الأذكار والأدعية", to: "/athkar" },
    { icon: Search, label: "البحث", to: "/quran" },
  ];

  return (
    <>
      {/* Toggle Button */}
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

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-card border-l border-primary/10 shadow-2xl z-50 transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary/10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold font-arabic text-foreground">القرآن الكريم</span>
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

        {/* Tabs */}
        <div className="flex border-b border-primary/10">
          <button
            onClick={() => setActiveTab('index')}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors",
              activeTab === 'index' 
                ? "text-primary border-b-2 border-primary bg-primary/5" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BookOpen className="w-4 h-4 mx-auto mb-1" />
            فهرس السور
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors",
              activeTab === 'settings' 
                ? "text-primary border-b-2 border-primary bg-primary/5" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Settings className="w-4 h-4 mx-auto mb-1" />
            الإعدادات
          </button>
        </div>

        {/* Content */}
        <ScrollArea className="h-[calc(100vh-180px)]">
          {activeTab === 'index' ? (
            <div className="p-4 space-y-2">
              {surahIndex.map((surah) => {
                const hasData = isDataAvailable(surah.id);
                return (
                  <Link
                    key={surah.id}
                    to={hasData ? `/surah/${surah.id}` : '#'}
                    onClick={(e) => {
                      if (!hasData) e.preventDefault();
                      else setIsOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                      hasData 
                        ? "hover:bg-primary/10 cursor-pointer group" 
                        : "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm",
                      hasData 
                        ? "gradient-gold text-primary-foreground shadow-sm group-hover:scale-105 transition-transform" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {surah.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-bold font-amiri text-sm truncate",
                        hasData ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {surah.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {surah.versesCount} آية
                      </p>
                    </div>
                    {hasData && (
                      <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Quick Links */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium px-1 mb-3">التنقل السريع</p>
                {menuItems.map((item, i) => (
                  <Link
                    key={i}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <item.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <span className="font-medium text-foreground">{item.label}</span>
                    <ChevronLeft className="w-4 h-4 text-muted-foreground mr-auto" />
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-primary/10 my-4" />

              {/* Theme Toggle */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium px-1 mb-3">المظهر</p>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors w-full group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    {theme === "dark" ? (
                      <Sun className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                    ) : (
                      <Moon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                    )}
                  </div>
                  <span className="font-medium text-foreground">
                    {theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
                  </span>
                </button>
              </div>

              {/* App Info */}
              <div className="h-px bg-primary/10 my-4" />
              
              <div className="p-4 rounded-2xl bg-muted/30 border border-primary/10">
                <div className="flex items-center gap-3 mb-3">
                  <Info className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">عن التطبيق</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  تطبيق القرآن الكريم مع 14 تفسير موثوق و6 قراء مميزين. اقرأ واستمع وتدبر آيات الله.
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
};

export default LandingSidebar;

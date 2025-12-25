import { useState, useMemo, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  Globe,
  MessageSquare,
  Bell
} from "lucide-react";
import { UserFeedback } from "@/components/UserFeedback";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage, languages, regionLabels, LanguageRegion, LanguageInfo } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Notification sound using Web Audio API
const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.log('Could not play notification sound:', error);
  }
};

const LandingSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t, isRtl } = useLanguage();
  const [showLanguages, setShowLanguages] = useState(false);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [hasNewFeedback, setHasNewFeedback] = useState(false);

  useEffect(() => {
    // Fetch initial count
    const fetchFeedbackCount = async () => {
      const { count } = await supabase
        .from('user_feedback')
        .select('*', { count: 'exact', head: true });
      setFeedbackCount(count || 0);
    };
    fetchFeedbackCount();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('feedback-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_feedback'
        },
        (payload) => {
          console.log('New feedback received:', payload);
          setFeedbackCount(prev => prev + 1);
          setHasNewFeedback(true);
          playNotificationSound();
          
          // Show toast notification
          toast.success(
            language === 'ar' ? '📬 وصلت ملاحظة جديدة!' : '📬 New feedback received!',
            {
              description: language === 'ar' 
                ? `نوع الملاحظة: ${payload.new.feedback_type}` 
                : `Type: ${payload.new.feedback_type}`,
              duration: 5000,
            }
          );
          
          // Reset animation after 3 seconds
          setTimeout(() => setHasNewFeedback(false), 3000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [language]);
  const [languageSearch, setLanguageSearch] = useState("");

  // Filter languages based on search
  const filteredLanguages = useMemo(() => {
    if (!languageSearch.trim()) return languages;
    const search = languageSearch.toLowerCase();
    return languages.filter(lang => 
      lang.name.toLowerCase().includes(search) ||
      lang.nativeName.toLowerCase().includes(search) ||
      lang.code.toLowerCase().includes(search) ||
      lang.translator?.toLowerCase().includes(search)
    );
  }, [languageSearch]);

  // Group languages by region
  const groupedLanguages = useMemo(() => {
    const groups: Record<LanguageRegion, LanguageInfo[]> = {
      original: [],
      middleeast: [],
      european: [],
      asian: [],
      african: [],
    };
    
    filteredLanguages.forEach(lang => {
      groups[lang.region].push(lang);
    });
    
    return groups;
  }, [filteredLanguages]);

  const regionOrder: LanguageRegion[] = ['original', 'middleeast', 'european', 'asian', 'african'];

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
                {t.quickNavigation}
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
                <div className="space-y-2 px-2 animate-fade-in">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={isRtl ? "ابحث عن لغة..." : "Search language..."}
                      value={languageSearch}
                      onChange={(e) => setLanguageSearch(e.target.value)}
                      className={cn(
                        "h-10 pr-10 bg-background border-primary/20 rounded-xl text-sm",
                        isRtl ? "text-right" : "text-left"
                      )}
                      dir={isRtl ? "rtl" : "ltr"}
                    />
                  </div>
                  
                  {/* Languages List - Grouped by Region */}
                  <ScrollArea className="h-72">
                    <div className="space-y-3">
                      {filteredLanguages.length > 0 ? (
                        regionOrder.map(region => {
                          const regionLangs = groupedLanguages[region];
                          if (regionLangs.length === 0) return null;
                          
                          return (
                            <div key={region} className="space-y-1">
                              {/* Region Header */}
                              <div className={cn(
                                "sticky top-0 z-10 px-2 py-1.5 bg-muted/80 backdrop-blur-sm rounded-lg text-xs font-medium text-muted-foreground flex items-center gap-2",
                                isRtl ? "flex-row" : "flex-row-reverse"
                              )}>
                                <span>{isRtl ? regionLabels[region].ar : regionLabels[region].en}</span>
                                <span className="text-muted-foreground/50">({regionLangs.length})</span>
                              </div>
                              
                              {/* Languages in this region */}
                              {regionLangs.map((lang) => (
                                <button
                                  key={lang.code}
                                  onClick={() => {
                                    setLanguage(lang.code);
                                    setShowLanguages(false);
                                    setLanguageSearch("");
                                  }}
                                  className={cn(
                                    "flex flex-col gap-1 p-3 rounded-xl transition-colors w-full",
                                    language === lang.code 
                                      ? "bg-primary/10 text-primary" 
                                      : "hover:bg-muted/50 text-foreground",
                                    isRtl ? "items-end text-right" : "items-start text-left"
                                  )}
                                >
                                  <div className={cn(
                                    "flex items-center gap-2",
                                    isRtl ? "flex-row" : "flex-row-reverse"
                                  )}>
                                    <span className="font-medium">{lang.nativeName}</span>
                                    <span className="text-sm text-muted-foreground">({lang.name})</span>
                                  </div>
                                  {lang.translator && lang.code !== 'ar' && (
                                    <div className="text-xs text-muted-foreground/70">
                                      {isRtl ? `المترجم: ${lang.translator}` : `Translator: ${lang.translator}`}
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          );
                        })
                      ) : (
                        <div className={cn(
                          "p-4 text-center text-muted-foreground text-sm",
                          isRtl ? "text-right" : "text-left"
                        )}>
                          {isRtl ? "لا توجد نتائج" : "No results found"}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  
                  {/* Language Count */}
                  <div className={cn(
                    "text-xs text-muted-foreground pt-2 border-t border-primary/10",
                    isRtl ? "text-right" : "text-left"
                  )}>
                    {isRtl 
                      ? `${languages.length} لغة متاحة` 
                      : `${languages.length} languages available`}
                  </div>
                </div>
              )}
            </div>

            {/* Feedback Button */}
            <div className={cn(
              "flex items-center gap-3 p-3 rounded-xl hover:bg-amber-500/10 transition-colors w-full group cursor-pointer",
              isRtl ? "flex-row text-right" : "flex-row-reverse text-left",
              hasNewFeedback && "bg-amber-500/20 animate-pulse"
            )}>
              <div className={cn(
                "w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500 transition-all duration-300 relative",
                isRtl ? "order-first" : "order-last",
                hasNewFeedback && "bg-amber-500 animate-bounce"
              )}>
                {hasNewFeedback ? (
                  <Bell className="w-5 h-5 text-white animate-shake" />
                ) : (
                  <MessageSquare className="w-5 h-5 text-amber-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                )}
                {feedbackCount > 0 && (
                  <span className={cn(
                    "absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center",
                    hasNewFeedback ? "animate-ping" : "animate-pulse"
                  )}>
                    {feedbackCount > 99 ? '99+' : feedbackCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "font-medium text-amber-600 dark:text-amber-400 group-hover:text-amber-500 transition-colors",
                  isRtl ? "order-last" : "order-first",
                  hasNewFeedback && "text-amber-500 font-bold"
                )}>
                  {hasNewFeedback 
                    ? (isRtl ? "📬 ملاحظة جديدة!" : "📬 New feedback!") 
                    : (isRtl ? "ملاحظات" : "Feedback")}
                </span>
                <UserFeedback />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-primary/10 my-4" />
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

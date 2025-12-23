import { getSurahData } from "@/data/surahsData";
import { VerseCard } from "./VerseCard";
import { SectionNav } from "./SectionNav";
import { SearchBar, SearchResult } from "./SearchBar";
import { FavoritesPanel } from "./FavoritesPanel";
import { useFavorites } from "@/hooks/useFavorites";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ChevronUp, Heart } from "lucide-react";
import { Button } from "./ui/button";

interface TafsirContentProps {
  playerHighlightedVerse?: number | null;
}

// تجميع الآيات حسب المواضيع
const getSections = () => {
  const surah = getSurahData(36);
  if (!surah) return [];
  
  const themeGroups: { id: string; title: string; description: string; verses: typeof surah.verses }[] = [];
  let currentTheme = "";
  
  surah.verses.forEach((verse) => {
    if (verse.theme && verse.theme !== currentTheme) {
      currentTheme = verse.theme;
      themeGroups.push({
        id: `theme-${verse.id}`,
        title: verse.theme,
        description: verse.tafsir.substring(0, 100) + "...",
        verses: [verse],
      });
    } else if (themeGroups.length > 0) {
      themeGroups[themeGroups.length - 1].verses.push(verse);
    }
  });
  
  return themeGroups;
};

export const TafsirContent = ({ playerHighlightedVerse }: TafsirContentProps) => {
  const sections = useMemo(() => getSections(), []);
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [highlightedVerse, setHighlightedVerse] = useState<number | null>(null);

  // Favorites
  const { favorites, toggleFavorite, isFavorite, clearFavorites } = useFavorites();

  const verseRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSectionChange = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToVerse = (verseNumber: number) => {
    const el = verseRefs.current.get(verseNumber);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleResultsChange = useCallback(
    (results: SearchResult[], query: string) => {
      setSearchResults(results);
      setSearchQuery(query);
      setCurrentResultIndex(0);
      if (results.length > 0) {
        const firstVerse = results[0].verse.id;
        setHighlightedVerse(firstVerse);
        scrollToVerse(firstVerse);
      } else {
        setHighlightedVerse(null);
      }
    },
    []
  );

  const handleNavigate = useCallback((result: SearchResult, index: number) => {
    setCurrentResultIndex(index);
    setHighlightedVerse(result.verse.id);
    scrollToVerse(result.verse.id);
  }, []);

  const handleFavoriteNavigate = useCallback((verseNumber: number) => {
    setShowFavorites(false);
    setTimeout(() => scrollToVerse(verseNumber), 300);
  }, []);

  const setVerseRef = useCallback(
    (verseNumber: number) => (el: HTMLDivElement | null) => {
      if (el) {
        verseRefs.current.set(verseNumber, el);
      }
    },
    []
  );

  // Determine which verse to highlight (player takes priority over search)
  const activeHighlight = playerHighlightedVerse ?? highlightedVerse;

  return (
    <main className="container py-12 relative">
      {/* Favorites Panel */}
      {showFavorites && (
        <>
          <div
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
            onClick={() => setShowFavorites(false)}
          />
          <FavoritesPanel
            favorites={favorites}
            onNavigate={handleFavoriteNavigate}
            onClear={clearFavorites}
            onClose={() => setShowFavorites(false)}
          />
        </>
      )}

      {/* Favorites Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowFavorites(true)}
        className="fixed top-4 left-4 z-30 h-10 gap-2 rounded-full border-primary/30 bg-background/80 backdrop-blur-sm hover:bg-primary/10"
      >
        <Heart className="w-4 h-4 text-primary" />
        <span className="hidden sm:inline">المفضلة</span>
        {favorites.length > 0 && (
          <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {favorites.length}
          </span>
        )}
      </Button>

      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <SearchBar
          onResultsChange={handleResultsChange}
          onNavigate={handleNavigate}
          currentIndex={currentResultIndex}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className="lg:sticky lg:top-4">
            <SectionNav
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          </div>
        </aside>

        {/* Main Content - Grid for horizontal layout */}
        <div className="flex-1 min-w-0">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="mb-16 scroll-mt-8">
              {/* Section Header */}
              <div className="mb-8 p-6 rounded-2xl gradient-gold shadow-gold">
                <h2
                  className="font-arabic text-2xl md:text-3xl font-bold text-primary-foreground mb-2"
                  dir="rtl"
                >
                  {section.title}
                </h2>
                <p
                  className="font-naskh text-lg text-primary-foreground/80"
                  dir="rtl"
                >
                  {section.description}
                </p>
                <div className="mt-3 text-primary-foreground/70 text-sm" dir="rtl">
                  الآيات: {section.verses[0].id} -{" "}
                  {section.verses[section.verses.length - 1].id}
                </div>
              </div>

              {/* Verses Grid (2 cols on xl) */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {section.verses.map((verse, index) => (
                  <VerseCard
                    key={verse.id}
                    ref={setVerseRef(verse.id)}
                    verse={verse}
                    index={index}
                    searchQuery={searchQuery}
                    isHighlighted={activeHighlight === verse.id}
                    isFavorite={isFavorite(verse.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 w-12 h-12 rounded-full gradient-gold shadow-gold flex items-center justify-center text-primary-foreground transition-all duration-300 hover:scale-110 animate-fade-in z-50"
          aria-label="العودة للأعلى"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </main>
  );
};

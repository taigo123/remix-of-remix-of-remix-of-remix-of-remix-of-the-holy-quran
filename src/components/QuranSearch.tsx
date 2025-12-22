import { useState, useMemo } from "react";
import { Search, X, ChevronDown, ChevronUp, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { availableSurahs } from "@/data/surahsData";
import { surahIndex } from "@/data/surahIndex";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SearchResult {
  surahId: number;
  surahName: string;
  verseId: number;
  arabicText: string;
  tafsir: string;
  matchType: "arabic" | "tafsir";
  revelationType: string;
}

type MatchFilter = "all" | "arabic" | "tafsir";
type RevelationFilter = "all" | "مكية" | "مدنية";

export const QuranSearch = () => {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // فلاتر البحث
  const [matchFilter, setMatchFilter] = useState<MatchFilter>("all");
  const [revelationFilter, setRevelationFilter] = useState<RevelationFilter>("all");
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];

    const searchResults: SearchResult[] = [];
    const normalizedQuery = query.trim().toLowerCase();

    Object.values(availableSurahs).forEach((surah) => {
      // فلتر السورة
      if (selectedSurah && surah.id !== selectedSurah) return;
      
      // فلتر نوع الوحي
      if (revelationFilter !== "all" && surah.revelationType !== revelationFilter) return;

      surah.verses.forEach((verse) => {
        const matchesArabic = verse.arabicText.includes(query.trim());
        const matchesTafsir = verse.tafsir.toLowerCase().includes(normalizedQuery);

        // فلتر نوع المطابقة
        if (matchFilter === "arabic" && !matchesArabic) return;
        if (matchFilter === "tafsir" && !matchesTafsir) return;

        if (matchesArabic) {
          searchResults.push({
            surahId: surah.id,
            surahName: surah.name,
            verseId: verse.id,
            arabicText: verse.arabicText,
            tafsir: verse.tafsir,
            matchType: "arabic",
            revelationType: surah.revelationType,
          });
        } else if (matchesTafsir && matchFilter !== "arabic") {
          searchResults.push({
            surahId: surah.id,
            surahName: surah.name,
            verseId: verse.id,
            arabicText: verse.arabicText,
            tafsir: verse.tafsir,
            matchType: "tafsir",
            revelationType: surah.revelationType,
          });
        }
      });
    });

    return searchResults.slice(0, 50);
  }, [query, matchFilter, revelationFilter, selectedSurah]);

  const handleClear = () => {
    setQuery("");
    setShowResults(false);
    setCurrentIndex(0);
  };

  const handleClearFilters = () => {
    setMatchFilter("all");
    setRevelationFilter("all");
    setSelectedSurah(null);
  };

  const hasActiveFilters = matchFilter !== "all" || revelationFilter !== "all" || selectedSurah !== null;

  const handlePrev = () => {
    if (results.length === 0) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
  };

  const handleNext = () => {
    if (results.length === 0) return;
    setCurrentIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
  };

  const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    const escapedTerm = escapeRegex(searchTerm);
    const parts = text.split(new RegExp(`(${escapedTerm})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-primary/30 text-foreground px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // السور المتوفرة فقط
  const availableSurahsList = surahIndex.filter(s => s.id in availableSurahs);

  return (
    <div className="w-full max-w-2xl mx-auto" dir="rtl">
      <div className="relative">
        {/* شريط البحث الرئيسي */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowResults(true);
                setCurrentIndex(0);
              }}
              onFocus={() => setShowResults(true)}
              placeholder="ابحث في آيات القرآن والتفسير..."
              className="pr-10 pl-10 bg-background border-border focus:ring-primary/50"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                aria-label="مسح البحث"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* زر الفلاتر */}
          <Button
            variant={hasActiveFilters ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-9 px-3 gap-1.5",
              hasActiveFilters && "bg-primary text-primary-foreground"
            )}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">فلاتر</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-primary-foreground" />
            )}
          </Button>

          {results.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {currentIndex + 1} / {results.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handlePrev}
                aria-label="النتيجة السابقة"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleNext}
                aria-label="النتيجة التالية"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* لوحة الفلاتر */}
        {showFilters && (
          <Card className="mt-2 p-3 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium flex items-center gap-1.5">
                <Filter className="w-4 h-4" />
                فلاتر البحث
              </span>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                  onClick={handleClearFilters}
                >
                  مسح الكل
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* فلتر نوع المطابقة */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">البحث في</label>
                <div className="flex flex-wrap gap-1">
                  {[
                    { value: "all", label: "الكل" },
                    { value: "arabic", label: "النص" },
                    { value: "tafsir", label: "التفسير" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={matchFilter === option.value ? "default" : "outline"}
                      size="sm"
                      className="h-7 text-xs flex-1"
                      onClick={() => setMatchFilter(option.value as MatchFilter)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* فلتر نوع الوحي */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">نوع السورة</label>
                <div className="flex flex-wrap gap-1">
                  {[
                    { value: "all", label: "الكل" },
                    { value: "مكية", label: "مكية" },
                    { value: "مدنية", label: "مدنية" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={revelationFilter === option.value ? "default" : "outline"}
                      size="sm"
                      className="h-7 text-xs flex-1"
                      onClick={() => setRevelationFilter(option.value as RevelationFilter)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* فلتر السورة */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">السورة</label>
                <select
                  value={selectedSurah || ""}
                  onChange={(e) => setSelectedSurah(e.target.value ? Number(e.target.value) : null)}
                  className="w-full h-7 text-xs rounded-md border border-input bg-background px-2 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">جميع السور</option>
                  {availableSurahsList.map((surah) => (
                    <option key={surah.id} value={surah.id}>
                      {surah.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        )}

        {/* Search Results Dropdown */}
        {showResults && query.length >= 2 && (
          <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto shadow-xl border-2">
            {results.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>لا توجد نتائج للبحث</p>
                {hasActiveFilters && (
                  <p className="text-xs mt-1">جرب إزالة بعض الفلاتر</p>
                )}
              </div>
            ) : (
              <div className="divide-y">
                {results.map((result, index) => (
                  <Link
                    key={`${result.surahId}-${result.verseId}`}
                    to={`/surah/${result.surahId}#verse-${result.verseId}`}
                    onClick={() => setShowResults(false)}
                    className={`block p-3 hover:bg-muted/50 transition-colors ${
                      index === currentIndex ? "bg-primary/10" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {result.surahName}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        الآية {result.verseId}
                      </span>
                      <Badge
                        variant={result.matchType === "arabic" ? "default" : "outline"}
                        className="text-xs"
                      >
                        {result.matchType === "arabic" ? "النص" : "التفسير"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs mr-auto",
                          result.revelationType === "مكية"
                            ? "border-amber-500/50 text-amber-600 dark:text-amber-400"
                            : "border-emerald-500/50 text-emerald-600 dark:text-emerald-400"
                        )}
                      >
                        {result.revelationType}
                      </Badge>
                    </div>
                    <p className="text-sm font-arabic leading-relaxed mb-1 line-clamp-2">
                      {highlightText(result.arabicText, query)}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {highlightText(result.tafsir, query)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Click outside to close */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
};
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { getSurahData } from "@/data/surahsData";
import { Verse } from "@/data/types";
import { VoiceSearchButton } from "./VoiceSearchButton";

export interface SearchResult {
  verse: Verse;
  sectionId: string;
  matchField: "arabic" | "tafsir" | "benefits";
}

interface SearchBarProps {
  onResultsChange: (results: SearchResult[], query: string) => void;
  onNavigate: (result: SearchResult, index: number) => void;
  currentIndex: number;
}

export const SearchBar = ({
  onResultsChange,
  onNavigate,
  currentIndex,
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const allVerses = useMemo(() => {
    const surah = getSurahData(36);
    if (!surah) return [];
    return surah.verses.map((verse) => ({
      verse,
      sectionId: `section-${verse.id}`,
    }));
  }, []);

  const search = useCallback(
    (q: string) => {
      if (!q.trim()) {
        setResults([]);
        onResultsChange([], "");
        return;
      }

      const normalized = q.trim().toLowerCase();

      const found: SearchResult[] = [];

      allVerses.forEach(({ verse, sectionId }) => {
        if (verse.arabicText.includes(q.trim())) {
          found.push({ verse, sectionId, matchField: "arabic" });
        } else if (verse.tafsir.toLowerCase().includes(normalized)) {
          found.push({ verse, sectionId, matchField: "tafsir" });
        } else if (verse.benefits?.toLowerCase().includes(normalized)) {
          found.push({ verse, sectionId, matchField: "benefits" });
        }
      });

      setResults(found);
      onResultsChange(found, q.trim());
    },
    [allVerses, onResultsChange]
  );

  useEffect(() => {
    const timer = setTimeout(() => search(query), 200);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    onResultsChange([], "");
    inputRef.current?.focus();
  };

  const handlePrev = () => {
    if (results.length === 0) return;
    const prev = currentIndex > 0 ? currentIndex - 1 : results.length - 1;
    onNavigate(results[prev], prev);
  };

  const handleNext = () => {
    if (results.length === 0) return;
    const next = currentIndex < results.length - 1 ? currentIndex + 1 : 0;
    onNavigate(results[next], next);
  };

  const handleVoiceTranscript = (text: string) => {
    setQuery(text);
    inputRef.current?.focus();
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-xl" dir="rtl">
      <div className="relative flex-1">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث في الآيات والتفسير..."
          className="pr-10 pl-20 bg-background border-border focus:ring-primary/50"
        />
        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <VoiceSearchButton onTranscript={handleVoiceTranscript} />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground p-1"
              aria-label="مسح البحث"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

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
  );
};

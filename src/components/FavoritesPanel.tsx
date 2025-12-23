import { Heart, X, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { getSurahData } from "@/data/surahsData";
import { Verse } from "@/data/types";
import { useMemo } from "react";

interface FavoritesPanelProps {
  favorites: number[];
  onNavigate: (verseNumber: number) => void;
  onClear: () => void;
  onClose: () => void;
}

export const FavoritesPanel = ({
  favorites,
  onNavigate,
  onClear,
  onClose,
}: FavoritesPanelProps) => {
  const favoriteVerses = useMemo(() => {
    const surah = getSurahData(36);
    if (!surah) return [];
    return surah.verses.filter((v) => favorites.includes(v.id));
  }, [favorites]);

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-full bg-background border-r border-border shadow-elevated animate-slide-in-right flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2 text-primary">
          <Heart className="w-5 h-5 fill-primary" />
          <span className="font-amiri font-bold text-lg">المفضلة</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        {favoriteVerses.length === 0 ? (
          <div className="text-center text-muted-foreground py-12" dir="rtl">
            <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-naskh">لا توجد آيات مفضلة</p>
            <p className="text-sm mt-2">اضغط على أيقونة القلب لإضافة آية للمفضلة</p>
          </div>
        ) : (
          <div className="space-y-3" dir="rtl">
            {favoriteVerses.map((verse) => (
              <button
                key={verse.id}
                onClick={() => onNavigate(verse.id)}
                className="w-full text-right p-3 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-card transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="verse-number text-xs w-8 h-8">{verse.id}</span>
                  {verse.theme && (
                    <span className="text-xs text-muted-foreground">{verse.theme}</span>
                  )}
                </div>
                <p className="font-arabic text-sm leading-relaxed line-clamp-2">
                  {verse.arabicText}
                </p>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      {favoriteVerses.length > 0 && (
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="w-full gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            <span>مسح الكل</span>
          </Button>
        </div>
      )}
    </div>
  );
};

import { getSurahData } from "@/data/surahsData";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface SectionNavProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
}

// تقسيم السورة إلى أقسام بناءً على المواضيع
const getSections = () => {
  const surah = getSurahData(36);
  if (!surah) return [];
  
  // تجميع الآيات حسب المواضيع
  const themeGroups: { id: string; title: string; verses: number[] }[] = [];
  let currentTheme = "";
  
  surah.verses.forEach((verse) => {
    if (verse.theme && verse.theme !== currentTheme) {
      currentTheme = verse.theme;
      themeGroups.push({
        id: `theme-${verse.id}`,
        title: verse.theme,
        verses: [verse.id],
      });
    } else if (themeGroups.length > 0) {
      themeGroups[themeGroups.length - 1].verses.push(verse.id);
    }
  });
  
  return themeGroups;
};

export const SectionNav = ({ activeSection, onSectionChange }: SectionNavProps) => {
  const sections = useMemo(() => getSections(), []);
  
  return (
    <nav className="sticky top-4 z-10">
      <div className="gradient-navy rounded-2xl p-4 shadow-elevated overflow-hidden">
        <h3 className="font-amiri font-bold text-lg text-primary-foreground mb-4 text-center" dir="rtl">
          أقسام السورة
        </h3>
        <div className="space-y-1 max-h-[60vh] overflow-y-auto scrollbar-thin">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "w-full text-right p-3 rounded-xl transition-all duration-300 flex items-center justify-between gap-2 group",
                activeSection === section.id
                  ? "bg-primary text-primary-foreground shadow-gold"
                  : "text-primary-foreground/70 hover:bg-primary/20 hover:text-primary-foreground"
              )}
              dir="rtl"
            >
              <span className="font-naskh text-sm leading-relaxed">{section.title}</span>
              <ChevronLeft
                className={cn(
                  "w-4 h-4 transition-transform",
                  activeSection === section.id ? "rotate-90" : "group-hover:-translate-x-1"
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

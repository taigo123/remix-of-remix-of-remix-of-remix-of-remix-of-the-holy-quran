import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Loader2, ChevronDown, Sparkles } from "lucide-react";
import { TafsirSource } from "@/hooks/useTafsir";

interface TafsirSourceInfo {
  id: TafsirSource;
  name: string;
  description: string;
  author: string;
}

interface TafsirSourceSelectorProps {
  selectedSource: TafsirSource;
  onSourceChange: (source: TafsirSource) => void;
  availableSources: TafsirSourceInfo[];
  isLoading: boolean;
}

export const TafsirSourceSelector = ({
  selectedSource,
  onSourceChange,
  availableSources,
  isLoading,
}: TafsirSourceSelectorProps) => {
  const selectedInfo = availableSources.find(s => s.id === selectedSource);
  
  return (
    <div className="flex flex-wrap items-center gap-3" dir="rtl">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
          <BookOpen className="w-5 h-5 text-primary-foreground" />
        </div>
        
        <Select
          value={selectedSource}
          onValueChange={(value) => onSourceChange(value as TafsirSource)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-52 h-11 bg-card border-primary/20 rounded-xl shadow-sm hover:border-primary/40 transition-colors">
            <SelectValue placeholder="اختر التفسير" />
          </SelectTrigger>
          <SelectContent className="max-h-80 bg-card border-primary/10 rounded-xl shadow-xl">
            {availableSources.map((source) => (
              <SelectItem 
                key={source.id} 
                value={source.id} 
                className="py-3 px-4 cursor-pointer hover:bg-primary/5 focus:bg-primary/10 rounded-lg mx-1 my-0.5"
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-medium text-foreground">{source.name}</span>
                  <span className="text-xs text-muted-foreground">{source.author}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {isLoading && (
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        )}
      </div>

      <Link 
        to="/tafsir-list" 
        className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors px-3 py-2 rounded-lg hover:bg-primary/5"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>عن التفاسير</span>
      </Link>
    </div>
  );
};
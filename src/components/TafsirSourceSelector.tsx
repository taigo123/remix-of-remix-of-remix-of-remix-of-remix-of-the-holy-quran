import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Loader2, Info, ExternalLink } from "lucide-react";
import { TafsirSource } from "@/hooks/useTafsir";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20 space-y-3" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-secondary">
          <BookOpen className="w-5 h-5" />
          <span className="font-medium text-sm">اختر مصدر التفسير:</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={selectedSource}
            onValueChange={(value) => onSourceChange(value as TafsirSource)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-56 bg-background">
              <SelectValue placeholder="اختر مصدر التفسير" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {availableSources.map((source) => (
                <SelectItem key={source.id} value={source.id} className="py-2">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{source.name}</span>
                    <span className="text-xs text-muted-foreground">{source.author}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm hidden sm:inline">جاري التحميل...</span>
            </div>
          )}
        </div>
      </div>
      
      {/* وصف التفسير المختار */}
      {selectedInfo && (
        <div className="flex items-start justify-between gap-2 p-3 bg-background/50 rounded-lg text-sm">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <span className="text-muted-foreground">{selectedInfo.description}</span>
              {selectedInfo.author && selectedInfo.id !== 'local' && (
                <span className="text-primary mr-2">— {selectedInfo.author}</span>
              )}
            </div>
          </div>
          <Link 
            to="/tafsir-list" 
            className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0"
          >
            <span>تعرف على التفاسير</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
};

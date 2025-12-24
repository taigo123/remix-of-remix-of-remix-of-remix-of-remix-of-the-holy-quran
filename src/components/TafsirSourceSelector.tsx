import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Loader2 } from "lucide-react";
import { TafsirSource } from "@/hooks/useTafsir";

interface TafsirSourceSelectorProps {
  selectedSource: TafsirSource;
  onSourceChange: (source: TafsirSource) => void;
  availableSources: { id: TafsirSource; name: string }[];
  isLoading: boolean;
}

export const TafsirSourceSelector = ({
  selectedSource,
  onSourceChange,
  availableSources,
  isLoading,
}: TafsirSourceSelectorProps) => {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/10 border border-secondary/20" dir="rtl">
      <div className="flex items-center gap-2 text-secondary">
        <BookOpen className="w-5 h-5" />
        <span className="font-medium text-sm">مصدر التفسير:</span>
      </div>
      
      <Select
        value={selectedSource}
        onValueChange={(value) => onSourceChange(value as TafsirSource)}
        disabled={isLoading}
      >
        <SelectTrigger className="w-48 bg-background">
          <SelectValue placeholder="اختر مصدر التفسير" />
        </SelectTrigger>
        <SelectContent>
          {availableSources.map((source) => (
            <SelectItem key={source.id} value={source.id}>
              {source.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">جاري التحميل...</span>
        </div>
      )}
    </div>
  );
};

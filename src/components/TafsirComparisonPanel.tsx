import { useState, useEffect, useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Loader2, 
  X, 
  Columns2,
  ArrowLeftRight
} from 'lucide-react';
import { TafsirSource } from '@/hooks/useTafsir';
import { fetchSurahTafsir, AVAILABLE_TAFSIRS } from '@/services/tafsirApi';
import { cn } from '@/lib/utils';

interface TafsirSourceInfo {
  id: TafsirSource;
  name: string;
  description: string;
  author: string;
}

interface TafsirComparisonPanelProps {
  surahNumber: number;
  versesCount: number;
  verses: Array<{ id: number; arabicText: string; tafsir: string }>;
  isOpen: boolean;
  onClose: () => void;
}

export const TafsirComparisonPanel = ({
  surahNumber,
  versesCount,
  verses,
  isOpen,
  onClose,
}: TafsirComparisonPanelProps) => {
  const [leftSource, setLeftSource] = useState<TafsirSource>('ar.muyassar');
  const [rightSource, setRightSource] = useState<TafsirSource>('ar.jalalayn');
  const [leftCache, setLeftCache] = useState<Map<number, string>>(new Map());
  const [rightCache, setRightCache] = useState<Map<number, string>>(new Map());
  const [leftLoading, setLeftLoading] = useState(false);
  const [rightLoading, setRightLoading] = useState(false);
  const [showAllVerses, setShowAllVerses] = useState(true);
  const [selectedVerse, setSelectedVerse] = useState(1);

  const availableSources: TafsirSourceInfo[] = [
    { 
      id: 'local', 
      name: 'التفسير المحلي', 
      description: 'مُولَّد بالذكاء الاصطناعي',
      author: 'ذكاء اصطناعي'
    },
    ...AVAILABLE_TAFSIRS.map(t => ({ 
      id: t.id, 
      name: t.name, 
      description: t.description,
      author: t.author
    })),
  ];

  const loadTafsir = useCallback(async (
    source: TafsirSource, 
    setCache: React.Dispatch<React.SetStateAction<Map<number, string>>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (source === 'local') {
      // للتفسير المحلي، نستخدم البيانات المحلية
      const localMap = new Map<number, string>();
      verses.forEach(v => localMap.set(v.id, v.tafsir));
      setCache(localMap);
      return;
    }
    
    setLoading(true);
    try {
      const tafsirMap = await fetchSurahTafsir(surahNumber, source, versesCount);
      setCache(tafsirMap);
    } catch {
      setCache(new Map());
    } finally {
      setLoading(false);
    }
  }, [surahNumber, versesCount, verses]);

  // تحميل التفسير الأيسر
  useEffect(() => {
    if (isOpen) {
      loadTafsir(leftSource, setLeftCache, setLeftLoading);
    }
  }, [leftSource, isOpen, loadTafsir]);

  // تحميل التفسير الأيمن
  useEffect(() => {
    if (isOpen) {
      loadTafsir(rightSource, setRightCache, setRightLoading);
    }
  }, [rightSource, isOpen, loadTafsir]);

  const swapSources = () => {
    const temp = leftSource;
    setLeftSource(rightSource);
    setRightSource(temp);
    const tempCache = leftCache;
    setLeftCache(rightCache);
    setRightCache(tempCache);
  };

  const getSourceName = (sourceId: TafsirSource) => {
    return availableSources.find(s => s.id === sourceId)?.name || sourceId;
  };

  if (!isOpen) return null;

  const versesToShow = showAllVerses 
    ? verses 
    : verses.filter(v => v.id === selectedVerse);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-primary text-primary-foreground py-3 px-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Columns2 className="w-5 h-5" />
              <span className="font-bold">مقارنة التفاسير</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <X className="w-4 h-4 ml-1" />
              إغلاق
            </Button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="sticky top-12 z-10 bg-muted/80 backdrop-blur-sm border-b py-3 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* اختيار التفاسير */}
            <div className="flex flex-wrap items-center gap-2">
              {/* التفسير الأول */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">1</Badge>
                <Select value={leftSource} onValueChange={(v) => setLeftSource(v as TafsirSource)}>
                  <SelectTrigger className="w-44 bg-background text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {availableSources.map((source) => (
                      <SelectItem 
                        key={source.id} 
                        value={source.id}
                        disabled={source.id === rightSource}
                      >
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* زر التبديل */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={swapSources}
                className="shrink-0"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </Button>

              {/* التفسير الثاني */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">2</Badge>
                <Select value={rightSource} onValueChange={(v) => setRightSource(v as TafsirSource)}>
                  <SelectTrigger className="w-44 bg-background text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {availableSources.map((source) => (
                      <SelectItem 
                        key={source.id} 
                        value={source.id}
                        disabled={source.id === leftSource}
                      >
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* عرض آية واحدة أو الكل */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch 
                  id="show-all"
                  checked={showAllVerses}
                  onCheckedChange={setShowAllVerses}
                />
                <Label htmlFor="show-all" className="text-sm cursor-pointer">
                  عرض كل الآيات
                </Label>
              </div>

              {!showAllVerses && (
                <Select 
                  value={selectedVerse.toString()} 
                  onValueChange={(v) => setSelectedVerse(parseInt(v))}
                >
                  <SelectTrigger className="w-32 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {verses.map((verse) => (
                      <SelectItem key={verse.id} value={verse.id.toString()}>
                        الآية {verse.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto py-4 px-4 h-[calc(100vh-120px)] overflow-y-auto">
        <div className="space-y-6">
          {versesToShow.map((verse) => (
            <Card key={verse.id} className="overflow-hidden">
              {/* رقم الآية والنص */}
              <div className="bg-primary/5 p-3 border-b">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {verse.id}
                  </span>
                  <span className="text-xs text-muted-foreground">الآية {verse.id}</span>
                </div>
                <p className="font-arabic text-lg text-foreground leading-relaxed">
                  {verse.arabicText}
                </p>
              </div>

              {/* مقارنة التفسيرين */}
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse">
                {/* التفسير الأول */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30">
                      {getSourceName(leftSource)}
                    </Badge>
                    {leftLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                  </div>
                  <p className={cn(
                    "text-sm leading-relaxed",
                    leftLoading && "text-muted-foreground"
                  )}>
                    {leftLoading 
                      ? 'جاري التحميل...'
                      : leftCache.get(verse.id) || 'التفسير غير متوفر'
                    }
                  </p>
                </div>

                {/* التفسير الثاني */}
                <div className="p-4 bg-muted/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-blue-500/20 text-blue-600 hover:bg-blue-500/30">
                      {getSourceName(rightSource)}
                    </Badge>
                    {rightLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                  </div>
                  <p className={cn(
                    "text-sm leading-relaxed",
                    rightLoading && "text-muted-foreground"
                  )}>
                    {rightLoading 
                      ? 'جاري التحميل...'
                      : rightCache.get(verse.id) || 'التفسير غير متوفر'
                    }
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

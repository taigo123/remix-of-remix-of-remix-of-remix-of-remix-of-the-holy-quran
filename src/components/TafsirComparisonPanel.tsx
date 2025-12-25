import { useState, useEffect, useCallback, useRef } from 'react';
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
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Loader2, 
  X, 
  Columns2,
  ArrowLeftRight,
  Download,
  FileImage,
  FileText,
  Search,
  XCircle
} from 'lucide-react';
import { TafsirSource } from '@/hooks/useTafsir';
import { fetchSurahTafsir, AVAILABLE_TAFSIRS, DEFAULT_TAFSIR } from '@/services/tafsirApi';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface TafsirSourceInfo {
  id: TafsirSource;
  name: string;
  description: string;
  author: string;
}

interface TafsirComparisonPanelProps {
  surahNumber: number;
  surahName?: string;
  versesCount: number;
  verses: Array<{ id: number; arabicText: string; tafsir: string }>;
  isOpen: boolean;
  onClose: () => void;
}

export const TafsirComparisonPanel = ({
  surahNumber,
  surahName = '',
  versesCount,
  verses,
  isOpen,
  onClose,
}: TafsirComparisonPanelProps) => {
  const [leftSource, setLeftSource] = useState<TafsirSource>(DEFAULT_TAFSIR);
  const [rightSource, setRightSource] = useState<TafsirSource>('qc-saadi');
  const [leftCache, setLeftCache] = useState<Map<number, string>>(new Map());
  const [rightCache, setRightCache] = useState<Map<number, string>>(new Map());
  const [leftLoading, setLeftLoading] = useState(false);
  const [rightLoading, setRightLoading] = useState(false);
  const [showAllVerses, setShowAllVerses] = useState(true);
  const [selectedVerse, setSelectedVerse] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  const availableSources: TafsirSourceInfo[] = [
    { 
      id: 'local', 
      name: 'التفسير المحلي ⚠️', 
      description: 'مُولَّد بالذكاء الاصطناعي - غير موثق',
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

  useEffect(() => {
    if (isOpen) {
      loadTafsir(leftSource, setLeftCache, setLeftLoading);
    }
  }, [leftSource, isOpen, loadTafsir]);

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

  // فلترة الآيات بناءً على البحث
  const filteredVerses = verses.filter(verse => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const leftTafsir = leftCache.get(verse.id)?.toLowerCase() || '';
    const rightTafsir = rightCache.get(verse.id)?.toLowerCase() || '';
    const arabicText = verse.arabicText.toLowerCase();
    
    return (
      arabicText.includes(query) ||
      leftTafsir.includes(query) ||
      rightTafsir.includes(query) ||
      verse.id.toString() === query
    );
  });

  const versesToShow = showAllVerses 
    ? filteredVerses 
    : filteredVerses.filter(v => v.id === selectedVerse);

  // تصدير كصورة - تحميل مباشر
  const exportAsImage = async () => {
    if (!contentRef.current) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      
      // تحميل مباشر
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `مقارنة-تفسير-سورة-${surahNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'تم حفظ الصورة',
        description: 'تم تنزيل الصورة بنجاح',
      });
    } catch (error) {
      console.error('Export image error:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في إنشاء الصورة',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  // تصدير كـ PDF - باستخدام الصورة للحفاظ على النص العربي
  const exportAsPdf = async () => {
    if (!contentRef.current) return;

    setIsExporting(true);
    try {
      // تحويل المحتوى لصورة
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // حساب أبعاد الصفحة
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;

      // حساب النسبة
      const ratio = Math.min(availableWidth / (imgWidth / 3.78), availableHeight / (imgHeight / 3.78));
      const scaledWidth = (imgWidth / 3.78) * ratio;
      const scaledHeight = (imgHeight / 3.78) * ratio;

      // إذا كانت الصورة أطول من صفحة واحدة، نقسمها
      const pxPerPage = (availableHeight * 3.78) / ratio;
      const totalPages = Math.ceil(imgHeight / pxPerPage);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        // قص جزء من الصورة لكل صفحة
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = imgWidth;
        tempCanvas.height = Math.min(pxPerPage, imgHeight - page * pxPerPage);
        const ctx = tempCanvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(
            canvas,
            0, page * pxPerPage,
            imgWidth, tempCanvas.height,
            0, 0,
            imgWidth, tempCanvas.height
          );
          
          const pageImgData = tempCanvas.toDataURL('image/png');
          const pageImgHeight = (tempCanvas.height / 3.78) * ratio;
          
          pdf.addImage(pageImgData, 'PNG', margin, margin, scaledWidth, pageImgHeight);
        }
      }

      pdf.save(`مقارنة-تفسير-سورة-${surahNumber}.pdf`);

      toast({
        title: 'تم حفظ PDF',
        description: 'تم تنزيل الملف بنجاح',
      });
    } catch (error) {
      console.error('Export PDF error:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في إنشاء ملف PDF',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };


  // تمييز نص البحث
  const highlightText = (text: string) => {
    if (!searchQuery.trim()) return text;
    
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchQuery.toLowerCase() 
        ? <mark key={i} className="bg-yellow-300 dark:bg-yellow-600 px-0.5 rounded">{part}</mark>
        : part
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-primary text-primary-foreground py-3 px-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Columns2 className="w-5 h-5" />
              <span className="font-bold">مقارنة التفاسير</span>
              {surahName && <Badge variant="secondary">{surahName}</Badge>}
            </div>
            
            <div className="flex items-center gap-2">
              {/* زر تصدير صورة */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={exportAsImage}
                disabled={isExporting}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileImage className="w-4 h-4" />}
                <span className="hidden sm:inline mr-1">صورة</span>
              </Button>
              
              {/* زر تصدير PDF */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={exportAsPdf}
                disabled={isExporting}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                <span className="hidden sm:inline mr-1">PDF</span>
              </Button>
              
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

            {/* البحث وخيارات العرض */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* البحث في التفاسير */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="بحث في التفاسير..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9 pl-8 w-48 bg-background"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                  >
                    <XCircle className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>

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
          
          {/* عدد نتائج البحث */}
          {searchQuery && (
            <div className="mt-2 text-sm text-muted-foreground">
              تم العثور على {filteredVerses.length} آية تحتوي على "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto py-4 px-4 h-[calc(100vh-140px)] overflow-y-auto">
        <div ref={contentRef} className="space-y-6 bg-background p-4 rounded-lg">
          {versesToShow.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد نتائج للبحث "{searchQuery}"</p>
            </div>
          ) : (
            versesToShow.map((verse) => (
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
                    {highlightText(verse.arabicText)}
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
                        : highlightText(leftCache.get(verse.id) || 'التفسير غير متوفر')
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
                        : highlightText(rightCache.get(verse.id) || 'التفسير غير متوفر')
                      }
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
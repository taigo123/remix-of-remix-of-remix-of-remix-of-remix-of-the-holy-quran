import { BookOpen, Type, Sun, Eye, EyeOff, RotateCcw, Minus, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from './ui/sheet';
import { useReadingMode, FontType } from '@/hooks/useReadingMode';
import { cn } from '@/lib/utils';

const fontOptions: { type: FontType; label: string; className: string }[] = [
  { type: 'naskh', label: 'نسخ', className: 'font-naskh' },
  { type: 'amiri', label: 'أميري', className: 'font-amiri' },
  { type: 'arabic', label: 'عربي', className: 'font-arabic' },
];

export const ReadingModePanel = () => {
  const {
    isEnabled,
    fontSize,
    fontType,
    brightness,
    hideSidebar,
    toggleReadingMode,
    setFontSize,
    setFontType,
    setBrightness,
    toggleHideSidebar,
    resetSettings,
  } = useReadingMode();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-10 w-10 p-0 rounded-full border-primary/30 bg-background/80 backdrop-blur-sm hover:bg-primary/10',
            isEnabled && 'bg-primary/20 border-primary'
          )}
          aria-label="وضع القراءة"
        >
          <BookOpen className="w-5 h-5 text-primary" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80" dir="rtl">
        <SheetHeader>
          <SheetTitle className="text-right font-amiri">إعدادات القراءة</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Toggle Reading Mode */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">وضع القراءة</span>
            <Button
              variant={isEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={toggleReadingMode}
            >
              {isEnabled ? 'مُفعّل' : 'معطّل'}
            </Button>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Type className="w-4 h-4" />
                حجم الخط
              </span>
              <span className="text-sm text-muted-foreground">{fontSize}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setFontSize(fontSize - 10)}
                disabled={fontSize <= 80}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Slider
                value={[fontSize]}
                onValueChange={([value]) => setFontSize(value)}
                min={80}
                max={150}
                step={5}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setFontSize(fontSize + 10)}
                disabled={fontSize >= 150}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Font Type */}
          <div className="space-y-3">
            <span className="text-sm font-medium">نوع الخط</span>
            <div className="flex gap-2">
              {fontOptions.map((font) => (
                <Button
                  key={font.type}
                  variant={fontType === font.type ? 'default' : 'outline'}
                  size="sm"
                  className={cn('flex-1', font.className)}
                  onClick={() => setFontType(font.type)}
                >
                  {font.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Brightness */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Sun className="w-4 h-4" />
                سطوع الشاشة
              </span>
              <span className="text-sm text-muted-foreground">{brightness}%</span>
            </div>
            <Slider
              value={[brightness]}
              onValueChange={([value]) => setBrightness(value)}
              min={50}
              max={100}
              step={5}
            />
          </div>

          {/* Hide Sidebar */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              {hideSidebar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              إخفاء العناصر الجانبية
            </span>
            <Button
              variant={hideSidebar ? 'default' : 'outline'}
              size="sm"
              onClick={toggleHideSidebar}
            >
              {hideSidebar ? 'مخفية' : 'ظاهرة'}
            </Button>
          </div>

          {/* Reset */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={resetSettings}
          >
            <RotateCcw className="w-4 h-4 ml-2" />
            إعادة ضبط
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

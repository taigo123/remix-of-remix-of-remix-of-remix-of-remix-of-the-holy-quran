import { 
  Type, 
  LayoutGrid, 
  List, 
  Grid3X3, 
  Sun, 
  Moon, 
  AlignJustify, 
  Music, 
  Hash,
  Sparkles,
  RotateCcw,
  SunDim,
  SunMedium
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  useQuranSettings, 
  FontSize, 
  CardStyle, 
  LineSpacing, 
  Brightness 
} from '@/hooks/useQuranSettings';
import { cn } from '@/lib/utils';

interface QuranSettingsPanelProps {
  className?: string;
}

export const QuranSettingsPanel = ({ className }: QuranSettingsPanelProps) => {
  const { settings, updateSetting, resetSettings } = useQuranSettings();

  const fontSizes: { value: FontSize; label: string; icon: string }[] = [
    { value: 'small', label: 'صغير', icon: 'أ' },
    { value: 'medium', label: 'متوسط', icon: 'أ' },
    { value: 'large', label: 'كبير', icon: 'أ' },
    { value: 'xlarge', label: 'كبير جداً', icon: 'أ' },
  ];

  const cardStyles: { value: CardStyle; label: string; icon: React.ReactNode }[] = [
    { value: 'grid', label: 'شبكة', icon: <LayoutGrid className="w-4 h-4" /> },
    { value: 'list', label: 'قائمة', icon: <List className="w-4 h-4" /> },
    { value: 'compact', label: 'مضغوط', icon: <Grid3X3 className="w-4 h-4" /> },
  ];

  const lineSpacings: { value: LineSpacing; label: string }[] = [
    { value: 'tight', label: 'ضيق' },
    { value: 'normal', label: 'عادي' },
    { value: 'relaxed', label: 'مريح' },
    { value: 'loose', label: 'واسع' },
  ];

  const brightnessLevels: { value: Brightness; label: string; icon: React.ReactNode }[] = [
    { value: 'dim', label: 'خافت', icon: <SunDim className="w-4 h-4" /> },
    { value: 'normal', label: 'عادي', icon: <Sun className="w-4 h-4" /> },
    { value: 'bright', label: 'ساطع', icon: <SunMedium className="w-4 h-4" /> },
  ];

  return (
    <div className={cn('space-y-6 p-1', className)} dir="rtl">
      {/* حجم الخط */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <Type className="w-4 h-4 text-primary" />
          حجم الخط
        </Label>
        <div className="grid grid-cols-4 gap-2">
          {fontSizes.map((size, index) => (
            <Button
              key={size.value}
              variant={settings.fontSize === size.value ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'flex flex-col gap-0.5 h-auto py-2 transition-all',
                settings.fontSize === size.value && 'ring-2 ring-primary/30'
              )}
              onClick={() => updateSetting('fontSize', size.value)}
            >
              <span style={{ fontSize: `${12 + index * 3}px` }} className="font-arabic">
                {size.icon}
              </span>
              <span className="text-[10px]">{size.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* نمط العرض */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <LayoutGrid className="w-4 h-4 text-primary" />
          نمط عرض السور
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {cardStyles.map((style) => (
            <Button
              key={style.value}
              variant={settings.cardStyle === style.value ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'flex items-center gap-2 transition-all',
                settings.cardStyle === style.value && 'ring-2 ring-primary/30'
              )}
              onClick={() => updateSetting('cardStyle', style.value)}
            >
              {style.icon}
              <span className="text-xs">{style.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* المسافة بين السطور */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <AlignJustify className="w-4 h-4 text-primary" />
          المسافة بين السطور
        </Label>
        <div className="grid grid-cols-4 gap-2">
          {lineSpacings.map((spacing) => (
            <Button
              key={spacing.value}
              variant={settings.lineSpacing === spacing.value ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'text-xs transition-all',
                settings.lineSpacing === spacing.value && 'ring-2 ring-primary/30'
              )}
              onClick={() => updateSetting('lineSpacing', spacing.value)}
            >
              {spacing.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* السطوع */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <Sun className="w-4 h-4 text-primary" />
          سطوع الشاشة
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {brightnessLevels.map((level) => (
            <Button
              key={level.value}
              variant={settings.brightness === level.value ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'flex items-center gap-2 transition-all',
                settings.brightness === level.value && 'ring-2 ring-primary/30'
              )}
              onClick={() => updateSetting('brightness', level.value)}
            >
              {level.icon}
              <span className="text-xs">{level.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* خيارات إضافية */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="w-4 h-4 text-primary" />
          خيارات إضافية
        </Label>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-1">
            <Label htmlFor="show-audio" className="flex items-center gap-2 text-sm cursor-pointer">
              <Music className="w-4 h-4 text-muted-foreground" />
              إظهار أيقونة الصوت
            </Label>
            <Switch
              id="show-audio"
              checked={settings.showAudioIcon}
              onCheckedChange={(checked) => updateSetting('showAudioIcon', checked)}
            />
          </div>

          <div className="flex items-center justify-between py-1">
            <Label htmlFor="show-verse-count" className="flex items-center gap-2 text-sm cursor-pointer">
              <Hash className="w-4 h-4 text-muted-foreground" />
              إظهار عدد الآيات
            </Label>
            <Switch
              id="show-verse-count"
              checked={settings.showVerseCount}
              onCheckedChange={(checked) => updateSetting('showVerseCount', checked)}
            />
          </div>

          <div className="flex items-center justify-between py-1">
            <Label htmlFor="enable-animations" className="flex items-center gap-2 text-sm cursor-pointer">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              تفعيل الحركات
            </Label>
            <Switch
              id="enable-animations"
              checked={settings.enableAnimations}
              onCheckedChange={(checked) => updateSetting('enableAnimations', checked)}
            />
          </div>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* إعادة ضبط */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full text-muted-foreground hover:text-destructive"
        onClick={resetSettings}
      >
        <RotateCcw className="w-4 h-4 ml-2" />
        إعادة ضبط الإعدادات
      </Button>
    </div>
  );
};

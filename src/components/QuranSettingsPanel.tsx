import { 
  Type, 
  AlignJustify, 
  Sun, 
  Music, 
  Hash,
  Sparkles,
  RotateCcw,
  SunDim,
  SunMedium,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  useQuranSettings, 
  FontSize, 
  LineSpacing, 
  Brightness 
} from '@/hooks/useQuranSettings';
import { cn } from '@/lib/utils';

interface QuranSettingsPanelProps {
  className?: string;
}

export const QuranSettingsPanel = ({ className }: QuranSettingsPanelProps) => {
  const { settings, updateSetting, resetSettings } = useQuranSettings();

  const fontSizes: { value: FontSize; label: string; size: string }[] = [
    { value: 'small', label: 'صغير', size: 'text-base' },
    { value: 'medium', label: 'متوسط', size: 'text-lg' },
    { value: 'large', label: 'كبير', size: 'text-xl' },
    { value: 'xlarge', label: 'كبير جداً', size: 'text-2xl' },
  ];

  const lineSpacings: { value: LineSpacing; label: string; desc: string }[] = [
    { value: 'tight', label: 'ضيق', desc: '1.6' },
    { value: 'normal', label: 'عادي', desc: '2.0' },
    { value: 'relaxed', label: 'مريح', desc: '2.5' },
    { value: 'loose', label: 'واسع', desc: '3.0' },
  ];

  const brightnessLevels: { value: Brightness; label: string; icon: React.ReactNode }[] = [
    { value: 'dim', label: 'خافت', icon: <SunDim className="w-5 h-5" /> },
    { value: 'normal', label: 'عادي', icon: <Sun className="w-5 h-5" /> },
    { value: 'bright', label: 'ساطع', icon: <SunMedium className="w-5 h-5" /> },
  ];

  return (
    <div className={cn('space-y-8', className)} dir="rtl">
      {/* حجم الخط */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
            <Type className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <Label className="text-base font-semibold">حجم الخط</Label>
            <p className="text-xs text-muted-foreground">اختر الحجم المناسب للقراءة</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {fontSizes.map((size) => (
            <button
              key={size.value}
              className={cn(
                'relative p-4 rounded-xl border-2 transition-all duration-200 text-right',
                settings.fontSize === size.value 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-border hover:border-primary/30 bg-card hover:bg-muted/30'
              )}
              onClick={() => updateSetting('fontSize', size.value)}
            >
              {settings.fontSize === size.value && (
                <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <span className={cn('font-arabic block mb-1', size.size)}>أ</span>
              <span className="text-sm text-muted-foreground">{size.label}</span>
            </button>
          ))}
        </div>
        
        {/* معاينة الخط */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
          <p className="text-xs text-muted-foreground mb-2">معاينة:</p>
          <p className={cn(
            'font-arabic text-foreground transition-all duration-300',
            fontSizes.find(f => f.value === settings.fontSize)?.size
          )}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      </div>

      {/* المسافة بين السطور */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
            <AlignJustify className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <Label className="text-base font-semibold">المسافة بين السطور</Label>
            <p className="text-xs text-muted-foreground">لراحة أكبر أثناء القراءة</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {lineSpacings.map((spacing) => (
            <button
              key={spacing.value}
              className={cn(
                'flex-1 py-3 px-2 rounded-xl border-2 transition-all duration-200 text-center',
                settings.lineSpacing === spacing.value 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/30 bg-card'
              )}
              onClick={() => updateSetting('lineSpacing', spacing.value)}
            >
              <span className="text-sm font-medium">{spacing.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* السطوع */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Sun className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <Label className="text-base font-semibold">سطوع الشاشة</Label>
            <p className="text-xs text-muted-foreground">اضبط السطوع حسب الإضاءة</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          {brightnessLevels.map((level) => (
            <button
              key={level.value}
              className={cn(
                'flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all duration-200',
                settings.brightness === level.value 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/30 bg-card'
              )}
              onClick={() => updateSetting('brightness', level.value)}
            >
              <span className={cn(
                'transition-colors',
                settings.brightness === level.value ? 'text-primary' : 'text-muted-foreground'
              )}>
                {level.icon}
              </span>
              <span className="text-sm">{level.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* خيارات إضافية */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <Label className="text-base font-semibold">خيارات إضافية</Label>
            <p className="text-xs text-muted-foreground">تخصيص تجربة القراءة</p>
          </div>
        </div>
        
        <div className="space-y-1 bg-muted/30 rounded-xl p-2">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <Label htmlFor="show-audio" className="flex items-center gap-3 text-sm cursor-pointer">
              <Music className="w-4 h-4 text-muted-foreground" />
              إظهار مشغل الصوت
            </Label>
            <Switch
              id="show-audio"
              checked={settings.showAudioIcon}
              onCheckedChange={(checked) => updateSetting('showAudioIcon', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <Label htmlFor="show-verse-count" className="flex items-center gap-3 text-sm cursor-pointer">
              <Hash className="w-4 h-4 text-muted-foreground" />
              إظهار عدد الآيات
            </Label>
            <Switch
              id="show-verse-count"
              checked={settings.showVerseCount}
              onCheckedChange={(checked) => updateSetting('showVerseCount', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <Label htmlFor="enable-animations" className="flex items-center gap-3 text-sm cursor-pointer">
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

      {/* إعادة ضبط */}
      <Button
        variant="outline"
        size="lg"
        className="w-full rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={resetSettings}
      >
        <RotateCcw className="w-4 h-4 ml-2" />
        إعادة ضبط الإعدادات
      </Button>
    </div>
  );
};
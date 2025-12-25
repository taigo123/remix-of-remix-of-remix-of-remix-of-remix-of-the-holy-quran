import { 
  Type, 
  Music, 
  Sparkles,
  Minus,
  Plus,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  useQuranSettings, 
  FontSize, 
} from '@/hooks/useQuranSettings';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QuickSettingsBarProps {
  className?: string;
}

export const QuickSettingsBar = ({ className }: QuickSettingsBarProps) => {
  const { settings, updateSetting } = useQuranSettings();

  const fontSizes: FontSize[] = ['small', 'medium', 'large', 'xlarge'];
  const fontSizeLabels: Record<FontSize, string> = {
    small: 'صغير',
    medium: 'متوسط',
    large: 'كبير',
    xlarge: 'كبير جداً',
  };

  const currentFontIndex = fontSizes.indexOf(settings.fontSize);

  const increaseFontSize = () => {
    if (currentFontIndex < fontSizes.length - 1) {
      updateSetting('fontSize', fontSizes[currentFontIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    if (currentFontIndex > 0) {
      updateSetting('fontSize', fontSizes[currentFontIndex - 1]);
    }
  };

  return (
    <TooltipProvider>
      <div className={cn(
        "flex items-center gap-1 p-1.5 bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm",
        className
      )} dir="rtl">
        {/* تكبير/تصغير الخط */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
            >
              <Type className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" dir="rtl">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center mb-2">حجم الخط</p>
              <div className="flex items-center justify-between gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={decreaseFontSize}
                      disabled={currentFontIndex === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>تصغير</TooltipContent>
                </Tooltip>
                <span className="text-sm font-medium flex-1 text-center">
                  {fontSizeLabels[settings.fontSize]}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={increaseFontSize}
                      disabled={currentFontIndex === fontSizes.length - 1}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>تكبير</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* إظهار/إخفاء مشغل الصوت */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={settings.showAudioIcon ? "default" : "ghost"}
              size="sm" 
              className={cn(
                "h-8 w-8 p-0",
                settings.showAudioIcon && "bg-primary/10 text-primary hover:bg-primary/20"
              )}
              onClick={() => updateSetting('showAudioIcon', !settings.showAudioIcon)}
            >
              {settings.showAudioIcon ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {settings.showAudioIcon ? 'إخفاء مشغل الصوت' : 'إظهار مشغل الصوت'}
          </TooltipContent>
        </Tooltip>

        {/* تفعيل/إيقاف الحركات */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={settings.enableAnimations ? "default" : "ghost"}
              size="sm" 
              className={cn(
                "h-8 w-8 p-0",
                settings.enableAnimations && "bg-primary/10 text-primary hover:bg-primary/20"
              )}
              onClick={() => updateSetting('enableAnimations', !settings.enableAnimations)}
            >
              <Sparkles className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {settings.enableAnimations ? 'إيقاف الحركات' : 'تفعيل الحركات'}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

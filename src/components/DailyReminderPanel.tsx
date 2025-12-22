import { Bell, BellOff, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from './ui/sheet';
import { useDailyReminder } from '@/hooks/useDailyReminder';
import { cn } from '@/lib/utils';

export const DailyReminderPanel = () => {
  const {
    isEnabled,
    reminderTime,
    permissionGranted,
    enableReminder,
    disableReminder,
    setReminderTime,
    requestPermission,
  } = useDailyReminder();

  const handleToggle = async () => {
    if (isEnabled) {
      disableReminder();
    } else {
      await enableReminder(reminderTime);
    }
  };

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
          aria-label="التذكير اليومي"
        >
          {isEnabled ? (
            <Bell className="w-5 h-5 text-primary" />
          ) : (
            <BellOff className="w-5 h-5 text-primary" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80" dir="rtl">
        <SheetHeader>
          <SheetTitle className="text-right font-amiri">التذكير اليومي</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Permission Status */}
          {!permissionGranted && (
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <p className="text-sm text-muted-foreground">
                يجب السماح بالإشعارات لتفعيل التذكير اليومي
              </p>
              <Button
                variant="default"
                size="sm"
                className="w-full"
                onClick={requestPermission}
              >
                السماح بالإشعارات
              </Button>
            </div>
          )}

          {/* Toggle Reminder */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">التذكير اليومي</span>
            <Button
              variant={isEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={handleToggle}
              disabled={!permissionGranted && !isEnabled}
            >
              {isEnabled ? 'مُفعّل' : 'معطّل'}
            </Button>
          </div>

          {/* Time Picker */}
          <div className="space-y-3">
            <span className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              وقت التذكير
            </span>
            <Input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="text-center"
              dir="ltr"
            />
          </div>

          {/* Info */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground leading-relaxed">
              سيتم تذكيرك يومياً في الوقت المحدد لقراءة سورة ياسين - قلب القرآن الكريم
            </p>
          </div>

          {/* Quick Times */}
          <div className="space-y-2">
            <span className="text-sm font-medium">أوقات سريعة</span>
            <div className="grid grid-cols-3 gap-2">
              {['06:00', '08:00', '20:00'].map((time) => (
                <Button
                  key={time}
                  variant={reminderTime === time ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReminderTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

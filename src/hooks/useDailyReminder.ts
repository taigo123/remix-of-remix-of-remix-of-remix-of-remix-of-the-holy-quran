import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface ReminderSettings {
  isEnabled: boolean;
  time: string; // HH:MM format
  lastNotified: string | null; // Date string
}

const STORAGE_KEY = 'daily-reminder-settings';

const defaultSettings: ReminderSettings = {
  isEnabled: false,
  time: '08:00',
  lastNotified: null,
};

export const useDailyReminder = () => {
  const [settings, setSettings] = useState<ReminderSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }
    return defaultSettings;
  });

  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setPermissionGranted(Notification.permission === 'granted');
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast.error('المتصفح لا يدعم الإشعارات');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setPermissionGranted(granted);
      
      if (granted) {
        toast.success('تم تفعيل الإشعارات بنجاح');
      } else {
        toast.error('تم رفض إذن الإشعارات');
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('حدث خطأ أثناء طلب إذن الإشعارات');
      return false;
    }
  }, []);

  const enableReminder = useCallback(async (time: string) => {
    let granted = permissionGranted;
    
    if (!granted) {
      granted = await requestPermission();
    }

    if (granted) {
      setSettings(prev => ({
        ...prev,
        isEnabled: true,
        time,
      }));
      toast.success(`تم تفعيل التذكير اليومي في الساعة ${time}`);
    }
  }, [permissionGranted, requestPermission]);

  const disableReminder = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      isEnabled: false,
    }));
    toast.info('تم إيقاف التذكير اليومي');
  }, []);

  const setReminderTime = useCallback((time: string) => {
    setSettings(prev => ({
      ...prev,
      time,
    }));
  }, []);

  // Check and show notification
  useEffect(() => {
    if (!settings.isEnabled || !permissionGranted) return;

    const checkReminder = () => {
      const now = new Date();
      const [hours, minutes] = settings.time.split(':').map(Number);
      const today = now.toDateString();
      
      if (
        now.getHours() === hours &&
        now.getMinutes() === minutes &&
        settings.lastNotified !== today
      ) {
        // Show notification
        new Notification('تذكير قراءة سورة ياسين', {
          body: 'حان وقت قراءة سورة ياسين - قلب القرآن الكريم',
          icon: '/pwa-192x192.png',
          tag: 'daily-reminder',
        });

        setSettings(prev => ({
          ...prev,
          lastNotified: today,
        }));
      }
    };

    // Check every minute
    const interval = setInterval(checkReminder, 60000);
    checkReminder(); // Check immediately

    return () => clearInterval(interval);
  }, [settings.isEnabled, settings.time, settings.lastNotified, permissionGranted]);

  return {
    isEnabled: settings.isEnabled,
    reminderTime: settings.time,
    permissionGranted,
    enableReminder,
    disableReminder,
    setReminderTime,
    requestPermission,
  };
};

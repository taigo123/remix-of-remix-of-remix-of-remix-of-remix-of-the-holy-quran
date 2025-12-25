import { useEffect, useRef, useState } from "react";
import { registerSW } from "virtual:pwa-register";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Prompt المستخدم لتحديث الـPWA عندما يتوفر إصدار جديد.
 * هذا يحل مشكلة بقاء التطبيق على نسخة قديمة (مثل ظهور قائمة قرّاء قديمة).
 */
export const PWAUpdatePrompt = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const updateSWRef = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        setNeedRefresh(true);
      },
    });

    updateSWRef.current = updateSW;
  }, []);

  if (!needRefresh) return null;

  const handleUpdate = async () => {
    try {
      await updateSWRef.current?.(true);
    } finally {
      // في حال لم يتم إعادة التحميل تلقائياً لأي سبب
      window.location.reload();
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-card border border-border rounded-2xl shadow-elevated p-4">
        <div className="flex items-start gap-3" dir="rtl">
          <div className="mt-0.5 h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <RefreshCw className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-amiri font-bold text-foreground">يوجد تحديث جديد</p>
            <p className="text-sm text-muted-foreground mt-1">اضغط تحديث الآن لتطبيق آخر تحسينات التطبيق.</p>
            <div className="mt-3 flex gap-2">
              <Button onClick={handleUpdate} size="sm" className="flex-1">
                تحديث الآن
              </Button>
              <Button
                onClick={() => setNeedRefresh(false)}
                variant="outline"
                size="sm"
              >
                لاحقاً
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

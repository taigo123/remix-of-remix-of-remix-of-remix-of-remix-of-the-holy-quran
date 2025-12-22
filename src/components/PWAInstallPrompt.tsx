import React, { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PWAInstallPromptInner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed recently (within 24 hours)
    const dismissedAt = localStorage.getItem("pwa-prompt-dismissed");
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      const now = Date.now();
      const hoursSinceDismissed = (now - dismissedTime) / (1000 * 60 * 60);
      if (hoursSinceDismissed < 24) {
        return;
      }
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // Show iOS prompt after a delay
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    // Handle beforeinstallprompt for Android/Desktop
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-card border border-border rounded-2xl shadow-elevated p-4 relative">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 left-3 p-1 rounded-full hover:bg-muted transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="flex items-start gap-4" dir="rtl">
          {/* App Icon */}
          <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center shadow-gold flex-shrink-0">
            <span className="font-arabic text-2xl text-primary-foreground font-bold">يس</span>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="font-amiri font-bold text-lg text-foreground mb-1">
              ثبّت التطبيق
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              احصل على تجربة أفضل مع إمكانية التصفح بدون إنترنت
            </p>

            {isIOS ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  اضغط على زر المشاركة ثم "إضافة إلى الشاشة الرئيسية"
                </p>
                <Link to="/install-guide">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                  >
                    <Download className="w-4 h-4" />
                    عرض التعليمات
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleInstall}
                  size="sm"
                  className="flex-1 gap-2 gradient-gold text-primary-foreground"
                >
                  <Download className="w-4 h-4" />
                  تثبيت الآن
                </Button>
                <Link to="/install-guide">
                  <Button variant="outline" size="sm">
                    التعليمات
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PWAInstallPrompt = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    return <PWAInstallPromptInner {...props} />;
  }
);
PWAInstallPrompt.displayName = "PWAInstallPrompt";

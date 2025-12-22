import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Handle beforeinstallprompt for Android/Desktop
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
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
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  // Don't show if already installed
  if (isInstalled) return null;

  // For iOS, show link to install guide
  if (isIOS) {
    return (
      <Link to="/install-guide">
        <Button
          variant="outline"
          size="sm"
          className="h-10 w-10 p-0 rounded-full border-primary/30 bg-background/80 backdrop-blur-sm hover:bg-primary/10"
          aria-label="تثبيت التطبيق"
        >
          <Download className="w-5 h-5 text-primary" />
        </Button>
      </Link>
    );
  }

  // For Android/Desktop with install prompt available
  if (deferredPrompt) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleInstall}
        className="h-10 w-10 p-0 rounded-full border-primary/30 bg-background/80 backdrop-blur-sm hover:bg-primary/10"
        aria-label="تثبيت التطبيق"
      >
        <Download className="w-5 h-5 text-primary" />
      </Button>
    );
  }

  // Show link to install guide as fallback
  return (
    <Link to="/install-guide">
      <Button
        variant="outline"
        size="sm"
        className="h-10 w-10 p-0 rounded-full border-primary/30 bg-background/80 backdrop-blur-sm hover:bg-primary/10"
        aria-label="تعليمات التثبيت"
      >
        <Download className="w-5 h-5 text-primary" />
      </Button>
    </Link>
  );
};

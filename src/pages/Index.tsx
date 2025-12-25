import { HeroSection } from "@/components/HeroSection";
import { TafsirContent } from "@/components/TafsirContent";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ReadingModePanel } from "@/components/ReadingModePanel";
import { DailyReminderPanel } from "@/components/DailyReminderPanel";
import { InstallButton } from "@/components/InstallButton";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { Helmet } from "react-helmet";
import { useState, useCallback, useRef } from "react";
import { useReadingMode } from "@/hooks/useReadingMode";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/config/app";

const Index = () => {
  const [playerHighlightedVerse, setPlayerHighlightedVerse] = useState<number | null>(null);
  const tafsirContentRef = useRef<{ scrollToVerse: (v: number) => void } | null>(null);
  const { isEnabled: readingModeEnabled, fontType, hideSidebar } = useReadingMode();

  const handlePlayerVerseChange = useCallback((verseNumber: number) => {
    setPlayerHighlightedVerse(verseNumber);
  }, []);


  return (
    <>
      <Helmet>
        <title>{APP_CONFIG.name} - تفسير وتلاوة</title>
        <meta name="description" content={APP_CONFIG.description} />
        <meta name="keywords" content={APP_CONFIG.keywords} />
        <meta property="og:title" content={`${APP_CONFIG.name} - تفسير وتلاوة`} />
        <meta property="og:description" content={APP_CONFIG.description} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={APP_CONFIG.canonicalUrl} />
        <html lang="ar" dir="rtl" />
      </Helmet>

      <div className={cn(
        "min-h-screen bg-background transition-all",
        readingModeEnabled && `font-${fontType}`
      )} style={{
        fontSize: readingModeEnabled ? 'calc(1rem * var(--reading-font-scale, 1))' : undefined
      }}>
        {/* Control Buttons */}
        <div className={cn(
          "fixed top-4 right-4 z-50 flex flex-col gap-2 transition-opacity",
          hideSidebar && readingModeEnabled && "opacity-20 hover:opacity-100"
        )}>
          <ThemeToggle />
          <ReadingModePanel />
          <DailyReminderPanel />
          <InstallButton />
        </div>

        {/* PWA Install Prompt */}
        <PWAInstallPrompt />

        <HeroSection
          onVerseChange={handlePlayerVerseChange}
          currentHighlightedVerse={playerHighlightedVerse}
        />
        <TafsirContent playerHighlightedVerse={playerHighlightedVerse} />
        <Footer />
      </div>
    </>
  );
};

export default Index;


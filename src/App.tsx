import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import InstallGuide from "./pages/InstallGuide";
import QuranIndex from "./pages/QuranIndex";
import SurahPage from "./pages/SurahPage";
import TafsirList from "./pages/TafsirList";
import Athkar from "./pages/Athkar";
import OfflineSettings from "./pages/OfflineSettings";
import NotFound from "./pages/NotFound";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { PWAUpdatePrompt } from "./components/PWAUpdatePrompt";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/quran" element={<QuranIndex />} />
              <Route path="/surah/:id" element={<SurahPage />} />
              <Route path="/tafsir" element={<Index />} />
              <Route path="/tafsir-list" element={<TafsirList />} />
              <Route path="/athkar" element={<Athkar />} />
              <Route path="/install-guide" element={<InstallGuide />} />
              <Route path="/offline-settings" element={<OfflineSettings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <PWAUpdatePrompt />
            <PWAInstallPrompt />
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;


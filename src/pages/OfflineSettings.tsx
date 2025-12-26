import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HardDrive, 
  Trash2, 
  Download, 
  Book, 
  Volume2, 
  Home, 
  ArrowRight,
  RefreshCw,
  FileText,
  Database,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOfflineAudio } from '@/hooks/useOfflineAudio';
import { useOfflineTafsir } from '@/hooks/useOfflineTafsir';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const OfflineSettings = () => {
  const { t, isRtl, dir } = useLanguage();
  const { cachedItems: cachedAudios, removeFromCache, clearAllCache } = useOfflineAudio();
  const { cachedTafsirs, clearAllTafsirs, refreshCache } = useOfflineTafsir();
  const [isClearing, setIsClearing] = useState(false);
  const [storageInfo, setStorageInfo] = useState<{ used: string; available: string } | null>(null);

  // Get storage info
  useEffect(() => {
    const getStorageInfo = async () => {
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        const usedMB = ((estimate.usage || 0) / (1024 * 1024)).toFixed(2);
        const availableMB = ((estimate.quota || 0) / (1024 * 1024)).toFixed(2);
        setStorageInfo({
          used: usedMB,
          available: availableMB
        });
      }
    };
    getStorageInfo();
  }, [cachedAudios, cachedTafsirs]);

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      await clearAllCache();
      await clearAllTafsirs();
      toast.success(isRtl ? 'تم مسح جميع الملفات المحفوظة' : 'All cached files cleared');
    } catch (error) {
      toast.error(isRtl ? 'حدث خطأ أثناء المسح' : 'Error clearing cache');
    } finally {
      setIsClearing(false);
    }
  };

  const handleRemoveAudio = async (url: string, name: string) => {
    await removeFromCache(url);
    toast.success(isRtl ? `تم حذف: ${name}` : `Deleted: ${name}`);
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-primary" />
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowRight className="w-4 h-4 rotate-180" />}
                <Home className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
                <HardDrive className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-bold font-amiri text-foreground">
                {isRtl ? 'إدارة التخزين' : 'Storage Management'}
              </h1>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 max-w-3xl">
        {/* Storage Overview */}
        <div className="mb-8 p-6 bg-card rounded-2xl border border-border/50 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">
                {isRtl ? 'معلومات التخزين' : 'Storage Info'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isRtl ? 'المساحة المستخدمة والمتاحة' : 'Used and available space'}
              </p>
            </div>
          </div>
          
          {storageInfo && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-muted/30 rounded-xl text-center">
                <p className="text-2xl font-bold text-primary">{storageInfo.used} MB</p>
                <p className="text-sm text-muted-foreground">{isRtl ? 'مستخدم' : 'Used'}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-xl text-center">
                <p className="text-2xl font-bold text-foreground">{storageInfo.available} MB</p>
                <p className="text-sm text-muted-foreground">{isRtl ? 'متاح' : 'Available'}</p>
              </div>
            </div>
          )}

          <Button 
            variant="destructive" 
            className="w-full gap-2"
            onClick={handleClearAll}
            disabled={isClearing || (cachedAudios.length === 0 && cachedTafsirs.length === 0)}
          >
            {isClearing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {isRtl ? 'مسح جميع الملفات المحفوظة' : 'Clear All Cached Files'}
          </Button>
        </div>

        {/* Cached Audio Section */}
        <div className="mb-8 p-6 bg-card rounded-2xl border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">
                  {isRtl ? 'التلاوات المحفوظة' : 'Cached Recitations'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {cachedAudios.length} {isRtl ? 'ملف صوتي' : 'audio files'}
                </p>
              </div>
            </div>
          </div>

          {cachedAudios.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Volume2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{isRtl ? 'لا توجد تلاوات محفوظة' : 'No cached recitations'}</p>
              <p className="text-sm mt-1">{isRtl ? 'حمّل التلاوات للاستماع بدون إنترنت' : 'Download recitations for offline listening'}</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {cachedAudios.map((audio) => (
                <div 
                  key={audio.url}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Volume2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {isRtl ? `سورة ${audio.surahId}` : `Surah ${audio.surahId}`}
                        {audio.verseId && ` - ${isRtl ? 'آية' : 'Verse'} ${audio.verseId}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {audio.reciter} • {new Date(audio.cachedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAudio(audio.url, `Surah ${audio.surahId}`)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cached Tafsir Section */}
        <div className="mb-8 p-6 bg-card rounded-2xl border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">
                  {isRtl ? 'التفاسير المحفوظة' : 'Cached Tafsirs'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {cachedTafsirs.length} {isRtl ? 'تفسير' : 'tafsirs'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshCache}
              className="text-muted-foreground"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {cachedTafsirs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{isRtl ? 'لا توجد تفاسير محفوظة' : 'No cached tafsirs'}</p>
              <p className="text-sm mt-1">{isRtl ? 'احفظ التفاسير للقراءة بدون إنترنت' : 'Save tafsirs for offline reading'}</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {/* Group by surah */}
              {Array.from(new Set(cachedTafsirs.map(t => t.surahId))).map((surahId) => {
                const surahTafsirs = cachedTafsirs.filter(t => t.surahId === surahId);
                return (
                  <div 
                    key={surahId}
                    className="p-3 bg-muted/30 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Book className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {isRtl ? `سورة رقم ${surahId}` : `Surah ${surahId}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {surahTafsirs.length} {isRtl ? 'آية محفوظة' : 'verses cached'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-bold text-foreground mb-2">
                {isRtl ? 'ملاحظات هامة' : 'Important Notes'}
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {isRtl ? 'الملفات المحفوظة تستخدم مساحة من جهازك' : 'Cached files use storage on your device'}</li>
                <li>• {isRtl ? 'مسح المتصفح قد يحذف الملفات المحفوظة' : 'Clearing browser data may delete cached files'}</li>
                <li>• {isRtl ? 'يُنصح بحفظ السور التي تقرأها كثيراً' : 'Recommended to cache surahs you read often'}</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfflineSettings;

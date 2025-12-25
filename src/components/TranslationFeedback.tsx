import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageSquarePlus, Send, Check } from 'lucide-react';
import { toast } from 'sonner';

const LANGUAGES = [
  { code: 'ar', name: 'العربية' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'ur', name: 'اردو' },
  { code: 'fa', name: 'فارسی' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Bahasa Melayu' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'it', name: 'Italiano' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'pl', name: 'Polski' },
  { code: 'th', name: 'ไทย' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'ha', name: 'Hausa' },
  { code: 'am', name: 'አማርኛ' },
  { code: 'so', name: 'Soomaali' },
  { code: 'uz', name: 'Oʻzbek' },
  { code: 'az', name: 'Azərbaycan' },
  { code: 'kk', name: 'Қазақ' },
  { code: 'tg', name: 'Тоҷикӣ' },
  { code: 'ku', name: 'Kurdî' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ml', name: 'മലയാളം' },
];

const UI_LABELS: Record<string, { title: string; description: string; originalLabel: string; suggestedLabel: string; contextLabel: string; contextPlaceholder: string; submit: string; success: string; error: string }> = {
  ar: {
    title: 'اقتراح تصحيح ترجمة',
    description: 'ساعدنا في تحسين الترجمات عن طريق اقتراح تصحيحات',
    originalLabel: 'النص الخاطئ',
    suggestedLabel: 'الترجمة الصحيحة المقترحة',
    contextLabel: 'أين رأيت هذا النص؟ (اختياري)',
    contextPlaceholder: 'مثال: في الصفحة الرئيسية، زر البحث',
    submit: 'إرسال الاقتراح',
    success: 'شكراً لك! تم إرسال اقتراحك بنجاح',
    error: 'حدث خطأ، يرجى المحاولة مرة أخرى',
  },
  en: {
    title: 'Suggest Translation Correction',
    description: 'Help us improve translations by suggesting corrections',
    originalLabel: 'Incorrect Text',
    suggestedLabel: 'Suggested Correct Translation',
    contextLabel: 'Where did you see this text? (optional)',
    contextPlaceholder: 'Example: on the homepage, search button',
    submit: 'Submit Suggestion',
    success: 'Thank you! Your suggestion has been submitted',
    error: 'An error occurred, please try again',
  },
};

const RTL_LANGUAGES = ['ar', 'ur', 'fa'];

export const TranslationFeedback = () => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);
  const [originalText, setOriginalText] = useState('');
  const [suggestedText, setSuggestedText] = useState('');
  const [context, setContext] = useState('');

  const labels = UI_LABELS[language] || UI_LABELS.en;
  const isRTL = RTL_LANGUAGES.includes(language);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originalText.trim() || !suggestedText.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('translation_suggestions').insert({
        language_code: selectedLanguage,
        original_text: originalText.trim(),
        suggested_text: suggestedText.trim(),
        context: context.trim() || null,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success(labels.success);
      
      // Reset form after delay
      setTimeout(() => {
        setOpen(false);
        setIsSuccess(false);
        setOriginalText('');
        setSuggestedText('');
        setContext('');
      }, 1500);
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      toast.error(labels.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
        >
          <MessageSquarePlus className="h-4 w-4" />
          <span className="hidden sm:inline">
            {language === 'ar' ? 'اقتراح تصحيح' : 'Suggest Correction'}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5 text-primary" />
            {labels.title}
          </DialogTitle>
          <DialogDescription>
            {labels.description}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-center text-muted-foreground">{labels.success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">
                {language === 'ar' ? 'اللغة' : 'Language'}
              </Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="original">{labels.originalLabel}</Label>
              <Input
                id="original"
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder={language === 'ar' ? 'اكتب النص الذي يحتوي على خطأ' : 'Enter the incorrect text'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="suggested">{labels.suggestedLabel}</Label>
              <Textarea
                id="suggested"
                value={suggestedText}
                onChange={(e) => setSuggestedText(e.target.value)}
                placeholder={language === 'ar' ? 'اكتب الترجمة الصحيحة' : 'Enter the correct translation'}
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">{labels.contextLabel}</Label>
              <Input
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder={labels.contextPlaceholder}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full gap-2" 
              disabled={isSubmitting || !originalText.trim() || !suggestedText.trim()}
            >
              <Send className="h-4 w-4" />
              {labels.submit}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

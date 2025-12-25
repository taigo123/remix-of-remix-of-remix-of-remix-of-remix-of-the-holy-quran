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
import { MessageSquarePlus, Send, Check, Languages, Lightbulb, Wrench, Bug, MessageCircle } from 'lucide-react';
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

type FeedbackType = 'translation' | 'feature' | 'improvement' | 'bug' | 'other';

const FEEDBACK_TYPES: { value: FeedbackType; labelAr: string; labelEn: string; icon: typeof Languages }[] = [
  { value: 'translation', labelAr: 'تصحيح ترجمة', labelEn: 'Translation Correction', icon: Languages },
  { value: 'feature', labelAr: 'اقتراح ميزة جديدة', labelEn: 'Feature Request', icon: Lightbulb },
  { value: 'improvement', labelAr: 'تحسين موجود', labelEn: 'Improvement', icon: Wrench },
  { value: 'bug', labelAr: 'الإبلاغ عن مشكلة', labelEn: 'Report Bug', icon: Bug },
  { value: 'other', labelAr: 'رسالة أخرى', labelEn: 'Other Message', icon: MessageCircle },
];

const UI_LABELS = {
  ar: {
    title: 'أرسل ملاحظاتك',
    description: 'ساعدنا في تحسين الموقع من خلال اقتراحاتك وملاحظاتك',
    feedbackTypeLabel: 'نوع الملاحظة',
    originalLabel: 'النص الخاطئ',
    suggestedLabel: 'الترجمة الصحيحة المقترحة',
    messageLabel: 'رسالتك',
    messagePlaceholder: 'اكتب اقتراحك أو ملاحظتك هنا...',
    contextLabel: 'تفاصيل إضافية (اختياري)',
    contextPlaceholder: 'مثال: في الصفحة الرئيسية، زر البحث',
    submit: 'إرسال',
    success: 'شكراً لك! تم إرسال ملاحظتك بنجاح',
    error: 'حدث خطأ، يرجى المحاولة مرة أخرى',
    buttonText: 'أرسل ملاحظاتك',
  },
  en: {
    title: 'Send Feedback',
    description: 'Help us improve by sharing your suggestions and feedback',
    feedbackTypeLabel: 'Feedback Type',
    originalLabel: 'Incorrect Text',
    suggestedLabel: 'Suggested Correct Translation',
    messageLabel: 'Your Message',
    messagePlaceholder: 'Write your suggestion or feedback here...',
    contextLabel: 'Additional Details (optional)',
    contextPlaceholder: 'Example: on the homepage, search button',
    submit: 'Submit',
    success: 'Thank you! Your feedback has been submitted',
    error: 'An error occurred, please try again',
    buttonText: 'Send Feedback',
  },
};

const RTL_LANGUAGES = ['ar', 'ur', 'fa'];

export const UserFeedback = () => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('feature');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);
  const [originalText, setOriginalText] = useState('');
  const [suggestedText, setSuggestedText] = useState('');
  const [context, setContext] = useState('');

  const labels = UI_LABELS[language as keyof typeof UI_LABELS] || UI_LABELS.en;
  const isRTL = RTL_LANGUAGES.includes(language);
  const isTranslation = feedbackType === 'translation';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const messageToSend = isTranslation ? suggestedText : suggestedText;
    if (!messageToSend.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('user_feedback').insert({
        feedback_type: feedbackType,
        language_code: isTranslation ? selectedLanguage : null,
        original_text: isTranslation ? (originalText.trim() || null) : null,
        suggested_text: messageToSend.trim(),
        context: context.trim() || null,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success(labels.success);
      
      setTimeout(() => {
        setOpen(false);
        setIsSuccess(false);
        setFeedbackType('feature');
        setOriginalText('');
        setSuggestedText('');
        setContext('');
      }, 1500);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error(labels.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedType = FEEDBACK_TYPES.find(t => t.value === feedbackType);
  const TypeIcon = selectedType?.icon || MessageCircle;

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
            {labels.buttonText}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TypeIcon className="h-5 w-5 text-primary" />
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
            {/* Feedback Type Selection */}
            <div className="space-y-2">
              <Label>{labels.feedbackTypeLabel}</Label>
              <div className="grid grid-cols-2 gap-2">
                {FEEDBACK_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = feedbackType === type.value;
                  return (
                    <Button
                      key={type.value}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="justify-start gap-2 h-auto py-2"
                      onClick={() => setFeedbackType(type.value)}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs">
                        {language === 'ar' ? type.labelAr : type.labelEn}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Language Selection - only for translation feedback */}
            {isTranslation && (
              <>
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
                  />
                </div>
              </>
            )}

            {/* Main Message */}
            <div className="space-y-2">
              <Label htmlFor="suggested">
                {isTranslation ? labels.suggestedLabel : labels.messageLabel}
              </Label>
              <Textarea
                id="suggested"
                value={suggestedText}
                onChange={(e) => setSuggestedText(e.target.value)}
                placeholder={isTranslation 
                  ? (language === 'ar' ? 'اكتب الترجمة الصحيحة' : 'Enter the correct translation')
                  : labels.messagePlaceholder
                }
                required
                rows={3}
              />
            </div>

            {/* Context / Additional Details */}
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
              disabled={isSubmitting || !suggestedText.trim()}
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

// Keep backward compatibility
export const TranslationFeedback = UserFeedback;

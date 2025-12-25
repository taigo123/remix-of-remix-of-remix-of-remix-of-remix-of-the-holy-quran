import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { getViewerId } from '@/hooks/useViewerId';
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

interface FeedbackTypeOption {
  value: FeedbackType;
  icon: typeof Languages;
  labels: Record<string, string>;
}

const FEEDBACK_TYPES: FeedbackTypeOption[] = [
  { 
    value: 'translation', 
    icon: Languages,
    labels: {
      ar: 'تصحيح ترجمة', en: 'Translation Correction', fr: 'Correction de traduction', de: 'Übersetzungskorrektur',
      es: 'Corrección de traducción', pt: 'Correção de tradução', ru: 'Исправление перевода', tr: 'Çeviri düzeltme',
      ur: 'ترجمہ کی تصحیح', fa: 'اصلاح ترجمه', id: 'Koreksi terjemahan', ms: 'Pembetulan terjemahan',
      bn: 'অনুবাদ সংশোধন', hi: 'अनुवाद सुधार', zh: '翻译更正', ja: '翻訳修正', ko: '번역 수정',
      it: 'Correzione traduzione', nl: 'Vertaalcorrectie', pl: 'Korekta tłumaczenia', th: 'แก้ไขคำแปล',
      vi: 'Sửa bản dịch', sw: 'Marekebisho ya tafsiri', ha: 'Gyara fassara', am: 'የትርጉም እርማት',
      so: 'Saxitaanka turjumaadda', uz: 'Tarjima tuzatish', az: 'Tərcümə düzəlişi', kk: 'Аударма түзету',
      tg: 'Ислоҳи тарҷума', ku: 'Rastkirina wergerê', ta: 'மொழிபெயர்ப்பு திருத்தம்', te: 'అనువాద సవరణ', ml: 'വിവർത്തന തിരുത്തൽ'
    }
  },
  { 
    value: 'feature', 
    icon: Lightbulb,
    labels: {
      ar: 'اقتراح ميزة جديدة', en: 'Feature Request', fr: 'Demande de fonctionnalité', de: 'Funktionsanfrage',
      es: 'Solicitud de función', pt: 'Solicitação de recurso', ru: 'Запрос функции', tr: 'Özellik isteği',
      ur: 'نئی خصوصیت کی درخواست', fa: 'درخواست ویژگی', id: 'Permintaan fitur', ms: 'Permintaan ciri',
      bn: 'বৈশিষ্ট্যের অনুরোধ', hi: 'सुविधा अनुरोध', zh: '功能请求', ja: '機能リクエスト', ko: '기능 요청',
      it: 'Richiesta funzionalità', nl: 'Functie aanvraag', pl: 'Prośba o funkcję', th: 'ขอฟีเจอร์',
      vi: 'Yêu cầu tính năng', sw: 'Ombi la kipengele', ha: 'Buƙatar fasali', am: 'የባህሪ ጥያቄ',
      so: 'Codsiga sifo', uz: 'Funksiya so\'rovi', az: 'Xüsusiyyət tələbi', kk: 'Функция сұрауы',
      tg: 'Дархости хусусият', ku: 'Daxwaza taybetmendiyê', ta: 'அம்ச கோரிக்கை', te: 'ఫీచర్ అభ్యర్థన', ml: 'ഫീച്ചർ അഭ്യർത്ഥന'
    }
  },
  { 
    value: 'improvement', 
    icon: Wrench,
    labels: {
      ar: 'تحسين موجود', en: 'Improvement', fr: 'Amélioration', de: 'Verbesserung',
      es: 'Mejora', pt: 'Melhoria', ru: 'Улучшение', tr: 'İyileştirme',
      ur: 'بہتری', fa: 'بهبود', id: 'Perbaikan', ms: 'Penambahbaikan',
      bn: 'উন্নতি', hi: 'सुधार', zh: '改进', ja: '改善', ko: '개선',
      it: 'Miglioramento', nl: 'Verbetering', pl: 'Ulepszenie', th: 'การปรับปรุง',
      vi: 'Cải tiến', sw: 'Uboreshaji', ha: 'Ingantawa', am: 'ማሻሻያ',
      so: 'Hagaajin', uz: 'Yaxshilash', az: 'Təkmilləşdirmə', kk: 'Жақсарту',
      tg: 'Беҳбуд', ku: 'Başkirin', ta: 'மேம்பாடு', te: 'మెరుగుదల', ml: 'മെച്ചപ്പെടുത്തൽ'
    }
  },
  { 
    value: 'bug', 
    icon: Bug,
    labels: {
      ar: 'الإبلاغ عن مشكلة', en: 'Report Bug', fr: 'Signaler un bug', de: 'Fehler melden',
      es: 'Reportar error', pt: 'Reportar bug', ru: 'Сообщить об ошибке', tr: 'Hata bildir',
      ur: 'مسئلہ کی اطلاع', fa: 'گزارش مشکل', id: 'Laporkan bug', ms: 'Laporkan pepijat',
      bn: 'বাগ রিপোর্ট', hi: 'बग रिपोर्ट', zh: '报告错误', ja: 'バグを報告', ko: '버그 신고',
      it: 'Segnala bug', nl: 'Bug melden', pl: 'Zgłoś błąd', th: 'รายงานข้อผิดพลาด',
      vi: 'Báo lỗi', sw: 'Ripoti hitilafu', ha: 'Rahoton matsala', am: 'ስህተት ሪፖርት',
      so: 'Warbixin cillad', uz: 'Xato haqida xabar', az: 'Xəta bildir', kk: 'Қате туралы хабарлау',
      tg: 'Хабар додани хато', ku: 'Çewtiyê ragihîne', ta: 'பிழை புகார்', te: 'బగ్ నివేదిక', ml: 'ബഗ് റിപ്പോർട്ട്'
    }
  },
  { 
    value: 'other', 
    icon: MessageCircle,
    labels: {
      ar: 'رسالة أخرى', en: 'Other Message', fr: 'Autre message', de: 'Andere Nachricht',
      es: 'Otro mensaje', pt: 'Outra mensagem', ru: 'Другое сообщение', tr: 'Diğer mesaj',
      ur: 'دوسرا پیغام', fa: 'پیام دیگر', id: 'Pesan lainnya', ms: 'Mesej lain',
      bn: 'অন্যান্য বার্তা', hi: 'अन्य संदेश', zh: '其他消息', ja: 'その他のメッセージ', ko: '기타 메시지',
      it: 'Altro messaggio', nl: 'Ander bericht', pl: 'Inna wiadomość', th: 'ข้อความอื่น',
      vi: 'Tin nhắn khác', sw: 'Ujumbe mwingine', ha: 'Sauran saƙo', am: 'ሌላ መልእክት',
      so: 'Fariin kale', uz: 'Boshqa xabar', az: 'Digər mesaj', kk: 'Басқа хабарлама',
      tg: 'Паёми дигар', ku: 'Peyama din', ta: 'வேறு செய்தி', te: 'ఇతర సందేశం', ml: 'മറ്റ് സന്ദേശം'
    }
  },
];

interface UILabels {
  title: string;
  description: string;
  feedbackTypeLabel: string;
  languageLabel: string;
  originalLabel: string;
  suggestedLabel: string;
  messageLabel: string;
  messagePlaceholder: string;
  contextLabel: string;
  contextPlaceholder: string;
  submit: string;
  success: string;
  error: string;
  buttonText: string;
}

const UI_LABELS: Record<string, UILabels> = {
  ar: {
    title: 'أرسل ملاحظاتك',
    description: 'ساعدنا في تحسين الموقع من خلال اقتراحاتك وملاحظاتك',
    feedbackTypeLabel: 'نوع الملاحظة',
    languageLabel: 'اللغة',
    originalLabel: 'النص الخاطئ',
    suggestedLabel: 'الترجمة الصحيحة المقترحة',
    messageLabel: 'رسالتك',
    messagePlaceholder: 'اكتب اقتراحك أو ملاحظتك هنا...',
    contextLabel: 'تفاصيل إضافية',
    contextPlaceholder: 'مثال: في الصفحة الرئيسية، زر البحث',
    submit: 'إرسال',
    success: 'شكراً لك! تم إرسال ملاحظتك بنجاح',
    error: 'حدث خطأ، يرجى المحاولة مرة أخرى',
    buttonText: 'أرسل ملاحظاتك',
  },
  en: {
    title: 'Send Feedback',
    description: 'Help us improve by sharing your suggestions',
    feedbackTypeLabel: 'Feedback Type',
    languageLabel: 'Language',
    originalLabel: 'Incorrect Text',
    suggestedLabel: 'Suggested Correct Translation',
    messageLabel: 'Your Message',
    messagePlaceholder: 'Write your suggestion here...',
    contextLabel: 'Additional Details',
    contextPlaceholder: 'Example: on the homepage, search button',
    submit: 'Submit',
    success: 'Thank you! Your feedback has been submitted',
    error: 'An error occurred, please try again',
    buttonText: 'Send Feedback',
  },
  fr: {
    title: 'Envoyer des commentaires',
    description: 'Aidez-nous à améliorer en partageant vos suggestions',
    feedbackTypeLabel: 'Type de commentaire',
    languageLabel: 'Langue',
    originalLabel: 'Texte incorrect',
    suggestedLabel: 'Traduction correcte suggérée',
    messageLabel: 'Votre message',
    messagePlaceholder: 'Écrivez votre suggestion ici...',
    contextLabel: 'Détails supplémentaires (optionnel)',
    contextPlaceholder: 'Exemple: sur la page d\'accueil, bouton recherche',
    submit: 'Envoyer',
    success: 'Merci! Votre commentaire a été envoyé',
    error: 'Une erreur s\'est produite, veuillez réessayer',
    buttonText: 'Commentaires',
  },
  de: {
    title: 'Feedback senden',
    description: 'Helfen Sie uns, uns zu verbessern, indem Sie Ihre Vorschläge teilen',
    feedbackTypeLabel: 'Feedback-Typ',
    languageLabel: 'Sprache',
    originalLabel: 'Falscher Text',
    suggestedLabel: 'Vorgeschlagene korrekte Übersetzung',
    messageLabel: 'Ihre Nachricht',
    messagePlaceholder: 'Schreiben Sie Ihren Vorschlag hier...',
    contextLabel: 'Zusätzliche Details (optional)',
    contextPlaceholder: 'Beispiel: auf der Startseite, Suchschaltfläche',
    submit: 'Absenden',
    success: 'Danke! Ihr Feedback wurde gesendet',
    error: 'Ein Fehler ist aufgetreten, bitte versuchen Sie es erneut',
    buttonText: 'Feedback',
  },
  es: {
    title: 'Enviar comentarios',
    description: 'Ayúdanos a mejorar compartiendo tus sugerencias',
    feedbackTypeLabel: 'Tipo de comentario',
    languageLabel: 'Idioma',
    originalLabel: 'Texto incorrecto',
    suggestedLabel: 'Traducción correcta sugerida',
    messageLabel: 'Tu mensaje',
    messagePlaceholder: 'Escribe tu sugerencia aquí...',
    contextLabel: 'Detalles adicionales (opcional)',
    contextPlaceholder: 'Ejemplo: en la página principal, botón buscar',
    submit: 'Enviar',
    success: '¡Gracias! Tu comentario ha sido enviado',
    error: 'Ocurrió un error, por favor intenta de nuevo',
    buttonText: 'Comentarios',
  },
  pt: {
    title: 'Enviar feedback',
    description: 'Ajude-nos a melhorar compartilhando suas sugestões',
    feedbackTypeLabel: 'Tipo de feedback',
    languageLabel: 'Idioma',
    originalLabel: 'Texto incorreto',
    suggestedLabel: 'Tradução correta sugerida',
    messageLabel: 'Sua mensagem',
    messagePlaceholder: 'Escreva sua sugestão aqui...',
    contextLabel: 'Detalhes adicionais (opcional)',
    contextPlaceholder: 'Exemplo: na página inicial, botão pesquisar',
    submit: 'Enviar',
    success: 'Obrigado! Seu feedback foi enviado',
    error: 'Ocorreu um erro, tente novamente',
    buttonText: 'Feedback',
  },
  ru: {
    title: 'Отправить отзыв',
    description: 'Помогите нам улучшиться, поделившись своими предложениями',
    feedbackTypeLabel: 'Тип отзыва',
    languageLabel: 'Язык',
    originalLabel: 'Неправильный текст',
    suggestedLabel: 'Предложенный правильный перевод',
    messageLabel: 'Ваше сообщение',
    messagePlaceholder: 'Напишите ваше предложение здесь...',
    contextLabel: 'Дополнительные детали (необязательно)',
    contextPlaceholder: 'Пример: на главной странице, кнопка поиска',
    submit: 'Отправить',
    success: 'Спасибо! Ваш отзыв был отправлен',
    error: 'Произошла ошибка, попробуйте снова',
    buttonText: 'Отзыв',
  },
  tr: {
    title: 'Geri bildirim gönder',
    description: 'Önerilerinizi paylaşarak gelişmemize yardımcı olun',
    feedbackTypeLabel: 'Geri bildirim türü',
    languageLabel: 'Dil',
    originalLabel: 'Yanlış metin',
    suggestedLabel: 'Önerilen doğru çeviri',
    messageLabel: 'Mesajınız',
    messagePlaceholder: 'Önerinizi buraya yazın...',
    contextLabel: 'Ek detaylar (isteğe bağlı)',
    contextPlaceholder: 'Örnek: ana sayfada, arama düğmesi',
    submit: 'Gönder',
    success: 'Teşekkürler! Geri bildiriminiz gönderildi',
    error: 'Bir hata oluştu, lütfen tekrar deneyin',
    buttonText: 'Geri bildirim',
  },
  ur: {
    title: 'رائے بھیجیں',
    description: 'اپنی تجاویز شیئر کرکے ہماری مدد کریں',
    feedbackTypeLabel: 'رائے کی قسم',
    languageLabel: 'زبان',
    originalLabel: 'غلط متن',
    suggestedLabel: 'تجویز کردہ درست ترجمہ',
    messageLabel: 'آپ کا پیغام',
    messagePlaceholder: 'اپنی تجویز یہاں لکھیں...',
    contextLabel: 'اضافی تفصیلات (اختیاری)',
    contextPlaceholder: 'مثال: ہوم پیج پر، سرچ بٹن',
    submit: 'بھیجیں',
    success: 'شکریہ! آپ کی رائے بھیج دی گئی',
    error: 'ایک خرابی ہوئی، براہ کرم دوبارہ کوشش کریں',
    buttonText: 'رائے بھیجیں',
  },
  fa: {
    title: 'ارسال بازخورد',
    description: 'با به اشتراک گذاری پیشنهادات خود به ما کمک کنید',
    feedbackTypeLabel: 'نوع بازخورد',
    languageLabel: 'زبان',
    originalLabel: 'متن نادرست',
    suggestedLabel: 'ترجمه صحیح پیشنهادی',
    messageLabel: 'پیام شما',
    messagePlaceholder: 'پیشنهاد خود را اینجا بنویسید...',
    contextLabel: 'جزئیات اضافی (اختیاری)',
    contextPlaceholder: 'مثال: در صفحه اصلی، دکمه جستجو',
    submit: 'ارسال',
    success: 'متشکریم! بازخورد شما ارسال شد',
    error: 'خطایی رخ داد، لطفا دوباره تلاش کنید',
    buttonText: 'بازخورد',
  },
  id: {
    title: 'Kirim Umpan Balik',
    description: 'Bantu kami meningkatkan dengan membagikan saran Anda',
    feedbackTypeLabel: 'Jenis Umpan Balik',
    languageLabel: 'Bahasa',
    originalLabel: 'Teks Salah',
    suggestedLabel: 'Terjemahan Benar yang Disarankan',
    messageLabel: 'Pesan Anda',
    messagePlaceholder: 'Tulis saran Anda di sini...',
    contextLabel: 'Detail Tambahan (opsional)',
    contextPlaceholder: 'Contoh: di halaman utama, tombol pencarian',
    submit: 'Kirim',
    success: 'Terima kasih! Umpan balik Anda telah dikirim',
    error: 'Terjadi kesalahan, silakan coba lagi',
    buttonText: 'Umpan Balik',
  },
  ms: {
    title: 'Hantar Maklum Balas',
    description: 'Bantu kami meningkatkan dengan berkongsi cadangan anda',
    feedbackTypeLabel: 'Jenis Maklum Balas',
    languageLabel: 'Bahasa',
    originalLabel: 'Teks Salah',
    suggestedLabel: 'Terjemahan Betul yang Dicadangkan',
    messageLabel: 'Mesej Anda',
    messagePlaceholder: 'Tulis cadangan anda di sini...',
    contextLabel: 'Butiran Tambahan (pilihan)',
    contextPlaceholder: 'Contoh: di halaman utama, butang carian',
    submit: 'Hantar',
    success: 'Terima kasih! Maklum balas anda telah dihantar',
    error: 'Ralat berlaku, sila cuba lagi',
    buttonText: 'Maklum Balas',
  },
  bn: {
    title: 'প্রতিক্রিয়া পাঠান',
    description: 'আপনার পরামর্শ শেয়ার করে আমাদের উন্নতিতে সাহায্য করুন',
    feedbackTypeLabel: 'প্রতিক্রিয়ার ধরন',
    languageLabel: 'ভাষা',
    originalLabel: 'ভুল টেক্সট',
    suggestedLabel: 'প্রস্তাবিত সঠিক অনুবাদ',
    messageLabel: 'আপনার বার্তা',
    messagePlaceholder: 'আপনার পরামর্শ এখানে লিখুন...',
    contextLabel: 'অতিরিক্ত বিবরণ (ঐচ্ছিক)',
    contextPlaceholder: 'উদাহরণ: হোম পেজে, সার্চ বাটন',
    submit: 'জমা দিন',
    success: 'ধন্যবাদ! আপনার প্রতিক্রিয়া পাঠানো হয়েছে',
    error: 'একটি ত্রুটি ঘটেছে, অনুগ্রহ করে আবার চেষ্টা করুন',
    buttonText: 'প্রতিক্রিয়া',
  },
  hi: {
    title: 'प्रतिक्रिया भेजें',
    description: 'अपने सुझाव साझा करके हमें बेहतर बनाने में मदद करें',
    feedbackTypeLabel: 'प्रतिक्रिया का प्रकार',
    languageLabel: 'भाषा',
    originalLabel: 'गलत टेक्स्ट',
    suggestedLabel: 'सुझाया गया सही अनुवाद',
    messageLabel: 'आपका संदेश',
    messagePlaceholder: 'अपना सुझाव यहाँ लिखें...',
    contextLabel: 'अतिरिक्त विवरण (वैकल्पिक)',
    contextPlaceholder: 'उदाहरण: होम पेज पर, सर्च बटन',
    submit: 'भेजें',
    success: 'धन्यवाद! आपकी प्रतिक्रिया भेज दी गई',
    error: 'एक त्रुटि हुई, कृपया पुनः प्रयास करें',
    buttonText: 'प्रतिक्रिया',
  },
  zh: {
    title: '发送反馈',
    description: '通过分享您的建议帮助我们改进',
    feedbackTypeLabel: '反馈类型',
    languageLabel: '语言',
    originalLabel: '错误文本',
    suggestedLabel: '建议的正确翻译',
    messageLabel: '您的消息',
    messagePlaceholder: '在这里写下您的建议...',
    contextLabel: '其他详情（可选）',
    contextPlaceholder: '例如：在首页，搜索按钮',
    submit: '提交',
    success: '谢谢！您的反馈已发送',
    error: '发生错误，请重试',
    buttonText: '反馈',
  },
  ja: {
    title: 'フィードバックを送信',
    description: 'ご提案を共有して改善にご協力ください',
    feedbackTypeLabel: 'フィードバックの種類',
    languageLabel: '言語',
    originalLabel: '誤ったテキスト',
    suggestedLabel: '提案された正しい翻訳',
    messageLabel: 'メッセージ',
    messagePlaceholder: 'ご提案をここに書いてください...',
    contextLabel: '追加の詳細（任意）',
    contextPlaceholder: '例：ホームページ、検索ボタン',
    submit: '送信',
    success: 'ありがとうございます！フィードバックが送信されました',
    error: 'エラーが発生しました。もう一度お試しください',
    buttonText: 'フィードバック',
  },
  ko: {
    title: '피드백 보내기',
    description: '제안을 공유하여 개선에 도움을 주세요',
    feedbackTypeLabel: '피드백 유형',
    languageLabel: '언어',
    originalLabel: '잘못된 텍스트',
    suggestedLabel: '제안된 올바른 번역',
    messageLabel: '메시지',
    messagePlaceholder: '제안을 여기에 작성하세요...',
    contextLabel: '추가 세부정보 (선택사항)',
    contextPlaceholder: '예: 홈페이지, 검색 버튼',
    submit: '제출',
    success: '감사합니다! 피드백이 전송되었습니다',
    error: '오류가 발생했습니다. 다시 시도해 주세요',
    buttonText: '피드백',
  },
  it: {
    title: 'Invia feedback',
    description: 'Aiutaci a migliorare condividendo i tuoi suggerimenti',
    feedbackTypeLabel: 'Tipo di feedback',
    languageLabel: 'Lingua',
    originalLabel: 'Testo errato',
    suggestedLabel: 'Traduzione corretta suggerita',
    messageLabel: 'Il tuo messaggio',
    messagePlaceholder: 'Scrivi il tuo suggerimento qui...',
    contextLabel: 'Dettagli aggiuntivi (opzionale)',
    contextPlaceholder: 'Esempio: nella homepage, pulsante cerca',
    submit: 'Invia',
    success: 'Grazie! Il tuo feedback è stato inviato',
    error: 'Si è verificato un errore, riprova',
    buttonText: 'Feedback',
  },
  nl: {
    title: 'Stuur feedback',
    description: 'Help ons verbeteren door je suggesties te delen',
    feedbackTypeLabel: 'Type feedback',
    languageLabel: 'Taal',
    originalLabel: 'Onjuiste tekst',
    suggestedLabel: 'Voorgestelde juiste vertaling',
    messageLabel: 'Je bericht',
    messagePlaceholder: 'Schrijf je suggestie hier...',
    contextLabel: 'Extra details (optioneel)',
    contextPlaceholder: 'Voorbeeld: op de homepage, zoekknop',
    submit: 'Versturen',
    success: 'Bedankt! Je feedback is verzonden',
    error: 'Er is een fout opgetreden, probeer het opnieuw',
    buttonText: 'Feedback',
  },
  pl: {
    title: 'Wyślij opinię',
    description: 'Pomóż nam się poprawić, dzieląc się swoimi sugestiami',
    feedbackTypeLabel: 'Typ opinii',
    languageLabel: 'Język',
    originalLabel: 'Nieprawidłowy tekst',
    suggestedLabel: 'Sugerowane poprawne tłumaczenie',
    messageLabel: 'Twoja wiadomość',
    messagePlaceholder: 'Napisz swoją sugestię tutaj...',
    contextLabel: 'Dodatkowe szczegóły (opcjonalnie)',
    contextPlaceholder: 'Przykład: na stronie głównej, przycisk szukaj',
    submit: 'Wyślij',
    success: 'Dziękujemy! Twoja opinia została wysłana',
    error: 'Wystąpił błąd, spróbuj ponownie',
    buttonText: 'Opinia',
  },
  th: {
    title: 'ส่งความคิดเห็น',
    description: 'ช่วยเราปรับปรุงโดยแบ่งปันข้อเสนอแนะของคุณ',
    feedbackTypeLabel: 'ประเภทความคิดเห็น',
    languageLabel: 'ภาษา',
    originalLabel: 'ข้อความที่ไม่ถูกต้อง',
    suggestedLabel: 'คำแปลที่ถูกต้องที่แนะนำ',
    messageLabel: 'ข้อความของคุณ',
    messagePlaceholder: 'เขียนข้อเสนอแนะของคุณที่นี่...',
    contextLabel: 'รายละเอียดเพิ่มเติม (ไม่บังคับ)',
    contextPlaceholder: 'ตัวอย่าง: ในหน้าแรก, ปุ่มค้นหา',
    submit: 'ส่ง',
    success: 'ขอบคุณ! ความคิดเห็นของคุณถูกส่งแล้ว',
    error: 'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง',
    buttonText: 'ความคิดเห็น',
  },
  vi: {
    title: 'Gửi phản hồi',
    description: 'Giúp chúng tôi cải thiện bằng cách chia sẻ đề xuất của bạn',
    feedbackTypeLabel: 'Loại phản hồi',
    languageLabel: 'Ngôn ngữ',
    originalLabel: 'Văn bản sai',
    suggestedLabel: 'Bản dịch đúng được đề xuất',
    messageLabel: 'Tin nhắn của bạn',
    messagePlaceholder: 'Viết đề xuất của bạn ở đây...',
    contextLabel: 'Chi tiết bổ sung (tùy chọn)',
    contextPlaceholder: 'Ví dụ: trên trang chủ, nút tìm kiếm',
    submit: 'Gửi',
    success: 'Cảm ơn! Phản hồi của bạn đã được gửi',
    error: 'Đã xảy ra lỗi, vui lòng thử lại',
    buttonText: 'Phản hồi',
  },
  sw: {
    title: 'Tuma Maoni',
    description: 'Tusaidie kuboresha kwa kushiriki mapendekezo yako',
    feedbackTypeLabel: 'Aina ya Maoni',
    languageLabel: 'Lugha',
    originalLabel: 'Maandishi Yasiyo Sahihi',
    suggestedLabel: 'Tafsiri Sahihi Iliyopendekezwa',
    messageLabel: 'Ujumbe Wako',
    messagePlaceholder: 'Andika pendekezo lako hapa...',
    contextLabel: 'Maelezo Zaidi (hiari)',
    contextPlaceholder: 'Mfano: kwenye ukurasa wa nyumbani, kitufe cha utafutaji',
    submit: 'Tuma',
    success: 'Asante! Maoni yako yametumwa',
    error: 'Hitilafu imetokea, tafadhali jaribu tena',
    buttonText: 'Maoni',
  },
  ha: {
    title: 'Aika Ra\'ayi',
    description: 'Taimaka mana mu inganta ta hanyar raba shawarwarinku',
    feedbackTypeLabel: 'Nau\'in Ra\'ayi',
    languageLabel: 'Harshe',
    originalLabel: 'Rubutu Mara Daidai',
    suggestedLabel: 'Fassarar da Aka Ba da Shawara',
    messageLabel: 'Saƙonku',
    messagePlaceholder: 'Rubuta shawarar ku a nan...',
    contextLabel: 'Ƙarin Bayani (zaɓi)',
    contextPlaceholder: 'Misali: a shafin gida, maɓallin bincike',
    submit: 'Aika',
    success: 'Na gode! An aika ra\'ayinku',
    error: 'An sami kuskure, da fatan za a sake gwadawa',
    buttonText: 'Ra\'ayi',
  },
  am: {
    title: 'አስተያየት ላክ',
    description: 'ሃሳብዎን በማጋራት እንድንሻሻል ይርዱን',
    feedbackTypeLabel: 'የአስተያየት ዓይነት',
    languageLabel: 'ቋንቋ',
    originalLabel: 'ስህተት ጽሁፍ',
    suggestedLabel: 'የተጠቆመ ትክክለኛ ትርጉም',
    messageLabel: 'መልእክትዎ',
    messagePlaceholder: 'ሃሳብዎን እዚህ ይጻፉ...',
    contextLabel: 'ተጨማሪ ዝርዝሮች (አማራጭ)',
    contextPlaceholder: 'ምሳሌ: በዋናው ገጽ፣ የፍለጋ አዝራር',
    submit: 'አስገባ',
    success: 'አመሰግናለሁ! አስተያየትዎ ተልኳል',
    error: 'ስህተት ተከስቷል፣ እባክዎ እንደገና ይሞክሩ',
    buttonText: 'አስተያየት',
  },
  so: {
    title: 'Dir Jawaab-celin',
    description: 'Naga caawi inaan wanaajino adoo la wadaagaya talooyinkaaga',
    feedbackTypeLabel: 'Nooca Jawaab-celinta',
    languageLabel: 'Luuqadda',
    originalLabel: 'Qoraal Khaldan',
    suggestedLabel: 'Turjumaad Saxan oo La Soo Jeediyey',
    messageLabel: 'Fariintaada',
    messagePlaceholder: 'Halkan ku qor talooyinkaaga...',
    contextLabel: 'Faahfaahin Dheeraad ah (ikhtiyaari)',
    contextPlaceholder: 'Tusaale: bogga hore, badhanka raadinta',
    submit: 'Dir',
    success: 'Mahadsanid! Jawaab-celintaada waa la diray',
    error: 'Khalad ayaa dhacay, fadlan mar kale isku day',
    buttonText: 'Jawaab-celin',
  },
  uz: {
    title: 'Fikr-mulohaza yuborish',
    description: 'Takliflaringizni baham ko\'rib, yaxshilashga yordam bering',
    feedbackTypeLabel: 'Fikr-mulohaza turi',
    languageLabel: 'Til',
    originalLabel: 'Noto\'g\'ri matn',
    suggestedLabel: 'Taklif qilingan to\'g\'ri tarjima',
    messageLabel: 'Xabaringiz',
    messagePlaceholder: 'Taklifingizni bu yerga yozing...',
    contextLabel: 'Qo\'shimcha tafsilotlar (ixtiyoriy)',
    contextPlaceholder: 'Misol: bosh sahifada, qidiruv tugmasi',
    submit: 'Yuborish',
    success: 'Rahmat! Fikr-mulohazangiz yuborildi',
    error: 'Xatolik yuz berdi, qaytadan urinib ko\'ring',
    buttonText: 'Fikr-mulohaza',
  },
  az: {
    title: 'Rəy göndər',
    description: 'Təkliflərinizi paylaşaraq yaxşılaşmağımıza kömək edin',
    feedbackTypeLabel: 'Rəy növü',
    languageLabel: 'Dil',
    originalLabel: 'Yanlış mətn',
    suggestedLabel: 'Təklif olunan düzgün tərcümə',
    messageLabel: 'Mesajınız',
    messagePlaceholder: 'Təklifinizi buraya yazın...',
    contextLabel: 'Əlavə detallar (istəyə bağlı)',
    contextPlaceholder: 'Məsələn: ana səhifədə, axtarış düyməsi',
    submit: 'Göndər',
    success: 'Təşəkkürlər! Rəyiniz göndərildi',
    error: 'Xəta baş verdi, yenidən cəhd edin',
    buttonText: 'Rəy',
  },
  kk: {
    title: 'Пікір жіберу',
    description: 'Ұсыныстарыңызбен бөлісіп, жақсартуға көмектесіңіз',
    feedbackTypeLabel: 'Пікір түрі',
    languageLabel: 'Тіл',
    originalLabel: 'Қате мәтін',
    suggestedLabel: 'Ұсынылған дұрыс аударма',
    messageLabel: 'Сіздің хабарламаңыз',
    messagePlaceholder: 'Ұсынысыңызды осында жазыңыз...',
    contextLabel: 'Қосымша мәліметтер (міндетті емес)',
    contextPlaceholder: 'Мысалы: басты бетте, іздеу түймесі',
    submit: 'Жіберу',
    success: 'Рахмет! Пікіріңіз жіберілді',
    error: 'Қате орын алды, қайта көріңіз',
    buttonText: 'Пікір',
  },
  tg: {
    title: 'Фикрро фиристед',
    description: 'Бо мубодилаи пешниҳодҳои худ ба беҳтар шудан кӯмак кунед',
    feedbackTypeLabel: 'Навъи фикр',
    languageLabel: 'Забон',
    originalLabel: 'Матни нодуруст',
    suggestedLabel: 'Тарҷумаи дурусти пешниҳодшуда',
    messageLabel: 'Паёми шумо',
    messagePlaceholder: 'Пешниҳоди худро дар ин ҷо нависед...',
    contextLabel: 'Тафсилоти иловагӣ (ихтиёрӣ)',
    contextPlaceholder: 'Мисол: дар саҳифаи асосӣ, тугмаи ҷустуҷӯ',
    submit: 'Фиристодан',
    success: 'Ташаккур! Фикри шумо фиристода шуд',
    error: 'Хато рӯй дод, лутфан дубора кӯшиш кунед',
    buttonText: 'Фикр',
  },
  ku: {
    title: 'Ramana bişîne',
    description: 'Bi parvekirina pêşniyarên xwe alîkariya me bikin ku baştir bibin',
    feedbackTypeLabel: 'Cureyê ramanê',
    languageLabel: 'Ziman',
    originalLabel: 'Nivîsa şaş',
    suggestedLabel: 'Wergera rast a pêşniyarkirî',
    messageLabel: 'Peyama we',
    messagePlaceholder: 'Pêşniyara xwe li vir binivîse...',
    contextLabel: 'Hûrguliyên din (vebijarkî)',
    contextPlaceholder: 'Mînak: li rûpelê sereke, bişkoja lêgerînê',
    submit: 'Bişîne',
    success: 'Spas! Ramana we hat şandin',
    error: 'Çewtî çêbû, ji kerema xwe dîsa biceribîne',
    buttonText: 'Raman',
  },
  ta: {
    title: 'கருத்து அனுப்பு',
    description: 'உங்கள் பரிந்துரைகளைப் பகிர்ந்து மேம்படுத்த உதவுங்கள்',
    feedbackTypeLabel: 'கருத்து வகை',
    languageLabel: 'மொழி',
    originalLabel: 'தவறான உரை',
    suggestedLabel: 'பரிந்துரைக்கப்பட்ட சரியான மொழிபெயர்ப்பு',
    messageLabel: 'உங்கள் செய்தி',
    messagePlaceholder: 'உங்கள் பரிந்துரையை இங்கே எழுதுங்கள்...',
    contextLabel: 'கூடுதல் விவரங்கள் (விருப்பம்)',
    contextPlaceholder: 'உதாரணம்: முகப்பு பக்கத்தில், தேடல் பொத்தான்',
    submit: 'சமர்ப்பி',
    success: 'நன்றி! உங்கள் கருத்து அனுப்பப்பட்டது',
    error: 'பிழை ஏற்பட்டது, மீண்டும் முயற்சிக்கவும்',
    buttonText: 'கருத்து',
  },
  te: {
    title: 'అభిప్రాయం పంపండి',
    description: 'మీ సూచనలను పంచుకోవడం ద్వారా మెరుగుపరచడంలో మాకు సహాయం చేయండి',
    feedbackTypeLabel: 'అభిప్రాయ రకం',
    languageLabel: 'భాష',
    originalLabel: 'తప్పు టెక్స్ట్',
    suggestedLabel: 'సూచించిన సరైన అనువాదం',
    messageLabel: 'మీ సందేశం',
    messagePlaceholder: 'మీ సూచనను ఇక్కడ వ్రాయండి...',
    contextLabel: 'అదనపు వివరాలు (ఐచ్ఛికం)',
    contextPlaceholder: 'ఉదాహరణ: హోమ్ పేజీలో, సెర్చ్ బటన్',
    submit: 'సమర్పించు',
    success: 'ధన్యవాదాలు! మీ అభిప్రాయం పంపబడింది',
    error: 'లోపం సంభవించింది, దయచేసి మళ్ళీ ప్రయత్నించండి',
    buttonText: 'అభిప్రాయం',
  },
  ml: {
    title: 'ഫീഡ്ബാക്ക് അയയ്ക്കുക',
    description: 'നിങ്ങളുടെ നിർദ്ദേശങ്ങൾ പങ്കുവച്ച് മെച്ചപ്പെടുത്താൻ സഹായിക്കുക',
    feedbackTypeLabel: 'ഫീഡ്ബാക്ക് തരം',
    languageLabel: 'ഭാഷ',
    originalLabel: 'തെറ്റായ വാചകം',
    suggestedLabel: 'നിർദ്ദേശിച്ച ശരിയായ വിവർത്തനം',
    messageLabel: 'നിങ്ങളുടെ സന്ദേശം',
    messagePlaceholder: 'നിങ്ങളുടെ നിർദ്ദേശം ഇവിടെ എഴുതുക...',
    contextLabel: 'അധിക വിശദാംശങ്ങൾ (ഓപ്ഷണൽ)',
    contextPlaceholder: 'ഉദാഹരണം: ഹോം പേജിൽ, തിരയൽ ബട്ടൺ',
    submit: 'സമർപ്പിക്കുക',
    success: 'നന്ദി! നിങ്ങളുടെ ഫീഡ്ബാക്ക് അയച്ചു',
    error: 'ഒരു പിശക് സംഭവിച്ചു, വീണ്ടും ശ്രമിക്കുക',
    buttonText: 'ഫീഡ്ബാക്ക്',
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
  const [touched, setTouched] = useState({ suggestedText: false, context: false });

  const labels = UI_LABELS[language] || UI_LABELS.en;
  const isRTL = RTL_LANGUAGES.includes(language);
  const isTranslation = feedbackType === 'translation';

  // Validation messages
  const validationMessages = {
    ar: {
      required: 'هذا الحقل مطلوب',
      minLength: 'يجب إدخال 3 أحرف على الأقل'
    },
    en: {
      required: 'This field is required',
      minLength: 'Please enter at least 3 characters'
    }
  };
  const messages = validationMessages[isRTL ? 'ar' : 'en'];

  // Validation errors
  const errors = {
    suggestedText: touched.suggestedText && !suggestedText.trim() ? messages.required : 
                   touched.suggestedText && suggestedText.trim().length < 3 ? messages.minLength : '',
    context: isTranslation && touched.context && !context.trim() ? messages.required : ''
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ suggestedText: true, context: true });
    
    if (!suggestedText.trim() || suggestedText.trim().length < 3) {
      return;
    }
    
    if (isTranslation && !context.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('user_feedback').insert({
        feedback_type: feedbackType,
        language_code: isTranslation ? selectedLanguage : null,
        original_text: isTranslation ? (originalText.trim() || null) : null,
        suggested_text: suggestedText.trim(),
        context: context.trim() || null,
        viewer_id: getViewerId(),
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
        setTouched({ suggestedText: false, context: false });
      }, 1500);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error(labels.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeLabel = (type: FeedbackTypeOption) => {
    return type.labels[language] || type.labels.en;
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
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="text-xs truncate">
                        {getTypeLabel(type)}
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
                  <Label htmlFor="language">{labels.languageLabel}</Label>
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
                    dir="auto"
                  />
                </div>
              </>
            )}

            {/* Main Message */}
            <div className="space-y-2">
              <Label htmlFor="suggested">
                {isTranslation ? labels.suggestedLabel : labels.messageLabel}
                <span className="text-red-500 mx-1">*</span>
              </Label>
              <Textarea
                id="suggested"
                value={suggestedText}
                onChange={(e) => setSuggestedText(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, suggestedText: true }))}
                placeholder={isTranslation ? '' : labels.messagePlaceholder}
                required
                rows={3}
                dir="auto"
                className={cn(
                  errors.suggestedText && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {errors.suggestedText && (
                <p className="text-xs text-red-500 animate-fade-in">{errors.suggestedText}</p>
              )}
            </div>

            {/* Context / Additional Details */}
            <div className="space-y-2">
              <Label htmlFor="context">
                {labels.contextLabel}
                {isTranslation ? (
                  <span className="text-red-500 mx-1">*</span>
                ) : (
                  <span className="text-muted-foreground text-xs mx-1">
                    ({language === 'ar' ? 'اختياري' : 'optional'})
                  </span>
                )}
              </Label>
              <Input
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, context: true }))}
                placeholder={labels.contextPlaceholder}
                required={isTranslation}
                dir="auto"
                className={cn(
                  errors.context && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {errors.context && (
                <p className="text-xs text-red-500 animate-fade-in">{errors.context}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full gap-2" 
              disabled={isSubmitting || !suggestedText.trim() || suggestedText.trim().length < 3 || (isTranslation && !context.trim())}
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

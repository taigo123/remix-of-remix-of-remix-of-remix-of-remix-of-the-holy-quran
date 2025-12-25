import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Sparkles, Building2, User, Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TafsirInfo {
  id: string;
  name: string;
  author: string;
  authorFull: string;
  deathYear?: string;
  description: string;
  fullDescription: string;
  type: 'classical' | 'modern' | 'ai';
  source: string;
  features: string[];
}

const TAFSIR_LIST: TafsirInfo[] = [
  {
    id: 'local',
    name: 'التفسير المحلي',
    author: 'ذكاء اصطناعي',
    authorFull: 'مُولَّد بواسطة الذكاء الاصطناعي',
    description: 'تفسير مُولَّد آلياً - غير موثق',
    fullDescription: 'هذا التفسير مُولَّد بواسطة الذكاء الاصطناعي وليس من مصدر علمي موثق. يُستخدم للتوضيح السريع فقط ولا يُعتمد عليه في الأحكام الشرعية. يُنصح بشدة باستخدام التفاسير الموثوقة من العلماء أدناه.',
    type: 'ai',
    source: 'محلي',
    features: ['سريع', 'يعمل بدون إنترنت', '⚠️ غير موثق علمياً']
  },
  {
    id: 'ar.muyassar',
    name: 'التفسير الميسر',
    author: 'مجمع الملك فهد',
    authorFull: 'مجمع الملك فهد لطباعة المصحف الشريف',
    description: 'تفسير مبسط وسهل الفهم',
    fullDescription: 'التفسير الميسر هو تفسير عصري صادر عن مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة. يتميز بأسلوبه السهل والمبسط الذي يناسب جميع المستويات. أعده نخبة من العلماء المتخصصين ليكون مرجعاً ميسراً لفهم معاني القرآن الكريم.',
    type: 'modern',
    source: 'alquran.cloud',
    features: ['سهل الفهم', 'موثق رسمياً', 'مناسب للمبتدئين', 'عصري']
  },
  {
    id: 'ar.jalalayn',
    name: 'تفسير الجلالين',
    author: 'المحلي والسيوطي',
    authorFull: 'جلال الدين المحلي وجلال الدين السيوطي',
    deathYear: '864 هـ - 911 هـ',
    description: 'تفسير كلاسيكي موجز وشامل',
    fullDescription: 'تفسير الجلالين من أشهر التفاسير في العالم الإسلامي. بدأه الإمام جلال الدين المحلي (ت 864 هـ) حيث فسّر من سورة الكهف إلى سورة الناس ثم الفاتحة، وأكمله تلميذه الإمام جلال الدين السيوطي (ت 911 هـ) من سورة البقرة إلى سورة الإسراء. سُمي بالجلالين نسبة لاسم "جلال الدين" المشترك بين المؤلفين.',
    type: 'classical',
    source: 'alquran.cloud',
    features: ['موجز ومختصر', 'شامل', 'كلاسيكي', 'معتمد علمياً']
  },
  {
    id: 'ar.qurtubi',
    name: 'تفسير القرطبي',
    author: 'الإمام القرطبي',
    authorFull: 'الإمام أبو عبد الله محمد بن أحمد القرطبي',
    deathYear: '671 هـ',
    description: 'الجامع لأحكام القرآن',
    fullDescription: 'الجامع لأحكام القرآن للإمام القرطبي (ت 671 هـ) من أهم التفاسير الفقهية. يركز على استنباط الأحكام الشرعية من الآيات مع ذكر أقوال الفقهاء ومذاهبهم. مفيد جداً لمن يريد فهم الأحكام الفقهية المستنبطة من القرآن.',
    type: 'classical',
    source: 'alquran.cloud',
    features: ['تفسير فقهي', 'أحكام شرعية', 'مقارنة المذاهب', 'موسوعي']
  },
  {
    id: 'ar.baghawi',
    name: 'تفسير البغوي',
    author: 'الإمام البغوي',
    authorFull: 'الإمام الحسين بن مسعود البغوي',
    deathYear: '516 هـ',
    description: 'معالم التنزيل',
    fullDescription: 'معالم التنزيل للإمام البغوي (ت 516 هـ) تفسير سلفي موجز ومعتدل. يجمع بين التفسير بالمأثور والرأي، ويتميز بالوضوح والاختصار مع الابتعاد عن الإسرائيليات. وصفه شيخ الإسلام ابن تيمية بأنه مختصر منقى من البدع.',
    type: 'classical',
    source: 'alquran.cloud',
    features: ['موجز', 'سلفي المنهج', 'خالٍ من الإسرائيليات', 'معتدل']
  },
  {
    id: 'ar.waseet',
    name: 'التفسير الوسيط',
    author: 'مجمع البحوث الإسلامية',
    authorFull: 'لجنة من علماء الأزهر الشريف',
    description: 'تفسير معاصر من الأزهر',
    fullDescription: 'التفسير الوسيط صادر عن مجمع البحوث الإسلامية بالأزهر الشريف. أعده مجموعة من العلماء المتخصصين ليكون تفسيراً وسطاً بين الإيجاز والتطويل. يجمع بين الأصالة والمعاصرة ويعالج قضايا العصر في ضوء القرآن الكريم.',
    type: 'modern',
    source: 'alquran.cloud',
    features: ['معاصر', 'وسط ومعتدل', 'من الأزهر', 'يعالج قضايا العصر']
  },
  {
    id: 'ar.miqbas',
    name: 'تنوير المقباس',
    author: 'منسوب لابن عباس',
    authorFull: 'منسوب لعبد الله بن عباس رضي الله عنه',
    description: 'من أقدم التفاسير المنسوبة للصحابة',
    fullDescription: 'تنوير المقباس من تفسير ابن عباس يُنسب إلى حبر الأمة عبد الله بن عباس رضي الله عنه، ترجمان القرآن. يُعد من أقدم التفاسير ويحتوي على آراء الصحابة في تفسير الآيات.',
    type: 'classical',
    source: 'alquran.cloud',
    features: ['من التراث', 'منسوب للصحابة', 'قديم', 'تاريخي']
  },
  // ===== تفاسير من quran.com API =====
  {
    id: 'qc-ibn-kathir',
    name: 'تفسير ابن كثير',
    author: 'ابن كثير',
    authorFull: 'الحافظ عماد الدين إسماعيل بن عمر بن كثير الدمشقي',
    deathYear: '774 هـ',
    description: 'من أشهر كتب التفسير بالمأثور',
    fullDescription: 'تفسير القرآن العظيم للحافظ ابن كثير (ت 774 هـ) من أشهر كتب التفسير بالمأثور. يعتمد على تفسير القرآن بالقرآن، ثم بالسنة النبوية، ثم بأقوال الصحابة والتابعين. يتميز بالتحقيق في الأحاديث وبيان صحيحها من ضعيفها.',
    type: 'classical',
    source: 'quran.com',
    features: ['تفسير بالمأثور', 'تحقيق الأحاديث', 'مرجع علمي', 'شامل']
  },
  {
    id: 'qc-tabari',
    name: 'تفسير الطبري',
    author: 'الإمام الطبري',
    authorFull: 'الإمام محمد بن جرير الطبري',
    deathYear: '310 هـ',
    description: 'جامع البيان - أعظم تفاسير السلف',
    fullDescription: 'جامع البيان في تأويل القرآن للإمام الطبري (ت 310 هـ) يُعد أعظم تفاسير السلف وأوسعها. جمع فيه أقوال الصحابة والتابعين مع الأسانيد، ورجّح بين الأقوال بمنهج علمي دقيق. يُعتبر المرجع الأول لجميع المفسرين.',
    type: 'classical',
    source: 'quran.com',
    features: ['أقدم التفاسير الكبرى', 'جمع أقوال السلف', 'بالأسانيد', 'مرجع المفسرين']
  },
  {
    id: 'qc-saadi',
    name: 'تفسير السعدي',
    author: 'الشيخ السعدي',
    authorFull: 'الشيخ عبد الرحمن بن ناصر السعدي',
    deathYear: '1376 هـ',
    description: 'تيسير الكريم الرحمن',
    fullDescription: 'تيسير الكريم الرحمن في تفسير كلام المنان للشيخ السعدي (ت 1376 هـ) تفسير عصري ميسر. يتميز بأسلوبه السهل والواضح، ويركز على استنباط الفوائد والعبر من الآيات. مناسب للقراءة اليومية.',
    type: 'modern',
    source: 'quran.com',
    features: ['عصري', 'سهل الأسلوب', 'فوائد وعبر', 'مناسب للجميع']
  },
  {
    id: 'qc-muyassar',
    name: 'التفسير الميسر (مفصل)',
    author: 'مجمع الملك فهد',
    authorFull: 'مجمع الملك فهد لطباعة المصحف الشريف',
    description: 'نسخة موسعة من التفسير الميسر',
    fullDescription: 'هذه النسخة الموسعة من التفسير الميسر توفر شرحاً أكثر تفصيلاً للآيات مع الحفاظ على سهولة الأسلوب. مناسبة لمن يريد فهماً أعمق.',
    type: 'modern',
    source: 'quran.com',
    features: ['مفصل أكثر', 'سهل', 'موثق', 'شامل']
  },
  {
    id: 'qc-qurtubi',
    name: 'تفسير القرطبي (مفصل)',
    author: 'الإمام القرطبي',
    authorFull: 'الإمام أبو عبد الله محمد بن أحمد القرطبي',
    deathYear: '671 هـ',
    description: 'الجامع لأحكام القرآن - نسخة مفصلة',
    fullDescription: 'الجامع لأحكام القرآن - نسخة مفصلة من quran.com مع شرح موسع للأحكام الفقهية.',
    type: 'classical',
    source: 'quran.com',
    features: ['تفسير فقهي', 'مفصل', 'أحكام شرعية', 'موسوعي']
  },
  {
    id: 'qc-baghawi',
    name: 'تفسير البغوي (مفصل)',
    author: 'الإمام البغوي',
    authorFull: 'الإمام الحسين بن مسعود البغوي',
    deathYear: '516 هـ',
    description: 'معالم التنزيل - نسخة مفصلة',
    fullDescription: 'معالم التنزيل - نسخة مفصلة من quran.com مع تفاصيل إضافية.',
    type: 'classical',
    source: 'quran.com',
    features: ['سلفي المنهج', 'مفصل', 'موثق', 'معتدل']
  },
  {
    id: 'qc-waseet',
    name: 'التفسير الوسيط للطنطاوي',
    author: 'الشيخ الطنطاوي',
    authorFull: 'الشيخ محمد سيد طنطاوي شيخ الأزهر الأسبق',
    description: 'تفسير معاصر شامل',
    fullDescription: 'التفسير الوسيط للشيخ محمد سيد طنطاوي شيخ الأزهر الأسبق. تفسير معاصر شامل يجمع بين الأصالة والمعاصرة.',
    type: 'modern',
    source: 'quran.com',
    features: ['معاصر', 'شامل', 'من الأزهر', 'موثق']
  },
];

const getTypeColor = (type: TafsirInfo['type']) => {
  switch (type) {
    case 'classical':
      return 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30';
    case 'modern':
      return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
    case 'ai':
      return 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30';
  }
};

const getTypeLabel = (type: TafsirInfo['type']) => {
  switch (type) {
    case 'classical':
      return 'تفسير كلاسيكي';
    case 'modern':
      return 'تفسير عصري';
    case 'ai':
      return '⚠️ ذكاء اصطناعي';
  }
};

export default function TafsirList() {
  return (
    <>
      <Helmet>
        <title>قائمة التفاسير المتاحة | القرآن الكريم</title>
        <meta name="description" content="تعرف على التفاسير المتاحة في التطبيق مع شرح لكل تفسير ومؤلفه ومميزاته" />
      </Helmet>

      <div className="min-h-screen bg-background" dir="rtl">
        {/* Header */}
        <div className="bg-gradient-to-b from-primary/10 to-background py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowRight className="h-4 w-4" />
              العودة للرئيسية
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">قائمة التفاسير المتاحة</h1>
                <p className="text-muted-foreground">تعرف على التفاسير الموثوقة ومصادرها</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* تحذير التفسير المحلي */}
          <Alert className="mb-6 border-red-500/30 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700 dark:text-red-300">
              <strong>تنبيه:</strong> التفسير المحلي (المُولَّد بالذكاء الاصطناعي) ليس موثوقاً علمياً ولا يُعتمد عليه. يُرجى استخدام التفاسير الموثوقة أدناه.
            </AlertDescription>
          </Alert>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge className={`${getTypeColor('classical')} border`}>
              تفسير كلاسيكي (من التراث)
            </Badge>
            <Badge className={`${getTypeColor('modern')} border`}>
              تفسير عصري (معاصر)
            </Badge>
            <Badge className={`${getTypeColor('ai')} border`}>
              <AlertTriangle className="h-3 w-3 ml-1" />
              ذكاء اصطناعي (غير موثق)
            </Badge>
          </div>

          {/* Tafsir Cards */}
          <div className="space-y-6">
            {TAFSIR_LIST.map((tafsir, index) => (
              <Card key={tafsir.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-muted-foreground font-mono">
                          {index + 1}.
                        </span>
                        <CardTitle className="text-xl">{tafsir.name}</CardTitle>
                        <Badge className={`${getTypeColor(tafsir.type)} border text-xs`}>
                          {getTypeLabel(tafsir.type)}
                        </Badge>
                      </div>
                      <CardDescription className="text-base">
                        {tafsir.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Author Info */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{tafsir.authorFull}</span>
                    </div>
                    {tafsir.deathYear && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>توفي: {tafsir.deathYear}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>المصدر: {tafsir.source}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Full Description */}
                  <p className="text-foreground leading-relaxed">
                    {tafsir.fullDescription}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {tafsir.features.map((feature, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-12 p-6 bg-muted/50 rounded-xl text-center">
            <p className="text-muted-foreground">
              جميع التفاسير متاحة مجاناً من خلال واجهات برمجة موثوقة
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              المصادر: alquran.cloud • quran-tafseer.com
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

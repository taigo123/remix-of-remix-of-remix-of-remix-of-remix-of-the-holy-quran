import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  ArrowRight,
  Share,
  PlusSquare,
  MoreVertical,
  Download,
  Check,
  Smartphone,
  Monitor,
  Apple,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const InstallGuide = () => {
  const { theme, setTheme } = useTheme();

  const iosSteps = [
    {
      step: 1,
      icon: Share,
      title: "افتح قائمة المشاركة",
      description: "اضغط على أيقونة المشاركة في شريط التنقل أسفل الشاشة (المربع مع السهم للأعلى)",
    },
    {
      step: 2,
      icon: PlusSquare,
      title: 'اختر "إضافة إلى الشاشة الرئيسية"',
      description: "مرر للأسفل في قائمة الخيارات واضغط على 'إضافة إلى الشاشة الرئيسية'",
    },
    {
      step: 3,
      icon: Check,
      title: "تأكيد التثبيت",
      description: "اضغط 'إضافة' في الزاوية العليا اليسرى لإتمام التثبيت",
    },
  ];

  const androidSteps = [
    {
      step: 1,
      icon: MoreVertical,
      title: "افتح قائمة المتصفح",
      description: "اضغط على النقاط الثلاث في الزاوية العليا اليمنى من المتصفح",
    },
    {
      step: 2,
      icon: Download,
      title: 'اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"',
      description: "ابحث عن خيار التثبيت في القائمة المنسدلة واضغط عليه",
    },
    {
      step: 3,
      icon: Check,
      title: "تأكيد التثبيت",
      description: "اضغط 'تثبيت' في النافذة المنبثقة لإتمام العملية",
    },
  ];

  const desktopSteps = [
    {
      step: 1,
      icon: Download,
      title: "ابحث عن أيقونة التثبيت",
      description: "ستجد أيقونة تثبيت في شريط العنوان على يمين عنوان الموقع",
    },
    {
      step: 2,
      icon: Check,
      title: "اضغط على التثبيت",
      description: "اضغط على الأيقونة ثم اختر 'تثبيت' من القائمة المنبثقة",
    },
  ];

  const benefits = [
    "تصفح بدون إنترنت - اقرأ التفسير في أي وقت",
    "وصول سريع من الشاشة الرئيسية",
    "تجربة تطبيق كاملة بدون حاجة للمتجر",
    "تحديثات تلقائية للمحتوى",
    "حجم صغير - لا يستهلك مساحة كبيرة",
  ];

  return (
    <>
      <Helmet>
        <title>تعليمات تثبيت التطبيق - سورة ياسين</title>
        <meta
          name="description"
          content="تعرف على كيفية تثبيت تطبيق تفسير سورة ياسين على جهازك للوصول السريع والتصفح بدون إنترنت"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="gradient-hero text-primary-foreground py-8 px-4">
          <div className="container max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <Link to="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <ArrowRight className="w-4 h-4" />
                  العودة
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            </div>

            <div className="text-center">
              <div className="inline-block mb-4">
                <div className="w-20 h-20 rounded-full gradient-gold flex items-center justify-center shadow-gold">
                  <span className="font-arabic text-3xl text-primary-foreground font-bold">
                    يس
                  </span>
                </div>
              </div>
              <h1 className="font-arabic text-3xl md:text-4xl font-bold mb-2" dir="rtl">
                تثبيت التطبيق
              </h1>
              <p className="font-amiri text-lg text-primary-foreground/80" dir="rtl">
                دليل خطوة بخطوة لتثبيت التطبيق على جهازك
              </p>
            </div>
          </div>
        </header>

        {/* Benefits Section */}
        <section className="py-8 px-4 border-b border-border">
          <div className="container max-w-4xl">
            <h2 className="font-amiri text-xl font-bold text-foreground mb-4 text-center" dir="rtl">
              مميزات التطبيق
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-muted/50 rounded-lg p-3"
                  dir="rtl"
                >
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* iOS Instructions */}
        <section className="py-8 px-4 border-b border-border">
          <div className="container max-w-4xl">
            <div className="flex items-center gap-3 mb-6" dir="rtl">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-amiri text-xl font-bold text-foreground">
                  أجهزة iPhone و iPad
                </h2>
                <p className="text-sm text-muted-foreground">Safari متصفح</p>
              </div>
            </div>

            <div className="space-y-4">
              {iosSteps.map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-4 bg-card border border-border rounded-xl p-4"
                  dir="rtl"
                >
                  <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary-foreground">{item.step}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <item.icon className="w-5 h-5 text-primary" />
                      <h3 className="font-amiri font-bold text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Android Instructions */}
        <section className="py-8 px-4 border-b border-border">
          <div className="container max-w-4xl">
            <div className="flex items-center gap-3 mb-6" dir="rtl">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-amiri text-xl font-bold text-foreground">
                  أجهزة Android
                </h2>
                <p className="text-sm text-muted-foreground">Chrome متصفح</p>
              </div>
            </div>

            <div className="space-y-4">
              {androidSteps.map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-4 bg-card border border-border rounded-xl p-4"
                  dir="rtl"
                >
                  <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary-foreground">{item.step}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <item.icon className="w-5 h-5 text-primary" />
                      <h3 className="font-amiri font-bold text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Desktop Instructions */}
        <section className="py-8 px-4">
          <div className="container max-w-4xl">
            <div className="flex items-center gap-3 mb-6" dir="rtl">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-amiri text-xl font-bold text-foreground">
                  أجهزة الكمبيوتر
                </h2>
                <p className="text-sm text-muted-foreground">Chrome / Edge متصفح</p>
              </div>
            </div>

            <div className="space-y-4">
              {desktopSteps.map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-4 bg-card border border-border rounded-xl p-4"
                  dir="rtl"
                >
                  <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary-foreground">{item.step}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <item.icon className="w-5 h-5 text-primary" />
                      <h3 className="font-amiri font-bold text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <div className="py-8 px-4 bg-muted/30">
          <div className="container max-w-4xl text-center">
            <p className="text-muted-foreground mb-4" dir="rtl">
              بعد التثبيت، ستجد التطبيق على شاشتك الرئيسية
            </p>
            <Link to="/tafsir">
              <Button className="gradient-gold text-primary-foreground gap-2">
                ابدأ قراءة التفسير
                <ArrowRight className="w-4 h-4 rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstallGuide;

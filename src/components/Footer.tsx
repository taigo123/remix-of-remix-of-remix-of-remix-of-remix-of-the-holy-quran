import * as React from "react";
import { BookOpen, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserFeedback } from "@/components/UserFeedback";

export const Footer = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"footer">>(
  ({ className, ...props }, ref) => {
    return (
      <footer ref={ref} className={cn("gradient-navy text-primary-foreground py-12", className)} {...props}>
        <div className="container">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
              <span className="font-arabic text-2xl font-bold">تفسير سورة ياسين</span>
            </div>

            <p className="font-naskh text-primary-foreground/70 mb-6 max-w-xl mx-auto" dir="rtl">
              تم جمع هذا التفسير من أمهات كتب التفسير الموثوقة كتفسير ابن كثير والطبري والقرطبي والسعدي
            </p>

            <div className="flex items-center justify-center gap-2 text-primary-foreground/60">
              <span className="font-naskh" dir="rtl">
                صُنع بـ
              </span>
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span className="font-naskh" dir="rtl">
                لخدمة القرآن الكريم
              </span>
            </div>

            {/* User Feedback Button */}
            <div className="mt-6 flex justify-center">
              <UserFeedback />
            </div>

            <div className="mt-6 pt-6 border-t border-primary-foreground/10">
              <p className="font-naskh text-sm text-primary-foreground/50" dir="rtl">
                ﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ ﴾
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  },
);

Footer.displayName = "Footer";

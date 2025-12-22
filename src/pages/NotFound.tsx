import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background" dir="rtl">
      <div className="text-center p-8">
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
        <p className="mb-2 text-2xl font-bold text-foreground">الصفحة غير موجودة</p>
        <p className="mb-6 text-muted-foreground">عذراً، الصفحة التي تبحث عنها غير موجودة</p>
        <div className="flex gap-3 justify-center">
          <Link to="/">
            <Button>
              <Home className="w-4 h-4 ml-2" />
              الرئيسية
            </Button>
          </Link>
          <Link to="/quran">
            <Button variant="outline">
              <BookOpen className="w-4 h-4 ml-2" />
              فهرس القرآن
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
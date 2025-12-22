import { Share2, Twitter, Facebook, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Verse } from "@/data/surahYasinTafsir";
import { useToast } from "@/hooks/use-toast";

interface ShareVerseButtonProps {
  verse: Verse;
}

export const ShareVerseButton = ({ verse }: ShareVerseButtonProps) => {
  const { toast } = useToast();

  const shareText = `${verse.arabic}\n\n— سورة ياسين، الآية ${verse.number}`;
  const shareUrl = `${window.location.origin}/tafsir#verse-${verse.number}`;

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`;
    window.open(url, "_blank");
  };

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText + "\n\n" + shareUrl);
      toast({
        title: "تم النسخ",
        description: "تم نسخ الآية إلى الحافظة",
      });
    } catch {
      toast({
        title: "تعذّر النسخ",
        description: "جرّب مرة أخرى",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
          aria-label="مشاركة الآية"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-popover">
        <DropdownMenuItem
          onClick={handleWhatsApp}
          className="gap-3 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-green-500" />
          <span>واتساب</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleTwitter}
          className="gap-3 cursor-pointer"
        >
          <Twitter className="w-4 h-4 text-sky-500" />
          <span>تويتر</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleFacebook}
          className="gap-3 cursor-pointer"
        >
          <Facebook className="w-4 h-4 text-blue-600" />
          <span>فيسبوك</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleCopyLink}
          className="gap-3 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>نسخ الرابط</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

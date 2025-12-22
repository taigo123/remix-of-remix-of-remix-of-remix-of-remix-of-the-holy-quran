import { useMemo } from "react";

interface HighlightTextProps {
  text: string;
  query: string;
  className?: string;
}

export const HighlightText = ({ text, query, className }: HighlightTextProps) => {
  const parts = useMemo(() => {
    if (!query.trim()) return [{ text, highlight: false }];

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "gi");
    const split = text.split(regex);

    return split.map((part) => ({
      text: part,
      highlight: part.toLowerCase() === query.toLowerCase(),
    }));
  }, [text, query]);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.highlight ? (
          <mark
            key={i}
            className="bg-primary/30 text-foreground rounded px-0.5"
          >
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </span>
  );
};

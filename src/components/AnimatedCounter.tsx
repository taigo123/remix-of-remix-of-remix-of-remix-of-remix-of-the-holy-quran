import { useCountUp, parseStatNumber } from '@/hooks/useCountUp';

interface AnimatedCounterProps {
  value: string;
  className?: string;
  duration?: number;
}

export const AnimatedCounter = ({ value, className = '', duration = 2000 }: AnimatedCounterProps) => {
  const parsed = parseStatNumber(value);
  const { formattedCount, ref } = useCountUp({
    end: parsed.value,
    duration,
    suffix: parsed.suffix,
    prefix: parsed.prefix
  });

  return (
    <div ref={ref} className={className}>
      {formattedCount}
    </div>
  );
};

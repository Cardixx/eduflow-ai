import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function RatingStars({
  value,
  onChange,
  size = 20,
  readOnly,
  className,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
  className?: string;
}) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  return (
    <div className={cn("flex items-center gap-1", className)} onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.button
          key={i}
          type="button"
          disabled={readOnly}
          whileHover={readOnly ? undefined : { scale: 1.2, rotate: -8 }}
          whileTap={readOnly ? undefined : { scale: 0.9 }}
          onMouseEnter={() => !readOnly && setHover(i)}
          onClick={() => !readOnly && onChange?.(i)}
          className={cn("transition-colors", readOnly && "cursor-default")}
        >
          <Star
            size={size}
            className={cn(
              "transition-all",
              i <= display ? "fill-warning text-warning drop-shadow-[0_0_8px_hsl(var(--warning)/0.5)]" : "text-muted-foreground/40"
            )}
          />
        </motion.button>
      ))}
    </div>
  );
}

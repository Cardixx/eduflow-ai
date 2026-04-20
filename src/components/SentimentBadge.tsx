import { cn } from "@/lib/utils";
import type { Sentiment } from "@/types";
import { motion } from "framer-motion";

const map: Record<Sentiment, { label: string; cls: string; dot: string }> = {
  POSITIVE: { label: "Positif", cls: "bg-success/15 text-success border-success/30", dot: "bg-success" },
  NEUTRAL: { label: "Neutre", cls: "bg-warning/15 text-warning border-warning/30", dot: "bg-warning" },
  NEGATIVE: { label: "Négatif", cls: "bg-destructive/15 text-destructive border-destructive/30", dot: "bg-destructive" },
};

export function SentimentBadge({ sentiment, className }: { sentiment: Sentiment; className?: string }) {
  const m = map[sentiment];
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", m.cls, className)}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse-glow", m.dot)} />
      {m.label}
    </motion.span>
  );
}

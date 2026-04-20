import { motion } from "framer-motion";
import { useState } from "react";
import { feedbacks as allFeedbacks, ecs } from "@/lib/mockData";
import { RatingStars } from "@/components/RatingStars";
import { SentimentBadge } from "@/components/SentimentBadge";
import { Calendar, Filter, EyeOff } from "lucide-react";
import type { Sentiment } from "@/types";

export default function FeedbackViewer() {
  const [filter, setFilter] = useState<Sentiment | "ALL">("ALL");
  const [ecId, setEcId] = useState<number | "ALL">("ALL");

  const filtered = allFeedbacks.filter((f) => (filter === "ALL" || f.sentiment === filter) && (ecId === "ALL" || f.ecId === ecId));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Tous les <span className="gradient-text">feedbacks</span></h1>
        <p className="text-muted-foreground mt-1">{filtered.length} avis · filtrés en temps réel.</p>
      </div>

      <div className="card-elegant p-4 flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/40">
          {(["ALL", "POSITIVE", "NEUTRAL", "NEGATIVE"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === s ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {filter === s && (
                <motion.div layoutId="filterPill" className="absolute inset-0 rounded-lg bg-gradient-aurora" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              <span className="relative">{s === "ALL" ? "Tous" : s}</span>
            </button>
          ))}
        </div>
        <select
          value={ecId} onChange={(e) => setEcId(e.target.value === "ALL" ? "ALL" : Number(e.target.value))}
          className="px-3 py-1.5 rounded-xl bg-muted/40 border border-border/60 text-xs outline-none"
        >
          <option value="ALL">Tous les ECs</option>
          {ecs.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            whileHover={{ y: -3 }}
            className="card-elegant p-5"
          >
            <div className="flex items-start justify-between mb-3 gap-2">
              <div className="min-w-0">
                <div className="font-semibold truncate">{f.ecName}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  {f.anonymous ? <span className="flex items-center gap-1"><EyeOff className="h-3 w-3" /> Anonyme</span> : f.studentName}
                  · <Calendar className="h-3 w-3" /> {new Date(f.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </div>
              <SentimentBadge sentiment={f.sentiment} />
            </div>
            <RatingStars value={f.rating} readOnly size={16} />
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{f.comment}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

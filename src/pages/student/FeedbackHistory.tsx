import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { RatingStars } from "@/components/RatingStars";
import { SentimentBadge } from "@/components/SentimentBadge";
import { Calendar, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import { mapFeedback, type FeedbackDto, type PageResponse } from "@/lib/backend";
import type { Feedback } from "@/types";

export default function FeedbackHistory() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<PageResponse<FeedbackDto>>("/feedbacks/teacher/me", {
          params: { page: 0, size: 50 },
        });
        setFeedbacks(data.content.map(mapFeedback));
      } catch {
        setAvailable(false);
      }
    };
    void load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Historique de mes <span className="gradient-text">feedbacks</span></h1>
        <p className="text-muted-foreground mt-1">Tous les avis que vous avez soumis.</p>
      </div>

      {!available && (
        <div className="card-elegant p-5 text-sm text-muted-foreground">
          L'historique étudiant dédié n'est pas encore exposé par l'API backend.
        </div>
      )}

      <div className="space-y-3">
        {feedbacks.slice(0, 12).map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            whileHover={{ x: 4 }}
            className="card-elegant p-5 flex flex-col md:flex-row md:items-center gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="font-semibold">{f.ecName}</h3>
                <SentimentBadge sentiment={f.sentiment} />
                {f.anonymous && (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground flex items-center gap-1">
                    <EyeOff className="h-3 w-3" /> Anonyme
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{f.comment}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" /> {new Date(f.createdAt).toLocaleDateString("fr-FR")}
              </div>
            </div>
            <RatingStars value={f.rating} readOnly />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

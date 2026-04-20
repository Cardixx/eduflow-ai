import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Send, EyeOff, Eye, Loader2 } from "lucide-react";
import { ecs } from "@/lib/mockData";
import { RatingStars } from "@/components/RatingStars";
import { toast } from "sonner";

export function FeedbackModal({ ecId, onClose }: { ecId: number | null; onClose: () => void }) {
  const ec = ecs.find((e) => e.id === ecId);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ec) { setRating(0); setComment(""); setAnonymous(true); }
  }, [ec]);

  const submit = async () => {
    if (!rating) return toast.error("Veuillez attribuer une note");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success("Feedback envoyé · Merci pour votre retour !");
    onClose();
  };

  return (
    <AnimatePresence>
      {ec && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/70 backdrop-blur-md z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 grid place-items-center p-4 pointer-events-none"
          >
            <div className="card-elegant glass-strong p-6 max-w-lg w-full pointer-events-auto relative">
              <button onClick={onClose} className="absolute top-4 right-4 h-8 w-8 grid place-items-center rounded-lg hover:bg-muted transition-colors">
                <X className="h-4 w-4" />
              </button>

              <div className="text-xs font-mono text-muted-foreground">{ec.code}</div>
              <h2 className="font-display text-2xl font-bold mt-1">{ec.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{ec.teacherName}</p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-medium block mb-2">Votre note</label>
                  <RatingStars value={rating} onChange={setRating} size={28} />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Votre commentaire</label>
                  <textarea
                    value={comment} onChange={(e) => setComment(e.target.value)}
                    rows={4} maxLength={500}
                    placeholder="Partagez votre expérience…"
                    className="w-full p-3 rounded-xl border border-border bg-card outline-none input-glow text-sm resize-none transition-all"
                  />
                  <div className="text-[11px] text-muted-foreground text-right mt-1">{comment.length}/500</div>
                </div>

                <button
                  onClick={() => setAnonymous((a) => !a)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {anonymous ? <EyeOff className="h-4 w-4 text-primary" /> : <Eye className="h-4 w-4" />}
                    <div className="text-left">
                      <div className="text-sm font-medium">Soumission anonyme</div>
                      <div className="text-xs text-muted-foreground">{anonymous ? "Votre identité reste cachée" : "Votre nom sera visible"}</div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ backgroundColor: anonymous ? "hsl(var(--primary))" : "hsl(var(--muted))" }}
                    className="h-6 w-11 rounded-full p-0.5 flex"
                  >
                    <motion.div animate={{ x: anonymous ? 20 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="h-5 w-5 rounded-full bg-background shadow" />
                  </motion.div>
                </button>

                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  disabled={loading} onClick={submit}
                  className="w-full h-12 rounded-xl bg-gradient-aurora text-white font-semibold flex items-center justify-center gap-2 btn-glow shadow-elegant disabled:opacity-60"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<>Envoyer le feedback <Send className="h-4 w-4" /></>)}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

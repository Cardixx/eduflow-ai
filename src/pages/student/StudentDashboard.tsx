import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, MessageSquare, TrendingUp, Award, ArrowRight } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ecs, feedbacks } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { RatingStars } from "@/components/RatingStars";
import { SentimentBadge } from "@/components/SentimentBadge";

const kpis = [
  { label: "ECs suivis", value: 7, icon: BookOpen, accent: "from-primary to-primary-glow" },
  { label: "Feedbacks donnés", value: 12, icon: MessageSquare, accent: "from-accent to-primary" },
  { label: "Note moyenne", value: 4.2, decimals: 1, icon: Award, accent: "from-warning to-primary-glow" },
  { label: "Taux participation", value: 87, suffix: "%", icon: TrendingUp, accent: "from-success to-accent" },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const myFeedbacks = feedbacks.slice(0, 4);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl font-bold">
          Bonjour, <span className="gradient-text">{user?.fullName?.split(" ")[0]}</span> 👋
        </h1>
        <p className="text-muted-foreground mt-2">Voici un aperçu de votre activité pédagogique cette semaine.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card-elegant p-5 relative overflow-hidden group"
          >
            <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${k.accent} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${k.accent} grid place-items-center shadow-glow`}>
                  <k.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{k.label}</div>
              <div className="font-display text-3xl font-bold mt-1">
                <AnimatedCounter value={k.value} decimals={k.decimals || 0} suffix={k.suffix || ""} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-elegant p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-xl font-bold">Mes ECs</h2>
              <p className="text-sm text-muted-foreground">Cliquez pour donner un feedback</p>
            </div>
            <button onClick={() => navigate("/app/ecs")} className="text-sm text-primary hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {ecs.slice(0, 4).map((ec, i) => (
              <motion.button
                key={ec.id}
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                onClick={() => navigate(`/app/feedback?ec=${ec.id}`)}
                className="text-left p-4 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <div className="text-xs text-muted-foreground font-mono">{ec.code}</div>
                <div className="font-semibold mt-1">{ec.name}</div>
                <div className="text-xs text-muted-foreground mt-2">{ec.teacherName} · {ec.hours}h</div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="card-elegant p-6">
          <h2 className="font-display text-xl font-bold mb-5">Derniers avis</h2>
          <div className="space-y-3">
            {myFeedbacks.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="p-3 rounded-xl bg-muted/40"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-medium truncate">{f.ecName}</div>
                  <SentimentBadge sentiment={f.sentiment} />
                </div>
                <RatingStars value={f.rating} readOnly size={14} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

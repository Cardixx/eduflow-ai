import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, MessageSquare, Brain, Star } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { useAuth } from "@/contexts/AuthContext";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { SentimentBadge } from "@/components/SentimentBadge";
import { api } from "@/lib/api";
import {
  mapEc,
  mapFeedback,
  type CourseElementDto,
  type FeedbackDto,
  type PageResponse,
  type ReportDto,
} from "@/lib/backend";
import type { EC, Feedback } from "@/types";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [myEcs, setMyEcs] = useState<EC[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [trend, setTrend] = useState<Array<{ m: string; positive: number; neutral: number; negative: number }>>([]);

  useEffect(() => {
    const load = async () => {
      const [coursesRes, feedbackRes] = await Promise.all([
        api.get<CourseElementDto[]>("/teachers/me/courses"),
        api.get<PageResponse<FeedbackDto>>("/feedbacks/teacher/me", { params: { page: 0, size: 100 } }),
      ]);
      const courses = coursesRes.data.map(mapEc);
      setMyEcs(courses);
      const mappedFeedbacks = feedbackRes.data.content.map(mapFeedback);
      setFeedbacks(mappedFeedbacks);

      if (courses.length > 0) {
        const report = await api.get<ReportDto>(`/reports/ec/${courses[0].id}`);
        setTrend(
          report.data.trend.map((t) => ({
            m: t.period,
            positive: t.positive,
            neutral: t.neutral,
            negative: t.negative,
          }))
        );
      }
    };
    void load();
  }, []);

  const total = feedbacks.length;
  const positive = feedbacks.filter((f) => f.sentiment === "POSITIVE").length;
  const avg = total ? feedbacks.reduce((s, f) => s + f.rating, 0) / total : 0;

  const kpis = useMemo(
    () => [
      { l: "ECs enseignés", v: myEcs.length, icon: BookOpen, accent: "from-primary to-primary-glow" },
      { l: "Feedbacks reçus", v: total, icon: MessageSquare, accent: "from-accent to-primary" },
      { l: "Note moyenne", v: avg, decimals: 1, icon: Star, accent: "from-warning to-primary-glow" },
      { l: "% positifs", v: total ? Math.round((positive / total) * 100) : 0, suffix: "%", icon: Brain, accent: "from-success to-accent" },
    ],
    [avg, myEcs.length, positive, total]
  );

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl font-bold">
          Espace <span className="gradient-text">enseignant</span>
        </h1>
        <p className="text-muted-foreground mt-2">Pilotez la qualité de vos enseignements en temps réel.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div key={k.l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card-elegant p-5 relative overflow-hidden">
            <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${k.accent} opacity-20 blur-2xl`} />
            <div className="relative">
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${k.accent} grid place-items-center shadow-glow mb-3`}>
                <k.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-xs text-muted-foreground">{k.l}</div>
              <div className="font-display text-3xl font-bold mt-1">
                <AnimatedCounter value={k.v} decimals={k.decimals || 0} suffix={k.suffix || ""} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-2 card-elegant p-6">
          <h2 className="font-display text-xl font-bold mb-4">Tendance des sentiments (12 mois)</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--warning))" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Area type="monotone" dataKey="positive" stroke="hsl(var(--success))" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="neutral" stroke="hsl(var(--warning))" fill="url(#g2)" strokeWidth={2} />
                <Area type="monotone" dataKey="negative" stroke="hsl(var(--destructive))" fill="url(#g3)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="card-elegant p-6">
          <h2 className="font-display text-xl font-bold mb-4">Derniers retours</h2>
          <div className="space-y-3">
            {feedbacks.slice(0, 4).map((f, i) => (
              <motion.div key={f.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="p-3 rounded-xl bg-muted/40">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-medium truncate">{f.ecName}</div>
                  <SentimentBadge sentiment={f.sentiment} />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{f.comment}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

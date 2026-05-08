import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Users, BookOpen, MessageSquare, Building2 } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { api } from "@/lib/api";
import {
  mapEc,
  mapMention,
  type CourseElementDto,
  type MentionDto,
  type NiveauDto,
  type ParcoursDto,
  type ReportDto,
  type SemestreDto,
  type TeachingUnitDto,
} from "@/lib/backend";
import type { EC, Mention } from "@/types";

export default function AdminDashboard() {
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [ecs, setEcs] = useState<EC[]>([]);
  const [report, setReport] = useState<ReportDto | null>(null);
  const [stats, setStats] = useState({ totalUsers: 0, totalFeedbacks: 0, totalEcs: 0, totalMentions: 0 });

  const monthly = useMemo(() => {
    if (!report?.trend) return [];
    return report.trend.map(t => ({
      m: new Date(t.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
      feedbacks: t.positive + t.neutral + t.negative,
      users: Math.round((t.positive + t.neutral + t.negative) * 0.8)
    }));
  }, [report]);

  useEffect(() => {
    const load = async () => {
      try {
        const [mentionsRes, statsRes] = await Promise.all([
          api.get<MentionDto[]>("/academic/mentions"),
          api.get<{ totalUsers: number; totalFeedbacks: number; totalEcs: number; totalMentions: number }>("/admin/stats"),
        ]);
        setStats(statsRes.data);
        const mappedMentions = mentionsRes.data.map(mapMention);
        setMentions(mappedMentions);

        if (!mappedMentions[0]) return;
        const parcours = await api.get<ParcoursDto[]>(`/academic/mentions/${mappedMentions[0].id}/parcours`);
        if (!parcours.data[0]) return;
        const niveaux = await api.get<NiveauDto[]>(`/academic/parcours/${parcours.data[0].id}/niveaux`);
        if (!niveaux.data[0]) return;
        const semestres = await api.get<SemestreDto[]>(`/academic/niveaux/${niveaux.data[0].id}/semestres`);
        if (!semestres.data[0]) return;
        const ues = await api.get<TeachingUnitDto[]>(`/academic/semestres/${semestres.data[0].id}/ues`);
        if (!ues.data[0]) return;
        const ecRes = await api.get<CourseElementDto[]>(`/academic/ues/${ues.data[0].id}/ecs`);
        const mappedEcs = ecRes.data.map(mapEc);
        setEcs(mappedEcs);
        if (mappedEcs[0]) {
          const reportRes = await api.get<ReportDto>(`/reports/ec/${mappedEcs[0].id}`);
          setReport(reportRes.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };
    void load();
  }, []);

  const dist = useMemo(
    () =>
      mentions.map((m, i) => ({
        name: m.name,
        value: 1, // Placeholder for distribution
        color: ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--primary-glow))"][i % 3],
      })),
    [mentions]
  );

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl font-bold">
          Vue <span className="gradient-text">administrative</span>
        </h1>
        <p className="text-muted-foreground mt-2">Pilotage global de la plateforme et de la qualité pédagogique.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Utilisateurs", v: stats.totalUsers, icon: Users, c: "from-primary to-primary-glow" },
          { l: "ECs actifs", v: stats.totalEcs, icon: BookOpen, accent: "from-accent to-primary" },
          { l: "Feedbacks", v: stats.totalFeedbacks, icon: MessageSquare, accent: "from-success to-accent" },
          { l: "Mentions", v: stats.totalMentions, icon: Building2, accent: "from-warning to-primary-glow" },
        ].map((k, i) => (
          <motion.div key={k.l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card-elegant p-5 relative overflow-hidden">
            <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${k.accent || k.c} opacity-20 blur-2xl`} />
            <div className="relative">
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${k.accent || k.c} grid place-items-center shadow-glow mb-3`}>
                <k.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-xs text-muted-foreground">{k.l}</div>
              <div className="font-display text-3xl font-bold mt-1"><AnimatedCounter value={k.v} /></div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-2 card-elegant p-6">
          <h2 className="font-display text-xl font-bold mb-4">Activité globale</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={monthly}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Line type="monotone" dataKey="feedbacks" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} animationDuration={1400} />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ r: 4 }} animationDuration={1400} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-elegant p-6">
          <h2 className="font-display text-xl font-bold mb-4">Répartition par mention</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={dist} dataKey="value" innerRadius={50} outerRadius={100} paddingAngle={4} animationDuration={1400}>
                  {dist.map((d) => <Cell key={d.name} fill={d.color} stroke="hsl(var(--background))" strokeWidth={3} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

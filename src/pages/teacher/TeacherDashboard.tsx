import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, MessageSquare, Brain, Star, Plus, X, Loader2 } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { useAuth } from "@/contexts/AuthContext";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { SentimentBadge } from "@/components/SentimentBadge";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  mapEc,
  mapFeedback,
  type CourseElementDto,
  type FeedbackDto,
  type PageResponse,
  type ReportDto,
  type MentionDto,
  type ParcoursDto,
  type NiveauDto,
  type SemestreDto,
  type TeachingUnitDto,
} from "@/lib/backend";
import type { EC, Feedback } from "@/types";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [myEcs, setMyEcs] = useState<EC[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [trend, setTrend] = useState<Array<{ m: string; positive: number; neutral: number; negative: number }>>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    description: "",
    hours: 20,
    ueId: 0,
  });

  // Academic structure for selection
  const [mentions, setMentions] = useState<MentionDto[]>([]);
  const [parcours, setParcours] = useState<ParcoursDto[]>([]);
  const [niveaux, setNiveaux] = useState<NiveauDto[]>([]);
  const [semestres, setSemestres] = useState<SemestreDto[]>([]);
  const [ues, setUes] = useState<TeachingUnitDto[]>([]);
  const [loadingAcademic, setLoadingAcademic] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadMyData = async () => {
    try {
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
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  useEffect(() => {
    void loadMyData();
  }, []);

  const loadAcademic = async () => {
    setLoadingAcademic(true);
    try {
      const res = await api.get<MentionDto[]>("/academic/mentions");
      setMentions(res.data);
    } catch (err) {
      toast.error("Erreur lors du chargement de la structure académique");
    } finally {
      setLoadingAcademic(false);
    }
  };

  const onMentionChange = async (id: number) => {
    setParcours([]); setNiveaux([]); setSemestres([]); setUes([]);
    const res = await api.get<ParcoursDto[]>(`/academic/mentions/${id}/parcours`);
    setParcours(res.data);
  };

  const onParcoursChange = async (id: number) => {
    setNiveaux([]); setSemestres([]); setUes([]);
    const res = await api.get<NiveauDto[]>(`/academic/parcours/${id}/niveaux`);
    setNiveaux(res.data);
  };

  const onNiveauChange = async (id: number) => {
    setSemestres([]); setUes([]);
    const res = await api.get<SemestreDto[]>(`/academic/niveaux/${id}/semestres`);
    setSemestres(res.data);
  };

  const onSemestreChange = async (id: number) => {
    setUes([]);
    const res = await api.get<TeachingUnitDto[]>(`/academic/semestres/${id}/ues`);
    setUes(res.data);
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.ueId) {
      toast.error("Veuillez sélectionner une Unité d'Enseignement (UE)");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/teachers/me/courses", newCourse);
      toast.success("Matière ajoutée avec succès !");
      setShowAddModal(false);
      setNewCourse({ code: "", name: "", description: "", hours: 20, ueId: 0 });
      void loadMyData();
    } catch (err) {
      toast.error("Erreur lors de l'ajout de la matière");
    } finally {
      setSubmitting(false);
    }
  };

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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            Espace <span className="gradient-text">enseignant</span>
          </h1>
          <p className="text-muted-foreground mt-2">Pilotez la qualité de vos enseignements en temps réel.</p>
        </motion.div>
        <button
          onClick={() => { setShowAddModal(true); void loadAcademic(); }}
          className="px-4 py-2.5 rounded-xl bg-gradient-aurora text-white font-semibold flex items-center gap-2 btn-glow shadow-elegant text-sm"
        >
          <Plus className="h-4 w-4" /> Nouvelle Matière
        </button>
      </div>

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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-lg card-elegant p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-display">Ajouter une <span className="gradient-text">Matière</span></h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted rounded-lg transition-colors"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleAddCourse} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Code</label>
                  <input required placeholder="EC-INF-101" className="w-full px-3 py-2 rounded-xl border border-border bg-muted/30 outline-none focus:border-primary/50 transition-all text-sm"
                    value={newCourse.code} onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Heures</label>
                  <input required type="number" min="1" className="w-full px-3 py-2 rounded-xl border border-border bg-muted/30 outline-none focus:border-primary/50 transition-all text-sm"
                    value={newCourse.hours} onChange={(e) => setNewCourse({ ...newCourse, hours: Number(e.target.value) })} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nom de la matière</label>
                <input required placeholder="Algorithmique et Structures de Données" className="w-full px-3 py-2 rounded-xl border border-border bg-muted/30 outline-none focus:border-primary/50 transition-all text-sm"
                  value={newCourse.name} onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</label>
                <textarea rows={3} placeholder="Détails du cours, objectifs pédagogiques..." className="w-full px-3 py-2 rounded-xl border border-border bg-muted/30 outline-none focus:border-primary/50 transition-all text-sm"
                  value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} />
              </div>

              <div className="space-y-4 pt-2 border-t border-border/60">
                <h3 className="text-sm font-semibold text-primary">Rattachement Académique</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <select className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-xs" onChange={(e) => onMentionChange(Number(e.target.value))}>
                    <option value="">Mention</option>
                    {mentions.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                  <select className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-xs" disabled={!parcours.length} onChange={(e) => onParcoursChange(Number(e.target.value))}>
                    <option value="">Parcours</option>
                    {parcours.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <select className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-xs" disabled={!niveaux.length} onChange={(e) => onNiveauChange(Number(e.target.value))}>
                    <option value="">Niveau</option>
                    {niveaux.map(n => <option key={n.id} value={n.id}>{n.code}</option>)}
                  </select>
                  <select className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-xs" disabled={!semestres.length} onChange={(e) => onSemestreChange(Number(e.target.value))}>
                    <option value="">Semestre</option>
                    {semestres.map(s => <option key={s.id} value={s.id}>{s.code}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Unité d'Enseignement (UE)</label>
                  <select required className="w-full px-3 py-2 rounded-xl border border-border bg-muted/30 text-sm" 
                    disabled={!ues.length} value={newCourse.ueId} onChange={(e) => setNewCourse({ ...newCourse, ueId: Number(e.target.value) })}>
                    <option value="">Sélectionner une UE</option>
                    {ues.map(u => <option key={u.id} value={u.id}>{u.code} - {u.name}</option>)}
                  </select>
                </div>
              </div>

              <button disabled={submitting} className="w-full h-12 rounded-xl bg-gradient-aurora text-white font-semibold flex items-center justify-center gap-2 btn-glow shadow-elegant disabled:opacity-50">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" /> Créer la matière</>}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

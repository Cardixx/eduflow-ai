import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { RatingStars } from "@/components/RatingStars";
import { SentimentBadge } from "@/components/SentimentBadge";
import { Calendar, Filter, EyeOff } from "lucide-react";
import type { EC, Feedback, Sentiment } from "@/types";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  mapEc,
  mapFeedback,
  type CourseElementDto,
  type FeedbackDto,
  type MentionDto,
  type NiveauDto,
  type PageResponse,
  type ParcoursDto,
  type SemestreDto,
  type TeachingUnitDto,
} from "@/lib/backend";

export default function FeedbackViewer() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<Sentiment | "ALL">("ALL");
  const [ecId, setEcId] = useState<number | "ALL">("ALL");
  const [allFeedbacks, setAllFeedbacks] = useState<Feedback[]>([]);
  const [ecs, setEcs] = useState<EC[]>([]);

  useEffect(() => {
    const load = async () => {
      if (user?.role === "ADMIN") {
        const mentions = await api.get<MentionDto[]>("/academic/mentions");
        if (!mentions.data[0]) return;
        const parcours = await api.get<ParcoursDto[]>(`/academic/mentions/${mentions.data[0].id}/parcours`);
        if (!parcours.data[0]) return;
        const niveaux = await api.get<NiveauDto[]>(`/academic/parcours/${parcours.data[0].id}/niveaux`);
        if (!niveaux.data[0]) return;
        const semestres = await api.get<SemestreDto[]>(`/academic/niveaux/${niveaux.data[0].id}/semestres`);
        if (!semestres.data[0]) return;
        const ues = await api.get<TeachingUnitDto[]>(`/academic/semestres/${semestres.data[0].id}/ues`);
        if (!ues.data[0]) return;
        const ecsRes = await api.get<CourseElementDto[]>(`/academic/ues/${ues.data[0].id}/ecs`);
        const list = ecsRes.data.map(mapEc);
        setEcs(list);
        if (list[0]) {
          const feedbackRes = await api.get<PageResponse<FeedbackDto>>(`/feedbacks/ec/${list[0].id}`, {
            params: { page: 0, size: 100 },
          });
          setAllFeedbacks(feedbackRes.data.content.map(mapFeedback));
          setEcId(list[0].id);
        }
        return;
      }

      const [coursesRes, feedbackRes] = await Promise.all([
        api.get<CourseElementDto[]>("/teachers/me/courses"),
        api.get<PageResponse<FeedbackDto>>("/feedbacks/teacher/me", { params: { page: 0, size: 100 } }),
      ]);
      setEcs(coursesRes.data.map(mapEc));
      setAllFeedbacks(feedbackRes.data.content.map(mapFeedback));
    };
    void load();
  }, [user?.role]);

  useEffect(() => {
    const loadAdminFeedbacks = async () => {
      if (user?.role !== "ADMIN" || ecId === "ALL") return;
      const { data } = await api.get<PageResponse<FeedbackDto>>(`/feedbacks/ec/${ecId}`, {
        params: { page: 0, size: 100 },
      });
      setAllFeedbacks(data.content.map(mapFeedback));
    };
    void loadAdminFeedbacks();
  }, [ecId, user?.role]);

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

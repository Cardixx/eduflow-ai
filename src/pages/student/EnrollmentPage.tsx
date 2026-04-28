import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BookOpen, Plus, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { mapEc, type CourseElementDto } from "@/lib/backend";
import type { EC } from "@/types";

export default function EnrollmentPage() {
  const [available, setAvailable] = useState<EC[]>([]);
  const [enrolled, setEnrolled] = useState<EC[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [availableRes, enrolledRes] = await Promise.all([
          api.get<CourseElementDto[]>("/students/available-courses"),
          api.get<CourseElementDto[]>("/students/me/courses"),
        ]);
        setAvailable(availableRes.data.map(mapEc));
        setEnrolled(enrolledRes.data.map(mapEc));
      } catch (err) {
        console.error("Failed to load courses", err);
        toast.error("Erreur lors du chargement des cours");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const handleEnroll = async (ecId: number) => {
    setEnrolling(ecId);
    try {
      await api.post("/students/me/enrollments", { ecId });
      const ec = available.find(e => e.id === ecId);
      if (ec) {
        setAvailable(prev => prev.filter(e => e.id !== ecId));
        setEnrolled(prev => [...prev, ec]);
      }
      toast.success("Inscription réussie ! Vous pouvez maintenant donner un feedback.");
    } catch (err) {
      toast.error("Erreur lors de l'inscription");
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Inscription aux <span className="gradient-text">ECs</span></h1>
        <p className="text-muted-foreground mt-1">Inscrivez-vous aux éléments constitutifs pour donner votre feedback.</p>
      </div>

      {enrolled.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <Check className="h-5 w-5 text-success" /> Mes ECs inscrits
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolled.map((ec, i) => (
              <motion.div
                key={ec.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="card-elegant p-5 border-l-4 border-l-success"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-success/20 grid place-items-center">
                    <Check className="h-5 w-5 text-success" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-muted/60 text-muted-foreground">{ec.code}</span>
                </div>
                <div className="font-semibold">{ec.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{ec.teacherName} · {ec.hours}h</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {available.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" /> ECs disponibles
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {available.map((ec, i) => (
              <motion.div
                key={ec.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="card-elegant p-5 group hover:border-primary/40 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/20 grid place-items-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-muted/60 text-muted-foreground">{ec.code}</span>
                </div>
                <div className="font-semibold">{ec.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{ec.teacherName} · {ec.hours}h</div>
                {ec.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{ec.description}</p>}
                <button
                  onClick={() => handleEnroll(ec.id)}
                  disabled={enrolling === ec.id}
                  className="mt-4 w-full h-9 rounded-lg bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {enrolling === ec.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <><Plus className="h-4 w-4" /> S'inscrire</>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {available.length === 0 && enrolled.length > 0 && (
        <div className="card-elegant p-8 text-center">
          <Check className="h-12 w-12 text-success mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold">Tous les ECs sont occupés !</h3>
          <p className="text-muted-foreground mt-2">Vous êtes inscrit à tous les éléments constitutifs disponibles.</p>
        </div>
      )}

      {available.length === 0 && enrolled.length === 0 && (
        <div className="card-elegant p-8 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold">Aucun EC disponible</h3>
          <p className="text-muted-foreground mt-2">Contactez votre administrateur pour plus d'informations.</p>
        </div>
      )}
    </div>
  );
}

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BookOpen, Search, MessageSquarePlus } from "lucide-react";
import { FeedbackModal } from "./FeedbackModal";
import { api } from "@/lib/api";
import { mapEc, type CourseElementDto } from "@/lib/backend";
import type { EC } from "@/types";

export default function ECList() {
  const [search, setSearch] = useState("");
  const [params] = useSearchParams();
  const initial = params.get("ec");
  const [selected, setSelected] = useState<number | null>(initial ? Number(initial) : null);
  const [ecs, setEcs] = useState<EC[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get<CourseElementDto[]>("/students/me/courses");
      setEcs(data.map(mapEc));
    };
    void load();
  }, []);

  const filtered = ecs.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Mes <span className="gradient-text">ECs</span></h1>
          <p className="text-muted-foreground mt-1">Sélectionnez un cours pour donner votre feedback.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-card input-glow transition-all max-w-sm w-full">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un EC…" className="flex-1 bg-transparent outline-none text-sm" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ec, i) => (
          <motion.div
            key={ec.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="card-elegant p-5 group cursor-pointer"
            onClick={() => setSelected(ec.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="h-11 w-11 rounded-xl bg-gradient-aurora grid place-items-center shadow-glow">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded-md bg-muted/60 text-muted-foreground">{ec.code}</span>
            </div>
            <div className="font-display font-bold text-lg leading-snug">{ec.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{ec.teacherName}</div>
            {ec.description && <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{ec.description}</p>}
            <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{ec.hours}h</span>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                <MessageSquarePlus className="h-3.5 w-3.5" /> Donner un avis
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <FeedbackModal ecId={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronRight, Network, Building2, GraduationCap, Calendar, BookOpen, Layers } from "lucide-react";
import { api } from "@/lib/api";
import {
  mapEc,
  mapMention,
  mapNiveau,
  mapParcours,
  mapSemestre,
  mapUe,
  type CourseElementDto,
  type MentionDto,
  type NiveauDto,
  type ParcoursDto,
  type SemestreDto,
  type TeachingUnitDto,
} from "@/lib/backend";

type Node = { id: string; label: string; sub?: string; icon: any; children?: Node[] };

function TreeNode({ node, depth }: { node: Node; depth: number }) {
  const [open, setOpen] = useState(depth < 1);
  const has = !!node.children?.length;
  return (
    <div>
      <motion.button
        whileHover={{ x: 2 }}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted/50 transition-colors text-left"
        style={{ paddingLeft: depth * 20 + 12 }}
      >
        {has ? (
          <motion.div animate={{ rotate: open ? 90 : 0 }}>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        ) : <div className="w-4" />}
        <div className="h-7 w-7 rounded-lg bg-muted/60 grid place-items-center"><node.icon className="h-3.5 w-3.5 text-primary" /></div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{node.label}</div>
          {node.sub && <div className="text-[11px] text-muted-foreground truncate">{node.sub}</div>}
        </div>
      </motion.button>
      <AnimatePresence initial={false}>
        {open && has && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
            {node.children!.map((c) => <TreeNode key={c.id} node={c} depth={depth + 1} />)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AcademicStructure() {
  const [tree, setTree] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTree = async () => {
      setLoading(true);
      setError(null);
      try {
        const mentionsRes = await api.get<MentionDto[]>("/academic/mentions");
        const mentionNodes = await Promise.all(
          mentionsRes.data.map(async (mentionDto) => {
            const mention = mapMention(mentionDto);
            const parcoursRes = await api.get<ParcoursDto[]>(`/academic/mentions/${mention.id}/parcours`);
            const parcoursNodes = await Promise.all(
              parcoursRes.data.map(async (parcoursDto) => {
                const parcours = mapParcours(parcoursDto);
                const niveauxRes = await api.get<NiveauDto[]>(`/academic/parcours/${parcours.id}/niveaux`);
                const niveauNodes = await Promise.all(
                  niveauxRes.data.map(async (niveauDto) => {
                    const niveau = mapNiveau(niveauDto);
                    const semestresRes = await api.get<SemestreDto[]>(`/academic/niveaux/${niveau.id}/semestres`);
                    const semestreNodes = await Promise.all(
                      semestresRes.data.map(async (semestreDto) => {
                        const semestre = mapSemestre(semestreDto);
                        const uesRes = await api.get<TeachingUnitDto[]>(`/academic/semestres/${semestre.id}/ues`);
                        const ueNodes = await Promise.all(
                          uesRes.data.map(async (ueDto) => {
                            const ue = mapUe(ueDto);
                            const ecsRes = await api.get<CourseElementDto[]>(`/academic/ues/${ue.id}/ecs`);
                            const ecNodes: Node[] = ecsRes.data.map((ecDto) => {
                              const ec = mapEc(ecDto);
                              return {
                                id: `e-${ec.id}`,
                                label: ec.name,
                                sub: `${ec.code} · ${ec.teacherName}`,
                                icon: Network,
                              };
                            });
                            return {
                              id: `u-${ue.id}`,
                              label: ue.name,
                              sub: `${ue.code} · ${ue.credits} crédits`,
                              icon: BookOpen,
                              children: ecNodes,
                            };
                          })
                        );
                        return {
                          id: `s-${semestre.id}`,
                          label: semestre.name,
                          icon: Calendar,
                          children: ueNodes,
                        };
                      })
                    );
                    return {
                      id: `n-${niveau.id}`,
                      label: niveau.name,
                      icon: Layers,
                      children: semestreNodes,
                    };
                  })
                );
                return {
                  id: `p-${parcours.id}`,
                  label: parcours.name,
                  icon: GraduationCap,
                  children: niveauNodes,
                };
              })
            );
            return {
              id: `m-${mention.id}`,
              label: mention.name,
              sub: mention.code,
              icon: Building2,
              children: parcoursNodes,
            };
          })
        );
        setTree(mentionNodes);
      } catch {
        setError("Impossible de charger la structure académique depuis le backend.");
      } finally {
        setLoading(false);
      }
    };
    void loadTree();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <Network className="h-7 w-7 text-primary" /> Structure <span className="gradient-text">LMD</span>
        </h1>
        <p className="text-muted-foreground mt-1">Hiérarchie : Mention → Parcours → Niveau → Semestre → UE → EC</p>
      </div>
      <div className="card-elegant p-3">
        {loading && <div className="p-4 text-sm text-muted-foreground">Chargement de la structure académique…</div>}
        {error && <div className="p-4 text-sm text-destructive">{error}</div>}
        {!loading && !error && tree.map((n) => <TreeNode key={n.id} node={n} depth={0} />)}
      </div>
    </div>
  );
}

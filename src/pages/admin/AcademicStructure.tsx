import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronRight, Network, Building2, GraduationCap, Calendar, BookOpen, Layers } from "lucide-react";
import { mentions, parcours, niveaux, semestres, ues, ecs } from "@/lib/mockData";

type Node = { id: string; label: string; sub?: string; icon: any; children?: Node[] };

function build(): Node[] {
  return mentions.map((m) => ({
    id: `m-${m.id}`, label: m.name, sub: m.code, icon: Building2,
    children: parcours.filter((p) => p.mentionId === m.id).map((p) => ({
      id: `p-${p.id}`, label: p.name, icon: GraduationCap,
      children: niveaux.filter((n) => n.parcoursId === p.id).map((n) => ({
        id: `n-${n.id}`, label: n.name, icon: Layers,
        children: semestres.filter((s) => s.niveauId === n.id).map((s) => ({
          id: `s-${s.id}`, label: s.name, icon: Calendar,
          children: ues.filter((u) => u.semestreId === s.id).map((u) => ({
            id: `u-${u.id}`, label: u.name, sub: `${u.code} · ${u.credits} crédits`, icon: BookOpen,
            children: ecs.filter((e) => e.ueId === u.id).map((e) => ({
              id: `e-${e.id}`, label: e.name, sub: `${e.code} · ${e.teacherName}`, icon: Network,
            })),
          })),
        })),
      })),
    })),
  }));
}

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
  const tree = build();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <Network className="h-7 w-7 text-primary" /> Structure <span className="gradient-text">LMD</span>
        </h1>
        <p className="text-muted-foreground mt-1">Hiérarchie : Mention → Parcours → Niveau → Semestre → UE → EC</p>
      </div>
      <div className="card-elegant p-3">
        {tree.map((n) => <TreeNode key={n.id} node={n} depth={0} />)}
      </div>
    </div>
  );
}

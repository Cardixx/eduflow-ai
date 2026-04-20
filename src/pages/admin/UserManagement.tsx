import { motion } from "framer-motion";
import { Users as UsersIcon, Plus, Search, MoreVertical, Mail } from "lucide-react";
import { useState } from "react";

const seed = [
  { id: 1, name: "Amina Berrada", email: "amina@emit.dz", role: "STUDENT", status: "active" },
  { id: 2, name: "Yassir Lamine", email: "yassir@emit.dz", role: "STUDENT", status: "active" },
  { id: 3, name: "Dr. Karim Idrissi", email: "karim@emit.dz", role: "TEACHER", status: "active" },
  { id: 4, name: "Pr. Hicham Bennani", email: "hicham@emit.dz", role: "TEACHER", status: "active" },
  { id: 5, name: "Sofia El Amrani", email: "sofia@emit.dz", role: "ADMIN", status: "active" },
  { id: 6, name: "Lina Tazi", email: "lina@emit.dz", role: "STUDENT", status: "pending" },
];

const roleColor: Record<string, string> = {
  STUDENT: "bg-primary/15 text-primary border-primary/30",
  TEACHER: "bg-accent/15 text-accent border-accent/30",
  ADMIN: "bg-warning/15 text-warning border-warning/30",
};

export default function UserManagement() {
  const [q, setQ] = useState("");
  const filtered = seed.filter((u) => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <UsersIcon className="h-7 w-7 text-primary" /> <span className="gradient-text">Utilisateurs</span>
          </h1>
          <p className="text-muted-foreground mt-1">Gérez les comptes étudiants, enseignants et administrateurs.</p>
        </div>
        <button className="px-4 py-2.5 rounded-xl bg-gradient-aurora text-white font-semibold flex items-center gap-2 btn-glow shadow-elegant text-sm">
          <Plus className="h-4 w-4" /> Nouveau
        </button>
      </div>

      <div className="card-elegant p-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/40 input-glow transition-all">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher par nom ou email…" className="flex-1 bg-transparent outline-none text-sm" />
        </div>
      </div>

      <div className="card-elegant overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 bg-muted/30">
            <tr className="text-left text-xs uppercase text-muted-foreground tracking-wider">
              <th className="px-5 py-3">Utilisateur</th>
              <th className="px-5 py-3">Rôle</th>
              <th className="px-5 py-3">Statut</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filtered.map((u, i) => (
              <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-aurora grid place-items-center text-white font-semibold text-sm">{u.name.charAt(0)}</div>
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" /> {u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[11px] font-medium px-2 py-1 rounded-md border ${roleColor[u.role]}`}>{u.role}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs ${u.status === "active" ? "text-success" : "text-warning"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${u.status === "active" ? "bg-success" : "bg-warning"} animate-pulse-glow`} />
                    {u.status === "active" ? "Actif" : "En attente"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors"><MoreVertical className="h-4 w-4" /></button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

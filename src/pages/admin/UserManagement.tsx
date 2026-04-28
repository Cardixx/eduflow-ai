import { motion } from "framer-motion";
import { Users as UsersIcon, Plus, Search, MoreVertical, Mail, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { mapUser, type UserDto } from "@/lib/backend";
import type { User } from "@/types";

const roleColor: Record<string, string> = {
  STUDENT: "bg-primary/15 text-primary border-primary/30",
  TEACHER: "bg-accent/15 text-accent border-accent/30",
  ADMIN: "bg-warning/15 text-warning border-warning/30",
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<UserDto[]>("/admin/users");
        setUsers(res.data.map(mapUser));
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase())
  );

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
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
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
                      <div className="h-9 w-9 rounded-full bg-gradient-aurora grid place-items-center text-white font-semibold text-sm">{u.fullName.charAt(0)}</div>
                      <div>
                        <div className="font-medium">{u.fullName}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" /> {u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-medium px-2 py-1 rounded-md border ${roleColor[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" />
                      Actif
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors"><MoreVertical className="h-4 w-4" /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

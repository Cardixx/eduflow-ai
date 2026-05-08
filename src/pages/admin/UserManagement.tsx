import { motion, AnimatePresence } from "framer-motion";
import { Users as UsersIcon, Plus, Search, MoreVertical, Mail, Loader2, Edit2, X, Lock, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
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
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ email: "", password: "", fullName: "" });
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = async () => {
    try {
      const res = await api.get<UserDto[]>("/admin/users");
      setUsers(res.data.map(mapUser));
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const handleEdit = (u: User) => {
    setEditingUser(u);
    setEditForm({ email: u.email, password: "", fullName: u.fullName });
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSubmitting(true);
    try {
      const { data } = await api.put<UserDto>(`/admin/users/${editingUser.id}`, {
        email: editForm.email,
        fullName: editForm.fullName,
        password: editForm.password || undefined,
      });
      setUsers((prev) => prev.map((u) => (u.id === data.id ? mapUser(data) : u)));
      toast.success("Utilisateur mis à jour");
      setEditingUser(null);
    } catch (err) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Utilisateur supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <UsersIcon className="h-7 w-7 text-primary" /> <span className="gradient-text">Utilisateurs</span>
          </h1>
          <p className="text-muted-foreground mt-1">Gérez les comptes étudiants, enseignants et administrateurs.</p>
        </div>
        <button 
          onClick={() => toast.info("Utilisez le formulaire d'inscription pour créer un utilisateur (pour l'instant)")}
          className="px-4 py-2.5 rounded-xl bg-gradient-aurora text-white font-semibold flex items-center gap-2 btn-glow shadow-elegant text-sm"
        >
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
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(u)}
                        className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(u.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setEditingUser(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md card-elegant p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-display">Modifier <span className="gradient-text">l'utilisateur</span></h2>
                <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-muted rounded-lg transition-colors"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={submitEdit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nom complet</label>
                  <input required placeholder="Ex: Jean Dupont" className="w-full px-3 py-2 rounded-xl border border-border bg-muted/30 outline-none focus:border-primary/50 text-sm"
                    value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input type="email" required placeholder="email@emit.mg" className="w-full pl-10 pr-3 py-2 rounded-xl border border-border bg-muted/30 outline-none focus:border-primary/50 text-sm"
                      value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nouveau mot de passe (optionnel)</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input type="password" placeholder="••••••••" className="w-full pl-10 pr-3 py-2 rounded-xl border border-border bg-muted/30 outline-none focus:border-primary/50 text-sm"
                      value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Laissez vide pour conserver le mot de passe actuel.</p>
                </div>
                <button type="submit" disabled={submitting} className="w-full h-11 rounded-xl bg-gradient-aurora text-white font-semibold flex items-center justify-center gap-2 btn-glow shadow-elegant mt-2 disabled:opacity-50">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Enregistrer</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

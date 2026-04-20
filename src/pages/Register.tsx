import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import { GraduationCap, User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Role } from "@/types";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("STUDENT");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ fullName, email, password, role });
      toast.success("Compte créé !");
      navigate("/app");
    } catch (err: any) {
      toast.error(err?.message || "Échec de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background mesh-bg p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md card-elegant p-8 relative z-10"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-aurora grid place-items-center shadow-glow">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-lg">Créer un compte</div>
            <div className="text-xs text-muted-foreground">Rejoignez la plateforme EMIT</div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field icon={User} label="Nom complet">
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Votre nom" className="flex-1 bg-transparent outline-none text-sm" />
          </Field>
          <Field icon={Mail} label="Email">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@emit.dz" className="flex-1 bg-transparent outline-none text-sm" />
          </Field>
          <Field icon={Lock} label="Mot de passe">
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="flex-1 bg-transparent outline-none text-sm" />
          </Field>

          <div className="space-y-2">
            <label className="text-sm font-medium">Rôle</label>
            <div className="grid grid-cols-3 gap-2">
              {(["STUDENT", "TEACHER", "ADMIN"] as Role[]).map((r) => (
                <button
                  key={r} type="button" onClick={() => setRole(r)}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                    role === r ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-aurora text-white font-semibold flex items-center justify-center gap-2 btn-glow shadow-elegant disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<>Créer le compte <ArrowRight className="h-4 w-4" /></>)}
          </motion.button>
        </form>

        <p className="mt-6 text-sm text-center text-muted-foreground">
          Déjà inscrit ? <Link to="/login" className="text-primary hover:underline font-medium">Se connecter</Link>
        </p>
      </motion.div>
    </div>
  );
}

function Field({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2 px-3 py-3 rounded-xl border border-border bg-card input-glow transition-all">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {children}
      </div>
    </div>
  );
}

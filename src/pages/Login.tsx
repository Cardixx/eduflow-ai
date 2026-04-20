import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import { GraduationCap, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname: string } } };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Connexion réussie");
      navigate(location.state?.from?.pathname || "/app");
    } catch (err: any) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error(err?.message || "Échec de la connexion");
    } finally {
      setLoading(false);
    }
  };

  const quick = (em: string, pw: string) => { setEmail(em); setPassword(pw); };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background overflow-hidden">
      {/* Visual */}
      <div className="relative hidden lg:flex items-center justify-center mesh-bg p-12 border-r border-border/40">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-md"
        >
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="h-14 w-14 rounded-2xl bg-gradient-aurora grid place-items-center shadow-glow"
            >
              <GraduationCap className="h-7 w-7 text-white" />
            </motion.div>
            <div>
              <div className="font-display font-bold text-2xl">EMIT</div>
              <div className="text-xs text-muted-foreground tracking-widest uppercase">Feedback Platform</div>
            </div>
          </div>
          <h1 className="font-display text-5xl font-bold leading-tight mb-6">
            <span className="gradient-text">L'IA au service</span><br />de l'enseignement.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Une plateforme LMD nouvelle génération qui transforme les retours étudiants en insights pédagogiques exploitables grâce à l'analyse de sentiment.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { k: "12.4k", l: "Feedbacks" },
              { k: "94%", l: "Précision IA" },
              { k: "320+", l: "ECs suivis" },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="card-elegant p-4"
              >
                <div className="font-display text-2xl font-bold gradient-text">{s.k}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-float" />
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full max-w-md ${shake ? "animate-shake" : ""}`}
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-aurora grid place-items-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div className="font-display font-bold text-xl">EMIT</div>
          </div>

          <h2 className="font-display text-3xl font-bold mb-2">Bon retour 👋</h2>
          <p className="text-muted-foreground mb-8">Connectez-vous pour accéder à votre espace.</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="flex items-center gap-2 px-3 py-3 rounded-xl border border-border bg-card input-glow transition-all">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@emit.dz"
                  className="flex-1 bg-transparent outline-none text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mot de passe</label>
              <div className="flex items-center gap-2 px-3 py-3 rounded-xl border border-border bg-card input-glow transition-all">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-aurora text-white font-semibold flex items-center justify-center gap-2 btn-glow shadow-elegant disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<>Se connecter <ArrowRight className="h-4 w-4" /></>)}
            </motion.button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Démo rapide</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { l: "Étudiant", e: "student@emit.dz", p: "student" },
              { l: "Enseignant", e: "teacher@emit.dz", p: "teacher" },
              { l: "Admin", e: "admin@emit.dz", p: "admin" },
            ].map((q) => (
              <button
                key={q.l}
                type="button"
                onClick={() => quick(q.e, q.p)}
                className="px-3 py-2.5 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 text-xs font-medium transition-all"
              >
                {q.l}
              </button>
            ))}
          </div>

          <p className="mt-8 text-sm text-center text-muted-foreground">
            Pas de compte ? <Link to="/register" className="text-primary hover:underline font-medium">S'inscrire</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

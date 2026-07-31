import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import { GraduationCap, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiError";

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
    } catch (err) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error(getApiErrorMessage(err, "Échec de la connexion"));
    } finally {
      setLoading(false);
    }
  };

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
              className="h-14 w-14 rounded-2xl overflow-hidden bg-white grid place-items-center shadow-glow"
            >
              <img 
                src="/logo-1.png" 
                alt="EMIT Logo" 
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.classList.add('bg-gradient-aurora');
                  const icon = document.createElement('div');
                  icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap text-white"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>';
                  e.currentTarget.parentElement?.appendChild(icon.firstChild as Node);
                }}
              />
            </motion.div>
            <div>
              <div className="font-display font-bold text-2xl">EMIT</div>
              <div className="text-xs text-muted-foreground tracking-widest uppercase">Fianarantsoa</div>
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
            <div className="h-10 w-10 rounded-xl overflow-hidden bg-white grid place-items-center shadow-glow">
              <img 
                src="/logo-1.png" 
                alt="EMIT Logo" 
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.classList.add('bg-gradient-aurora');
                  const icon = document.createElement('div');
                  icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap text-white"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>';
                  e.currentTarget.parentElement?.appendChild(icon.firstChild as Node);
                }}
              />
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
                  placeholder="vous@emit.mg"
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

          <p className="mt-8 text-sm text-center text-muted-foreground">
            Pas de compte ? <Link to="/register" className="text-primary hover:underline font-medium">S'inscrire</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

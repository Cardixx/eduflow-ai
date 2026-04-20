import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GraduationCap, Sparkles, BarChart3, Brain, ArrowRight, Star, Network, MessageSquare } from "lucide-react";

const features = [
  { icon: Brain, title: "Analyse de sentiment IA", desc: "Détection automatique du ton des feedbacks (positif / neutre / négatif) avec résumés générés." },
  { icon: Network, title: "Structure LMD complète", desc: "Mention → Parcours → Niveau → Semestre → UE → EC. Une hiérarchie pédagogique propre." },
  { icon: BarChart3, title: "Reporting interactif", desc: "Dashboards animés, tendances, KPIs, exports prêts pour la direction académique." },
  { icon: MessageSquare, title: "Feedback anonyme", desc: "Les étudiants s'expriment librement, les enseignants reçoivent des insights actionnables." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background mesh-bg overflow-hidden">
      {/* Nav */}
      <nav className="relative z-20 px-6 lg:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-aurora grid place-items-center shadow-glow">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-none">EMIT</div>
            <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Feedback AI</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Se connecter</Link>
          <Link to="/register" className="px-4 py-2 rounded-xl bg-gradient-aurora text-white text-sm font-semibold btn-glow shadow-elegant">
            Démarrer
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 lg:px-12 pt-12 pb-24 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-xs font-medium mb-8"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Plateforme LMD nouvelle génération · Analyse IA en temps réel</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="font-display text-5xl md:text-7xl font-bold leading-[1.05] text-balance"
        >
          Le feedback étudiant,<br />
          <span className="gradient-text">amplifié par l'IA.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Collectez les retours, analysez le sentiment, transformez chaque cours en une expérience pédagogique mesurable. Pour étudiants, enseignants et administrateurs.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-10 flex items-center justify-center gap-4 flex-wrap"
        >
          <Link to="/login" className="h-12 px-6 rounded-xl bg-gradient-aurora text-white font-semibold flex items-center gap-2 btn-glow shadow-elegant">
            Accéder à la plateforme <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/register" className="h-12 px-6 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 font-semibold flex items-center gap-2 transition-all">
            Créer un compte
          </Link>
        </motion.div>

        {/* Mock dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 relative"
        >
          <div className="card-elegant glass-strong p-6 max-w-4xl mx-auto text-left">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { l: "Feedbacks reçus", v: "1,284", c: "+18%" },
                { l: "Sentiment positif", v: "76%", c: "+4%" },
                { l: "ECs actifs", v: "47", c: "+3" },
              ].map((s, i) => (
                <motion.div key={s.l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
                  className="rounded-xl bg-muted/40 p-4 border border-border/40">
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                  <div className="font-display text-3xl font-bold mt-1">{s.v}</div>
                  <div className="text-xs text-success mt-1">{s.c}</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 flex items-end gap-2 h-32">
              {[40, 65, 50, 80, 70, 90, 75, 85, 95, 88, 70, 92].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }} animate={{ height: `${h}%` }}
                  transition={{ delay: 0.8 + i * 0.05, type: "spring" }}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-primary to-primary-glow"
                />
              ))}
            </div>
          </div>
          <div className="absolute -inset-x-20 -bottom-10 h-40 bg-primary/20 blur-3xl rounded-full" />
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 lg:px-12 py-24 max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-4">
          Une <span className="gradient-text">expérience complète</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-16">Tout ce qu'il faut pour piloter la qualité pédagogique d'un établissement.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="card-elegant p-6"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-aurora grid place-items-center shadow-glow mb-4">
                <f.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 px-6 lg:px-12 py-8 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <Star className="h-3.5 w-3.5 text-primary" />
          EMIT Feedback Platform — Construit pour l'enseignement supérieur LMD.
        </div>
      </footer>
    </div>
  );
}

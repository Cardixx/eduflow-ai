import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadialBarChart, RadialBar, Legend } from "recharts";
import { ecs, feedbacks } from "@/lib/mockData";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { BarChart3, Download } from "lucide-react";

const ratings = ecs.map((e) => {
  const list = feedbacks.filter((f) => f.ecId === e.id);
  const avg = list.length ? list.reduce((s, f) => s + f.rating, 0) / list.length : 0;
  return { name: e.code, rating: Math.round(avg * 10) / 10, total: list.length };
});

const radial = [
  { name: "Positif", value: 68, fill: "hsl(var(--success))" },
  { name: "Neutre", value: 22, fill: "hsl(var(--warning))" },
  { name: "Négatif", value: 10, fill: "hsl(var(--destructive))" },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="h-7 w-7 text-primary" /> Rapports <span className="gradient-text">analytiques</span>
          </h1>
          <p className="text-muted-foreground mt-1">Tableaux de bord détaillés et exports prêts pour la direction.</p>
        </div>
        <button className="px-4 py-2.5 rounded-xl bg-gradient-aurora text-white font-semibold flex items-center gap-2 btn-glow shadow-elegant text-sm">
          <Download className="h-4 w-4" /> Exporter PDF
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Total avis", v: feedbacks.length },
          { l: "ECs évalués", v: ecs.length },
          { l: "Note moyenne", v: 4.1, dec: 1 },
          { l: "Taux participation", v: 87, suffix: "%" },
        ].map((k, i) => (
          <motion.div key={k.l} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-elegant p-5">
            <div className="text-xs text-muted-foreground">{k.l}</div>
            <div className="font-display text-3xl font-bold mt-1 gradient-text">
              <AnimatedCounter value={k.v} decimals={k.dec || 0} suffix={k.suffix || ""} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="lg:col-span-2 card-elegant p-6">
          <h2 className="font-display text-lg font-bold mb-4">Note moyenne par EC</h2>
          <div className="h-80">
            <ResponsiveContainer>
              <BarChart data={ratings}>
                <defs>
                  <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary-glow))" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis domain={[0, 5]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Bar dataKey="rating" fill="url(#bar)" radius={[12, 12, 0, 0]} animationDuration={1400} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="card-elegant p-6">
          <h2 className="font-display text-lg font-bold mb-4">Sentiment global</h2>
          <div className="h-80">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="30%" outerRadius="100%" data={radial} startAngle={90} endAngle={-270}>
                <RadialBar background dataKey="value" cornerRadius={12} animationDuration={1400} />
                <Legend iconSize={10} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

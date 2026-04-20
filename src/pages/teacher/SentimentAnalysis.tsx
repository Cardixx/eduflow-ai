import { motion } from "framer-motion";
import { useState } from "react";
import { ecs, sentimentFor } from "@/lib/mockData";
import { TypingText } from "@/components/TypingText";
import { Sparkles, TrendingUp } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

export default function SentimentAnalysis() {
  const [ecId, setEcId] = useState(ecs[0].id);
  const data = sentimentFor(ecId);
  const ec = ecs.find((e) => e.id === ecId)!;
  const pie = [
    { name: "Positif", value: data.positive, color: "hsl(var(--success))" },
    { name: "Neutre", value: data.neutral, color: "hsl(var(--warning))" },
    { name: "Négatif", value: data.negative, color: "hsl(var(--destructive))" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <Sparkles className="h-7 w-7 text-primary" /> Sentiment <span className="gradient-text">AI</span>
          </h1>
          <p className="text-muted-foreground mt-1">Analyse intelligente des retours étudiants.</p>
        </div>
        <select value={ecId} onChange={(e) => setEcId(Number(e.target.value))} className="px-4 py-2.5 rounded-xl bg-card border border-border outline-none input-glow text-sm">
          {ecs.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {[
          { l: "Total feedbacks", v: data.totalFeedback },
          { l: "Note moyenne", v: data.averageRating, dec: 1 },
          { l: "Positifs", v: data.positive, color: "text-success" },
          { l: "Négatifs", v: data.negative, color: "text-destructive" },
        ].map((k, i) => (
          <motion.div key={k.l} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-elegant p-5">
            <div className="text-xs text-muted-foreground">{k.l}</div>
            <div className={`font-display text-3xl font-bold mt-1 ${k.color || ""}`}>
              <AnimatedCounter value={k.v} decimals={k.dec || 0} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-elegant p-6">
          <h2 className="font-display text-lg font-bold mb-4">Répartition des sentiments</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pie} dataKey="value" innerRadius={60} outerRadius={110} paddingAngle={4} animationDuration={1200}>
                  {pie.map((p) => <Cell key={p.name} fill={p.color} stroke="hsl(var(--background))" strokeWidth={3} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-elegant p-6">
          <h2 className="font-display text-lg font-bold mb-4">Tendance hebdomadaire</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={data.trend}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Bar dataKey="positive" stackId="a" fill="hsl(var(--success))" radius={[0, 0, 0, 0]} animationDuration={1200} />
                <Bar dataKey="neutral" stackId="a" fill="hsl(var(--warning))" animationDuration={1200} />
                <Bar dataKey="negative" stackId="a" fill="hsl(var(--destructive))" radius={[8, 8, 0, 0]} animationDuration={1200} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-elegant p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-aurora grid place-items-center shadow-glow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold">Résumé IA · {ec.name}</h2>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Généré à l'instant
              </div>
            </div>
          </div>
          <TypingText key={ecId} text={data.summary} className="text-foreground/90 leading-relaxed" />
        </div>
      </motion.div>
    </div>
  );
}

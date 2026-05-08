import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadialBarChart, RadialBar, Legend, AreaChart, Area } from "recharts";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { BarChart3, Download, FileText, Filter, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { mapEc, type CourseElementDto, type ReportDto } from "@/lib/backend";
import type { EC } from "@/types";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  const [ecs, setEcs] = useState<EC[]>([]);
  const [selectedEc, setSelectedEc] = useState<number | null>(null);
  const [report, setReport] = useState<ReportDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    const loadEcs = async () => {
      try {
        const { data } = await api.get<CourseElementDto[]>("/teachers/me/courses");
        const mapped = data.map(mapEc);
        setEcs(mapped);
        if (mapped.length > 0) {
          setSelectedEc(mapped[0].id);
        }
      } catch (err) {
        toast.error("Erreur lors du chargement des matières");
      } finally {
        setLoading(false);
      }
    };
    void loadEcs();
  }, []);

  useEffect(() => {
    if (!selectedEc) return;
    const loadReport = async () => {
      setLoadingReport(true);
      try {
        const { data } = await api.get<ReportDto>(`/reports/ec/${selectedEc}`);
        setReport(data);
      } catch (err) {
        toast.error("Erreur lors de la génération du rapport");
      } finally {
        setLoadingReport(false);
      }
    };
    void loadReport();
  }, [selectedEc]);

  const radial = useMemo(
    () =>
      report
        ? [
            { name: "Positif", value: report.positive, fill: "hsl(var(--success))" },
            { name: "Neutre", value: report.neutral, fill: "hsl(var(--warning))" },
            { name: "Négatif", value: report.negative, fill: "hsl(var(--destructive))" },
          ]
        : [],
    [report]
  );

  const trendData = useMemo(() => {
    if (!report?.trend) return [];
    return report.trend.map(p => ({
      date: new Date(p.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
      positif: p.positive,
      neutre: p.neutral,
      negatif: p.negative,
    }));
  }, [report]);

  const handleExport = () => {
    if (!report) return;
    const data = JSON.stringify(report, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${report.ecCode}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    if (!report) return;
    
    const doc = new jsPDF();
    const now = new Date().toLocaleDateString("fr-FR");
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.text("Rapport d'Évaluation Pédagogique", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(`Généré le : ${now}`, 105, 28, { align: "center" });
    
    // Course Info
    doc.setFontSize(16);
    doc.setTextColor(79, 70, 229); // Primary
    doc.text(`${report.ecCode} - ${report.ecName}`, 14, 45);
    
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.line(14, 48, 196, 48);
    
    // Summary Table
    autoTable(doc, {
      startY: 55,
      head: [["Indicateur", "Valeur"]],
      body: [
        ["Total des avis", report.totalFeedback.toString()],
        ["Note Moyenne", `${report.averageRating.toFixed(1)} / 5`],
        ["Avis Positifs", report.positive.toString()],
        ["Avis Neutres", report.neutral.toString()],
        ["Avis Négatifs", report.negative.toString()],
        ["Taux de satisfaction", `${Math.round((report.positive / Math.max(report.totalFeedback, 1)) * 100)}%`],
      ],
      theme: "striped",
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 11 }
    });
    
    // Automatic Summary
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("Résumé Analytique", 14, finalY);
    
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    const splitSummary = doc.splitTextToSize(report.summary, 180);
    doc.text(splitSummary, 14, finalY + 10);
    
    // Evolution Data Table
    if (report.trend && report.trend.length > 0) {
      autoTable(doc, {
        startY: finalY + 35,
        head: [["Date", "Positifs", "Neutres", "Négatifs"]],
        body: report.trend.map(p => [
          new Date(p.date).toLocaleDateString("fr-FR"),
          p.positive.toString(),
          p.neutral.toString(),
          p.negative.toString()
        ]),
        headStyles: { fillColor: [15, 118, 110] }, // Success/Teal
        margin: { top: 10 }
      });
    }
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text(`EduFlow AI - Page ${i} sur ${pageCount}`, 105, 285, { align: "center" });
    }

    doc.save(`Rapport-${report.ecCode}.pdf`);
    toast.success("PDF généré avec succès");
  };

  if (loading) return (
    <div className="p-12 flex justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="h-7 w-7 text-primary" /> Rapports <span className="gradient-text">analytiques</span>
          </h1>
          <p className="text-muted-foreground mt-1">Tableaux de bord détaillés et exports prêts pour la direction.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedEc || ""} 
            onChange={(e) => setSelectedEc(Number(e.target.value))}
            className="px-3 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary/50 transition-all"
          >
            {ecs.map(ec => (
              <option key={ec.id} value={ec.id}>{ec.code} - {ec.name}</option>
            ))}
          </select>
          <button 
            onClick={handleExportPDF}
            disabled={!report}
            className="px-4 py-2.5 rounded-xl bg-gradient-aurora text-white font-semibold flex items-center gap-2 btn-glow shadow-elegant text-sm disabled:opacity-50"
          >
            <FileText className="h-4 w-4" /> Exporter PDF
          </button>
          <button 
            onClick={handleExport}
            disabled={!report}
            className="px-4 py-2.5 rounded-xl border border-border hover:bg-muted font-semibold flex items-center gap-2 transition-all text-sm disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> JSON
          </button>
        </div>
      </div>

      {loadingReport ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : report ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { l: "Total avis", v: report.totalFeedback },
              { l: "Note moyenne", v: report.averageRating, dec: 1 },
              { l: "Taux positifs", v: Math.round((report.positive / Math.max(report.totalFeedback, 1)) * 100), suffix: "%" },
              { l: "Évolution", v: trendData.length, suffix: " jours" },
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-2 card-elegant p-6">
              <h2 className="font-display text-lg font-bold mb-4">Évolution du sentiment</h2>
              <div className="h-80">
                <ResponsiveContainer>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                    <Area type="monotone" dataKey="positif" stroke="hsl(var(--success))" fillOpacity={1} fill="url(#colorPos)" strokeWidth={2} />
                    <Area type="monotone" dataKey="negatif" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorNeg)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-elegant p-6">
              <h2 className="font-display text-lg font-bold mb-4">Répartition des avis</h2>
              <div className="h-80">
                <ResponsiveContainer>
                  <RadialBarChart innerRadius="30%" outerRadius="100%" data={radial} startAngle={90} endAngle={-270}>
                    <RadialBar background dataKey="value" cornerRadius={12} animationDuration={1400} />
                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                    <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-elegant p-6">
            <h2 className="font-display text-lg font-bold mb-2">Résumé automatique</h2>
            <p className="text-muted-foreground text-sm leading-relaxed italic">
              "{report.summary}"
            </p>
          </motion.div>
        </>
      ) : (
        <div className="card-elegant p-12 text-center text-muted-foreground">
          Aucune donnée disponible pour générer un rapport.
        </div>
      )}
    </div>
  );
}

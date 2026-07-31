import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, FormEvent, useEffect } from "react";
import { GraduationCap, User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Role } from "@/types";
import { api } from "@/lib/api";
import type { MentionDto, ParcoursDto, NiveauDto } from "@/lib/backend";
import { getApiErrorMessage } from "@/lib/apiError";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("STUDENT");
  const [loading, setLoading] = useState(false);
  const [studentNumber, setStudentNumber] = useState("");
  const [teacherCode, setTeacherCode] = useState("");
  const [department, setDepartment] = useState("");
  const [niveauId, setNiveauId] = useState<number | undefined>();
  const [niveaux, setNiveaux] = useState<NiveauDto[]>([]);
  const [parcoursList, setParcoursList] = useState<ParcoursDto[]>([]);
  const [mentions, setMentions] = useState<MentionDto[]>([]);
  const [mentionId, setMentionId] = useState<number | undefined>();
  const [parcoursId, setParcoursId] = useState<number | undefined>();
  const [loadingAcademic, setLoadingAcademic] = useState(false);
  const [loadingParcours, setLoadingParcours] = useState(false);
  const [loadingNiveaux, setLoadingNiveaux] = useState(false);

  useEffect(() => {
    if (role === "STUDENT") {
      setLoadingAcademic(true);
      api.get<MentionDto[]>("/academic/mentions")
        .then((res) => {
          setMentions(res.data);
          if (res.data.length > 0) {
            setMentionId(res.data[0].id);
          } else {
            setMentionId(undefined);
          }
        })
        .catch((err) => {
          console.error("Failed to load mentions:", err);
          toast.error("Erreur lors du chargement des mentions");
        })
        .finally(() => setLoadingAcademic(false));
    }
  }, [role]);

  useEffect(() => {
    if (role === "STUDENT" && mentionId) {
      setLoadingParcours(true);
      setParcoursList([]);
      setParcoursId(undefined);
      setNiveaux([]);
      setNiveauId(undefined);
      api.get<ParcoursDto[]>(`/academic/mentions/${mentionId}/parcours`)
        .then((res) => {
          setParcoursList(res.data);
          if (res.data.length > 0) {
            setParcoursId(res.data[0].id);
          }
        })
        .catch((err) => {
          console.error("Failed to load parcours:", err);
          toast.error("Erreur lors du chargement des parcours");
        })
        .finally(() => setLoadingParcours(false));
    } else if (!mentionId) {
      setParcoursList([]);
      setParcoursId(undefined);
      setNiveaux([]);
      setNiveauId(undefined);
    }
  }, [role, mentionId]);

  useEffect(() => {
    if (role === "STUDENT" && parcoursId) {
      setLoadingNiveaux(true);
      setNiveaux([]);
      setNiveauId(undefined);
      api.get<NiveauDto[]>(`/academic/parcours/${parcoursId}/niveaux`)
        .then((res) => {
          setNiveaux(res.data);
          if (res.data.length > 0) {
            setNiveauId(res.data[0].id);
          }
        })
        .catch((err) => {
          console.error("Failed to load niveaux:", err);
          toast.error("Erreur lors du chargement des niveaux");
        })
        .finally(() => setLoadingNiveaux(false));
    } else if (!parcoursId) {
      setNiveaux([]);
      setNiveauId(undefined);
    }
  }, [role, parcoursId]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (role === "STUDENT" && (!studentNumber.trim() || !niveauId)) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setLoading(true);
    try {
      await register({
        fullName,
        email,
        password,
        role,
        studentNumber: role === "STUDENT" ? studentNumber : undefined,
        niveauId: role === "STUDENT" ? niveauId : undefined,
        teacherCode: role === "TEACHER" ? teacherCode : undefined,
        department: role === "TEACHER" ? department : undefined,
      });
      toast.success("Demande d'inscription envoyée. L'administrateur doit valider votre compte.");
      navigate("/login");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Échec de l'inscription"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background mesh-bg p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl card-elegant p-8 relative z-10"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <Link to="/" className="group mb-4">
            <div className="h-16 w-16 rounded-2xl overflow-hidden bg-white grid place-items-center shadow-glow group-hover:scale-105 transition-transform">
              <img 
                src="https://emit.univ-fianarantsoa.mg/img/logo.png" 
                alt="EMIT Logo" 
                className="h-12 w-12 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.classList.add('bg-gradient-aurora');
                  const icon = document.createElement('div');
                  icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap text-white"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>';
                  e.currentTarget.parentElement?.appendChild(icon.firstChild as Node);
                }}
              />
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold">Rejoindre l'EMIT</h1>
          <p className="text-muted-foreground mt-2">Créez votre compte pour commencer.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field icon={User} label="Nom complet">
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Votre nom" className="flex-1 bg-transparent outline-none text-sm" />
          </Field>
          <Field icon={Mail} label="Email">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@emit.mg" className="flex-1 bg-transparent outline-none text-sm" />
          </Field>
          <Field icon={Lock} label="Mot de passe">
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="flex-1 bg-transparent outline-none text-sm" />
          </Field>

          <div className="space-y-2">
            <label className="text-sm font-medium">Rôle</label>
            <div className="grid grid-cols-3 gap-2">
              {(["STUDENT", "TEACHER"] as Role[]).map((r) => (
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

          {role === "STUDENT" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Numéro étudiant</label>
                <input
                  required
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  placeholder="Ex: 2024-INFO-001"
                  className="w-full px-3 py-3 rounded-xl border border-border bg-card input-glow transition-all outline-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Mention</label>
                <select
                  value={mentionId || ""}
                  onChange={(e) => setMentionId(Number(e.target.value))}
                  disabled={loadingAcademic || mentions.length === 0}
                  className="w-full px-3 py-3 rounded-xl border border-border bg-card input-glow transition-all outline-none text-sm disabled:opacity-50"
                >
                  {loadingAcademic ? (
                    <option value="">Chargement des mentions...</option>
                  ) : mentions.length === 0 ? (
                    <option value="">Aucune mention disponible</option>
                  ) : (
                    mentions.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.code})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Parcours</label>
                <select
                  value={parcoursId || ""}
                  onChange={(e) => setParcoursId(Number(e.target.value))}
                  disabled={loadingParcours || parcoursList.length === 0}
                  className="w-full px-3 py-3 rounded-xl border border-border bg-card input-glow transition-all outline-none text-sm disabled:opacity-50"
                >
                  {loadingParcours ? (
                    <option value="">Chargement des parcours...</option>
                  ) : parcoursList.length === 0 ? (
                    <option value="">Aucun parcours disponible</option>
                  ) : (
                    parcoursList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Niveau</label>
                <select
                  value={niveauId || ""}
                  onChange={(e) => setNiveauId(Number(e.target.value))}
                  disabled={loadingNiveaux || niveaux.length === 0}
                  className="w-full px-3 py-3 rounded-xl border border-border bg-card input-glow transition-all outline-none text-sm disabled:opacity-50"
                >
                  {loadingNiveaux ? (
                    <option value="">Chargement des niveaux...</option>
                  ) : niveaux.length === 0 ? (
                    <option value="">Aucun niveau disponible</option>
                  ) : (
                    niveaux.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.code}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </>
          )}

          {role === "TEACHER" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Code enseignant</label>
                <input
                  required
                  value={teacherCode}
                  onChange={(e) => setTeacherCode(e.target.value)}
                  placeholder="Ex: ENS-2024-001"
                  className="w-full px-3 py-3 rounded-xl border border-border bg-card input-glow transition-all outline-none text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Département / Mention</label>
                <input
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Ex: Informatique"
                  className="w-full px-3 py-3 rounded-xl border border-border bg-card input-glow transition-all outline-none text-sm"
                />
              </div>
            </>
          )}

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

type FieldProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
};

function Field({ icon: Icon, label, children }: FieldProps) {
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

import type {
  EC, Feedback, Mention, Niveau, Notification, Parcours, Semestre, SentimentAnalysis, UE, User,
} from "@/types";

export const mockUsers: Record<string, { password: string; user: User }> = {
  "student@emit.dz": {
    password: "student",
    user: { id: 1, email: "student@emit.dz", fullName: "Amina Berrada", role: "STUDENT" },
  },
  "teacher@emit.dz": {
    password: "teacher",
    user: { id: 2, email: "teacher@emit.dz", fullName: "Dr. Karim Idrissi", role: "TEACHER" },
  },
  "admin@emit.dz": {
    password: "admin",
    user: { id: 3, email: "admin@emit.dz", fullName: "Sofia El Amrani", role: "ADMIN" },
  },
};

export const mentions: Mention[] = [
  { id: 1, name: "Informatique", code: "INFO" },
  { id: 2, name: "Mathématiques Appliquées", code: "MATH" },
  { id: 3, name: "Génie Industriel", code: "GI" },
];

export const parcours: Parcours[] = [
  { id: 1, name: "Génie Logiciel", mentionId: 1 },
  { id: 2, name: "Intelligence Artificielle", mentionId: 1 },
  { id: 3, name: "Réseaux & Sécurité", mentionId: 1 },
  { id: 4, name: "Statistiques", mentionId: 2 },
  { id: 5, name: "Production", mentionId: 3 },
];

export const niveaux: Niveau[] = [
  { id: 1, name: "Licence 1", parcoursId: 1 },
  { id: 2, name: "Licence 2", parcoursId: 1 },
  { id: 3, name: "Licence 3", parcoursId: 1 },
  { id: 4, name: "Master 1", parcoursId: 2 },
  { id: 5, name: "Master 2", parcoursId: 2 },
];

export const semestres: Semestre[] = [
  { id: 1, name: "Semestre 1", niveauId: 3 },
  { id: 2, name: "Semestre 2", niveauId: 3 },
  { id: 3, name: "Semestre 1", niveauId: 4 },
];

export const ues: UE[] = [
  { id: 1, code: "UE-INFO-501", name: "Architecture Logicielle", semestreId: 1, credits: 6 },
  { id: 2, code: "UE-INFO-502", name: "Bases de Données Avancées", semestreId: 1, credits: 6 },
  { id: 3, code: "UE-INFO-503", name: "Intelligence Artificielle", semestreId: 1, credits: 6 },
  { id: 4, code: "UE-INFO-504", name: "Génie Logiciel", semestreId: 2, credits: 6 },
];

export const ecs: EC[] = [
  { id: 1, code: "EC-501-A", name: "Microservices & Cloud", ueId: 1, teacherName: "Dr. Karim Idrissi", hours: 42, description: "Patterns, Docker, Kubernetes." },
  { id: 2, code: "EC-501-B", name: "Design Patterns", ueId: 1, teacherName: "Dr. Karim Idrissi", hours: 28, description: "GoF + architecture." },
  { id: 3, code: "EC-502-A", name: "PostgreSQL Avancé", ueId: 2, teacherName: "Dr. Yasmine Cherif", hours: 36 },
  { id: 4, code: "EC-502-B", name: "NoSQL & Big Data", ueId: 2, teacherName: "Dr. Yasmine Cherif", hours: 30 },
  { id: 5, code: "EC-503-A", name: "Machine Learning", ueId: 3, teacherName: "Pr. Hicham Bennani", hours: 48 },
  { id: 6, code: "EC-503-B", name: "Deep Learning", ueId: 3, teacherName: "Pr. Hicham Bennani", hours: 40 },
  { id: 7, code: "EC-504-A", name: "Méthodes Agiles", ueId: 4, teacherName: "Dr. Karim Idrissi", hours: 24 },
];

const sample = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
const positive = ["Cours passionnant et bien structuré.", "Le professeur explique très clairement.", "J'ai énormément appris, merci !", "Travaux pratiques excellents."];
const neutral = ["Cours correct, rythme acceptable.", "Quelques chapitres méritent plus d'exemples.", "Bonne pédagogie globalement."];
const negative = ["Le rythme est trop rapide.", "Manque d'exercices pratiques.", "Support de cours peu clair."];

export const feedbacks: Feedback[] = Array.from({ length: 28 }).map((_, i) => {
  const ec = ecs[i % ecs.length];
  const r = Math.random();
  const sentiment = r > 0.6 ? "POSITIVE" : r > 0.3 ? "NEUTRAL" : "NEGATIVE";
  const rating = sentiment === "POSITIVE" ? 4 + Math.round(Math.random()) : sentiment === "NEUTRAL" ? 3 : 1 + Math.round(Math.random());
  const comment = sentiment === "POSITIVE" ? sample(positive) : sentiment === "NEUTRAL" ? sample(neutral) : sample(negative);
  return {
    id: i + 1,
    ecId: ec.id,
    ecName: ec.name,
    studentName: ["Amina B.", "Yassir L.", "Sara M.", "Omar K.", "Lina T."][i % 5],
    anonymous: i % 3 === 0,
    rating,
    comment,
    sentiment,
    createdAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
  };
});

export const sentimentFor = (ecId: number): SentimentAnalysis => {
  const list = feedbacks.filter((f) => f.ecId === ecId);
  const positive = list.filter((f) => f.sentiment === "POSITIVE").length;
  const neutral = list.filter((f) => f.sentiment === "NEUTRAL").length;
  const negative = list.filter((f) => f.sentiment === "NEGATIVE").length;
  const avg = list.length ? list.reduce((s, f) => s + f.rating, 0) / list.length : 0;
  return {
    ecId,
    positive, neutral, negative,
    totalFeedback: list.length,
    averageRating: Math.round(avg * 10) / 10,
    summary: "Les retours soulignent une pédagogie claire et un contenu apprécié. Les étudiants demandent davantage d'exemples pratiques et un rythme légèrement ajusté pour les chapitres avancés.",
    trend: Array.from({ length: 6 }).map((_, i) => ({
      date: `S${i + 1}`,
      positive: Math.max(1, Math.round(positive / 6 + (Math.random() * 2 - 1))),
      neutral: Math.max(0, Math.round(neutral / 6 + (Math.random() * 2 - 1))),
      negative: Math.max(0, Math.round(negative / 6 + (Math.random() * 2 - 1))),
    })),
  };
};

export const notifications: Notification[] = [
  { id: 1, title: "Nouveau feedback", message: "Un étudiant a noté Microservices & Cloud.", read: false, type: "info", createdAt: new Date().toISOString() },
  { id: 2, title: "Sentiment positif", message: "Tendance positive détectée sur Machine Learning (+12%).", read: false, type: "success", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 3, title: "Rappel", message: "Période d'évaluation du Semestre 1 ouverte.", read: true, type: "warning", createdAt: new Date(Date.now() - 86400000).toISOString() },
];

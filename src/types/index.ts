export type Role = "STUDENT" | "TEACHER" | "ADMIN";

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  avatarUrl?: string;
  active?: boolean;
}

export interface Mention { id: number; name: string; code: string; }
export interface Parcours { id: number; name: string; mentionId: number; }
export interface Niveau { id: number; name: string; parcoursId: number; }
export interface Semestre { id: number; name: string; niveauId: number; }
export interface UE { id: number; code: string; name: string; semestreId: number; credits: number; }
export interface EC {
  id: number;
  code: string;
  name: string;
  ueId: number;
  teacherName: string;
  hours: number;
  description?: string;
}

export type Sentiment = "POSITIVE" | "NEUTRAL" | "NEGATIVE";

export interface Feedback {
  id: number;
  ecId: number;
  ecName: string;
  studentName: string;
  anonymous: boolean;
  rating: number; // 1..5
  comment: string;
  sentiment: Sentiment;
  createdAt: string;
}

export interface SentimentAnalysis {
  ecId: number;
  positive: number;
  neutral: number;
  negative: number;
  averageRating: number;
  totalFeedback: number;
  summary: string;
  trend: { date: string; positive: number; neutral: number; negative: number }[];
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  type: "info" | "success" | "warning";
  createdAt: string;
}

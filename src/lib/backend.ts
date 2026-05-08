import type {
  EC,
  Feedback,
  Mention,
  Niveau,
  Notification,
  Parcours,
  Role,
  Semestre,
  Sentiment,
  SentimentAnalysis,
  UE,
  User,
} from "@/types";

export type BackendRole = "ADMIN" | "ETUDIANT" | "ENSEIGNANT";

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface UserDto {
  id: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: BackendRole;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: UserDto;
}

export interface CourseElementDto {
  id: number;
  code: string;
  name: string;
  description?: string;
  hours: number;
  ueId?: number;
  teacherId?: number;
  teacherName?: string;
}

export interface FeedbackDto {
  id: number;
  ecId: number;
  ecName: string;
  studentName: string;
  anonymous: boolean;
  rating: number;
  comment: string;
  sentiment: Sentiment;
  score?: number;
  summary?: string;
  createdAt: string;
}

export interface StudentProfileDto {
  id: number;
  studentNumber: string;
  fullName: string;
  email: string;
  niveau: string;
  academicYear: string;
}

export interface MentionDto {
  id: number;
  code: string;
  name: string;
}

export interface ParcoursDto {
  id: number;
  name: string;
  mentionId: number;
}

export interface NiveauDto {
  id: number;
  code: string;
  parcoursId: number;
}

export interface SemestreDto {
  id: number;
  code: string;
  niveauId: number;
}

export interface TeachingUnitDto {
  id: number;
  code: string;
  name: string;
  credits: number;
  semestreId: number;
}

export interface NotificationDto {
  id: number;
  title: string;
  message: string;
  read: boolean;
  type: "INFO" | "SUCCESS" | "WARNING";
  createdAt: string;
}

export interface SentimentTrendPointDto {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface ReportDto {
  ecId: number;
  ecCode: string;
  ecName: string;
  averageRating: number;
  totalFeedback: number;
  positive: number;
  neutral: number;
  negative: number;
  summary: string;
  trend: SentimentTrendPointDto[];
}

export const backendRoleToRole = (role: BackendRole): Role => {
  if (role === "ETUDIANT") return "STUDENT";
  if (role === "ENSEIGNANT") return "TEACHER";
  return "ADMIN";
};

export const roleToBackendRole = (role: Role): BackendRole => {
  if (role === "STUDENT") return "ETUDIANT";
  if (role === "TEACHER") return "ENSEIGNANT";
  return "ADMIN";
};

export const mapUser = (user: UserDto): User => ({
  id: user.id,
  email: user.email,
  fullName: user.fullName,
  avatarUrl: user.avatarUrl,
  role: backendRoleToRole(user.role),
});

export const mapEc = (ec: CourseElementDto): EC => ({
  id: ec.id,
  code: ec.code,
  name: ec.name,
  description: ec.description,
  hours: ec.hours ?? 0,
  ueId: ec.ueId ?? 0,
  teacherName: ec.teacherName ?? "—",
});

export const mapFeedback = (feedback: FeedbackDto): Feedback => ({
  id: feedback.id,
  ecId: feedback.ecId,
  ecName: feedback.ecName,
  studentName: feedback.studentName,
  anonymous: feedback.anonymous,
  rating: feedback.rating,
  comment: feedback.comment,
  sentiment: feedback.sentiment,
  createdAt: feedback.createdAt,
});

export const mapMention = (mention: MentionDto): Mention => ({
  id: mention.id,
  name: mention.name,
  code: mention.code,
});

export const mapParcours = (parcours: ParcoursDto): Parcours => parcours;

export const mapNiveau = (niveau: NiveauDto): Niveau => ({
  id: niveau.id,
  name: niveau.code,
  parcoursId: niveau.parcoursId,
});

export const mapSemestre = (semestre: SemestreDto): Semestre => ({
  id: semestre.id,
  name: semestre.code,
  niveauId: semestre.niveauId,
});

export const mapUe = (ue: TeachingUnitDto): UE => ({
  id: ue.id,
  code: ue.code,
  name: ue.name,
  credits: ue.credits,
  semestreId: ue.semestreId,
});

export const mapNotification = (notification: NotificationDto): Notification => ({
  id: notification.id,
  title: notification.title,
  message: notification.message,
  read: notification.read,
  type: notification.type.toLowerCase() as Notification["type"],
  createdAt: notification.createdAt,
});

export const reportToSentiment = (report: ReportDto): SentimentAnalysis => ({
  ecId: report.ecId,
  positive: report.positive,
  neutral: report.neutral,
  negative: report.negative,
  averageRating: report.averageRating,
  totalFeedback: report.totalFeedback,
  summary: report.summary,
  trend: report.trend.map((point) => ({
    date: point.date,
    positive: point.positive,
    neutral: point.neutral,
    negative: point.negative,
  })),
});

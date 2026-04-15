export type Subject =
  | "Mathématiques"
  | "Français"
  | "Histoire-Géo"
  | "Sciences"
  | "Anglais"
  | "Technologie"
  | "Programmation";

export type ActivityType =
  | "quiz"
  | "dictée"
  | "chat"
  | "exercice"
  | "fiche"
  | "brevet_blanc"
  | "calcul_mental"
  | "lecture";

export interface Child {
  id: string;
  name: string;
  grade: string;
  age: number;
  avatarEmoji: string;
  xp: number;
  coins: number;
  streak: number;
}

export interface Activity {
  id: string;
  childId: string;
  type: ActivityType;
  subject: Subject;
  title: string;
  score?: number;
  xpEarned: number;
  duration: number;
  timestamp: Date;
}

export interface ScreenTimeConfig {
  childId: string;
  dailyLimitMinutes: number;
  todayUsedMinutes: number;
  isLocked: boolean;
  studyWindows: StudyWindow[];
}

export interface StudyWindow {
  start: string;
  end: string;
}

export interface WeeklyReport {
  childId: string;
  weekStart: Date;
  totalMinutes: number;
  totalXp: number;
  subjectBreakdown: SubjectStats[];
  aiSummary: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  generatedAt: Date;
}

export interface SubjectStats {
  subject: Subject;
  minutes: number;
  averageScore: number;
  activitiesCount: number;
}

export interface DaySchedule {
  day: string;
  subjects: Subject[];
}

import type { Subject } from "../types";

export const SUBJECTS: Subject[] = [
  "Mathématiques",
  "Français",
  "Histoire-Géo",
  "Sciences",
  "Anglais",
  "Technologie",
  "Programmation",
];

export const SUBJECT_ICONS: Record<Subject, string> = {
  Mathématiques: "calculator",
  Français: "book-open-variant",
  "Histoire-Géo": "earth",
  Sciences: "flask",
  Anglais: "translate",
  Technologie: "cog",
  Programmation: "code-tags",
};

export const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  quiz: "Quiz",
  dictée: "Dictée",
  chat: "Discussion",
  exercice: "Exercice",
  fiche: "Fiche de révision",
  brevet_blanc: "Brevet blanc",
  calcul_mental: "Calcul mental",
  lecture: "Lecture",
};

export const GRADES = [
  "CP",
  "CE1",
  "CE2",
  "CM1",
  "CM2",
  "6ème",
  "5ème",
  "4ème",
  "3ème",
  "2nde",
  "1ère",
  "Terminale",
];

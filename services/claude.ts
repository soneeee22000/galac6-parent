import type { Activity, Child, SubjectStats } from "../types";

interface WeeklyReportResult {
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

function buildPrompt(
  child: Child,
  stats: SubjectStats[],
  totalMinutes: number,
): string {
  const subjectLines = stats
    .map(
      (s) =>
        `- ${s.subject}: ${s.minutes} min, ${s.activitiesCount} activités${s.averageScore > 0 ? `, moyenne ${s.averageScore}%` : ""}`,
    )
    .join("\n");

  return `Tu es un conseiller pédagogique bienveillant pour parents français.
Analyse les données d'apprentissage de cette semaine pour ${child.name} (${child.grade}, ${child.age} ans) et génère un rapport hebdomadaire.

Données de la semaine:
- Temps total: ${totalMinutes} minutes
- Série actuelle: ${child.streak} jours consécutifs
- XP total: ${child.xp}
- Détail par matière:
${subjectLines}

Génère un rapport JSON avec exactement cette structure (en français, ton chaleureux et encourageant):
{
  "summary": "2-3 phrases résumant la semaine",
  "strengths": ["point fort 1", "point fort 2", "point fort 3"],
  "improvements": ["axe d'amélioration 1", "axe d'amélioration 2"],
  "recommendations": ["recommandation concrète 1", "recommandation concrète 2", "recommandation concrète 3"]
}

Règles:
- Sois spécifique aux matières et scores mentionnés
- Ton positif et encourageant (c'est pour un parent)
- Recommandations actionables (ex: "15 min d'anglais par jour")
- Réponds UNIQUEMENT avec le JSON, sans texte autour`;
}

export async function generateWeeklyReport(
  child: Child,
  stats: SubjectStats[],
  totalMinutes: number,
  apiKey: string,
): Promise<WeeklyReportResult> {
  const prompt = buildPrompt(child, stats, totalMinutes);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content[0].text;

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse Claude response as JSON");
  }

  return JSON.parse(jsonMatch[0]) as WeeklyReportResult;
}

export function generateMockReport(
  child: Child,
  stats: SubjectStats[],
  totalMinutes: number,
): WeeklyReportResult {
  const topSubject = stats[0];
  const weakSubject = stats.length > 1 ? stats[stats.length - 1] : null;

  return {
    summary: `${child.name} a eu une semaine productive avec ${totalMinutes} minutes d'étude réparties sur ${stats.length} matières. La régularité est au rendez-vous avec une série de ${child.streak} jours consécutifs — bravo !`,
    strengths: [
      topSubject
        ? `Excellente implication en ${topSubject.subject} (${topSubject.minutes} min, ${topSubject.averageScore > 0 ? `${topSubject.averageScore}% de moyenne` : "régulier"})`
        : "Bonne régularité dans l'utilisation de la plateforme",
      `Série de ${child.streak} jours consécutifs — la constance paie !`,
      `${child.xp} XP accumulés — progression solide`,
    ],
    improvements: [
      weakSubject
        ? `${weakSubject.subject} mériterait plus d'attention (seulement ${weakSubject.minutes} min cette semaine)`
        : "Essayer de diversifier les matières étudiées",
      "Augmenter progressivement la durée des sessions pour renforcer la concentration",
    ],
    recommendations: [
      weakSubject
        ? `Planifier 15 min de ${weakSubject.subject} par jour cette semaine`
        : "Explorer une nouvelle matière pour élargir les compétences",
      "Faire un brevet blanc pour identifier les points à travailler",
      "Continuer sur cette lancée — la régularité est la clé de la réussite !",
    ],
  };
}

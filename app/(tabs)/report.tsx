import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useChildStore } from "../../stores/childStore";
import { useActivityStore } from "../../stores/activityStore";
import { COLORS, SUBJECT_COLORS } from "../../constants/colors";
import { generateMockReport } from "../../services/claude";
import type { Subject, SubjectStats } from "../../types";

function computeSubjectStats(
  activities: { subject: Subject; duration: number; score?: number }[],
): SubjectStats[] {
  const map = new Map<
    Subject,
    { minutes: number; scores: number[]; count: number }
  >();
  for (const a of activities) {
    const entry = map.get(a.subject) ?? { minutes: 0, scores: [], count: 0 };
    entry.minutes += a.duration;
    entry.count += 1;
    if (a.score !== undefined) entry.scores.push(a.score);
    map.set(a.subject, entry);
  }
  return Array.from(map.entries())
    .map(([subject, data]) => ({
      subject,
      minutes: data.minutes,
      averageScore:
        data.scores.length > 0
          ? Math.round(
              data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
            )
          : 0,
      activitiesCount: data.count,
    }))
    .sort((a, b) => b.minutes - a.minutes);
}

export default function ReportScreen() {
  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState<{
    summary: string;
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  } | null>(null);

  const activeChild = useChildStore((s) => s.activeChild)();
  const getWeekActivities = useActivityStore((s) => s.getWeekActivities);
  const weekActivities = activeChild ? getWeekActivities(activeChild.id) : [];
  const subjectStats = computeSubjectStats(weekActivities);
  const totalMinutes = weekActivities.reduce((sum, a) => sum + a.duration, 0);
  const totalXp = weekActivities.reduce((sum, a) => sum + a.xpEarned, 0);
  const maxMinutes = Math.max(...subjectStats.map((st) => st.minutes), 1);

  const generateReport = async () => {
    if (!activeChild) return;
    setLoading(true);
    try {
      // Use mock report for demo — swap to generateWeeklyReport() with API key for real Claude AI
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const report = generateMockReport(
        activeChild,
        subjectStats,
        totalMinutes,
      );
      setAiReport(report);
    } catch {
      setAiReport(generateMockReport(activeChild, subjectStats, totalMinutes));
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={s.screen}>
      <ScrollView style={{ flex: 1 }}>
        <View style={s.header}>
          <Text style={s.title}>Rapport hebdo</Text>
          <Text style={s.subtitle}>
            Semaine du{" "}
            {new Date(Date.now() - 7 * 86400000).toLocaleDateString("fr-FR")} au{" "}
            {new Date().toLocaleDateString("fr-FR")}
          </Text>
        </View>

        <View style={s.statsRow}>
          <View style={s.statBox}>
            <Ionicons name="time" size={24} color={COLORS.primary} />
            <Text style={s.statValue}>{totalMinutes}</Text>
            <Text style={s.statLabel}>minutes</Text>
          </View>
          <View style={s.statBox}>
            <Ionicons name="star" size={24} color={COLORS.accent} />
            <Text style={s.statValue}>{totalXp}</Text>
            <Text style={s.statLabel}>XP gagnés</Text>
          </View>
          <View style={s.statBox}>
            <Ionicons name="book" size={24} color={COLORS.success} />
            <Text style={s.statValue}>{weekActivities.length}</Text>
            <Text style={s.statLabel}>activités</Text>
          </View>
        </View>

        <Text style={s.sectionLabel}>Temps par matière</Text>
        <View style={s.card}>
          {subjectStats.map((stat) => {
            const barColor = SUBJECT_COLORS[stat.subject] ?? COLORS.primary;
            return (
              <View key={stat.subject} style={{ marginBottom: 14 }}>
                <View style={s.barHeader}>
                  <Text style={s.barSubject}>{stat.subject}</Text>
                  <Text style={s.barMeta}>
                    {stat.minutes} min
                    {stat.averageScore > 0 ? ` · ${stat.averageScore}%` : ""}
                  </Text>
                </View>
                <View style={s.barTrack}>
                  <View
                    style={[
                      s.barFill,
                      {
                        width: `${(stat.minutes / maxMinutes) * 100}%`,
                        backgroundColor: barColor,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        <Text style={s.sectionLabel}>Analyse IA</Text>
        <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
          {!aiReport && !loading && (
            <TouchableOpacity onPress={generateReport} style={s.button}>
              <Ionicons name="sparkles" size={20} color="white" />
              <Text style={s.buttonText}>Générer le rapport IA</Text>
            </TouchableOpacity>
          )}
          {loading && (
            <View
              style={[
                s.card,
                {
                  marginHorizontal: 0,
                  alignItems: "center",
                  paddingVertical: 32,
                },
              ]}
            >
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={[s.subtitle, { marginTop: 12 }]}>
                Analyse en cours...
              </Text>
            </View>
          )}
          {aiReport && (
            <View style={{ gap: 12 }}>
              <View style={[s.card, { marginHorizontal: 0 }]}>
                <Text style={[s.aiLabel, { color: COLORS.primary }]}>
                  Résumé
                </Text>
                <Text style={s.aiText}>{aiReport.summary}</Text>
              </View>
              <View style={[s.card, { marginHorizontal: 0 }]}>
                <View style={s.aiHeader}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={COLORS.success}
                  />
                  <Text style={[s.aiLabel, { color: COLORS.success }]}>
                    Points forts
                  </Text>
                </View>
                {aiReport.strengths.map((str, i) => (
                  <Text key={i} style={s.aiBullet}>
                    • {str}
                  </Text>
                ))}
              </View>
              <View style={[s.card, { marginHorizontal: 0 }]}>
                <View style={s.aiHeader}>
                  <Ionicons
                    name="alert-circle"
                    size={16}
                    color={COLORS.warning}
                  />
                  <Text style={[s.aiLabel, { color: COLORS.warning }]}>
                    À améliorer
                  </Text>
                </View>
                {aiReport.improvements.map((str, i) => (
                  <Text key={i} style={s.aiBullet}>
                    • {str}
                  </Text>
                ))}
              </View>
              <View style={[s.card, { marginHorizontal: 0 }]}>
                <View style={s.aiHeader}>
                  <Ionicons name="bulb" size={16} color={COLORS.accent} />
                  <Text style={[s.aiLabel, { color: COLORS.accent }]}>
                    Recommandations
                  </Text>
                </View>
                {aiReport.recommendations.map((str, i) => (
                  <Text key={i} style={s.aiBullet}>
                    • {str}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  title: { color: COLORS.text, fontSize: 24, fontWeight: "700" },
  subtitle: { color: COLORS.textMuted, fontSize: 14, marginTop: 4 },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statValue: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
  },
  statLabel: { color: COLORS.textMuted, fontSize: 12 },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  barSubject: { color: COLORS.text, fontSize: 14, fontWeight: "500" },
  barMeta: { color: COLORS.textMuted, fontSize: 12 },
  barTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  barFill: { height: 10, borderRadius: 5 },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  aiLabel: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  aiText: { color: COLORS.text, fontSize: 14, lineHeight: 20 },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  aiBullet: { color: COLORS.text, fontSize: 14, lineHeight: 22, marginLeft: 4 },
});

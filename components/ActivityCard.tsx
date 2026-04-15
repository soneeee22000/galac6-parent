import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Activity } from "../types";
import { COLORS, SUBJECT_COLORS } from "../constants/colors";
import { ACTIVITY_TYPE_LABELS } from "../constants/subjects";

interface ActivityCardProps {
  activity: Activity;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return "Hier";
  return `Il y a ${diffDays} jours`;
}

function getScoreColor(score: number): string {
  if (score >= 80) return COLORS.success;
  if (score >= 60) return COLORS.accent;
  return COLORS.error;
}

function getActivityIcon(type: string): keyof typeof Ionicons.glyphMap {
  const icons: Record<string, string> = {
    quiz: "help-circle",
    dictée: "mic",
    chat: "chatbubbles",
    exercice: "pencil",
    fiche: "document-text",
    brevet_blanc: "school",
    calcul_mental: "calculator",
    lecture: "book",
  };
  return (icons[type] ?? "ellipse") as keyof typeof Ionicons.glyphMap;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const subjectColor = SUBJECT_COLORS[activity.subject] ?? COLORS.primary;

  return (
    <View style={s.card}>
      <View style={s.topRow}>
        <View style={[s.iconBox, { backgroundColor: `${subjectColor}20` }]}>
          <Ionicons
            name={getActivityIcon(activity.type)}
            size={20}
            color={subjectColor}
          />
        </View>
        <View style={s.titleArea}>
          <Text style={s.title} numberOfLines={2}>
            {activity.title}
          </Text>
          <View style={s.badges}>
            <View style={[s.badge, { backgroundColor: `${subjectColor}20` }]}>
              <Text style={[s.badgeText, { color: subjectColor }]}>
                {activity.subject}
              </Text>
            </View>
            <Text style={s.typeLabel}>
              {ACTIVITY_TYPE_LABELS[activity.type]}
            </Text>
          </View>
        </View>
      </View>

      <View style={s.bottomRow}>
        <View style={s.stats}>
          {activity.score !== undefined && (
            <View style={s.stat}>
              <Ionicons
                name="trophy"
                size={14}
                color={getScoreColor(activity.score)}
              />
              <Text
                style={[s.statText, { color: getScoreColor(activity.score) }]}
              >
                {activity.score}%
              </Text>
            </View>
          )}
          <View style={s.stat}>
            <Ionicons name="star" size={14} color={COLORS.accent} />
            <Text style={[s.statText, { color: COLORS.accent }]}>
              +{activity.xpEarned} XP
            </Text>
          </View>
          <View style={s.stat}>
            <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
            <Text style={s.statTextMuted}>{activity.duration} min</Text>
          </View>
        </View>
        <Text style={s.timeAgo}>{formatTimeAgo(activity.timestamp)}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  titleArea: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "600",
  },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "500",
  },
  typeLabel: {
    color: COLORS.textDim,
    fontSize: 11,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 13,
    fontWeight: "700",
  },
  statTextMuted: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  timeAgo: {
    color: COLORS.textDim,
    fontSize: 11,
  },
});

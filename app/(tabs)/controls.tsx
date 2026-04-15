import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useChildStore } from "../../stores/childStore";
import { useControlsStore } from "../../stores/controlsStore";
import { COLORS, SUBJECT_COLORS } from "../../constants/colors";

export default function ControlsScreen() {
  const activeChild = useChildStore((s) => s.activeChild)();
  const { getScreenTime, setDailyLimit, toggleLock, schedule } =
    useControlsStore();
  const screenTime = activeChild ? getScreenTime(activeChild.id) : null;

  if (!screenTime || !activeChild) return null;

  const pct =
    screenTime.dailyLimitMinutes > 0
      ? Math.min(screenTime.todayUsedMinutes / screenTime.dailyLimitMinutes, 1)
      : 0;
  const ringColor =
    pct > 0.8 ? COLORS.error : pct > 0.5 ? COLORS.accent : COLORS.success;

  return (
    <SafeAreaView style={s.screen}>
      <ScrollView style={{ flex: 1 }}>
        <View style={s.header}>
          <Text style={s.title}>Temps d'écran</Text>
          <Text style={s.subtitle}>
            Contrôle parental pour {activeChild.name}
          </Text>
        </View>

        <View style={s.ringCard}>
          <View style={s.ringOuter}>
            <View style={[s.ringProgress, { borderColor: ringColor }]} />
            <View style={s.ringCenter}>
              <Text style={s.ringValue}>{screenTime.todayUsedMinutes}</Text>
              <Text style={s.ringLabel}>
                / {screenTime.dailyLimitMinutes} min
              </Text>
            </View>
          </View>
          <Text style={s.ringCaption}>Temps utilisé aujourd'hui</Text>
        </View>

        <View style={s.card}>
          <View style={s.cardHeader}>
            <View style={s.row}>
              <Ionicons name="hourglass" size={18} color={COLORS.primary} />
              <Text style={s.cardTitle}>Limite quotidienne</Text>
            </View>
            <Text style={s.limitValue}>{screenTime.dailyLimitMinutes} min</Text>
          </View>
          <View style={s.buttonsRow}>
            {[30, 60, 90, 120].map((mins) => (
              <TouchableOpacity
                key={mins}
                onPress={() => setDailyLimit(activeChild.id, mins)}
                style={[
                  s.limitBtn,
                  screenTime.dailyLimitMinutes === mins && s.limitBtnActive,
                ]}
              >
                <Text
                  style={[
                    s.limitBtnText,
                    screenTime.dailyLimitMinutes === mins &&
                      s.limitBtnTextActive,
                  ]}
                >
                  {mins}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={s.card}>
          <View style={s.cardHeader}>
            <View style={s.row}>
              <Ionicons
                name={screenTime.isLocked ? "lock-closed" : "lock-open"}
                size={18}
                color={screenTime.isLocked ? COLORS.error : COLORS.success}
              />
              <View style={{ marginLeft: 8 }}>
                <Text style={s.cardTitle}>Verrouiller l'app</Text>
                <Text style={s.cardSubtitle}>
                  {screenTime.isLocked
                    ? "L'accès est bloqué"
                    : "L'enfant peut utiliser l'app"}
                </Text>
              </View>
            </View>
            <Switch
              value={screenTime.isLocked}
              onValueChange={() => toggleLock(activeChild.id)}
              trackColor={{ false: COLORS.border, true: COLORS.error }}
              thumbColor="white"
            />
          </View>
        </View>

        <View style={s.card}>
          <View style={s.row}>
            <Ionicons name="time" size={18} color={COLORS.primary} />
            <Text style={[s.cardTitle, { marginLeft: 8 }]}>
              Créneaux d'étude
            </Text>
          </View>
          {screenTime.studyWindows.map((w, i) => (
            <View key={i} style={s.windowChip}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={COLORS.textMuted}
              />
              <Text style={s.windowText}>
                {w.start} — {w.end}
              </Text>
            </View>
          ))}
        </View>

        <Text style={s.sectionLabel}>Programme de la semaine</Text>
        <View style={s.card}>
          {schedule.map((day, index) => (
            <View
              key={day.day}
              style={[
                s.scheduleRow,
                index < schedule.length - 1 && s.scheduleRowBorder,
              ]}
            >
              <Text style={s.dayLabel}>{day.day}</Text>
              <View style={s.subjectChips}>
                {day.subjects.length > 0 ? (
                  day.subjects.map((subject) => (
                    <View
                      key={subject}
                      style={[
                        s.chip,
                        {
                          backgroundColor: `${SUBJECT_COLORS[subject] ?? COLORS.primary}20`,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          s.chipText,
                          { color: SUBJECT_COLORS[subject] ?? COLORS.primary },
                        ]}
                      >
                        {subject}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={s.restText}>Repos</Text>
                )}
              </View>
            </View>
          ))}
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
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
  cardSubtitle: { color: COLORS.textMuted, fontSize: 12, marginLeft: 8 },
  row: { flexDirection: "row", alignItems: "center" },
  limitValue: { color: COLORS.primary, fontWeight: "700", fontSize: 15 },
  buttonsRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  limitBtn: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  limitBtnActive: { backgroundColor: COLORS.primary },
  limitBtnText: { color: COLORS.textMuted, fontSize: 14, fontWeight: "500" },
  limitBtnTextActive: { color: "#FFF" },
  ringCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  ringOuter: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  ringProgress: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
  },
  ringCenter: { alignItems: "center" },
  ringValue: { color: COLORS.text, fontSize: 28, fontWeight: "700" },
  ringLabel: { color: COLORS.textMuted, fontSize: 12 },
  ringCaption: { color: COLORS.textMuted, fontSize: 14, marginTop: 12 },
  windowChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
  },
  windowText: { color: COLORS.text, fontWeight: "500", fontSize: 14 },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  scheduleRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  dayLabel: { color: COLORS.text, fontWeight: "600", width: 36 },
  subjectChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    flex: 1,
    marginLeft: 8,
  },
  chip: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 11, fontWeight: "500" },
  restText: { color: COLORS.textDim, fontSize: 12, fontStyle: "italic" },
});

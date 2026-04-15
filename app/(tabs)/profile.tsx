import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useChildStore } from "../../stores/childStore";
import { useActivityStore } from "../../stores/activityStore";
import { COLORS } from "../../constants/colors";

export default function ProfileScreen() {
  const { children, activeChildId, setActiveChild } = useChildStore();
  const getTodayMinutes = useActivityStore((s) => s.getTodayMinutes);

  return (
    <SafeAreaView style={s.screen}>
      <ScrollView style={{ flex: 1 }}>
        <View style={s.header}>
          <Text style={s.title}>Mes enfants</Text>
          <Text style={s.subtitle}>
            Sélectionne un profil pour voir son suivi
          </Text>
        </View>

        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {children.map((child) => {
            const isActive = child.id === activeChildId;
            const todayMins = getTodayMinutes(child.id);

            return (
              <TouchableOpacity
                key={child.id}
                onPress={() => setActiveChild(child.id)}
                style={[s.childCard, isActive && s.childCardActive]}
              >
                <View style={s.childTop}>
                  <View style={[s.avatar, isActive && s.avatarActive]}>
                    <Text style={{ fontSize: 28 }}>{child.avatarEmoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={s.nameRow}>
                      <Text style={s.childName}>{child.name}</Text>
                      {isActive && (
                        <View style={s.activeBadge}>
                          <Text style={s.activeBadgeText}>ACTIF</Text>
                        </View>
                      )}
                    </View>
                    <Text style={s.childGrade}>
                      {child.grade} — {child.age} ans
                    </Text>
                  </View>
                  <Ionicons
                    name={isActive ? "checkmark-circle" : "ellipse-outline"}
                    size={24}
                    color={isActive ? COLORS.primary : COLORS.textDim}
                  />
                </View>

                <View style={s.miniStats}>
                  <View style={s.miniStat}>
                    <View style={s.miniStatRow}>
                      <Ionicons name="star" size={14} color={COLORS.accent} />
                      <Text style={s.miniStatValue}>{child.xp}</Text>
                    </View>
                    <Text style={s.miniStatLabel}>XP</Text>
                  </View>
                  <View style={s.miniStat}>
                    <View style={s.miniStatRow}>
                      <Ionicons name="flame" size={14} color={COLORS.error} />
                      <Text style={s.miniStatValue}>{child.streak}</Text>
                    </View>
                    <Text style={s.miniStatLabel}>Série</Text>
                  </View>
                  <View style={s.miniStat}>
                    <View style={s.miniStatRow}>
                      <Ionicons name="cash" size={14} color={COLORS.success} />
                      <Text style={s.miniStatValue}>{child.coins}</Text>
                    </View>
                    <Text style={s.miniStatLabel}>Pièces</Text>
                  </View>
                  <View style={s.miniStat}>
                    <View style={s.miniStatRow}>
                      <Ionicons name="time" size={14} color={COLORS.primary} />
                      <Text style={s.miniStatValue}>{todayMins}</Text>
                    </View>
                    <Text style={s.miniStatLabel}>min/jour</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={s.addChild}>
          <Ionicons
            name="add-circle-outline"
            size={32}
            color={COLORS.textDim}
          />
          <Text style={s.addChildText}>Ajouter un enfant</Text>
        </TouchableOpacity>

        <View style={s.settingsCard}>
          <Text style={s.settingsLabel}>Compte parent</Text>
          {[
            { icon: "settings-outline", label: "Paramètres" },
            { icon: "notifications-outline", label: "Notifications" },
            { icon: "help-circle-outline", label: "Aide & support" },
          ].map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[s.settingsRow, i < 2 && s.settingsRowBorder]}
            >
              <Ionicons
                name={item.icon as any}
                size={20}
                color={COLORS.textMuted}
              />
              <Text style={s.settingsRowText}>{item.label}</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={COLORS.textDim}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>Galac6 Parent v1.0.0</Text>
          <Text style={s.footerSub}>Propulsé par Ekkhara AI Ventures</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  title: { color: COLORS.text, fontSize: 24, fontWeight: "700" },
  subtitle: { color: COLORS.textMuted, fontSize: 14, marginTop: 4 },
  childCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  childCardActive: { borderColor: COLORS.primary },
  childTop: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.border,
    marginRight: 16,
  },
  avatarActive: { backgroundColor: `${COLORS.primary}20` },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  childName: { color: COLORS.text, fontSize: 18, fontWeight: "700" },
  activeBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  activeBadgeText: { color: "#FFF", fontSize: 10, fontWeight: "700" },
  childGrade: { color: COLORS.textMuted, fontSize: 14 },
  miniStats: { flexDirection: "row", marginTop: 16, gap: 8 },
  miniStat: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  miniStatRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  miniStatValue: { color: COLORS.text, fontSize: 14, fontWeight: "700" },
  miniStatLabel: { color: COLORS.textDim, fontSize: 10 },
  addChild: {
    marginHorizontal: 16,
    marginTop: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  addChildText: { color: COLORS.textMuted, marginTop: 8, fontWeight: "500" },
  settingsCard: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  settingsLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingsRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  settingsRowText: {
    color: COLORS.text,
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
  },
  footer: { alignItems: "center", paddingVertical: 24 },
  footerText: { color: COLORS.textDim, fontSize: 12 },
  footerSub: { color: COLORS.textDim, fontSize: 10, marginTop: 4 },
});

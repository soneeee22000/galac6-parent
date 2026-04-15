import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ActivityCard from "../../components/ActivityCard";
import NotificationBanner from "../../components/NotificationBanner";
import { useChildStore } from "../../stores/childStore";
import { useActivityStore } from "../../stores/activityStore";
import { COLORS } from "../../constants/colors";

export default function ActivityFeed() {
  const [refreshing, setRefreshing] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const activeChild = useChildStore((s) => s.activeChild)();
  const getRecentActivities = useActivityStore((s) => s.getRecentActivities);
  const getTodayMinutes = useActivityStore((s) => s.getTodayMinutes);

  const activities = activeChild ? getRecentActivities(activeChild.id, 20) : [];
  const todayMinutes = activeChild ? getTodayMinutes(activeChild.id) : 0;

  useEffect(() => {
    const timer = setTimeout(() => setShowNotif(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <SafeAreaView style={s.screen}>
      {activities.length > 0 && activeChild && (
        <NotificationBanner
          activity={activities[0]}
          childName={activeChild.name}
          visible={showNotif}
          onDismiss={() => setShowNotif(false)}
        />
      )}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>Bonjour !</Text>
          <Text style={s.title}>Suivi de {activeChild?.name ?? "..."}</Text>
        </View>
        <View style={s.profileBadge}>
          <Text style={{ fontSize: 18 }}>{activeChild?.avatarEmoji}</Text>
          <Text style={s.gradeBadge}>{activeChild?.grade}</Text>
        </View>
      </View>

      <View style={s.statsRow}>
        <View style={s.statBox}>
          <Ionicons name="star" size={20} color={COLORS.accent} />
          <Text style={s.statValue}>{activeChild?.xp ?? 0}</Text>
          <Text style={s.statLabel}>XP total</Text>
        </View>
        <View style={s.statBox}>
          <Ionicons name="flame" size={20} color={COLORS.error} />
          <Text style={s.statValue}>{activeChild?.streak ?? 0}</Text>
          <Text style={s.statLabel}>jours de suite</Text>
        </View>
        <View style={s.statBox}>
          <Ionicons name="time" size={20} color={COLORS.primary} />
          <Text style={s.statValue}>{todayMinutes}</Text>
          <Text style={s.statLabel}>min aujourd'hui</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        <Text style={s.sectionLabel}>Activité récente</Text>

        {activities.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="book-outline" size={48} color={COLORS.textDim} />
            <Text style={s.emptyText}>
              Pas encore d'activité.{"\n"}Les sessions apparaîtront ici !
            </Text>
          </View>
        ) : (
          activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "700",
  },
  profileBadge: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  gradeBadge: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
  },
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
    padding: 12,
    alignItems: "center",
  },
  statValue: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 64,
  },
  emptyText: {
    color: COLORS.textMuted,
    marginTop: 12,
    textAlign: "center",
    lineHeight: 20,
  },
});

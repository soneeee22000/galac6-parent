import { View, Text, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SUBJECT_COLORS } from "../constants/colors";
import type { Activity } from "../types";
import { ACTIVITY_TYPE_LABELS } from "../constants/subjects";

interface NotificationBannerProps {
  activity: Activity;
  childName: string;
  visible: boolean;
  onDismiss: () => void;
}

export default function NotificationBanner({
  activity,
  childName,
  visible,
  onDismiss,
}: NotificationBannerProps) {
  const translateY = useRef(new Animated.Value(-120)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -120,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onDismiss());
      }, 4000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [visible, translateY, onDismiss]);

  if (!visible) return null;

  const subjectColor = SUBJECT_COLORS[activity.subject] ?? COLORS.primary;

  return (
    <Animated.View style={[s.container, { transform: [{ translateY }] }]}>
      <View style={s.inner}>
        <View style={s.header}>
          <View style={[s.dot, { backgroundColor: subjectColor }]} />
          <Text style={s.appName}>Galac6 Parent</Text>
          <Text style={s.time}>maintenant</Text>
        </View>
        <Text style={s.title}>
          {childName} vient de terminer un {ACTIVITY_TYPE_LABELS[activity.type]}
        </Text>
        <Text style={s.body}>
          {activity.subject}
          {activity.score !== undefined ? ` — Score: ${activity.score}%` : ""}
          {` — +${activity.xpEarned} XP`}
        </Text>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 12,
    right: 12,
    zIndex: 1000,
  },
  inner: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  appName: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  time: {
    color: COLORS.textDim,
    fontSize: 11,
  },
  title: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  body: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
});

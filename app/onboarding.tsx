import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useChildStore } from "../stores/childStore";
import { COLORS } from "../constants/colors";
import { GRADES } from "../constants/subjects";

type Step = "welcome" | "name" | "grade" | "done";

export default function OnboardingScreen() {
  const [step, setStep] = useState<Step>("welcome");
  const [childName, setChildName] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const { setOnboarded } = useChildStore();

  const finish = () => {
    setOnboarded(true);
    router.replace("/(tabs)");
  };

  if (step === "welcome") {
    return (
      <SafeAreaView style={s.centered}>
        <View style={s.iconCircle}>
          <Ionicons name="sparkles" size={48} color={COLORS.primary} />
        </View>
        <Text style={s.heroTitle}>Bienvenue sur{"\n"}Galac6 Parent</Text>
        <Text style={s.heroSub}>
          Suivez les progrès de votre enfant,{"\n"}recevez des rapports IA
          personnalisés
          {"\n"}et gérez son temps d'écran.
        </Text>
        <TouchableOpacity onPress={() => setStep("name")} style={s.primaryBtn}>
          <Text style={s.primaryBtnText}>Commencer</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={finish} style={s.skipBtn}>
          <Text style={s.skipText}>Passer (données de démo)</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (step === "name") {
    return (
      <SafeAreaView style={s.form}>
        <TouchableOpacity onPress={() => setStep("welcome")}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>
        <Text style={[s.formTitle, { marginTop: 32 }]}>
          Comment s'appelle{"\n"}votre enfant ?
        </Text>
        <TextInput
          value={childName}
          onChangeText={setChildName}
          placeholder="Prénom de l'enfant"
          placeholderTextColor={COLORS.textDim}
          style={s.input}
          autoFocus
        />
        <TouchableOpacity
          onPress={() => childName.trim() && setStep("grade")}
          style={[s.primaryBtn, !childName.trim() && s.disabledBtn]}
          disabled={!childName.trim()}
        >
          <Text
            style={[
              s.primaryBtnText,
              !childName.trim() && { color: COLORS.textDim },
            ]}
          >
            Suivant
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (step === "grade") {
    return (
      <SafeAreaView style={s.form}>
        <TouchableOpacity onPress={() => setStep("name")}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>
        <Text style={[s.formTitle, { marginTop: 32 }]}>
          En quelle classe est{"\n"}
          {childName} ?
        </Text>
        <View style={s.gradeGrid}>
          {GRADES.map((grade) => (
            <TouchableOpacity
              key={grade}
              onPress={() => setSelectedGrade(grade)}
              style={[s.gradeBtn, selectedGrade === grade && s.gradeBtnActive]}
            >
              <Text
                style={[
                  s.gradeBtnText,
                  selectedGrade === grade && { color: "#FFF" },
                ]}
              >
                {grade}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          onPress={() => selectedGrade && setStep("done")}
          style={[s.primaryBtn, !selectedGrade && s.disabledBtn]}
          disabled={!selectedGrade}
        >
          <Text
            style={[
              s.primaryBtnText,
              !selectedGrade && { color: COLORS.textDim },
            ]}
          >
            Suivant
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.centered}>
      <View style={[s.iconCircle, { backgroundColor: `${COLORS.success}20` }]}>
        <Ionicons name="checkmark-circle" size={48} color={COLORS.success} />
      </View>
      <Text style={s.heroTitle}>C'est parti !</Text>
      <Text style={s.heroSub}>
        Le profil de {childName} ({selectedGrade}) est prêt.{"\n"}
        Vous pouvez maintenant suivre ses progrès.
      </Text>
      <TouchableOpacity onPress={finish} style={s.primaryBtn}>
        <Text style={s.primaryBtnText}>Voir le tableau de bord</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  form: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 32,
    paddingTop: 16,
    justifyContent: "center",
  },
  iconCircle: {
    backgroundColor: `${COLORS.primary}20`,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  heroSub: {
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
  },
  formTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "700",
  },
  input: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 24,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 24,
    width: "100%",
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  disabledBtn: {
    backgroundColor: COLORS.surface,
  },
  skipBtn: {
    marginTop: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  gradeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 24,
  },
  gradeBtn: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  gradeBtnActive: {
    backgroundColor: COLORS.primary,
  },
  gradeBtnText: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 15,
  },
});

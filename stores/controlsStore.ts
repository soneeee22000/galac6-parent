import { create } from "zustand";
import type { DaySchedule, ScreenTimeConfig, Subject } from "../types";

interface ControlsState {
  screenTime: Record<string, ScreenTimeConfig>;
  schedule: DaySchedule[];
  getScreenTime: (childId: string) => ScreenTimeConfig;
  setDailyLimit: (childId: string, minutes: number) => void;
  toggleLock: (childId: string) => void;
  setScheduleDay: (dayIndex: number, subjects: Subject[]) => void;
}

const DEFAULT_SCHEDULE: DaySchedule[] = [
  { day: "Lun", subjects: ["Mathématiques", "Français"] },
  { day: "Mar", subjects: ["Sciences", "Anglais"] },
  { day: "Mer", subjects: ["Histoire-Géo"] },
  { day: "Jeu", subjects: ["Mathématiques", "Programmation"] },
  { day: "Ven", subjects: ["Français", "Sciences"] },
  { day: "Sam", subjects: [] },
  { day: "Dim", subjects: [] },
];

const DEFAULT_SCREEN_TIME: ScreenTimeConfig = {
  childId: "",
  dailyLimitMinutes: 60,
  todayUsedMinutes: 35,
  isLocked: false,
  studyWindows: [
    { start: "17:00", end: "19:00" },
    { start: "14:00", end: "16:00" },
  ],
};

export const useControlsStore = create<ControlsState>((set, get) => ({
  screenTime: {
    "child-1": {
      ...DEFAULT_SCREEN_TIME,
      childId: "child-1",
      todayUsedMinutes: 35,
    },
    "child-2": {
      ...DEFAULT_SCREEN_TIME,
      childId: "child-2",
      todayUsedMinutes: 12,
    },
  },
  schedule: DEFAULT_SCHEDULE,

  getScreenTime: (childId: string) => {
    return get().screenTime[childId] ?? { ...DEFAULT_SCREEN_TIME, childId };
  },

  setDailyLimit: (childId: string, minutes: number) =>
    set((state) => ({
      screenTime: {
        ...state.screenTime,
        [childId]: {
          ...(state.screenTime[childId] ?? { ...DEFAULT_SCREEN_TIME, childId }),
          dailyLimitMinutes: minutes,
        },
      },
    })),

  toggleLock: (childId: string) =>
    set((state) => {
      const current = state.screenTime[childId] ?? {
        ...DEFAULT_SCREEN_TIME,
        childId,
      };
      return {
        screenTime: {
          ...state.screenTime,
          [childId]: { ...current, isLocked: !current.isLocked },
        },
      };
    }),

  setScheduleDay: (dayIndex: number, subjects: Subject[]) =>
    set((state) => {
      const newSchedule = [...state.schedule];
      newSchedule[dayIndex] = { ...newSchedule[dayIndex], subjects };
      return { schedule: newSchedule };
    }),
}));

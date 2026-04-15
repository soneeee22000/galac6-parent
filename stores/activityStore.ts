import { create } from "zustand";
import type { Activity } from "../types";
import { MOCK_ACTIVITIES } from "../constants/mockActivities";

interface ActivityState {
  activities: Activity[];
  getActivitiesForChild: (childId: string) => Activity[];
  getRecentActivities: (childId: string, limit?: number) => Activity[];
  getTodayMinutes: (childId: string) => number;
  getWeekActivities: (childId: string) => Activity[];
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: MOCK_ACTIVITIES,

  getActivitiesForChild: (childId: string) => {
    return get()
      .activities.filter((a) => a.childId === childId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
  },

  getRecentActivities: (childId: string, limit = 10) => {
    return get().getActivitiesForChild(childId).slice(0, limit);
  },

  getTodayMinutes: (childId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return get()
      .activities.filter(
        (a) => a.childId === childId && new Date(a.timestamp) >= today,
      )
      .reduce((sum, a) => sum + a.duration, 0);
  },

  getWeekActivities: (childId: string) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return get()
      .activities.filter(
        (a) => a.childId === childId && new Date(a.timestamp) >= weekAgo,
      )
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
  },
}));

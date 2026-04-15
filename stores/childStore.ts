import { create } from "zustand";
import type { Child } from "../types";
import { MOCK_CHILDREN } from "../constants/mockActivities";

interface ChildState {
  children: Child[];
  activeChildId: string | null;
  isOnboarded: boolean;
  activeChild: () => Child | undefined;
  setActiveChild: (id: string) => void;
  addChild: (child: Child) => void;
  setOnboarded: (value: boolean) => void;
}

export const useChildStore = create<ChildState>((set, get) => ({
  children: MOCK_CHILDREN,
  activeChildId: MOCK_CHILDREN[0]?.id ?? null,
  isOnboarded: false,

  activeChild: () => {
    const state = get();
    return state.children.find((c) => c.id === state.activeChildId);
  },

  setActiveChild: (id: string) => set({ activeChildId: id }),

  addChild: (child: Child) =>
    set((state) => ({
      children: [...state.children, child],
      activeChildId: child.id,
    })),

  setOnboarded: (value: boolean) => set({ isOnboarded: value }),
}));

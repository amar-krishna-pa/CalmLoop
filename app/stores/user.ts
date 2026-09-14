import { create } from "zustand";

type UserStore = {
  streak: number | null;
};

export const useUserStore = create<UserStore>(() => ({
  streak: null,
}));

export function incrementStreak() {
  useUserStore.setState((state) => ({
    streak: (state.streak ?? 0) + 1,
  }));
}

export function decrementStreak() {
  useUserStore.setState((state) => ({
    streak: (state.streak ?? 0) - 1,
  }));
}

export function setStreak(streak: number) {
  useUserStore.setState(() => ({ streak }));
}

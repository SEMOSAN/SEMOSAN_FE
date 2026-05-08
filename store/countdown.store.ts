import { create } from "zustand";

type CountdownStore = {
  countdown: number | null;
  onComplete: (() => void) | null;
  start: (onComplete?: () => void) => void;
  dismiss: () => void;
  tick: () => void;
};

export const useCountdownStore = create<CountdownStore>((set, get) => ({
  countdown: null,
  onComplete: null,
  start: (onComplete) => set({ countdown: 3, onComplete: onComplete ?? null }),
  dismiss: () => set({ countdown: null, onComplete: null }),
  tick: () => {
    const { countdown, onComplete } = get();
    if (countdown === null) return;
    if (countdown <= 1) {
      set({ countdown: null, onComplete: null });
      onComplete?.();
    } else {
      set({ countdown: countdown - 1 });
    }
  },
}));

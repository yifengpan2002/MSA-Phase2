import { create } from "zustand";
import { api } from "../api/api";
import type { DailyStatus, StarType } from "../types";

interface EnergyState {
  energy: number;
  daily: DailyStatus | null;
  stars: StarType[];
  status: "idle" | "loading" | "ready" | "error";
  isClaiming: boolean;
  purchasingId: string | null;
  error: string | null;
  lastClaimAmount: number | null;

  fetchDaily: () => Promise<void>;
  claimDaily: () => Promise<void>;
  fetchStars: () => Promise<void>;
  purchase: (starTypeId: string) => Promise<void>;
  setEnergy: (energy: number) => void;
  dismissClaim: () => void;
  clearError: () => void;
}

export const useEnergyStore = create<EnergyState>((set, get) => ({
  energy: 0,
  daily: null,
  stars: [],
  status: "idle",
  isClaiming: false,
  purchasingId: null,
  error: null,
  lastClaimAmount: null,

  fetchDaily: async () => {
    set({ status: "loading", error: null });
    try {
      const daily = await api.getDailyStatus();
      set({ daily, energy: daily.energy, status: "ready" });
    } catch (error) {
      set({ error: (error as Error).message, status: "error" });
    }
  },

  claimDaily: async () => {
    set({ isClaiming: true, error: null });
    try {
      const result = await api.claimDaily();
      set({
        energy: result.energy,
        lastClaimAmount: result.energyAwarded,
        isClaiming: false,
        daily: {
          canClaimToday: false,
          currentStreak: result.currentStreak,
          longestStreak: result.longestStreak,
          nextReward: 0,
          energy: result.energy,
          lastClaimUtc: new Date().toISOString(),
        },
      });
    } catch (error) {
      set({ error: (error as Error).message, isClaiming: false });
    }
  },

  fetchStars: async () => {
    set({ status: "loading", error: null });
    try {
      set({ stars: await api.getStars(), status: "ready" });
    } catch (error) {
      set({ error: (error as Error).message, status: "error" });
    }
  },

  purchase: async (starTypeId) => {
    set({ purchasingId: starTypeId, error: null });
    try {
      const result = await api.purchaseStar(starTypeId);
      set({
        energy: result.energy,
        purchasingId: null,
        stars: get().stars.map((star) =>
          star.id === starTypeId
            ? { ...star, ownedCount: result.ownedCount }
            : star,
        ),
      });
    } catch (error) {
      set({ error: (error as Error).message, purchasingId: null });
    }
  },

  setEnergy: (energy) => set({ energy }),
  dismissClaim: () => set({ lastClaimAmount: null }),
  clearError: () => set({ error: null }),
}));

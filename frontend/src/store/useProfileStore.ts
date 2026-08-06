import { create } from "zustand";
import { api } from "../api/api";
import { fileToAvatarDataUrl } from "../helper/image";
import type { Profile } from "../types";

interface ProfileState {
  profile: Profile | null;
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;
  isUploading: boolean;

  fetchProfile: () => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  clearError: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  status: "idle",
  error: null,
  isUploading: false,

  fetchProfile: async () => {
    set({ status: "loading", error: null });
    try {
      set({ profile: await api.getMyProfile(), status: "ready" });
    } catch (error) {
      set({ error: (error as Error).message, status: "error" });
    }
  },

  uploadAvatar: async (file) => {
    set({ isUploading: true, error: null });
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      set({ profile: await api.updateAvatar(dataUrl), isUploading: false });
    } catch (error) {
      set({ error: (error as Error).message, isUploading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

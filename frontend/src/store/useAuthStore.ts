import { create } from "zustand";
import { api } from "../api/api";
import type { User } from "../types";
import type { AuthState } from "../types";

const TOKEN_KEY = "orbit.token";
const USER_KEY = "orbit.user";

function loadUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: loadUser(),
  token: localStorage.getItem(TOKEN_KEY),
  isSubmitting: false,
  error: null,

  login: async (username, password) => {
    set({ isSubmitting: true, error: null });
    try {
      const { token, user } = await api.login({ username, password });
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ token, user, isSubmitting: false });
      return true;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return false;
    }
  },

  register: async (username, password) => {
    set({ isSubmitting: true, error: null });
    try {
      const { token, user } = await api.register({ username, password });
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ token, user, isSubmitting: false });
      return true;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ token: null, user: null, error: null });
  },

  clearError: () => set({ error: null }),
}));

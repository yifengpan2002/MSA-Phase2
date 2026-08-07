import { create } from "zustand";
import { api } from "../api/api";
import type { Post, SortOrder } from "../types";

interface PostState {
  posts: Post[];
  sort: SortOrder;
  search: string;
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;

  fetchPosts: () => Promise<void>;
  setSort: (sort: SortOrder) => void;
  setSearch: (search: string) => void;
  toggleSupport: (postId: string) => Promise<void>;
  clearError: () => void;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  sort: "newest",
  search: "",
  status: "idle",
  error: null,

  fetchPosts: async () => {
    set({ status: "loading", error: null });
    try {
      set({
        posts: await api.listPosts(get().sort, get().search),
        status: "ready",
      });
    } catch (error) {
      set({ error: (error as Error).message, status: "error" });
    }
  },
  toggleSupport: async (postId: string) => {
    try {
      const result = await api.toggleSupport(postId);
      set({
        posts: get().posts.map((p) =>
          p.id === postId ? { ...p, supportCount: result.energyCount } : p,
        ),
      });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  setSort: (sort) => {
    set({ sort });
  },
  setSearch: (search) => set({ search }),
  clearError: () => set({ error: null }),
}));

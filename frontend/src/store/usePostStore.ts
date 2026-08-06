import { create } from "zustand";
import { api } from "../api/api";
import type { Post, SortOrder } from "../types";

interface PostState {
  posts: Post[];
  sort: SortOrder;
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;

  fetchPosts: () => Promise<void>;
  setSort: (sort: SortOrder) => Promise<void>;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  sort: "newest",
  status: "idle",
  error: null,

  fetchPosts: async () => {
    set({ status: "loading", error: null });
    try {
      set({ posts: await api.listPosts(get().sort), status: "ready" });
    } catch (error) {
      set({ error: (error as Error).message, status: "error" });
    }
  },

  setSort: async (sort) => {
    set({ sort });
    await get().fetchPosts();
  },
}));

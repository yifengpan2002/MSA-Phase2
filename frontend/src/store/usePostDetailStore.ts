import { create } from "zustand";
import { api } from "../api/api";
import type { PostDetail } from "../types";

interface PostDetailState {
  post: PostDetail | null;
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;
  isSubmitting: boolean;

  fetchPost: (id: string) => Promise<void>;
  addComment: (body: string) => Promise<boolean>;
  deleteComment: (commentId: string) => Promise<void>;
  reset: () => void;
  clearError: () => void;
}

export const usePostDetailStore = create<PostDetailState>((set, get) => ({
  post: null,
  status: "idle",
  error: null,
  isSubmitting: false,

  fetchPost: async (id) => {
    set({ status: "loading", error: null });
    try {
      set({ post: await api.getPost(id), status: "ready" });
    } catch (error) {
      set({ error: (error as Error).message, status: "error" });
    }
  },

  addComment: async (body) => {
    const post = get().post;
    if (!post) return false;

    set({ isSubmitting: true, error: null });
    try {
      const comment = await api.addComment(post.id, body);
      set({
        post: { ...post, comments: [...post.comments, comment] },
        isSubmitting: false,
      });
      return true;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return false;
    }
  },

  deleteComment: async (commentId) => {
    const post = get().post;
    if (!post) return;

    try {
      await api.deleteComment(post.id, commentId);
      set({
        post: {
          ...post,
          comments: post.comments.filter((c) => c.id !== commentId),
        },
      });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  reset: () => set({ post: null, status: "idle", error: null }),

  clearError: () => set({ error: null }),
}));

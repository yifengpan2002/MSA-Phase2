import {
  type Comment,
  type PostDetail,
  type AuthResponse,
  type Profile,
  type SortOrder,
  type Post,
  type SupportResult,
  type DailyStatus,
  type ClaimResult,
  type GalaxyPlanet,
  type StarType,
} from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(localStorage.getItem("orbit.token")
          ? { Authorization: `Bearer ${localStorage.getItem("orbit.token")}` }
          : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new Error("Can't reach the server. Is the API running?");
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (data?.message) message = data.message;
    } catch {
      /* body wasn't JSON */
    }
    throw new Error(message);
  }

  return response.status === 204
    ? (undefined as T)
    : ((await response.json()) as T);
}

export const api = {
  register: (body: { username: string; password: string }) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: { username: string; password: string }) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getMyProfile: () => request<Profile>("/users/me"),

  updateAvatar: (avatarUrl: string) =>
    request<Profile>("/users/me/avatar", {
      method: "PUT",
      body: JSON.stringify({ avatarUrl }),
    }),
  createPost: (body: { title: string; body: string }) =>
    request<Post>("/posts", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  listPosts: (sort: SortOrder = "newest") =>
    request<Post[]>(`/posts?sort=${sort}`),
  getPost: (id: string) => request<PostDetail>(`/posts/${id}`),
  addComment: (postId: string, body: string) =>
    request<Comment>(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),
  deleteComment: (postId: string, commentId: string) =>
    request<void>(`/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
    }),

  getDailyStatus: () => request<DailyStatus>("/energy/daily"),

  claimDaily: () =>
    request<ClaimResult>("/energy/daily/claim", { method: "POST" }),

  getStars: () => request<StarType[]>("/store/stars"),

  getMyGalaxy: () => request<GalaxyPlanet[]>("/users/me/galaxy"),

  purchaseStar: (id: string) =>
    request<{ energy: number; ownedCount: number }>(
      `/store/stars/${id}/purchase`,
      {
        method: "POST",
      },
    ),

  toggleSupport: (postId: string) =>
    request<SupportResult>(`/posts/${postId}/support`, { method: "POST" }),
};

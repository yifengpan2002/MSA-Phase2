import type { AuthResponse } from "../types";

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
};

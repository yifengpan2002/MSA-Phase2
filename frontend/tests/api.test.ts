import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../src/api/api";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const fetchMock = vi.fn();

beforeEach(() => {
  localStorage.clear();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("api auth", () => {
  it("registers a new user", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        token: "register-token",
        user: {
          id: "user-1",
          username: "apitest01",
          createdUtc: "2026-08-08T00:00:00Z",
        },
      }),
    );

    const result = await api.register({
      username: "apitest01",
      password: "password123",
    });

    expect(result.token).toBe("register-token");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:5000/api/auth/register",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          username: "apitest01",
          password: "password123",
        }),
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("logs in an existing user", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        token: "login-token",
        user: {
          id: "user-1",
          username: "demo",
          createdUtc: "2026-08-08T00:00:00Z",
        },
      }),
    );

    const result = await api.login({
      username: "demo",
      password: "password123",
    });

    expect(result.token).toBe("login-token");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:5000/api/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          username: "demo",
          password: "password123",
        }),
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });
});

describe("api client", () => {
  it("adds the auth token when requesting the current profile", async () => {
    localStorage.setItem("orbit.token", "test-token");
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        id: "user-1",
        username: "demo",
        avatarUrl: null,
        createdUtc: "2026-08-08T00:00:00Z",
        postCount: 0,
        totalEnergy: 25,
        posts: [],
      }),
    );

    await api.getMyProfile();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:5000/api/users/me",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("builds post list query parameters for sorting and searching", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]));

    await api.listPosts("hottest", "planet diary");

    const [url] = fetchMock.mock.calls[0];

    expect(url).toBe(
      "http://localhost:5000/api/posts?sort=hottest&search=planet+diary",
    );
  });

  it("uses backend error messages when a request fails", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ message: "You need more energy." }, 400),
    );

    await expect(api.purchaseStar("star-1")).rejects.toThrow(
      "You need more energy.",
    );
  });

  it("throws a friendly message when the server cannot be reached", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Network down"));

    await expect(api.getStars()).rejects.toThrow(
      "Can't reach the server. Is the API running?",
    );
  });
});

describe("api posts and comments", () => {
  it("creates a new post", async () => {
    localStorage.setItem("orbit.token", "fake-token");
    fetchMock.mockResolvedValueOnce(
      jsonResponse(
        {
          id: "post-1",
          title: "Test post",
          body: "A test post",
          authorId: "user-1",
          authorName: "demo",
          supportCount: 0,
          createdUtc: "2026-08-08T00:00:00Z",
        },
        201,
      ),
    );

    const result = await api.createPost({
      title: "Test post",
      body: "A test post",
    });

    expect(result.id).toBe("post-1");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:5000/api/posts",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          title: "Test post",
          body: "A test post",
        }),
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer fake-token",
        }),
      }),
    );
  });

  it("adds a comment to a post", async () => {
    localStorage.setItem("orbit.token", "fake-token");
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        id: "comment-1",
        body: "This is my API test comment.",
        authorId: "user-1",
        authorName: "demo",
        authorAvatarUrl: null,
        createdUtc: "2026-08-08T00:00:00Z",
      }),
    );

    const result = await api.addComment(
      "post-1",
      "This is my API test comment.",
    );

    expect(result.id).toBe("comment-1");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:5000/api/posts/post-1/comments",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          body: "This is my API test comment.",
        }),
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer fake-token",
        }),
      }),
    );
  });
});

describe("api store", () => {
  it("gets store planets", async () => {
    localStorage.setItem("orbit.token", "fake-token");
    fetchMock.mockResolvedValueOnce(
      jsonResponse([
        {
          id: "star-1",
          name: "Purple Planet",
          description: "A strange purple world.",
          cost: 375,
          imageUrl: null,
          colorHex: "#8f7cff",
          modelUrl: "/models/purple.glb",
          ownedCount: 0,
        },
      ]),
    );

    const result = await api.getStars();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Purple Planet");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:5000/api/store/stars",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer fake-token",
        }),
      }),
    );
  });

  it("buys a planet", async () => {
    localStorage.setItem("orbit.token", "fake-token");
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        energy: 100,
        ownedCount: 1,
      }),
    );

    const result = await api.purchaseStar("star-1");

    expect(result.energy).toBe(100);
    expect(result.ownedCount).toBe(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:5000/api/store/stars/star-1/purchase",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer fake-token",
        }),
      }),
    );
  });
});

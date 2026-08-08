export interface User {
  id: string;
  username: string;
  createdUtc: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isSubmitting: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export interface ProfilePostSummary {
  id: string;
  title: string;
  energyCount: number;
  createdUtc: string;
}

export interface Profile {
  id: string;
  username: string;
  avatarUrl: string | null;
  createdUtc: string;
  postCount: number;
  totalEnergy: number;
  posts: ProfilePostSummary[];
}

export interface Comment {
  id: string;
  body: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  createdUtc: string;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  supportCount: number;
  createdUtc: string;
}

export interface PostDetail {
  id: string;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  energyCount: number;
  createdUtc: string;
  comments: Comment[];
}

export type SortOrder = "newest" | "hottest";

export interface DailyStatus {
  canClaimToday: boolean;
  currentStreak: number;
  longestStreak: number;
  nextReward: number;
  energy: number;
  lastClaimUtc: string | null;
}

export interface ClaimResult {
  energyAwarded: number;
  currentStreak: number;
  longestStreak: number;
  energy: number;
  streakReset: boolean;
}

export interface StarType {
  id: string;
  name: string;
  description: string;
  cost: number;
  imageUrl: string;
  colorHex: string;
  modelUrl: string | null;
  ownedCount: number;
}

export interface GalaxyPlanet {
  id: string;
  starTypeId: string;
  name: string;
  colorHex: string;
  modelUrl: string | null;
  modelScale: number;
  acquiredUtc: string;
}

export interface GalaxyLeaderboardEntry {
  userId: string;
  username: string;
  avatarUrl: string | null;
  planetCount: number;
  totalEnergySpent: number;
  rank: number;
}

export interface GalaxyLeaderboardResponse {
  topUsers: GalaxyLeaderboardEntry[];
  currentUser: GalaxyLeaderboardEntry | null;
  totalUsers: number;
}

export interface SupportResult {
  energyCount: number;
  supportedByMe: boolean;
}

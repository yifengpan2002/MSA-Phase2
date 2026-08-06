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

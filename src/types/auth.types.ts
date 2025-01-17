import { User } from ".";

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null; // For simulation purposes
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

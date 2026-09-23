import axiosClient from "./axiosClient";

export type UserRole = "JOB_SEEKER" | "HR" | "COMPANY_ADMIN" | "SUPER_ADMIN";

export interface UserCreate {
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserOut {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

/**
 * Register a new user account.
 */
export async function registerUser(data: UserCreate): Promise<UserOut> {
  const response = await axiosClient.post<UserOut>("/auth/register", data);
  return response.data;
}

/**
 * Authenticate user with credentials and store access token.
 */
export async function loginUser(credentials: UserLogin): Promise<Token> {
  const response = await axiosClient.post<Token>("/auth/login", credentials);
  const tokenData = response.data;
  if (tokenData?.access_token && typeof window !== "undefined") {
    localStorage.setItem("token", tokenData.access_token);
    localStorage.setItem("access_token", tokenData.access_token);
  }
  return tokenData;
}

/**
 * Fetch details of the currently authenticated user.
 */
export async function getCurrentUser(): Promise<UserOut> {
  const response = await axiosClient.get<UserOut>("/auth/me");
  return response.data;
}

/**
 * Logout user by clearing stored auth tokens.
 */
export function logoutUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
  }
}

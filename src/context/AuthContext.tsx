import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  type UserCreate,
  type UserLogin,
  type UserOut,
} from "@/api/auth";

interface AuthContextType {
  user: UserOut | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: UserLogin) => Promise<void>;
  register: (data: UserCreate) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token") || localStorage.getItem("access_token");
  });

  // Enterprise-grade user caching via TanStack Query: deduplicates /auth/me calls
  const {
    data: user = null,
    isLoading: isUserLoading,
    refetch,
  } = useQuery<UserOut | null>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const storedToken = localStorage.getItem("token") || localStorage.getItem("access_token");
      if (!storedToken) {
        return null;
      }
      try {
        return await getCurrentUser();
      } catch (err) {
        logoutUser();
        setToken(null);
        return null;
      }
    },
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    // Listen for unauthorized events emitted by Axios interceptor
    const handleUnauthorized = () => {
      setToken(null);
      queryClient.setQueryData(["auth", "me"], null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [queryClient]);

  const login = async (credentials: UserLogin) => {
    const res = await loginUser(credentials);
    setToken(res.access_token);
    await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
  };

  const register = async (data: UserCreate) => {
    await registerUser(data);
    await login({ email: data.email, password: data.password });
  };

  const logout = () => {
    logoutUser();
    setToken(null);
    queryClient.setQueryData(["auth", "me"], null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading: Boolean(token) && isUserLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        refreshUser: async () => {
          await refetch();
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

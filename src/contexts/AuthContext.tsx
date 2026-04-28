import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Role, User } from "@/types";
import { api } from "@/lib/api";
import { mapUser, roleToBackendRole, type AuthResponse } from "@/lib/backend";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { fullName: string; email: string; password: string; role: Role }) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("emit_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const persist = (u: User, token: string) => {
    localStorage.setItem("emit_token", token);
    localStorage.setItem("emit_user", JSON.stringify(u));
    setUser(u);
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
    const mappedUser = mapUser(data.user);
    persist(mappedUser, data.accessToken);
    return mappedUser;
  };

  const register: AuthContextValue["register"] = async (payload) => {
    const { data } = await api.post<AuthResponse>("/auth/register", {
      email: payload.email,
      password: payload.password,
      fullName: payload.fullName,
      role: roleToBackendRole(payload.role),
    });
    const mappedUser = mapUser(data.user);
    persist(mappedUser, data.accessToken);
    return mappedUser;
  };

  const logout = () => {
    localStorage.removeItem("emit_token");
    localStorage.removeItem("emit_user");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

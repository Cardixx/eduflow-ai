import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Role, User } from "@/types";
import { USE_MOCK, api } from "@/lib/api";
import { mockUsers } from "@/lib/mockData";

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
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 600));
      const entry = mockUsers[email.toLowerCase()];
      if (!entry || entry.password !== password) throw new Error("Identifiants invalides");
      persist(entry.user, "mock-jwt-token");
      return entry.user;
    }
    const { data } = await api.post("/auth/login", { email, password });
    persist(data.user, data.token);
    return data.user as User;
  };

  const register: AuthContextValue["register"] = async (payload) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 700));
      const u: User = { id: Date.now(), email: payload.email, fullName: payload.fullName, role: payload.role };
      persist(u, "mock-jwt-token");
      return u;
    }
    const { data } = await api.post("/auth/register", payload);
    persist(data.user, data.token);
    return data.user as User;
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

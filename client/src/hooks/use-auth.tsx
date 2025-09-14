import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getToken, setToken, getUser, setUser, clearAuth, type AuthUser } from "@/lib/auth";

export type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(() => getUser());
  const [token, setTokenState] = useState<string | null>(() => getToken());

  useEffect(() => {
    // Keep localStorage in sync
    setUser(user);
    setToken(token);
  }, [user, token]);

  const login = (tk: string, usr: AuthUser) => {
    setTokenState(tk);
    setUserState(usr);
  };

  const logout = () => {
    clearAuth();
    setTokenState(null);
    setUserState(null);
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);
  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

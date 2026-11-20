import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api";

const STORAGE_KEY = "portfolio-auth";
const AuthContext = createContext(null);

function readStoredSession() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return stored && stored.token ? stored : null;
  } catch {
    return null;
  }
}

function storeSession(session) {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode); the session then lasts for this tab only.
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  // While a stored token is being checked against the server.
  const [checking, setChecking] = useState(() => Boolean(readStoredSession()));

  const signOut = useCallback(() => {
    setSession(null);
    storeSession(null);
    apiRequest("/auth/signout").catch(() => {});
  }, []);

  // Re-check a stored token so an expired token or a removed admin role is noticed.
  useEffect(() => {
    const stored = readStoredSession();
    if (!stored) return;
    const controller = new AbortController();
    apiRequest("/auth/me", { token: stored.token, signal: controller.signal })
      .then((user) => {
        const next = { token: stored.token, user };
        setSession(next);
        storeSession(next);
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        if (error.status === 401) {
          setSession(null);
          storeSession(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setChecking(false);
      });
    return () => controller.abort();
  }, []);

  const signIn = useCallback(async (email, password) => {
    const data = await apiRequest("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const next = { token: data.token, user: data.user };
    setSession(next);
    storeSession(next);
    return data.user;
  }, []);

  const value = useMemo(
    () => ({
      token: session?.token || null,
      user: session?.user || null,
      isAdmin: session?.user?.role === "admin",
      checking,
      signIn,
      signOut,
    }),
    [session, checking, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth must be used within AuthProvider.");
  return auth;
}

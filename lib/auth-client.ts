"use client";

import { useState, useEffect } from "react";

export interface User {
  name: string;
  email: string;
}

export interface Session {
  user: User;
}

// Client session lookup with localStorage
const getUsers = (): Record<string, { name: string; email: string; password?: string }> => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("momentum_users") || "{}");
  } catch {
    return {};
  }
};

const saveUser = (user: { name: string; email: string; password?: string }) => {
  if (typeof window === "undefined") return;
  const users = getUsers();
  users[user.email.toLowerCase()] = user;
  localStorage.setItem("momentum_users", JSON.stringify(users));
};

const getSession = (): Session | null => {
  if (typeof window === "undefined") return null;
  try {
    const sess = localStorage.getItem("momentum_session");
    return sess ? JSON.parse(sess) : null;
  } catch {
    return null;
  }
};

const setSession = (session: Session | null) => {
  if (typeof window === "undefined") return;
  if (session) {
    localStorage.setItem("momentum_session", JSON.stringify(session));
  } else {
    localStorage.removeItem("momentum_session");
  }
};

export const signIn = {
  social: async ({ provider, callbackURL }: { provider: string; callbackURL: string }) => {
    // Generate a mock user dynamically
    const name = provider === "google" ? "Alex Rivera" : "Jordan Chen";
    const email = `${provider}_user@example.com`;
    setSession({ user: { name, email } });
    if (typeof window !== "undefined" && callbackURL) {
      window.location.href = callbackURL;
    }
    return { data: { user: { name, email } }, error: null };
  },
  email: async ({ email, password, callbackURL }: any) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    if (!email || !email.includes("@")) {
      return { data: null, error: { message: "Please enter a valid email address." } };
    }
    if (!password || password.length < 8) {
      return { data: null, error: { message: "Password must be at least 8 characters." } };
    }

    const users = getUsers();
    const user = users[email.toLowerCase()];
    if (!user || user.password !== password) {
      return { data: null, error: { message: "Invalid email or matching password." } };
    }
    
    const sessionUser = { name: user.name, email: user.email };
    setSession({ user: sessionUser });
    
    if (typeof window !== "undefined" && callbackURL) {
      window.location.href = callbackURL;
    }
    return { data: { user: sessionUser }, error: null };
  }
};

export const signUp = {
  email: async ({ name, email, password, callbackURL }: any) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    if (!name || name.trim().length === 0) {
      return { data: null, error: { message: "Full name is required." } };
    }
    if (!email || !email.includes("@")) {
      return { data: null, error: { message: "Please enter a valid email address." } };
    }
    if (!password || password.length < 8) {
      return { data: null, error: { message: "Password must be at least 8 characters." } };
    }
    
    const users = getUsers();
    if (users[email.toLowerCase()]) {
      return { data: null, error: { message: "This email is already registered." } };
    }
    
    saveUser({ name, email, password });
    const sessionUser = { name, email };
    setSession({ user: sessionUser });
    
    if (typeof window !== "undefined" && callbackURL) {
      window.location.href = callbackURL;
    }
    return { data: { user: sessionUser }, error: null };
  }
};

export const signOut = async () => {
  setSession(null);
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};

export const useSession = () => {
  const [session, setSessionState] = useState<Session | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    // Perform session retrieval asynchronously out of main render pipeline
    const checkSession = async () => {
      const activeSession = getSession();
      setSessionState(activeSession);
      setIsPending(false);
    };
    checkSession();
  }, []);

  return {
    data: session,
    isPending,
  };
};

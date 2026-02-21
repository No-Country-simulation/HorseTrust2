"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SessionUser {
  id: string;
  email: string;
  avatar_url?: string | null;
  first_name: string;
  last_name: string;
  role: string;
}

interface AuthState {
  user: SessionUser | null;
  isAuthenticated: boolean;
  setUser: (user: SessionUser) => void;
  updateUser: (user: Partial<SessionUser>) => void;
  logout: () => void;
}

export const useSession = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      updateUser: (partialUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partialUser } : null,
        })),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-session",
    }
  )
);
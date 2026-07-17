import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (userData, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
    set({ user: userData, token, isAuthenticated: true });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
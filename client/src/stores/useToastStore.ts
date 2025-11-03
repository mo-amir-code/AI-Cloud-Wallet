import { create } from "zustand";

export type ToastStatus = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  status: ToastStatus;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, status: ToastStatus, duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, status, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, message, status, duration };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}));

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { AppStoreActions, AppStoreState } from "../@types/zustand";

const useAppStore = create<AppStoreState & AppStoreActions>()(
  immer((set) => ({
    isMenuOpen: false,
    setIsMenuOpen: (status: boolean) =>
      set((state) => {
        state.isMenuOpen = status;
      }),
  }))
);

export { useAppStore };

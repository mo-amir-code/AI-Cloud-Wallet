import { create } from 'zustand';
import type { AppStoreActionsType, AppStoreStatesType } from '../types/zustand';


export const useAppStore = create<AppStoreStatesType & AppStoreActionsType>((set) => ({
    isSidebarOpen: true,
    isAIModalOpen: false,
    toggleSidebar: () => set((state) => {
        return { isSidebarOpen: !state.isSidebarOpen }
    }),
    toggleAIModal: () => set((state) => {
        return { isAIModalOpen: !state.isAIModalOpen }
    }),
}));
import { create } from 'zustand';
import type { AppStoreActionsType, AppStoreStatesType } from '../types/zustand';


export const useAppStore = create<AppStoreStatesType & AppStoreActionsType>((set) => ({
    isSidebarOpen: window.innerWidth >= 768, // Close on mobile, open on desktop
    isAIModalOpen: false,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    toggleAIModal: () => set((state) => ({ isAIModalOpen: !state.isAIModalOpen })),
}));
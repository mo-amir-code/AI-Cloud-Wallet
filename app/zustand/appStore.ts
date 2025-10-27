import { AlertToastType, AppStoreActionsType, AppStoreStatesType } from '@/types/zustand';
import { create } from 'zustand';


export const useAppStore = create<AppStoreStatesType & AppStoreActionsType>((set) => ({
    toast: null,
    setToast: (error: AlertToastType | null) => set({ toast: error }),
}));

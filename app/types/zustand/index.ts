import { StatusType } from "@/components/modals/AlertModal";
import { MyTokenDataType } from "../tokens";

// User info type
type UserInfoType = {
    id: string;
    name: string;
    email: string;
    photoUrl: string | null;
    wallet: {
        publicKey: string;
        privateKey: string | null;
    };
};

// Contact type
type ContactType = {
    id: string;
    name: string;
    imageUri: string | null;
    walletAddress: string;
};

type NetworkType = "devnet" | "mainnet";

// ✅ Settings type
type SettingsType = {
    mode: NetworkType
};

// ----------------------------
// USER STORE TYPES
// ----------------------------

type UserStoreStatesType = {
    isUserLoggedIn: boolean;
    userInfo: UserInfoType | null;
    totalBalance: number;
    tokens: MyTokenDataType[];
    contacts: ContactType[];
    settings: SettingsType | null; // ✅ added settings
};

type UserStoreActionsType = {
    setUserInfo: (userInfo: UserInfoType | null) => void;
    clearUserInfo: () => void;
    updateTotalBalance: (balance: number) => void;
    updateTokenBalance: (mintAddress: string, amount: number) => void;
    setTokens: (tokens: MyTokenDataType[]) => void;
    setUserAuthStatus: (status: boolean) => void;
    setContacts: (contacts: ContactType[]) => void;
    updateContact: (contactId: string, updatedData: Partial<ContactType>) => void;

    // ✅ Settings actions
    setSettings: (settings: SettingsType) => void;
    updateSettings: (updatedData: Partial<SettingsType>) => void;
};

// ----------------------------
// APP STORE TYPES
// ----------------------------

type AlertToastType = {
    status: StatusType;
    title: string;
    content: string;
};

type AppStoreStatesType = {
    toast: AlertToastType | null;
};

type AppStoreActionsType = {
    setToast: (error: AlertToastType | null) => void;
};

// ----------------------------
// EXPORTS
// ----------------------------

export type {
    AlertToastType,
    AppStoreActionsType,
    AppStoreStatesType,
    ContactType, NetworkType, SettingsType, UserInfoType,
    UserStoreActionsType,
    UserStoreStatesType
};


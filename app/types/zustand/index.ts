import { StatusType } from "@/components/modals/AlertModal";
import { MyTokenDataType } from "../tokens";

type UserInfoType = {
    id: string;
    name: string;
    email: string;
    photoUrl: string | null;
    wallet: {
        publicKey: string;
        privateKey: string | null;
    }
}

type ContactType = {
    id: string
    name: string
    imageUri: string | null
    walletAddress: string
}


type UserStoreStatesType = {
    isUserLoggedIn: boolean;
    userInfo: UserInfoType | null;
    totalBalance: number;
    tokens: MyTokenDataType[];
    contacts: ContactType[]
}

type UserStoreActionsType = {
    setUserInfo: (userInfo: UserInfoType) => void;
    clearUserInfo: () => void;
    updateTotalBalance: (balance: number) => void;
    updateTokenBalance: (mintAddress: string, amount: number) => void;
    setTokens: (tokens: MyTokenDataType[]) => void
    setUserAuthStatus: (status: boolean) => void
    setContacts: (contacts: ContactType[]) => void
    updateContact: (contactId: string, updatedData: Partial<ContactType>) => void
}


type AlertToastType = {
    status: StatusType
    title: string
    content: string
}

type AppStoreStatesType = {
    toast: AlertToastType | null
}

type AppStoreActionsType = {
    setToast: (error: AlertToastType | null) => void
}


export type { AlertToastType, AppStoreActionsType, AppStoreStatesType, ContactType, UserInfoType, UserStoreActionsType, UserStoreStatesType };


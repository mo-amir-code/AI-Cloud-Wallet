// User info type
export type UserInfoType = {
    id: string;
    name: string;
    email: string;
    photoUrl: string | null;
    wallet: {
        publicKey: string;
        privateKey: string | null;
    };
};

export type UserSettingsType = {
    mode: NetworkType;
};

// Contact type
export type ContactType = {
    id: string;
    name: string;
    imageUri: string | null;
    walletAddress: string;
};

export type NetworkType = "devnet" | "mainnet";

// Settings type
export type SettingsType = {
    mode: NetworkType;
};

// Token types
export type TokenMetadataType = {
    name: string;
    symbol: string;
    // Updated: use mint and logo to align with fetched token shape
    mint: string;
    logo: string | null;
};

export type MyTokenDataType = TokenMetadataType & {
    // Formatted human-readable balance (e.g., "4.500000")
    balance: string;
    // Raw on-chain amount and decimals
    rawBalance: number;
    decimals: number;
    // Computed USD value and 24h change
    value: number;
    priceChange24h: number;
    // 24-hour profit/loss in USD
    profitLoss24h: number;
    tokenProgramId: string
};

export type PriceType = {
    price: {
        usd: number;
        inr: number;
    };
};

// User Store State Types
export type UserStoreStatesType = {
    isUserLoggedIn: boolean;
    userInfo: UserInfoType | null;
    totalBalance: number;
    tokens: MyTokenDataType[];
    contacts: ContactType[];
    settings: SettingsType | null;
};

// User Store Actions Types
export type UserStoreActionsType = {
    login: (userInfo: UserInfoType) => void;
    logout: () => void;
    setUserInfo: (userInfo: UserInfoType | null) => void;
    setTotalBalance: (balance: number) => void;
    setTokens: (tokens: MyTokenDataType[]) => void;
    addContact: (contact: ContactType) => void;
    removeContact: (contactId: string) => void;
    updateContacts: (contacts: ContactType[]) => void;
    setSettings: (settings: SettingsType) => void;
    updateNetworkMode: (mode: NetworkType) => void;
};

export type UserStoreType = UserStoreStatesType & UserStoreActionsType;

// Transaction types
export type TransactionType = "Sent" | "Received" | "Swap";

export type TransactionStatus = "Completed" | "Pending" | "Failed";

export type TransactionInfo = {
  type: TransactionType;
  address: string;
  amount: string;
  date: string;
  status: TransactionStatus;
  signature: string;
};

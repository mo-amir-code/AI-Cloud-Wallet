

type TokenMetadataType = {
    name: string;
    symbol: string;
    programId: string;
    mintAddress: string;
    imageUri: string | null;
    coingeckoId: string;
};

type MyTokenDataType = Omit<TokenMetadataType, 'coingeckoId'> & {
    amount: number;
    pricePerToken: number;
    currency: "USD" | "INR";
    decimals: number;
};

type PriceType = {
    price: {
        usd: number;
        inr: number;
    }
};

export type { MyTokenDataType, PriceType, TokenMetadataType };


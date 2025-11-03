import axios from "axios";
import { httpAxios, ROUTES } from ".";
import { SECRETS } from "../../config/secrets";

const HELIUS_API_KEY = SECRETS.HELIUS_API_KEY;

// User API methods
export const userApi = {
    getUserInfo: async () => {
        const response = await httpAxios.get(ROUTES.USER.ROOT);
        return response.data;
    },
    getPrivateKey: async () => {
        const response = await httpAxios.get(ROUTES.USER.SECRET);
        return response.data;
    }
};

// Plain async: fetch wallet tokens; returns [] on error
export const getWalletTokens = async (
    walletAddress: string,
    network: "mainnet" | "devnet" = "devnet"
): Promise<any[]> => {
    try {
        const baseUrl =
            network === "mainnet"
                ? "https://mainnet.helius-rpc.com"
                : "https://devnet.helius-rpc.com";

        // Fetch native SOL balance using getBalance RPC method
        const balanceResponse = await axios.post(`${baseUrl}/?api-key=${HELIUS_API_KEY}`, {
            jsonrpc: "2.0",
            id: "get-balance",
            method: "getBalance",
            params: [walletAddress],
        });

        const solBalanceLamports = balanceResponse.data?.result?.value ?? 0;
        const solDecimals = 9;
        const formattedSolBalance = (solBalanceLamports / Math.pow(10, solDecimals)).toFixed(4);

        // console.log("Fetched SOL Balance:", formattedSolBalance);


        // Fetch SPL tokens using getAssetsByOwner with price data
        const response = await axios.post(`${baseUrl}/?api-key=${HELIUS_API_KEY}`, {
            jsonrpc: "2.0",
            id: "get-assets",
            method: "getAssetsByOwner",
            params: {
                ownerAddress: walletAddress,
                page: 1,
                limit: 100,
                displayOptions: {
                    showFungible: true,
                    showNativeBalance: false,
                },
            },
        });

        const assets = response.data?.result?.items ?? [];

        // console.log("Fetched Assets:", assets);

        const fungibleTokens = assets
            .filter(
                (asset: any) =>
                    asset.interface === "FungibleToken" || asset.interface === "FungibleAsset"
            )
            .map((asset: any) => {
                const balance = asset.token_info?.balance || 0;
                const decimals = asset.token_info?.decimals || 0;
                const formattedBalance = (balance / Math.pow(10, decimals)).toFixed(
                    decimals > 6 ? 6 : decimals
                );

                // Extract price data from token_info.price_info
                const priceInfo = asset.token_info?.price_info;
                const pricePerToken = priceInfo?.price_per_token || 0;
                const totalPrice = priceInfo?.total_price || 0;
                const currentValue = totalPrice || parseFloat(formattedBalance) * pricePerToken;

                return {
                    name: asset.content?.metadata?.name || "Unknown Token",
                    symbol: asset.content?.metadata?.symbol || "???",
                    logo:
                        asset.content?.links?.image ||
                        asset.content?.files?.[0]?.uri ||
                        "https://via.placeholder.com/40",
                    balance: formattedBalance,
                    mint: asset.id,
                    decimals,
                    rawBalance: balance,
                    value: currentValue,
                    priceChange24h: 0,
                    profitLoss24h: 0,
                    tokenProgramId: asset.token_info?.token_program || "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                };
            });

        // Get SOL price from CoinGecko for native token
        let solToken = {
            name: "Solana",
            symbol: "SOL",
            logo:
                "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
            balance: formattedSolBalance,
            mint: "So11111111111111111111111111111111111111112",
            decimals: solDecimals,
            rawBalance: solBalanceLamports,
            value: 0,
            priceChange24h: 0,
            profitLoss24h: 0,
            tokenProgramId: "11111111111111111111111111111111", // System Program for native SOL
        };

        try {
            const solPriceResponse = await axios.get(
                "https://api.coingecko.com/api/v3/simple/price",
                {
                    params: {
                        ids: "solana",
                        vs_currencies: "usd",
                        include_24hr_change: true,
                    },
                }
            );

            const solPriceData = solPriceResponse.data?.solana;
            if (solPriceData) {
                const currentValue = parseFloat(solToken.balance) * solPriceData.usd;
                const priceChange = solPriceData.usd_24h_change || 0;

                // Calculate profit/loss: (current_value * price_change) / (100 + price_change)
                const profitLoss = (currentValue * priceChange) / (100 + priceChange);

                solToken = {
                    ...solToken,
                    value: currentValue,
                    priceChange24h: priceChange,
                    profitLoss24h: profitLoss,
                };
            }
        } catch (solPriceError) {
            console.error("Error fetching SOL price:", solPriceError);
        }

        // Always include SOL at the beginning
        const allTokens = [solToken, ...fungibleTokens];

        // Calculate profit/loss for other tokens based on price change
        const tokensWithProfitLoss = allTokens.map((token) => {
            if (token.symbol === "SOL") return token;

            // If we have price change, calculate profit/loss
            if (token.priceChange24h !== 0) {
                const profitLoss = (token.value * token.priceChange24h) / (100 + token.priceChange24h);
                return {
                    ...token,
                    profitLoss24h: profitLoss,
                };
            }
            return token;
        });

        // Filter other tokens with zero balance, but ALWAYS keep SOL
        return tokensWithProfitLoss.filter((t: any) =>
            t.symbol === "SOL" || parseFloat(t.balance) > 0
        ).sort((a: any, b: any) => {
            // Keep SOL at top
            if (a.symbol === "SOL") return -1;
            if (b.symbol === "SOL") return 1;
            // Sort others by value
            return b.value - a.value;
        });
    } catch (error) {
        console.error("Error fetching wallet tokens:", error);
        if (axios.isAxiosError(error)) {
            console.error("Response data:", error.response?.data);
            console.error("Status code:", error.response?.status);
        }
        // Return SOL token with zero balance as fallback
        return [
            {
                name: "Solana",
                symbol: "SOL",
                logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
                balance: "0.0000",
                mint: "So11111111111111111111111111111111111111112",
                decimals: 9,
                rawBalance: 0,
                value: 0,
                priceChange24h: 0,
                tokenProgramId: "11111111111111111111111111111111",
            },
        ];
    }
};


export type SendTransactionType = {
    toAddress: string,
    amount: number,
    decimals: number,
    tokenMint?: string,
    tokenProgramId?: string
}

export const sendTransaction = async (args: SendTransactionType) => {
    try {
        const response = await httpAxios.post(ROUTES.TRANSACTION.ROOT, args);
        return response.data.message;
    } catch (error) {
        console.error("Error sending transaction:", error);
        throw new Error("Transaction failed");
    }
};

export type Contact = {
    id: string | number;
    name: string;
    address: string;
};

// Contacts API methods
export const contactsApi = {
    getAll: async (): Promise<Contact[]> => {
        const response = await httpAxios.get(ROUTES.CONTACTS.ROOT);
        return response.data.data.contacts;
    },

    create: async (data: Omit<Contact, "id">): Promise<Contact> => {
        const response = await httpAxios.post(ROUTES.CONTACTS.ROOT, { contacts: [data] });
        return response.data;
    },

    update: async (id: string, data: Partial<Omit<Contact, "id">>): Promise<Contact> => {
        const response = await httpAxios.patch(ROUTES.CONTACTS.ROOT, { contact: { id, ...data } });
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await httpAxios.delete(`${ROUTES.CONTACTS.ROOT}/${id}`);
    },
};
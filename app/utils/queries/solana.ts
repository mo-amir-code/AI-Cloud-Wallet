import { SECRETS } from "@/config/secrets";
import { MyTokenDataType } from "@/types/tokens";
import { NetworkType } from "@/types/zustand";


const fetchTokenPriceData = async (mintAddresses: [string], mode: NetworkType): Promise<MyTokenDataType[]> => {
    console.log("MODE: ", mode)
    const response = await fetch(`https://${mode}.helius-rpc.com/?api-key=` + SECRETS.HELIUS_API_KEY, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: "1",
            method: "getAssetBatch",
            params: {
                ids: mintAddresses
            },
        }),
    });

    let data = await response.json();
    data = data.result.map((token: any) => {
        return {
            metadata: token.content.metadata,
            files: token.content.files,
            tokenInfo: token.token_info,
        }
    })

    const tokensData = data.map((token: any, idx: number) => {
        const data: MyTokenDataType = {
            name: token.metadata.name as string,
            symbol: token.metadata.symbol as string,
            programId: token.tokenInfo.token_program as string,
            mintAddress: mintAddresses[idx] as string,
            imageUri: token.files && token.files.length > 0 ? token.files[0].uri : null,
            amount: -1,
            pricePerToken: token?.tokenInfo?.price_info?.price_per_token || -1,
            currency: token?.tokenInfo?.price_info?.currency || "USD",
            decimals: -1
        }

        return data;
    }) as MyTokenDataType[];

    return tokensData;
};

export {
    fetchTokenPriceData
};

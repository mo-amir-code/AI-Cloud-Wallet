import { Connection } from "@solana/web3.js"
import { ENV_VARS } from "./constants.js"
import { NetworkModeType } from "../types/db/schema/index.js";

const TOKEN_PROGRAM_IDS = [
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", // SPL Token v1
    "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb", // SPL Token-2022
];

// Function to get connection based on network mode
const getSolanaConnection = (networkMode: NetworkModeType): Connection => {
    const rpcUrl = `https://${networkMode}.helius-rpc.com/?api-key=${ENV_VARS.SOLANA.RPC_URL_KEY}`;
    return new Connection(rpcUrl!);
};

export {
    TOKEN_PROGRAM_IDS,
    getSolanaConnection
}


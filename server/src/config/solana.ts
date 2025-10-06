import { Connection } from "@solana/web3.js"
import { ENV_VARS } from "./constants.js"


const solanaConnection = new Connection(ENV_VARS.SOLANA.RPC_URL!);
const TOKEN_PROGRAM_IDS = [
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", // SPL Token v1
    "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb", // SPL Token-2022
];

export {
    solanaConnection,
    TOKEN_PROGRAM_IDS
}


import { Connection } from "@solana/web3.js"
import { ENV_VARS } from "./constants.js"


const solanaConnection = new Connection(ENV_VARS.SOLANA.RPC_URL!);


export {
    solanaConnection
}


import { Keypair } from "@solana/web3.js";
import bs58 from "bs58"
import { SolanaWalletType } from "../../types/solana/index.js";


const createWallet = (): SolanaWalletType => {
    const wallet = Keypair.generate();

    return {
        publicKey: wallet.publicKey.toBase58().toString(),
        secretKey: convertKeyUint8ArrayToBase58(wallet.secretKey),
    };
}

function convertKeyUint8ArrayToBase58(uint8array: Uint8Array): string {
    return bs58.encode(Buffer.from(uint8array));
}

function convertKeyBase58ToUint8Array(base58String: string): Uint8Array {
    return bs58.decode(base58String);
}


export {
    createWallet,
    convertKeyBase58ToUint8Array,
    convertKeyUint8ArrayToBase58
}

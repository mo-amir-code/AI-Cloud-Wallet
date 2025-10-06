import { Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { solanaConnection, TOKEN_PROGRAM_IDS } from "../../config/solana.js";
import { createTransferInstruction, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { CreateInstructionArgsType } from "../../types/services/gemini.js";
import bs58 from "bs58"


const getSolBalance = async (pubkey: string): Promise<number> => {
    const publicKey = new PublicKey(pubkey);

    const lamports = await solanaConnection.getBalance(publicKey);

    return lamports;
}

const getSolAccount = async (pubkey: string) => {
    const lamports = await getSolBalance(pubkey);

    // Convert to SOL
    const sol = lamports / 1_000_000_000;

    return {
        mint: "So11111111111111111111111111111111111111112", // Pseudo mint address for native SOL
        isNative: true,
        tokenAmount: {
            amount: lamports.toString(),
            uiAmount: sol,
            decimals: 9,
        },
    };
}

const getAllTokenAccounts = async (pubkey: string) => {
    const allAccounts: any[] = [];
    const validPubKey = new PublicKey(pubkey);

    for (const programId of TOKEN_PROGRAM_IDS) {
        const validProgramId = new PublicKey(programId);

        const { value } = await solanaConnection.getParsedTokenAccountsByOwner(validPubKey, {
            programId: validProgramId,
        });

        const accounts = value.map((v) => {
            const info = v.account.data.parsed.info;
            return {
                mint: info.mint,
                owner: v.account.owner.toString(),
                isNative: false,
                tokenAmount: {
                    amount: info.tokenAmount.amount,
                    uiAmount: info.tokenAmount.uiAmount,
                    decimals: info.tokenAmount.decimals
                }
            }
        });

        allAccounts.push(...accounts);
    }

    const solInfo = await getSolAccount(pubkey);
    allAccounts.push(solInfo)


    return allAccounts;
}


const createInstruction = async ({ fromSecretKey, toAddress, amount, decimals, mintAddress, tokenProgramId }: CreateInstructionArgsType): Promise<TransactionInstruction> => {
    const decodedSecretKey = bs58.decode(fromSecretKey);
    const fromWallet = Keypair.fromSecretKey(Uint8Array.from(decodedSecretKey));
    const toPublicKey = new PublicKey(toAddress);

    let instruction;

    if (mintAddress && tokenProgramId) {
        let mintPublicKey = new PublicKey(mintAddress);
        const fromTokenAccount = await getOrCreateAssociatedTokenAccount(solanaConnection, fromWallet, mintPublicKey, fromWallet.publicKey);
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(solanaConnection, fromWallet, mintPublicKey, toPublicKey);

        instruction = createTransferInstruction(
            fromTokenAccount.address,
            toTokenAccount.address,
            fromWallet.publicKey,
            amount * Math.pow(10, decimals),
            [],
            new PublicKey(tokenProgramId)
        );
    } else {
        instruction = SystemProgram.transfer({
            fromPubkey: fromWallet.publicKey,
            toPubkey: toPublicKey,
            lamports: amount * Math.pow(10, decimals)
        })
    }

    return instruction;
}

const executeInstructions = async (fromSecretKey: string, instructions: TransactionInstruction[]) => {
    const decodedSecretKey = bs58.decode(fromSecretKey);
    const fromWallet = Keypair.fromSecretKey(Uint8Array.from(decodedSecretKey));

    const tx = new Transaction().add(...instructions);

    const signature = await sendAndConfirmTransaction(solanaConnection, tx, [fromWallet]);
    console.log("✅ Token transfer successful:", signature);

    return signature;
}

export {
    getAllTokenAccounts,
    getSolAccount,
    getSolBalance,
    createInstruction,
    executeInstructions
}

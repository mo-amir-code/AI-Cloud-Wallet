import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { TOKEN_PROGRAM_IDS } from "../../config/solana.js";
import { createTransferInstruction, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { CreateInstructionArgsType } from "../../types/services/gemini.js";
import bs58 from "bs58"


const getSolBalance = async (pubkey: string, connection: Connection): Promise<number> => {
    const publicKey = new PublicKey(pubkey);

    const lamports = await connection.getBalance(publicKey);

    return lamports;
}

const getSolAccount = async (pubkey: string, connection: Connection) => {
    try {
        const lamports = await getSolBalance(pubkey, connection);

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
    } catch (error) {
        console.error('Error fetching SOL account:', error);
        throw new Error('Failed to fetch SOL account');
    }
}

const getAllTokenAccounts = async (pubkey: string, connection: Connection) => {
    try {

        const allAccounts: any[] = [];
        const validPubKey = new PublicKey(pubkey);

        for (const programId of TOKEN_PROGRAM_IDS) {
            const validProgramId = new PublicKey(programId);

            const { value } = await connection.getParsedTokenAccountsByOwner(validPubKey, {
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

        const solInfo = await getSolAccount(pubkey, connection);
        allAccounts.push(solInfo)


        return allAccounts;
    } catch (error) {
        console.error('Error fetching token accounts:', error);
        throw new Error('Failed to fetch token accounts');
    }
}


const createInstruction = async ({ fromSecretKey, toAddress, amount, decimals, mintAddress, tokenProgramId, connection }: CreateInstructionArgsType & { connection: Connection }): Promise<TransactionInstruction> => {
    try {

        const decodedSecretKey = bs58.decode(fromSecretKey);
        const fromWallet = Keypair.fromSecretKey(Uint8Array.from(decodedSecretKey));
        const toPublicKey = new PublicKey(toAddress);

        let instruction;

        if (mintAddress && tokenProgramId) {
            let mintPublicKey = new PublicKey(mintAddress);
            const fromTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mintPublicKey, fromWallet.publicKey);
            const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mintPublicKey, toPublicKey);

            instruction = createTransferInstruction(
                fromTokenAccount.address,
                toTokenAccount.address,
                fromWallet.publicKey,
                BigInt(Math.round(amount * Math.pow(10, decimals))),
                [],
                new PublicKey(tokenProgramId)
            );
        } else {
            instruction = SystemProgram.transfer({
                fromPubkey: fromWallet.publicKey,
                toPubkey: toPublicKey,
                lamports: BigInt(Math.round(amount * Math.pow(10, decimals)))
            })
        }

        return instruction;
    } catch (error) {
        console.error('Error creating instruction:', error);
        throw new Error('Failed to create instruction');
    }
}

const executeInstructions = async (fromSecretKey: string, instructions: TransactionInstruction[], connection: Connection) => {
    try {

        const decodedSecretKey = bs58.decode(fromSecretKey);
        const fromWallet = Keypair.fromSecretKey(Uint8Array.from(decodedSecretKey));

        const tx = new Transaction().add(...instructions);

        const signature = await sendAndConfirmTransaction(connection, tx, [fromWallet]);
        console.log("✅ Token transfer successful:", signature);

        return signature;
    } catch (error) {
        console.error('Error executing instructions:', error);
        throw new Error('Failed to execute instructions');
    }
}

const getSolPrice = async (): Promise<number> => {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
        );
        const data = await response.json();
        return data.solana.usd;
    } catch (error) {
        console.error('Error fetching SOL price:', error);
        throw new Error('Failed to fetch SOL price');
    }
};


export {
    getAllTokenAccounts,
    getSolAccount,
    getSolBalance,
    createInstruction,
    executeInstructions,
    getSolPrice
}

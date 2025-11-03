import { RESPONSE_MESSAGES } from "../config/constants.js";
import { apiHandler, ErrorHandlerClass, ok } from "../middlewares/errorHandling/index.js";
import { getDrive } from "../services/drive/config.js";
import { getFileById } from "../services/drive/index.js";
import { createInstruction, executeInstructions } from "../services/gemini/utils.js";
import { getUser } from "../utils/db/user.services.db.js";
import { getSettingsByUserId } from "../utils/db/settings.services.db.js";
import { getSolanaConnection } from "../config/solana.js";
import { NetworkMode } from "@prisma/client";


const makeTransaction = apiHandler(async (req, res, next) => {
    const userId = req.user.id;

    const user = await getUser({ id: userId });

    if (!user) {
        return new ErrorHandlerClass("Something went wrong!", RESPONSE_MESSAGES.AUTH.CODES.BAD_REQUEST)
    }

    // Fetch user settings to determine network
    const userSettings = await getSettingsByUserId(userId);
    const networkMode = userSettings?.mode || NetworkMode.mainnet;
    const connection = getSolanaConnection(networkMode);

    const { toAddress, tokenMint, amount, tokenProgramId, decimals } = req.body;

    console.log("Transaction Request:", { toAddress, tokenMint, amount, tokenProgramId, decimals });

    const drive = getDrive({ user, req });
    const fileData = await getFileById(drive, user.driveFileId);

    console.log("File Data Retrieved for Transaction", fileData);


    const ins = await createInstruction({
        fromSecretKey: fileData.wallet.secretKey,
        toAddress,
        amount,
        decimals,
        mintAddress: tokenMint,
        tokenProgramId,
        connection
    });

    const signature = await executeInstructions(fileData.wallet.secretKey, [ins], connection);

    return ok({
        res,
        message: "Transaction successful with signature: " + signature,
    })
});



export {
    makeTransaction
}
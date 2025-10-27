import { RESPONSE_MESSAGES } from "../config/constants.js";
import { apiHandler, ErrorHandlerClass, ok } from "../middlewares/errorHandling/index.js";
import { getDrive } from "../services/drive/config.js";
import { getFileById } from "../services/drive/index.js";
import { createInstruction, executeInstructions } from "../services/gemini/utils.js";
import { getUser } from "../utils/db/user.services.db.js";


const makeTransaction = apiHandler(async (req, res, next) => {
    const userId = req.user.id;

    const user = await getUser({ id: userId });

    if (!user) {
        return new ErrorHandlerClass("Something went wrong!", RESPONSE_MESSAGES.AUTH.CODES.BAD_REQUEST)
    }

    const { toAddress, tokenMint, amount, tokenProgramId, decimals } = req.body;

    const drive = getDrive({ user, req });
    const fileData = await getFileById(drive, user.driveFileId);


    const ins = await createInstruction({
        fromSecretKey: fileData.wallet.secretKey,
        toAddress,
        amount,
        decimals,
        mintAddress: tokenMint,
        tokenProgramId
    });

    const signature = await executeInstructions(fileData.wallet.secretKey, [ins]);

    return ok({
        res,
        message: "Transaction successful with signature: " + signature,
    })
});



export {
    makeTransaction
}
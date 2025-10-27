import { RESPONSE_MESSAGES } from "../config/constants.js";
import { apiHandler, ErrorHandlerClass, ok } from "../middlewares/errorHandling/index.js";
import { getDrive } from "../services/drive/config.js";
import { getFileById } from "../services/drive/index.js";
import { getUser } from "../utils/db/user.services.db.js";


const getUserInfo = apiHandler(async (req, res, next) => {
    const userId = req.user.id;

    const user = await getUser({ id: userId });

    if (!user) {
        return new ErrorHandlerClass("Something went wrong!", RESPONSE_MESSAGES.AUTH.CODES.BAD_REQUEST)
    }

    const drive = getDrive({ user, req });
    const fileData = await getFileById(drive, user.driveFileId);

    return ok({
        res,
        message: "profile information has been fetched",
        data: {
            user: {
                ...user,
                publicKey: fileData.wallet.publicKey
            }
        }
    })
});



export {
    getUserInfo
}
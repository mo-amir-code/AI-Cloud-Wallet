import { RESPONSE_MESSAGES } from "../config/constants.js";
import { apiHandler, ErrorHandlerClass, ok } from "../middlewares/errorHandling/index.js";
import { getDrive } from "../services/drive/config.js";
import { getFileById } from "../services/drive/index.js";
import { getSettingsByUserId } from "../utils/db/settings.services.db.js";
import { getUser } from "../utils/db/user.services.db.js";


const getUserInfo = apiHandler(async (req, res, next) => {
    const userId = req.user.id;

    const user = await getUser({ id: userId });

    if (!user) {
        return new ErrorHandlerClass("Something went wrong!", RESPONSE_MESSAGES.AUTH.CODES.BAD_REQUEST)
    }

    const drive = getDrive({ user, req });
    const fileData = await getFileById(drive, user.driveFileId);

    const settings = await getSettingsByUserId(user.id);

    return ok({
        res,
        message: "profile information has been fetched",
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                publicKey: fileData.wallet.publicKey
            },
            settings: {
                mode: settings?.mode
            }
        }
    })
});

const getSecretKey = apiHandler(async (req, res, next) => {
    const userId = req.user.id;

    const user = await getUser({ id: userId });

    if (!user) {
        return new ErrorHandlerClass("Something went wrong!", RESPONSE_MESSAGES.AUTH.CODES.BAD_REQUEST)
    }

    const drive = getDrive({ user, req });
    const fileData = await getFileById(drive, user.driveFileId);

    return ok({
        res,
        message: "fetched secret key",
        data: {
            key: fileData.wallet.secretKey
        }
    })
});


export {
    getUserInfo,
    getSecretKey
}
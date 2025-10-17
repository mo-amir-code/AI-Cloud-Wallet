import { RESPONSE_MESSAGES } from "../config/constants.js";
import { apiHandler, ErrorHandlerClass, ok } from "../middlewares/errorHandling/index.js";
import { getDrive } from "../services/drive/config.js";
import { getFileById } from "../services/drive/index.js";
import { processUserRequest } from "../services/gemini/index.js";
import { getUser } from "../utils/db/user.services.db.js";


const processRequest = apiHandler(async (req, res, next) => {
    const userId = req.user.id;
    const user = await getUser({ id: userId });
    const query = req.query.q as string;

    if (!user) {
        return new ErrorHandlerClass("Something went wrong!", RESPONSE_MESSAGES.AUTH.CODES.BAD_REQUEST)
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const drive = getDrive({ user });
    const driveFileData = await getFileById(drive, user.driveFileId);

    await processUserRequest(driveFileData, query, res);

    res.end();
});



export {
    processRequest
}
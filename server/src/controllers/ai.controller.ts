import { RESPONSE_MESSAGES } from "../config/constants.js";
import { apiHandler, ErrorHandlerClass, ok } from "../middlewares/errorHandling/index.js";
import { getDrive } from "../services/drive/config.js";
import { getFileById } from "../services/drive/index.js";
import { processUserRequest } from "../services/gemini/index.js";
import { transcribeWithHuggingFace } from "../services/huggingface/index.js";
import { getUser } from "../utils/db/user.services.db.js";


const processRequest = apiHandler(async (req, res, next) => {
    const userId = req.user.id;
    const user = await getUser({ id: userId });
    let query = req.query.q as string;

    if (!user) {
        return new ErrorHandlerClass("Something went wrong!", RESPONSE_MESSAGES.AUTH.CODES.BAD_REQUEST)
    }


    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Transfer-Encoding", "chunked");
    res.flushHeaders();


    const drive = getDrive({ user, req });
    const driveFileData = await getFileById(drive, user.driveFileId);

    const response = await processUserRequest(driveFileData, query, res, userId);

    if (response) {
        res.write(`event: close\ndata: ${JSON.stringify({ status: "completed" })}\n\n`);
    }

    res.end();
});

const storeAudioFile = apiHandler(async (req, res, next) => {
    const text = await transcribeWithHuggingFace(req.file?.buffer as Buffer)

    // console.log("TEXT: ", text);

    return ok({
        res,
        message: "File has been saved",
        data: {
            text: text
        }
    })
});



export {
    processRequest,
    storeAudioFile
}
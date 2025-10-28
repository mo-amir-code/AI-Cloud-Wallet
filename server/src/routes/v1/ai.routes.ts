import express from "express";
import { processRequest, storeAudioFile } from "../../controllers/ai.controller.js";
import { zodValidation } from "../../validators/zod/index.js";
import { processRequestZodSchema } from "../../validators/zod/ai.zod.js";
import { upload } from "../../utils/multer/index.js";

const router = express.Router();

router.post("/", upload.single('audio'), storeAudioFile)
router.get("/", zodValidation(processRequestZodSchema), processRequest)

export default router;
import express from "express";
import { processRequest } from "../../controllers/ai.controller.js";
import { zodValidation } from "../../validators/zod/index.js";
import { processRequestZodSchema } from "../../validators/zod/ai.zod.js";

const router = express.Router();

router.get("/", zodValidation(processRequestZodSchema), processRequest)

export default router;
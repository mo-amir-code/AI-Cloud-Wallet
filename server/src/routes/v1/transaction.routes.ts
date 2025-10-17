import express from "express";
import { makeTransaction } from "../../controllers/transaction.controller.js";
import { zodValidation } from "../../validators/zod/index.js";
import { makeTransactionZodSchema } from "../../validators/zod/transaction.zod.js";

const router = express.Router();

router.post("/", zodValidation(makeTransactionZodSchema), makeTransaction)

export default router;
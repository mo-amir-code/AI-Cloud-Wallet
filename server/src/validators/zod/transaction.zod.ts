import { z } from "zod";
import { ZOD_REQUIRED_ERR } from "../../config/constants.js";

const makeTransactionZodSchema = z.object({
    body: z.object({
        toAddress: z.string(ZOD_REQUIRED_ERR.replace("{field}", "toAddress")),
        tokenMint: z.string(ZOD_REQUIRED_ERR.replace("{field}", "token mint address")).optional(),
        tokenProgramId: z.string(ZOD_REQUIRED_ERR.replace("{field}", "token program id")).optional(),
        amount: z.number(ZOD_REQUIRED_ERR.replace("{field}", "amount")),
        decimals: z.number(ZOD_REQUIRED_ERR.replace("{field}", "decimals")),
    }),
});

export { makeTransactionZodSchema };

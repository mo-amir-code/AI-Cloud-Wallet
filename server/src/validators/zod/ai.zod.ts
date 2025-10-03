import { z } from "zod";
import { ZOD_REQUIRED_ERR } from "../../config/constants.js";

const processRequestZodSchema = z.object({
    query: z.object({
        q: z.string(ZOD_REQUIRED_ERR.replace("{field}", "query")),
    }),
});

export { processRequestZodSchema };

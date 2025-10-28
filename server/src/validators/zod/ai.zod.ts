import { z } from "zod";

const processRequestZodSchema = z.object({
    query: z.object({
        q: z.string(),
    })
});


export { processRequestZodSchema };

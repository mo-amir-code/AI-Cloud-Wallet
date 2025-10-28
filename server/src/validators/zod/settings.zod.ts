import { z } from "zod";

// Enum validation (matches your Prisma enum)
const NetworkModeEnum = z.enum(["devnet", "mainnet"]);

// Create Settings schema
const createSettingsZodSchema = z.object({
    body: z.object({
        mode: NetworkModeEnum.optional(), // optional (default handled by DB)
    }),
});

// Update Settings schema
const updateSettingsZodSchema = z.object({
    body: z.object({
        mode: NetworkModeEnum.optional(),
    }),
});

export {
    createSettingsZodSchema,
    updateSettingsZodSchema
};

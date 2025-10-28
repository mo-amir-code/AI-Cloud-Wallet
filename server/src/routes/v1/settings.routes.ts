import express from "express";
import {
    createUserSettings,
    getUserSettings,
    updateUserSettings,
    deleteUserSettings
} from "../../controllers/settings.controller.js";
import { zodValidation } from "../../validators/zod/index.js";
import { createSettingsZodSchema, updateSettingsZodSchema } from "../../validators/zod/settings.zod.js";

const router = express.Router();

// Create new settings for a user
router.post("/", zodValidation(createSettingsZodSchema), createUserSettings);

// Get settings by user ID
router.get("/", getUserSettings);

// Update settings by user ID
router.patch("/", zodValidation(updateSettingsZodSchema), updateUserSettings);

// Delete settings by user ID
router.delete("/", deleteUserSettings);

export default router;

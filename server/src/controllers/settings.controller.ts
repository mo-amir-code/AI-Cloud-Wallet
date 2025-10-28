import { apiHandler, ok } from "../middlewares/errorHandling/index.js";
import { createSettings, deleteSettings, getSettingsByUserId, updateSettings } from "../utils/db/settings.services.db.js";


// Create settings for a user
const createUserSettings = apiHandler(async (req, res) => {
    const userId = req.user.id;
    const { mode } = req.body;

    const settings = await createSettings({ userId, mode });

    return ok({
        res,
        message: "Settings created successfully",
        data: settings
    });
});

// Get settings by userId
const getUserSettings = apiHandler(async (req, res) => {
    const userId = req.user.id;

    const settings = await getSettingsByUserId(userId);

    return ok({
        res,
        message: "Settings fetched successfully",
        data: settings
    });
});

// Update settings by userId
const updateUserSettings = apiHandler(async (req, res) => {
    const userId = req.user.id;
    const { mode } = req.body;

    const settings = await updateSettings(userId, { mode });

    return ok({
        res,
        message: "Settings updated successfully",
        data: settings
    });
});

// Delete settings by userId
const deleteUserSettings = apiHandler(async (req, res) => {
    const userId = req.user.id;

    await deleteSettings(userId);

    return ok({
        res,
        message: "Settings deleted successfully"
    });
});

export {
    createUserSettings,
    getUserSettings,
    updateUserSettings,
    deleteUserSettings
};

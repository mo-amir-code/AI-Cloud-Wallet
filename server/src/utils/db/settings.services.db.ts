import { prisma } from "../../app.js";
import { Settings, NetworkMode } from "@prisma/client";
import { SettingsSchemaType } from "../../types/db/schema/index.js";

// Create Settings
const createSettings = async (data: Omit<SettingsSchemaType, "id">): Promise<SettingsSchemaType> => {
    const res = await prisma.settings.create({
        data,
    });
    return res;
};

// Get Settings by User ID
const getSettingsByUserId = async (userId: string): Promise<SettingsSchemaType | null> => {
    const res = await prisma.settings.findUnique({
        where: {
            userId,
        },
    });
    return res;
};

// Update Settings by User ID
const updateSettings = async (userId: string, data: Partial<Omit<Settings, "userId" | "id">>): Promise<Settings> => {
    const res = await prisma.settings.update({
        where: { userId },
        data,
    });
    return res;
};

// Delete Settings by User ID
const deleteSettings = async (userId: string): Promise<SettingsSchemaType> => {
    const res = await prisma.settings.delete({
        where: { userId },
    });
    return res;
};

export { createSettings, getSettingsByUserId, updateSettings, deleteSettings };

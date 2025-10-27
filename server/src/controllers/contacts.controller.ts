import { RESPONSE_MESSAGES } from "../config/constants.js";
import { apiHandler, ErrorHandlerClass, ok } from "../middlewares/errorHandling/index.js";
import { getDrive } from "../services/drive/config.js";
import { getFileById, updateJsonFile } from "../services/drive/index.js";
import { NewContactType, UpdateContactType } from "../types/services/drive/index.js";
import { getUser } from "../utils/db/user.services.db.js";
import { v4 as uuid, validate as uuidvalidate } from "uuid"


const getContacts = apiHandler(async (req, res, next) => {
    const userId = req.user.id;

    const user = await getUser({ id: userId });

    if (!user) {
        return new ErrorHandlerClass("Something went wrong!", RESPONSE_MESSAGES.AUTH.CODES.BAD_REQUEST)
    }

    const drive = getDrive({ user, req });
    const fileData = await getFileById(drive, user.driveFileId);

    return ok({
        res,
        message: "Contacts has been fetched",
        data: {
            contacts: fileData?.contacts || []
        }
    })
});

const addNewContact = apiHandler(async (req, res, next) => {
    const userId = req.user.id;
    const newContacts = req.body.contacts as NewContactType[];

    const user = await getUser({ id: userId });

    if (!user) {
        return new ErrorHandlerClass("Something went wrong!", RESPONSE_MESSAGES.AUTH.CODES.BAD_REQUEST)
    }

    const drive = getDrive({ user, req });

    const fileData = await getFileById(drive, user.driveFileId);

    for (const contact of newContacts) {
        if (!fileData.contacts.some((c) => c.address === contact.address)) {
            let newContactId = uuid();
            fileData.contacts.push({
                ...contact,
                id: newContactId
            });
        }
    }

    await updateJsonFile(drive, user.driveFileId, fileData);

    return ok({
        res,
        message: "new contact added",
    })
});

const updateContact = apiHandler(async (req, res, next) => {
    const userId = req.user.id;
    const updatedContact = req.body.contact as UpdateContactType;

    const user = await getUser({ id: userId });

    if (!user) {
        return new ErrorHandlerClass("Something went wrong!", RESPONSE_MESSAGES.AUTH.CODES.BAD_REQUEST)
    }

    if (!uuidvalidate(updatedContact.id)) {
        return new ErrorHandlerClass("enter valid contact id!", RESPONSE_MESSAGES.AUTH.CODES.BAD_REQUEST)
    }

    const drive = getDrive({ user, req });

    let fileData = await getFileById(drive, user.driveFileId);

    let contactIdx = fileData.contacts.findIndex((c) => c.id === updatedContact.id);

    if (contactIdx === -1) {
        return new ErrorHandlerClass("contact id did not match", RESPONSE_MESSAGES.AUTH.CODES.BAD_REQUEST)
    }

    fileData.contacts[contactIdx].name = updatedContact.name || fileData.contacts[contactIdx].name;
    fileData.contacts[contactIdx].address = updatedContact.address || fileData.contacts[contactIdx].address;

    await updateJsonFile(drive, user.driveFileId, fileData);

    return ok({
        res,
        message: "contact has been updated",
    })
});

const deleteContact = apiHandler(async (req, res, next) => {
    const userId = req.user.id;
    const contact = req.body.contact as { id: string };

    const user = await getUser({ id: userId });

    if (!user) {
        return new ErrorHandlerClass("Something went wrong!", RESPONSE_MESSAGES.AUTH.CODES.BAD_REQUEST)
    }

    if (!uuidvalidate(contact.id)) {
        return new ErrorHandlerClass("enter valid contact id!", RESPONSE_MESSAGES.AUTH.CODES.BAD_REQUEST)
    }

    const drive = getDrive({ user, req });

    let fileData = await getFileById(drive, user.driveFileId);

    fileData.contacts = fileData.contacts.filter((c) => c.id !== contact.id);

    await updateJsonFile(drive, user.driveFileId, fileData);

    return ok({
        res,
        message: "contact has been updated",
    })
});

const deleteAllContacts = apiHandler(async (req, res, next) => {
    const userId = req.user.id;

    const user = await getUser({ id: userId });

    if (!user) {
        return new ErrorHandlerClass("Something went wrong!", RESPONSE_MESSAGES.AUTH.CODES.BAD_REQUEST)
    }

    const drive = getDrive({ user, req });

    let fileData = await getFileById(drive, user.driveFileId);

    fileData.contacts = [];

    await updateJsonFile(drive, user.driveFileId, fileData);

    return ok({
        res,
        message: "all contacts has been deleted",
    })
});

export {
    getContacts,
    addNewContact,
    updateContact,
    deleteContact,
    deleteAllContacts
}
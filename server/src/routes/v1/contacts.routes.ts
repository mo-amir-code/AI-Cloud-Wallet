import express from "express";
import { addNewContact, deleteAllContacts, deleteContact, getContacts, updateContact } from "../../controllers/contacts.controller.js";
import { zodValidation } from "../../validators/zod/index.js";
import { addContactsZodSchema, deleteContactZodSchema, updateContactZodSchema } from "../../validators/zod/contacts.js";

const router = express.Router();

router.get("/", getContacts)
router.post("/", zodValidation(addContactsZodSchema), addNewContact)
router.patch("/", zodValidation(updateContactZodSchema), updateContact)
router.delete("/:contactId", zodValidation(deleteContactZodSchema), deleteContact)
router.delete("/all", deleteAllContacts)

export default router;
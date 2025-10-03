import { z } from "zod";
import { ZOD_REQUIRED_ERR } from "../../config/constants.js";

const addContactsZodSchema = z.object({
  body: z.object({
    contacts: z.array(z.object({
      name: z.string(ZOD_REQUIRED_ERR.replace("{field}", "name")),
      address: z.string(ZOD_REQUIRED_ERR.replace("{field}", "public key")).length(44, { message: "Enter valid sol wallet public key" }),
    })).min(1, { message: "at least one contact is required" })
  })
});

const updateContactZodSchema = z.object({
  body: z.object({
    contact: z.object({
      id: z.uuidv4("enter valid contact id"),
      name: z.string(ZOD_REQUIRED_ERR.replace("{field}", "name")).optional(),
      address: z.string(ZOD_REQUIRED_ERR.replace("{field}", "public key")).length(44, { message: "Enter valid sol wallet public key" }).optional(),
    })
  })
});

const deleteContactZodSchema = z.object({
  body: z.object({
    contact: z.object({
      id: z.uuidv4("enter valid contact id"),
    })
  })
});

export { addContactsZodSchema, updateContactZodSchema, deleteContactZodSchema };

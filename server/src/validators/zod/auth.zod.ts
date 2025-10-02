import { z } from "zod";
import { ZOD_REQUIRED_ERR } from "../../config/constants.js";

const registerUserZodSchema = z.object({
  body: z.object({
    fullName: z.string(ZOD_REQUIRED_ERR.replace("{field}", "Full name")).min(2, { message: "name length should not be lesser than 2" }),
    email: z.email(ZOD_REQUIRED_ERR.replace("{field}", "Email")),
    password: z
      .string(ZOD_REQUIRED_ERR.replace("{field}", "Password"))
      .min(6, "Password length must be at least 6 characters"),
  }),
});

export { registerUserZodSchema };

import express from "express";
import authRoutes from "./auth.routes.js";
import contactsRoutes from "./contacts.routes.js";
import { isUserAuthenticated } from "../../middlewares/auth.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/contacts", isUserAuthenticated, contactsRoutes);

export default router;

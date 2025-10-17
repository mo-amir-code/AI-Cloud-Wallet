import express from "express";
import authRoutes from "./auth.routes.js";
import contactsRoutes from "./contacts.routes.js";
import userRoutes from "./user.routes.js";
import aiRoutes from "./ai.routes.js";
import { isUserAuthenticated } from "../../middlewares/auth.js";
import transactionRoutes from "./transaction.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/contacts", isUserAuthenticated, contactsRoutes);
router.use("/user", isUserAuthenticated, userRoutes);
router.use("/ai", isUserAuthenticated, aiRoutes);
router.use("/transaction", isUserAuthenticated, transactionRoutes);

export default router;

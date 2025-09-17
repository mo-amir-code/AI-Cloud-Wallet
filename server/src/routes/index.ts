import express from "express";
import authRoutes from "./auth.routes.js";
import { isUserAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.use("/api/auth", authRoutes);

export default router;

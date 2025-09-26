import express from "express";
import { authenticateWithGoogle, googleCallback } from "../../controllers/auth.controller.js";

const router = express.Router();

router.post("/google", authenticateWithGoogle);
router.get("/google/callback", googleCallback);

export default router;
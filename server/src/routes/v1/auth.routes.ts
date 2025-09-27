import express from "express";
import { authenticateWithGoogle, googleCallback, logoutUser } from "../../controllers/auth.controller.js";
import { isUserAuthenticated } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/google", authenticateWithGoogle);
router.get("/google/callback", googleCallback);
router.post("/google/logout", isUserAuthenticated, logoutUser);

export default router;
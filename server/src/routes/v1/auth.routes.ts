import express from "express";
import { authenticateWithGoogle, checkIsUserAuthenticated, googleCallback, logoutUser, refreshToken, revokeGoogleAccess } from "../../controllers/auth.controller.js";
import { isUserAuthenticated } from "../../middlewares/auth.js";
import { zodValidation } from "../../validators/zod/index.js";
import { authWithGoogleZodSchema } from "../../validators/zod/auth.zod.js";

const router = express.Router();

router.get("/", checkIsUserAuthenticated);
router.post("/google", zodValidation(authWithGoogleZodSchema), authenticateWithGoogle);
router.get("/google/callback", googleCallback);
router.post("/google/token/refresh", refreshToken);
router.post("/google/logout", isUserAuthenticated, logoutUser);
router.post("/google/revoke", isUserAuthenticated, revokeGoogleAccess);

export default router;
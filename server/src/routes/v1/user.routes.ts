import express from "express";
import { getSecretKey, getUserInfo } from "../../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUserInfo)
router.get("/secret", getSecretKey)

export default router;
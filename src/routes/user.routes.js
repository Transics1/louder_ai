import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", protect, getProfile);

export default router;
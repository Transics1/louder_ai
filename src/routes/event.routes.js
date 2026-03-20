import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createEvent,
  getUserEvents,
  generateEvent,
} from "../controllers/event.controller.js";

const router = express.Router();

router.post("/create", protect, createEvent);

router.post("/generate", protect, generateEvent);

router.get("/my", protect, getUserEvents);

export default router;
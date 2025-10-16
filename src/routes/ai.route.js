import { Router } from "express";
import { chatbotResponse } from "../controllers/ai.controller.js";
import getDashboardData from "../controllers/dashboard.ontroller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/ai", authMiddleware, chatbotResponse);
router.get("/dashboard/data", authMiddleware, getDashboardData);

export default router;

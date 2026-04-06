import express from "express"
import { getProviderDashboard } from "../controllers/providerDashboadController.js"
import { verifyToken } from "../middleware/authMiddleware.js"
import { isProvider } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", verifyToken, isProvider, getProviderDashboard);

export default router;
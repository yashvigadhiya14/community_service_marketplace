import express from "express"
import { getProviderDashboard } from "../controllers/providerDashboadController.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const router=express.Router();

router.get("/dashboard",verifyToken,getProviderDashboard);

export default router;
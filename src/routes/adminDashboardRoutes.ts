import express from "express";
import { getAdminDashboard } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admindashboard", verifyToken, isAdmin, getAdminDashboard);

export default router
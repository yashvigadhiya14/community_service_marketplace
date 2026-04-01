import express from "express";
import { getAdminDashboard } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router=express.Router();

router.get("/admindashboard",verifyToken,getAdminDashboard);

export default router
import express from "express";
import {
  getAdminDashboard,
  getAllUsers,
  toggleUserStatus,
  getAllServicesAdmin,
  getAllBookingsAdmin
} from "../controllers/adminController.js";

import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

//  Dashboard
router.get("/admindashboard", verifyToken, isAdmin, getAdminDashboard);

//  Users
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.patch("/users/:id/status", verifyToken, isAdmin, toggleUserStatus);

//  Services
router.get("/services", verifyToken, isAdmin, getAllServicesAdmin);

//  Bookings
router.get("/bookings", verifyToken, isAdmin, getAllBookingsAdmin);

export default router;
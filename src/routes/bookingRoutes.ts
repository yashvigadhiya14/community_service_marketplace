import express from "express";
import { createbooking,getCustomerBookings,getProviderBookings,updateBookingStatus,completeBooking,cancelbooking } from "../controllers/bookingController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router=express.Router();

router.post("/",verifyToken,createbooking);
router.get("/customer",verifyToken,getCustomerBookings);
router.get("/provider",verifyToken,getProviderBookings);
router.put("/:booking_id/status",verifyToken,updateBookingStatus);
router.put("/:booking_id/complete",verifyToken,completeBooking);
router.put("/:booking_id/cancel",verifyToken,cancelbooking);

export default router;
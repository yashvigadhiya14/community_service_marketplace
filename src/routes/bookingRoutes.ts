import express from "express";
import { createbooking, getCustomerBookings, getProviderBookings, updateBookingStatus, completeBooking, cancelbooking } from "../controllers/bookingController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createBookingValidator, BookingIdValidator, statusValidator } from "../validators/bookingValidator.js"
import { validate } from "../middleware/validate.js"
import { create } from "domain";

const router = express.Router();

router.post("/", verifyToken, createBookingValidator, validate, createbooking);
router.get("/customer", verifyToken, getCustomerBookings);
router.get("/provider", verifyToken, getProviderBookings);
router.put("/:booking_id/status", verifyToken, BookingIdValidator, statusValidator, validate, updateBookingStatus);
router.put("/:booking_id/complete", verifyToken, BookingIdValidator, validate, completeBooking);
router.put("/:booking_id/cancel", verifyToken, BookingIdValidator, validate, cancelbooking);

export default router;
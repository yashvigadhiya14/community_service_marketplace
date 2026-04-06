import { body, param } from "express-validator";

export const createBookingValidator = [
  body("service_id").isInt().withMessage("service id must be number"),
  body("total_amount").isFloat().withMessage("invalid amount"),
  body("booking_date").notEmpty().withMessage("Date required"),
  body("booking_time").notEmpty().withMessage("Time required")
];

export const BookingIdValidator = [
  param("booking_id").isInt().withMessage("invalid booking id"),
];

export const statusValidator = [
  body("status")
    .isIn(["pending", "confirmed", "completed", "cancelled"])
    .withMessage("invalid status"),
]
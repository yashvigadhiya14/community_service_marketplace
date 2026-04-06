import { body, param } from "express-validator";

export const createReviewValidator = [
  body("service_id").isInt().withMessage("Service ID must be number"),

  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 to 5"),

  body("review_text")
    .optional()
    .isLength({ min: 3, max: 500 })
    .withMessage("Review must be 3-500 characters"),
];

export const reviewIdValidator = [
  param("review_id").isInt().withMessage("Invalid review ID"),
];
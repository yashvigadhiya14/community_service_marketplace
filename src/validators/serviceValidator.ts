import { body } from "express-validator";

export const createServiceValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("service_description").notEmpty().withMessage("Description is required"),
  body("category_id").isNumeric().withMessage("Category ID must be number"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("location").notEmpty().withMessage("Location is required"),
];
import express from "express";
import { addReview, deleteReview, getProviderRating, getReviews, updateReview } from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createReviewValidator, reviewIdValidator } from "../validators/reviewValidator.js"
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/add", verifyToken, createReviewValidator, validate, addReview);
router.get("/provider/avg/:provider_id", getProviderRating);
router.get("/service/:service_id", getReviews);
router.put("/:review_id", verifyToken, reviewIdValidator, validate, updateReview);
router.delete("/:review_id", verifyToken, reviewIdValidator, validate, deleteReview)

export default router
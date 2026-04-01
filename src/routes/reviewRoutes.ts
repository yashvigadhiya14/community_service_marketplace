import express from "express";
import { addReview,getProviderRating } from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router=express.Router();

router.post("/add",verifyToken,addReview);
router.get("/provider/avg/:provider_id",getProviderRating);

export default router
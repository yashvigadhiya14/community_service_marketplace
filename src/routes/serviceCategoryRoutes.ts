import express from "express";
import * as controller from "../controllers/ServiceCategoryController.js";
import { verifyToken,isAdmin } from "../middleware/authMiddleware.js";

const router=express.Router();


//public
router.get("/",controller.getAllcategories);
router.get("/:id",controller.getcategorybyid);


//for admin only

router.post("/",verifyToken,isAdmin,controller.createCategory);
router.put("/:id", verifyToken, isAdmin, controller.updateCategory);
router.delete("/:id", verifyToken, isAdmin, controller.deleteCategory);

export default router;
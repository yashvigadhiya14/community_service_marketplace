import express from "express"
import { createservice, updateService, deleteService, getServices, searchServices, filterservices, sortservices, getProviderServices } from "../controllers/ServiceController.js"
import { verifyToken } from "../middleware/authMiddleware.js"
import { createServiceValidator } from "../validators/serviceValidator.js";
import { validate } from "../middleware/validate.js";

const router = express.Router()

router.post("/", verifyToken, createServiceValidator, validate, createservice);
router.put("/:id", verifyToken, updateService)
router.delete("/:id", verifyToken, deleteService)
router.get("/allservices", getServices);
router.get("/search", searchServices);
router.get("/filter", filterservices);
router.get("/sort", sortservices);
router.get("/provider/services", verifyToken, getProviderServices);

export default router
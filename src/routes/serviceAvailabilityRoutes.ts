import express from "express"
import { addAvailability,getAvailabilityByService } from "../controllers/serviceAvailabilityController.js";
const router=express.Router();


router.post("/add-availability",addAvailability);
router.get("/:service_id",getAvailabilityByService);

export default router;
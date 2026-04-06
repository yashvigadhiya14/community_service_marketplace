import express from "express"
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/create-service", verifyToken, authorizeRoles("provider"), (req, res) => {
  res.json({
    message: "service created"
  })
})

export default router
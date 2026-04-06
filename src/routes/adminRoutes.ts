import express from "express"
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/dashboard", verifyToken, authorizeRoles("admin"), (req, res) => {
  res.json({
    message: "Admin dashboard"
  })
})

export default router
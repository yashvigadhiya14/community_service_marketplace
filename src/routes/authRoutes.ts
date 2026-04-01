import express from "express"
import * as authController from "../controllers/authController.js"
import { verifyToken } from "../middleware/authMiddleware.js"
import { registerValidation,loginValidation,validate } from "../middleware/validationMiddleware.js"
import { forgotPassword,resetPassword,  resendVerificationEmail
 } from "../controllers/authController.js"

const router = express.Router()

router.post("/register",registerValidation,validate,authController.register)
router.get("/verify-email",authController.verifyEmail)
router.post("/login",loginValidation,validate,authController.login)
router.post("/forgot-password", forgotPassword);       
router.post("/reset-password/:token", resetPassword);  
router.post("/resend-verification", resendVerificationEmail); 
router.post("/logout",verifyToken,authController.logout)
export default router
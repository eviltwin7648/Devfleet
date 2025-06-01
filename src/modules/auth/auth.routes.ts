import express from "express";
import { authController } from "./auth.controller";
const router = express.Router();
//manual authentication routes
router.post("/send-otp", authController.handleSendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/register", authController.register);
router.post("/login", authController.login);

//github Oauth routes
router.get("/github", authController.githubAuth);
router.get("/github/callback", authController.githubCallback);

export const authRoutes = router;

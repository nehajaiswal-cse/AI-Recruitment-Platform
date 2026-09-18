import express from "express";
import { register, login, logout , forgotPassword, resetPassword, googleLogin,} from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/google", googleLogin);

export default router;
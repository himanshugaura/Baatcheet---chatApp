import express from "express"
import '../config/passport.js'
import {
  checkEmail,
  checkUserName,
  getUser,
  googleLogin,
  isLoggedIn,
  login,
  logout,
  register,
  sendOTP,
  verifyOTP,
} from "../controllers/auth.controller.js";
import passport from "passport";
import authMiddleware from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/check-username", checkUserName);
authRouter.post("/check-email", checkEmail);
authRouter.get("/is-logged-in", isLoggedIn);
authRouter.post('/register', register);
authRouter.post("/login", login);
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  googleLogin
);
authRouter.post("/logout", logout);
authRouter.post("/send-otp", sendOTP);
authRouter.post("/verify-otp", verifyOTP);
authRouter.get("/get-user-data", authMiddleware, getUser);

export default authRouter
import otpGenerator from "otp-generator";
import OTPModel from "../models/otp.model.js";
import mailSender from "../utils/mailSender.js";
import otpTemplate from "../mail/template/mailVerification.js";
import validator from "validator";
import UserModel from "../models/user.model.js";
import { Request, Response, NextFunction } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import jwt from "jsonwebtoken";

const { isEmail } = validator;

export const register = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, userName, email, password, confirmPassword } = req.body;

    if (!name || !userName || !email || !password || !confirmPassword) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
      return;
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email already registered",
      });
      return;
    }

    await UserModel.create({ name, userName, email, password });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  }
);

export const login = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    const userExist = await UserModel.findOne({ email });
    if (!userExist) {
      res.status(400).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const isPasswordValid = await userExist.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    const token = userExist.generateJWT();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  }
);


export const googleLogin = asyncErrorHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }

    const user = req.user as any;


    const token = user.generateJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);



export const logout = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ 
      success: true, 
      message: "Logged out successfully" 
    });
  }
);

export const sendOTP = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email || !isEmail(email)) {
      res.status(400).json({
        success: false,
        message: "A valid email is required.",
      });
      return;
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await OTPModel.create({ email, otp });

    try {
      await mailSender(email, "Verification Email", otpTemplate(otp));
    } catch (error) {
      console.log("Error occurred while sending email: ", error);
    }

    res.status(200).json({
      success: true,
      message: "OTP sent to email.",
    });
  }
);

export const verifyOTP = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
      return;
    }

    const otpRecord = await OTPModel.findOne({ email })
      .sort({ createdAt: -1 })
      .exec();

    if (!otpRecord) {
      res.status(400).json({
        success: false,
        message: "No OTP found for this email.",
      });
      return;
    }

    if (otpRecord.otp !== otp) {
      res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
      return;
    }

    const currentTime = new Date();
    if (currentTime > otpRecord.expiresAt) {
      res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
      return;
    }

    await OTPModel.deleteMany({ email });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  }
);

export const checkUserName = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userName } = req.body;

    if (!userName) {
      res.status(400).json({ 
        success: false, 
        message: "userName is required" 
      });
      return;
    }

    const user = await UserModel.findOne({ userName });

    if (user) {
      res.status(200).json({
        success: false,
        message: "userName is already taken",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "userName is available",
      });
    }
  }
);

export const checkEmail = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ 
        success: false, 
        message: "Email is required" 
      });
      return;
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      res.status(200).json({ 
        success: false, 
        message: "Email is already registered" 
      });
    } else {
      res.status(200).json({ 
        success: true, 
        message: "Email is available" 
      });
    }
  }
);

export const isLoggedIn = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ 
        success: false, 
        message: "Not logged in" 
      });
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string);
    res.status(200).json({ 
      success: true, 
      message: "user already logged in" 
    });
  }
);

export const getUser = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.authUser?._id;

    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

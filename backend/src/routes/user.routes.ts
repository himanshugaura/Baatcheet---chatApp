import express from "express";
import {

  deleteUserAccount,
  getAllUsers,

  getUserFollowing,
  toggleFollowUser,
  updateProfile,
  updateProfileImage,
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const userRouter = express.Router();

userRouter.post("/toggle-follow-user", authMiddleware , toggleFollowUser);

userRouter.get("/following/", authMiddleware , getUserFollowing);
userRouter.get("/get-all-users" , authMiddleware, getAllUsers);
userRouter.post(
  "/update-profile-image",
  authMiddleware,
  upload.single("file"),  
  updateProfileImage
);
userRouter.post("/update-profile" , authMiddleware , updateProfile);
userRouter.post("/delete-account" , authMiddleware , deleteUserAccount);


export default userRouter;






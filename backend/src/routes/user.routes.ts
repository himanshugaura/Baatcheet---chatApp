import express from "express";
import {

  getAllUsers,

  getUserFollowing,
  toggleFollowUser,
} from "../controllers/user.controller";
import authMiddleware from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/toggle-follow-user", authMiddleware , toggleFollowUser);

userRouter.get("/following/", authMiddleware , getUserFollowing);
userRouter.get("/get-all-users" , authMiddleware, getAllUsers);

export default userRouter;

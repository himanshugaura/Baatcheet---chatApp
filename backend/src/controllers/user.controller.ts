import UserModel from "../models/user.model.js";
import { Request, Response, NextFunction } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

export const toggleFollowUser = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const  {targetUserId}  = req.body;
    const currentUserId = req.authUser?._id;
    console.log(targetUserId);
    
    if (currentUserId === targetUserId) {
      return res.status(400).json({ 
        success: false,
        message: "You can't follow or unfollow yourself." 
      });
    }

    const currentUser = await UserModel.findById(currentUserId);
    const targetUser = await UserModel.findById(targetUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ 
        success: false,
        message: "Target user not found." 
      });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow logic
      currentUser.following = currentUser.following.filter(
        (id : string) => id.toString() !== targetUserId
      );
      targetUser.followers = targetUser.followers.filter(
        (id : string) => id.toString() !== currentUserId
      );

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        success: true,
        message: "Successfully unfollowed the user.",
      });
    } else {
      // Follow logic
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        success: true,
        message: "Successfully followed the user.",
      });
    }
  }
);


export const getUserFollowing = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const  userId  = req.authUser?._id;
    const user = await UserModel.findById(userId).populate("following");

    if (!user) {
      res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
      return;
    }

    res.status(200).json({ 
      success: true, 
      data: user.following 
    });
  }
);

export const getAllUsers = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = req.authUser?._id;
    
    // Fetch the current user's following list
    const currentUser = await UserModel.findById(currentUserId).select('following');

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found",
      });
    }

    // Exclude current user and the users they are following
    const users = await UserModel.find({
      _id: { $nin: [currentUserId, ...currentUser.following] },
    });

    res.status(200).json({
      success: true,
      data: users,
    });
  }
);

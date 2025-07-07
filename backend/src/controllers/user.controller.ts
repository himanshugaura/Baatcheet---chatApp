import UserModel from "../models/user.model.js";
import { Request, Response, NextFunction } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";


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

export const updateProfileImage = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    const userId = req.authUser?._id;
    
    
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    if (!file) {
      return res.status(400).json({ 
        success: false, 
        message: "No file uploaded." 
      });
    }

    const result = await uploadToCloudinary(
      file.buffer, 
      `profileImages/${user.userName}`
    );

    const oldPublicId = user.profileImage?.publicId;
    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
      } catch (err) {
        console.error("Failed to delete old image:", err);
      }
    }

    user.profileImage = {
      url: result.url,
      publicId: result.public_id,
    };
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully.",
      data: {
        url: result.url,
        publicId: result.public_id,
      },
    });
  }
);

export const updateProfile = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { userName ,name , bio  } = req.body;
    const userId = req.authUser?._id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!bio && !name && !userName) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    if (bio && bio !== user.bio) {
      user.bio = bio;
    }

    if (name && name !== user.name) {
      user.name = name;
    }

    if (userName && userName !== user.userName) {
      user.userName = userName;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
    });
  }
);

export const deleteUserAccount = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.authUser?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: No user ID provided.',
      });
      return;
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    if (user.profileImage?.publicId) {
      try {
        await cloudinary.uploader.destroy(user.profileImage.publicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    await UserModel.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'User account deleted1 successfully.',
    });
  }
);


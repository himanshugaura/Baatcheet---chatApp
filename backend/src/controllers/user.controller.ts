import UserModel from "../models/user.model.js";
import { Request, Response, NextFunction } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import MessageModel from "../models/message.model.js";


export const toggleContact = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { targetUserId } = req.body;
    const currentUserId = req.authUser?._id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You can't add yourself as a contact.",
      });
    }

    const currentUser = await UserModel.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const targetUser = await UserModel.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found.",
      });
    }

    const contactIndex = currentUser.contacts.findIndex(
      (id : string) => id.toString() === targetUserId
    );

    if (contactIndex !== -1) {
      // If found → remove it
      currentUser.contacts.splice(contactIndex, 1);
      await currentUser.save();
      return res.status(200).json({
        success: true,
        message: "Contact removed successfully.",
      });
    } else {
      // If not found → add it
      currentUser.contacts.push(targetUserId);
      await currentUser.save();
      return res.status(200).json({
        success: true,
        message: "Contact added successfully.",
      });
    }
  }
);


export const getUserContacts = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const  userId  = req.authUser?._id;
    const user = await UserModel.findById(userId).populate("contacts");
    
    if (!user) {
      res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
      return;
    }

    res.status(200).json({ 
      success: true, 
      data: user.contacts 
    });
  }
);

export const getUserChats = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const userId = req.authUser?._id;

    
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const uniqueContacts = await MessageModel.aggregate([
      {
        $match: {
          $or: [
            { senderId: user._id },
            { receiverId: user._id },
          ],
        },
      },
      {
        $project: {
          otherUser: {
            $cond: [
              { $eq: ["$senderId", user._id] },
              "$receiverId",
              "$senderId",
            ],
          },
        },
      },
      {
        $group: {
          _id: "$otherUser",
        },
      },
    ]);

    const contactIds = uniqueContacts.map(c => c._id);

    if (contactIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    
    const contacts = await UserModel.find({
      _id: { $in: contactIds },
    }).select("_id name userName profileImage");

    res.status(200).json({
      success: true,
      data: contacts,
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
      message: 'User account deleted successfully.',
    });
  }
);


export const searchUsers = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const query = (req.query.query as string)?.trim().toLowerCase();
    const currentUserId = req.authUser?._id;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required.",
      });
    }

    const currentUser = await UserModel.findById(currentUserId).select("contacts");
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found.",
      });
    }

    const excludeIds = [currentUserId, ...currentUser.contacts];

    // Detect if query looks like an email
    const isEmail = query.includes("@");

    const filter = isEmail
      ? { email: { $regex: `^${query}$`, $options: "i" } }
      : { userName: { $regex: `^${query}$`, $options: "i" } };

    const users = await UserModel.find({
      $and: [filter, { _id: { $nin: excludeIds } }],
    }).select("_id userName name email profileImage");

    res.status(200).json({
      success: true,
      data: users,
    });
  }
);


export const getUserDataById = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

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
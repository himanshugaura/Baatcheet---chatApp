import express from "express";
import {
  deleteUserAccount,
  getUserChats,
  getUserContacts,
  getUserDataById,
  searchUsers,
  toggleContact,
  updateProfile,
  updateProfileImage,
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const userRouter = express.Router();

userRouter.post("/toggle-contact", authMiddleware , toggleContact);
userRouter.get("/contacts/", authMiddleware , getUserContacts);
userRouter.get("/get-chats" , authMiddleware , getUserChats)
userRouter.get("/search", authMiddleware, searchUsers);
userRouter.get("/get-user-data-byID/:userId",  getUserDataById);
userRouter.post(
  "/update-profile-image",
  authMiddleware,
  upload.single("file"),  
  updateProfileImage
);
userRouter.post("/update-profile" , authMiddleware , updateProfile);
userRouter.post("/delete-account" , authMiddleware , deleteUserAccount);


export default userRouter;






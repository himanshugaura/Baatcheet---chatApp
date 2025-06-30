import { Request, Response, NextFunction } from 'express';
import MessageModel from '../models/message.model.js';
import asyncErrorHandler from '../utils/asyncErrorHandler';

// GET messages between two users
export const getMessages = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { senderId, receiverId } = req.params;

    const messages = await MessageModel.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  }
);

// POST a new message
export const sendMessage = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { senderId, receiverId, text, roomId } = req.body;

    const newMessage = new MessageModel({ senderId, receiverId, text, roomId });
    await newMessage.save();

    res.status(201).json(newMessage);
  }
);

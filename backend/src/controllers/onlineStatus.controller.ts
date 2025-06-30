import { Request, Response, NextFunction } from 'express';
import { pubClient } from '../config/redis';
import asyncErrorHandler from '../utils/asyncErrorHandler';

export const getOnlineStatus = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId: string = req.params.id;

    // Check if the user is online by checking the Redis set
    const isOnline = await pubClient.sIsMember('online_users', userId);

    // Respond with the online status
    res.json({ isOnline: Boolean(isOnline) });
  }
);

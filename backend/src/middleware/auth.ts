import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import { DecodedUser } from '../types/type.js';

declare global {
  namespace Express {
    interface Request {
      authUser?: DecodedUser;
    }
  }
}

dotenv.config();

const authMiddleware = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({
        success: false,
        message: 'JWT secret not configured.',
      });
    }

    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as DecodedUser;
      req.authUser = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.',
      });
    }
  }
);

export default authMiddleware;

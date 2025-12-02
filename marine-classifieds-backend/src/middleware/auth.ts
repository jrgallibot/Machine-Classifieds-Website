import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { AppError } from './errorHandler';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Not authorized to access this route', 401);
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as { id: string };

      // Get user from token
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { id: decoded.id } });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      throw new AppError('Not authorized to access this route', 401);
    }
  } catch (error) {
    next(error);
  }
};

// Admin middleware
export const admin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || !req.user.isAdmin) {
    throw new AppError('Not authorized as an admin', 403);
  }
  next();
}; 
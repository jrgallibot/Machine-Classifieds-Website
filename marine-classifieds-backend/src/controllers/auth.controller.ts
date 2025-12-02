import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import { AppError } from '../middleware/errorHandler';
import { MoreThan } from 'typeorm';
import nodemailer from 'nodemailer';

export class AuthController {
  private userRepository = getRepository(User);

  // Register a new user
  async register(req: Request, res: Response): Promise<void> {
    const { firstName, lastName, email, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new AppError('User already exists with this email', 400);
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = this.userRepository.create({
        firstName,
        lastName,
        email,
        password: hashedPassword
      });

      await this.userRepository.save(user);

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '30d' }
      );

      // After user is created:
      const emailToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${emailToken}`;
      // Send email
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      await transporter.sendMail({
        to: user.email,
        subject: 'Verify your email',
        html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`
      });

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  // Login user
  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      // Check if user exists
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new AppError('Invalid credentials', 401);
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '30d' }
      );

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  // Get current user
  async getMe(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: req.user.id }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  // Forgot password
  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { id: user.id },
        process.env.JWT_RESET_SECRET || 'reset-secret-key',
        { expiresIn: '1h' }
      );

      // Save reset token to user
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 hour
      await this.userRepository.save(user);

      // TODO: Send reset password email

      res.status(200).json({
        success: true,
        message: 'Password reset email sent'
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  // Reset password
  async resetPassword(req: Request, res: Response): Promise<void> {
    const { token, password } = req.body;

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_RESET_SECRET || 'reset-secret-key'
      ) as { id: string };

      const user = await this.userRepository.findOne({
        where: {
          id: decoded.id,
          resetPasswordToken: token,
          resetPasswordExpire: MoreThan(new Date())
        }
      });

      if (!user) {
        throw new AppError('Invalid or expired reset token', 400);
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update user password
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;
      await this.userRepository.save(user);

      res.status(200).json({
        success: true,
        message: 'Password reset successful'
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query;
    try {
      const decoded = jwt.verify(token as string, process.env.JWT_SECRET) as { id: string };
      const userRepo = getRepository(User);
      const user = await userRepo.findOne({ where: { id: decoded.id } });
      if (!user) return res.status(404).json({ message: 'User not found' });
      user.isActive = true;
      await userRepo.save(user);
      res.json({ message: 'Email verified successfully' });
    } catch (err) {
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  };
} 
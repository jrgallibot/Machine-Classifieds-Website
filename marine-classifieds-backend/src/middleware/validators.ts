import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { AppError } from './errorHandler';

// Validation middleware
const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(error => error.msg);
    throw new AppError(messages.join(', '), 400);
  }
  next();
};

// Register validation rules
export const validateRegister = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
  
  validate
];

// Login validation rules
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required'),
  
  validate
];

// Listing creation validation rules
export const validateCreateListing = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  
  body('categories')
    .isArray()
    .withMessage('Categories must be an array')
    .notEmpty()
    .withMessage('At least one category is required'),
  
  validate
];

// Category creation validation rules
export const validateCreateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),
  
  body('description')
    .trim()
    .optional()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  
  body('parentId')
    .optional()
    .isUUID()
    .withMessage('Invalid parent category ID'),
  
  validate
];

// Message creation validation rules
export const validateCreateMessage = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters'),
  
  body('receiverId')
    .notEmpty()
    .withMessage('Receiver ID is required')
    .isUUID()
    .withMessage('Invalid receiver ID'),
  
  body('listingId')
    .notEmpty()
    .withMessage('Listing ID is required')
    .isUUID()
    .withMessage('Invalid listing ID'),
  
  validate
]; 
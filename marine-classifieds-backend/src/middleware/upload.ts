import multer from 'multer';
import { Request } from 'express';
import { AppError } from './errorHandler';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Accept only images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Please upload only images', 400));
  }
};

// Export multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 10 // Max 10 files per upload
  }
}); 
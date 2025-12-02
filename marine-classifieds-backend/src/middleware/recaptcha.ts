import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export const verifyRecaptcha = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.body.recaptchaToken;
  if (!token) return res.status(400).json({ message: 'Missing reCAPTCHA token' });
  try {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`);
    if (response.data.success) {
      next();
    } else {
      res.status(400).json({ message: 'Failed reCAPTCHA verification' });
    }
  } catch (err) {
    res.status(500).json({ message: 'reCAPTCHA verification error' });
  }
}; 
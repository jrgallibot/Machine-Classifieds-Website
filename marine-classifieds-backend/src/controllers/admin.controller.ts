import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { Listing } from '../entities/Listing';
import { Payment } from '../entities/Payment';
import { io } from '../index';

export const getAnalytics = async (req: Request, res: Response) => {
  const userRepo = getRepository(User);
  const listingRepo = getRepository(Listing);
  const paymentRepo = getRepository(Payment);
  const userCount = await userRepo.count();
  const listingCount = await listingRepo.count();
  const revenue = await paymentRepo.createQueryBuilder('payment').select('SUM(payment.amount)', 'total').getRawOne();
  res.json({ userCount, listingCount, totalRevenue: revenue.total });
};

export const getRevenue = async (req: Request, res: Response) => {
  const paymentRepo = getRepository(Payment);
  const payments = await paymentRepo.find({ order: { createdAt: 'DESC' } });
  res.json(payments);
};

export const getPendingListings = async (req: Request, res: Response) => {
  const listingRepo = getRepository(Listing);
  const listings = await listingRepo.find({ where: { status: 'pending' }, relations: ['user', 'category'] });
  res.json(listings);
};

export const moderateListing = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'
  const listingRepo = getRepository(Listing);
  const listing = await listingRepo.findOne({ where: { id } });
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  listing.status = status;
  await listingRepo.save(listing);
  io.emit('notification', { message: `Listing ${listing.title} has been ${status}` });
  res.json({ message: `Listing ${status}` });
}; 
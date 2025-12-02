import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Payment } from '../entities/Payment';
import { Listing } from '../entities/Listing';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { listingId, paymentType } = req.body;
    
    const listingRepository = getRepository(Listing);
    const listing = await listingRepository.findOne({ where: { id: listingId } });
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Define payment amounts based on type
    const paymentAmounts = {
      free: 0,
      premium: 1000, // $10.00 in cents
      featured: 3000  // $30.00 in cents
    };

    const amount = paymentAmounts[paymentType as keyof typeof paymentAmounts];
    
    if (amount === 0) {
      // Handle free listings
      listing.paymentType = paymentType;
      listing.status = 'active';
      await listingRepository.save(listing);
      
      return res.json({ message: 'Free listing created successfully' });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        listingId: listingId.toString(),
        userId: req.user?.id.toString(),
        paymentType
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment creation failed' });
  }
};

export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const paymentRepository = getRepository(Payment);
    const payments = await paymentRepository.find({
      where: { userId: req.user?.id },
      relations: ['listing'],
      order: { createdAt: 'DESC' }
    });
    
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payment history' });
  }
};

export const processWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const { listingId, userId, paymentType } = paymentIntent.metadata;

    const listingRepository = getRepository(Listing);
    const listing = await listingRepository.findOne({ where: { id: parseInt(listingId) } });
    
    if (listing) {
      listing.paymentType = paymentType;
      listing.status = 'active';
      await listingRepository.save(listing);
    }

    // Save payment record
    const paymentRepository = getRepository(Payment);
    const payment = new Payment();
    payment.userId = parseInt(userId);
    payment.listingId = parseInt(listingId);
    payment.amount = paymentIntent.amount;
    payment.paymentType = paymentType;
    payment.stripePaymentId = paymentIntent.id;
    payment.status = 'completed';
    
    await paymentRepository.save(payment);
  }

  res.json({ received: true });
}; 

export const createPayPalPayment = async (req: Request, res: Response) => {
  // TODO: Integrate with PayPal SDK
  res.json({ message: 'PayPal payment intent created (stub)' });
};

export const handlePayPalWebhook = async (req: Request, res: Response) => {
  // TODO: Handle PayPal webhook events
  res.json({ message: 'PayPal webhook received (stub)' });
}; 
import { Router } from 'express';
import { ListingsController, getListingBySlug } from '../controllers/listings.controller';
import { protect } from '../middleware/auth';
import { validateCreateListing } from '../middleware/validators';
import { upload } from '../middleware/upload';
import { apiLimiter } from '../middleware/rateLimit';
import { verifyRecaptcha } from '../middleware/recaptcha';

const router = Router();
const listingsController = new ListingsController();

// @route   GET /api/listings
// @desc    Get all listings with filters
// @access  Public
router.get('/', listingsController.getListings.bind(listingsController));

// @route   GET /api/listings/:id
// @desc    Get single listing
// @access  Public
router.get('/:id', listingsController.getListing.bind(listingsController));

// @route   GET /api/listings/slug/:slug
// @desc    Get single listing by slug
// @access  Public
router.get('/slug/:slug', getListingBySlug);

// @route   POST /api/listings
// @desc    Create new listing
// @access  Private
router.post(
  '/',
  apiLimiter,
  verifyRecaptcha,
  protect,
  upload.array('images', 10),
  validateCreateListing,
  listingsController.createListing.bind(listingsController)
);

// @route   PUT /api/listings/:id
// @desc    Update listing
// @access  Private
router.put(
  '/:id',
  protect,
  upload.array('images', 10),
  listingsController.updateListing.bind(listingsController)
);

// @route   DELETE /api/listings/:id
// @desc    Delete listing
// @access  Private
router.delete(
  '/:id',
  protect,
  listingsController.deleteListing.bind(listingsController)
);

export default router; 
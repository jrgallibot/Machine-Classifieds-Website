import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Listing, ListingStatus, ListingType } from '../entities/Listing';
import { Category } from '../entities/Category';
import { AppError } from '../middleware/errorHandler';
import { uploadToS3, deleteFromS3 } from '../utils/s3';
import slugify from 'slugify';

export class ListingsController {
  private listingRepository = getRepository(Listing);
  private categoryRepository = getRepository(Category);

  // Get all listings with filters
  async getListings(req: Request, res: Response): Promise<void> {
    try {
      const {
        status,
        type,
        category,
        minPrice,
        maxPrice,
        location,
        search,
        page = 1,
        limit = 10
      } = req.query;

      const queryBuilder = this.listingRepository
        .createQueryBuilder('listing')
        .leftJoinAndSelect('listing.user', 'user')
        .leftJoinAndSelect('listing.categories', 'categories');

      // Apply filters
      if (status) {
        queryBuilder.andWhere('listing.status = :status', { status });
      } else {
        queryBuilder.andWhere('listing.status = :status', {
          status: ListingStatus.ACTIVE
        });
      }

      if (type) {
        queryBuilder.andWhere('listing.type = :type', { type });
      }

      if (category) {
        queryBuilder.andWhere('categories.id = :categoryId', {
          categoryId: category
        });
      }

      if (minPrice) {
        queryBuilder.andWhere('listing.price >= :minPrice', {
          minPrice: Number(minPrice)
        });
      }

      if (maxPrice) {
        queryBuilder.andWhere('listing.price <= :maxPrice', {
          maxPrice: Number(maxPrice)
        });
      }

      if (location) {
        queryBuilder.andWhere('listing.location ILIKE :location', {
          location: `%${location}%`
        });
      }

      if (search) {
        queryBuilder.andWhere(
          '(listing.title ILIKE :search OR listing.description ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      // Add pagination
      const skip = (Number(page) - 1) * Number(limit);
      queryBuilder.skip(skip).take(Number(limit));

      // Order by newest first
      queryBuilder.orderBy('listing.createdAt', 'DESC');

      const [listings, total] = await queryBuilder.getManyAndCount();

      res.status(200).json({
        success: true,
        count: listings.length,
        total,
        pages: Math.ceil(total / Number(limit)),
        data: listings
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  // Get single listing
  async getListing(req: Request, res: Response): Promise<void> {
    try {
      const listing = await this.listingRepository.findOne({
        where: { id: req.params.id },
        relations: ['user', 'categories']
      });

      if (!listing) {
        throw new AppError('Listing not found', 404);
      }

      // Increment views
      listing.views += 1;
      await this.listingRepository.save(listing);

      res.status(200).json({
        success: true,
        data: listing
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  // Create new listing
  async createListing(req: Request, res: Response): Promise<void> {
    try {
      const {
        title,
        description,
        price,
        location,
        latitude,
        longitude,
        categories,
        type = ListingType.FREE
      } = req.body;

      // Check if categories exist
      const categoryEntities = await this.categoryRepository.findByIds(categories);
      if (categoryEntities.length !== categories.length) {
        throw new AppError('One or more categories not found', 400);
      }

      // Handle image uploads
      const images: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          const imageUrl = await uploadToS3(file);
          images.push(imageUrl);
        }
      }

      const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now();
      const listing = this.listingRepository.create({
        title,
        description,
        price,
        location,
        latitude,
        longitude,
        type,
        images,
        user: req.user,
        categories: categoryEntities,
        status: ListingStatus.ACTIVE,
        slug
      });

      await this.listingRepository.save(listing);

      res.status(201).json({
        success: true,
        data: listing
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  // Update listing
  async updateListing(req: Request, res: Response): Promise<void> {
    try {
      let listing = await this.listingRepository.findOne({
        where: { id: req.params.id },
        relations: ['user', 'categories']
      });

      if (!listing) {
        throw new AppError('Listing not found', 404);
      }

      // Check ownership
      if (listing.user.id !== req.user.id && !req.user.isAdmin) {
        throw new AppError('Not authorized to update this listing', 403);
      }

      // Update categories if provided
      if (req.body.categories) {
        const categoryEntities = await this.categoryRepository.findByIds(
          req.body.categories
        );
        if (categoryEntities.length !== req.body.categories.length) {
          throw new AppError('One or more categories not found', 400);
        }
        listing.categories = categoryEntities;
      }

      // Handle new image uploads
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          const imageUrl = await uploadToS3(file);
          listing.images.push(imageUrl);
        }
      }

      // Remove images if specified
      if (req.body.removeImages && Array.isArray(req.body.removeImages)) {
        for (const imageUrl of req.body.removeImages) {
          await deleteFromS3(imageUrl);
          listing.images = listing.images.filter(img => img !== imageUrl);
        }
      }

      // Update other fields
      listing = this.listingRepository.merge(listing, {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        location: req.body.location,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        type: req.body.type,
        status: req.body.status
      });

      await this.listingRepository.save(listing);

      res.status(200).json({
        success: true,
        data: listing
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  // Delete listing
  async deleteListing(req: Request, res: Response): Promise<void> {
    try {
      const listing = await this.listingRepository.findOne({
        where: { id: req.params.id },
        relations: ['user']
      });

      if (!listing) {
        throw new AppError('Listing not found', 404);
      }

      // Check ownership
      if (listing.user.id !== req.user.id && !req.user.isAdmin) {
        throw new AppError('Not authorized to delete this listing', 403);
      }

      // Delete images from S3
      for (const imageUrl of listing.images) {
        await deleteFromS3(imageUrl);
      }

      await this.listingRepository.remove(listing);

      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  async getListingBySlug(req: Request, res: Response): Promise<void> {
    const { slug } = req.params;
    const listing = await this.listingRepository.findOne({ where: { slug }, relations: ['user', 'categories'] });
    if (!listing) {
      throw new AppError('Listing not found', 404);
    }
    res.status(200).json({
      success: true,
      data: listing
    });
  }
} 
import { Response } from 'express';
import { ProductModel } from '../models/Product.js';
import { UserModel } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';
import crypto from 'crypto';

export async function addReview(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Please log in to leave a review.',
      });
    }

    const { productId } = req.params;
    const { rating, comment } = req.body;

    // Validate rating
    if (
      !rating ||
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      return res.status(400).json({
        message: 'Rating must be between 1 and 5 stars.',
      });
    }

    // Validate comment
    if (
      !comment ||
      typeof comment !== 'string' ||
      comment.trim().length < 3
    ) {
      return res.status(400).json({
        message: 'Please provide a helpful review comment.',
      });
    }

    // Find product
    const product = await ProductModel.findOne({
      id: productId,
    });

    if (!product) {
      return res.status(404).json({
        message: 'Product not found.',
      });
    }

    // Find user
    const user = await UserModel.findOne({
      id: req.user.id,
    });

    // Create review
    const review = {
      id: crypto.randomUUID(),
      userId: req.user.id,
      userName: req.user.name,
      userAvatar: user?.avatar || '',
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    // Add review to product
    product.reviews.push(review);

    // Recalculate rating
    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    product.numReviews = product.reviews.length;

    product.rating = Number(
      (totalRating / product.numReviews).toFixed(1)
    );

    await product.save();

    return res.status(201).json({
      review,
      product,
      message: 'Review posted successfully!',
    });
  } catch (error) {
    console.error('addReview error:', error);

    return res.status(500).json({
      message: 'Error submitting review.',
    });
  }
}
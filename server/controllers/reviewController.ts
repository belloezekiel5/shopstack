import { Response } from 'express';
import { store } from '../data/store.js';
import { AuthRequest } from '../middleware/auth.js';

export function addReview(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Please log in to leave a review.' });
    }

    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5 stars.' });
    }

    if (!comment || comment.trim().length < 3) {
      return res.status(400).json({ message: 'Please provide a helpful review comment.' });
    }

    const user = store.findUserById(req.user.id);
    const review = store.addReviewToProduct(productId, {
      userId: req.user.id,
      userName: req.user.name,
      userAvatar: user?.avatar,
      rating: Number(rating),
      comment: comment.trim()
    });

    if (!review) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const updatedProduct = store.findProductById(productId);

    return res.status(201).json({
      review,
      product: updatedProduct,
      message: 'Review posted successfully!'
    });
  } catch (error) {
    console.error('addReview error:', error);
    return res.status(500).json({ message: 'Error submitting review.' });
  }
}

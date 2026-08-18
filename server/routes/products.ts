import { Router, Request, Response } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview
} from '../store';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Public: Get all products with filtering & pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await getProducts(req.query);
    return res.json({
      success: true,
      products,
      total: products.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch products' });
  }
});

// Public: Get product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Also fetch related products
    const all = await getProducts({ category: product.category });
    const related = all
      .filter((p: any) => (p._id?.toString() || p.id) !== (product._id?.toString() || product.id))
      .slice(0, 4);

    return res.json({
      success: true,
      product,
      related
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch product' });
  }
});

// Auth required: Add review
router.post('/:id/reviews', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }

    const review = {
      id: 'rev_' + Date.now(),
      userId: req.user._id?.toString() || req.user.id,
      userName: req.user.name,
      userAvatar: req.user.avatar || '',
      rating: Number(rating),
      comment,
      createdAt: new Date()
    };

    const updated = await addProductReview(req.params.id, review);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.json({
      success: true,
      product: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to submit review' });
  }
});

// Admin: Create product
router.post('/', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { name, brand, category, price, stock, description, images, specifications, sku, featured } = req.body;
    if (!name || !brand || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name, brand, and price are required' });
    }

    const product = await createProduct({
      name,
      brand,
      category: category || 'Electronics',
      price: Number(price),
      discountPrice: req.body.discountPrice ? Number(req.body.discountPrice) : undefined,
      stock: Number(stock) || 0,
      description: description || '',
      images: Array.isArray(images) ? images : [images],
      specifications: specifications || {},
      sku: sku || `SKU-${Date.now().toString().slice(-4)}`,
      featured: Boolean(featured)
    });

    return res.status(201).json({
      success: true,
      product
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to create product' });
  }
});

// Admin: Update product
router.put('/:id', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const updated = await updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({
      success: true,
      product: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to update product' });
  }
});

// Admin: Delete product
router.delete('/:id', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({
      success: true,
      message: 'Product deleted successfully',
      product: deleted
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to delete product' });
  }
});

export default router;

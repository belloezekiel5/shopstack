import { Request, Response } from 'express';
import { store } from '../data/store.js';
import { ProductDoc } from '../data/types.js';

export function getProducts(req: Request, res: Response) {
  try {
    const {
      q,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStock,
      featured,
      sort = 'newest',
      page = '1',
      limit = '12'
    } = req.query;

    let items: ProductDoc[] = [...store.getAllProducts()];

    // Text search in name, description, brand, or category
    if (q && typeof q === 'string' && q.trim()) {
      const searchTerm = q.trim().toLowerCase();
      items = items.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        p.brand.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (category && typeof category === 'string' && category !== 'All') {
      items = items.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Brand filter
    if (brand && typeof brand === 'string' && brand !== 'All') {
      items = items.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    }

    // Price filter (effective price is discountPrice || price)
    if (minPrice) {
      const min = Number(minPrice);
      if (!isNaN(min)) {
        items = items.filter(p => (p.discountPrice ?? p.price) >= min);
      }
    }

    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max)) {
        items = items.filter(p => (p.discountPrice ?? p.price) <= max);
      }
    }

    // Rating filter
    if (rating) {
      const minRating = Number(rating);
      if (!isNaN(minRating)) {
        items = items.filter(p => p.rating >= minRating);
      }
    }

    // In-Stock filter
    if (inStock === 'true') {
      items = items.filter(p => p.stock > 0);
    }

    // Featured filter
    if (featured === 'true') {
      items = items.filter(p => p.featured);
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        items.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;
      case 'price_desc':
        items.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
        break;
      case 'rating':
        items.sort((a, b) => b.rating - a.rating || b.numReviews - a.numReviews);
        break;
      case 'name_asc':
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    // Total matched count before pagination
    const total = items.length;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit as string, 10) || 12));
    const totalPages = Math.ceil(total / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = items.slice(startIndex, startIndex + limitNum);

    return res.json({
      products: paginatedItems,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('getProducts error:', error);
    return res.status(500).json({ message: 'Error retrieving products.' });
  }
}

export function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = store.findProductById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Also get related products from same category
    const related = store
      .getAllProducts()
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);

    return res.json({ product, related });
  } catch (error) {
    console.error('getProductById error:', error);
    return res.status(500).json({ message: 'Error retrieving product details.' });
  }
}

export function getCategories(req: Request, res: Response) {
  try {
    const products = store.getAllProducts();
    const categoryMap: Record<string, number> = {};

    for (const prod of products) {
      categoryMap[prod.category] = (categoryMap[prod.category] || 0) + 1;
    }

    const categories = Object.entries(categoryMap).map(([name, count]) => ({
      name,
      count
    }));

    return res.json({ categories });
  } catch (error) {
    console.error('getCategories error:', error);
    return res.status(500).json({ message: 'Error retrieving categories.' });
  }
}

export function createProduct(req: Request, res: Response) {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      brand,
      images,
      stock,
      featured,
      sku,
      specifications
    } = req.body;

    if (!name || !description || price === undefined || !category || !brand) {
      return res.status(400).json({ message: 'Missing required product fields (name, description, price, category, brand).' });
    }

    const imageList = Array.isArray(images) && images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'];

    const newProduct = store.createProduct({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      category: category.trim(),
      brand: brand.trim(),
      images: imageList,
      stock: Number(stock) || 0,
      featured: Boolean(featured),
      sku: sku || `SKU-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      specifications: specifications || {}
    });

    return res.status(201).json({ product: newProduct, message: 'Product created successfully.' });
  } catch (error) {
    console.error('createProduct error:', error);
    return res.status(500).json({ message: 'Error creating product.' });
  }
}

export function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.discountPrice !== undefined) updates.discountPrice = updates.discountPrice ? Number(updates.discountPrice) : undefined;
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    const updated = store.updateProduct(id, updates);
    if (!updated) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json({ product: updated, message: 'Product updated successfully.' });
  } catch (error) {
    console.error('updateProduct error:', error);
    return res.status(500).json({ message: 'Error updating product.' });
  }
}

export function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = store.deleteProduct(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('deleteProduct error:', error);
    return res.status(500).json({ message: 'Error deleting product.' });
  }
}

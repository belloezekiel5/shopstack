import { Request, Response } from 'express';
import { ProductModel } from '../models/Product.js';
import { buildIdFilter, normalizeDoc, normalizeDocs } from '../utils/dbUtils.js';

export async function getProducts(req: Request, res: Response) {
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

    const filter: any = {};

    // Text search
    if (q && typeof q === 'string' && q.trim()) {
      const searchTerm = q.trim();
      filter.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } },
        { brand: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // Category
    if (category && typeof category === 'string' && category !== 'All') {
      filter.category = { $regex: `^${category}$`, $options: 'i' };
    }

    // Brand
    if (brand && typeof brand === 'string' && brand !== 'All') {
      filter.brand = { $regex: `^${brand}$`, $options: 'i' };
    }

    // Price
    if (minPrice || maxPrice) {
      const priceConditions: any[] = [];

      if (minPrice) {
        const min = Number(minPrice);

        if (!isNaN(min)) {
          priceConditions.push({
            $gte: [
              { $ifNull: ['$discountPrice', '$price'] },
              min
            ]
          });
        }
     }

  if (maxPrice) {
    const max = Number(maxPrice);

    if (!isNaN(max)) {
      priceConditions.push({
        $lte: [
          { $ifNull: ['$discountPrice', '$price'] },
          max
        ]
      });
    }
  }

  if (priceConditions.length === 1) {
    filter.$expr = priceConditions[0];
  } else if (priceConditions.length === 2) {
    filter.$expr = {
      $and: priceConditions
    };
  }
}

    // Rating
    if (rating) {
      const minRating = Number(rating);

      if (!isNaN(minRating)) {
        filter.rating = { $gte: minRating };
      }
    }

    // Stock
    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    // Featured
    if (featured === 'true') {
      filter.featured = true;
    }

    // Sorting
    let sortOption: any = { createdAt: -1 };

    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;

      case 'price_desc':
        sortOption = { price: -1 };
        break;

      case 'rating':
        sortOption = { rating: -1, numReviews: -1 };
        break;

      case 'name_asc':
        sortOption = { name: 1 };
        break;

      case 'newest':
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const pageNum = Math.max(
      1,
      parseInt(page as string, 10) || 1
    );

    const limitNum = Math.max(
      1,
      Math.min(50, parseInt(limit as string, 10) || 12)
    );

    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      ProductModel.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),

      ProductModel.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    const normalized = normalizeDocs(products);

    return res.json({
      products: normalized,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('getProducts error:', error);

    return res.status(500).json({
      message: 'Error retrieving products.'
    });
  }
}


export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const rawProduct = await ProductModel.findOne(buildIdFilter(id)).lean();

    if (!rawProduct) {
      return res.status(404).json({
        message: 'Product not found.'
      });
    }

    const product = normalizeDoc(rawProduct)!;

    const relatedRaw = await ProductModel.find({
      category: product.category,
      _id: { $ne: (rawProduct as any)._id }
    })
      .limit(4)
      .lean();

    const related = normalizeDocs(relatedRaw);

    return res.json({
      product,
      related
    });

  } catch (error) {
    console.error('getProductById error:', error);

    return res.status(500).json({
      message: 'Error retrieving product details.'
    });
  }
}


export async function getCategories(_req: Request, res: Response) {
  try {
    const categories = await ProductModel.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          count: 1
        }
      },
      {
        $sort: {
          name: 1
        }
      }
    ]);

    return res.json({
      categories
    });

  } catch (error) {
    console.error('getCategories error:', error);

    return res.status(500).json({
      message: 'Error retrieving categories.'
    });
  }
}


export async function createProduct(req: Request, res: Response) {
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

    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      !brand
    ) {
      return res.status(400).json({
        message:
          'Missing required product fields (name, description, price, category, brand).'
      });
    }

    const imageList =
      Array.isArray(images) && images.length > 0
        ? images
        : [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
          ];

    const newProduct = await ProductModel.create({
      id: `prod_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 7)}`,

      name: name.trim(),

      description: description.trim(),

      price: Number(price),

      discountPrice:
        discountPrice !== undefined && discountPrice !== ''
          ? Number(discountPrice)
          : undefined,

      category: category.trim(),

      brand: brand.trim(),

      images: imageList,

      stock: Number(stock) || 0,

      rating: 5,

      numReviews: 0,

      reviews: [],

      featured: Boolean(featured),

      sku:
        sku ||
        `SKU-${Math.random()
          .toString(36)
          .substring(2, 7)
          .toUpperCase()}`,

      specifications: specifications || {}
    });

    return res.status(201).json({
      product: newProduct,
      message: 'Product created successfully.'
    });

  } catch (error: any) {
    console.error('createProduct error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'A product with this ID or SKU already exists.'
      });
    }

    return res.status(500).json({
      message: 'Error creating product.'
    });
  }
}


export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const updates = {
      ...req.body
    };

    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
    }

    if (updates.discountPrice !== undefined) {
      updates.discountPrice =
        updates.discountPrice === ''
          ? undefined
          : Number(updates.discountPrice);
    }

    if (updates.stock !== undefined) {
      updates.stock = Number(updates.stock);
    }

    if (updates.name) {
      updates.name = updates.name.trim();
    }

    if (updates.description) {
      updates.description = updates.description.trim();
    }

    if (updates.category) {
      updates.category = updates.category.trim();
    }

    if (updates.brand) {
      updates.brand = updates.brand.trim();
    }

    const updated = await ProductModel.findOneAndUpdate(
      buildIdFilter(id),
      updates,
      {
        new: true,
        runValidators: true
      }
    ).lean();

    if (!updated) {
      return res.status(404).json({
        message: 'Product not found.'
      });
    }

    return res.json({
      product: normalizeDoc(updated),
      message: 'Product updated successfully.'
    });

  } catch (error: any) {
    console.error('updateProduct error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'A product with this SKU already exists.'
      });
    }

    return res.status(500).json({
      message: 'Error updating product.'
    });
  }
}


export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const deleted = await ProductModel.findOneAndDelete(buildIdFilter(id));

    if (!deleted) {
      return res.status(404).json({
        message: 'Product not found.'
      });
    }

    return res.json({
      message: 'Product deleted successfully.'
    });

  } catch (error) {
    console.error('deleteProduct error:', error);

    return res.status(500).json({
      message: 'Error deleting product.'
    });
  }
}
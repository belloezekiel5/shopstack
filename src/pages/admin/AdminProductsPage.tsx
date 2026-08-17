import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  AlertTriangle
} from 'lucide-react';
import { api } from '../../services/api';
import { Product } from '../../types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminProductsPage: React.FC = () => {
  const { success, error } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Delete modal state
  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Electronics',
    price: 99.99,
    discountPrice: 0,
    stock: 25,
    description: '',
    images: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    sku: '',
    featured: false
  });

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAdminProducts({ limit: 100 });
      setProducts(res.products);
    } catch (err: any) {
      error(err.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: '',
      category: 'Electronics',
      price: 49.99,
      discountPrice: 0,
      stock: 20,
      description: '',
      images: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      featured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      discountPrice: product.discountPrice || 0,
      stock: product.stock,
      description: product.description,
      images: product.images.join(', '),
      sku: product.sku || '',
      featured: !!product.featured
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.brand || formData.price <= 0) {
      error('Please complete all required fields.');
      return;
    }

    try {
      setIsSaving(true);
      const imageUrls = formData.images
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        price: Number(formData.price),
        discountPrice: formData.discountPrice > 0 ? Number(formData.discountPrice) : undefined,
        stock: Number(formData.stock),
        description: formData.description,
        images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
        sku: formData.sku,
        featured: formData.featured
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        success('Product updated successfully!');
      } else {
        await api.createProduct(payload);
        success('Product created successfully!');
      }

      setIsModalOpen(false);
      loadProducts();
    } catch (err: any) {
      error(err.message || 'Failed to save product.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteCandidate) return;
    try {
      setIsDeleting(true);
      await api.deleteProduct(deleteCandidate.id);
      success('Product deleted successfully!');
      setDeleteCandidate(null);
      loadProducts();
    } catch (err: any) {
      error(err.message || 'Failed to delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">Product Inventory</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage catalogue, stock counts, discounts, and product details.
          </p>
        </div>

        <Button
          id="admin-add-product-btn"
          variant="primary"
          size="md"
          onClick={handleOpenAddModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Product
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by title, brand, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs py-2 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 font-semibold text-gray-800 focus:outline-none focus:border-[#FDBF2D] cursor-pointer w-full sm:w-auto"
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home">Home</option>
          <option value="Beauty">Beauty</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">Product</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Discount</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3">Rating</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Loading inventory...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No products match your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-10 h-10 rounded-xl object-cover bg-gray-50 border border-gray-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-[#1A1A1A] truncate max-w-xs">{prod.name}</div>
                          <div className="text-[11px] text-gray-400">
                            {prod.brand} • {prod.sku || 'SKU-001'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600 font-medium">{prod.category}</td>
                    <td className="py-3 font-bold text-[#1A1A1A]">${prod.price.toFixed(2)}</td>
                    <td className="py-3">
                      {prod.discountPrice ? (
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                          ${prod.discountPrice.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-md ${
                          prod.stock <= 5
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="py-3 text-gray-700 font-semibold">
                      ★ {prod.rating.toFixed(1)} ({prod.reviews?.length || 0})
                    </td>
                    <td className="py-3 text-right pr-2">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          id={`edit-product-${prod.id}`}
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          id={`delete-product-${prod.id}`}
                          onClick={() => setDeleteCandidate(prod)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Product Title *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g. Minimalist Noise-Cancelling Headphones"
              className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Brand *</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
                placeholder="e.g. AudioCraft"
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A] cursor-pointer"
              >
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home">Home</option>
                <option value="Beauty">Beauty</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                required
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Discount Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: parseFloat(e.target.value) || 0 })}
                placeholder="Optional"
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Stock Count *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                required
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Image URLs (comma separated)</label>
            <input
              type="text"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              placeholder="https://images.unsplash.com/..., https://..."
              className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of features, materials, warranty..."
              className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FDBF2D] text-[#1A1A1A]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="featured-checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded text-[#1A1A1A] accent-[#FAF92A]"
            />
            <label htmlFor="featured-checkbox" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
              Mark as Featured Product on Homepage
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        title="Delete Product"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>
              Are you sure you want to permanently remove <strong>{deleteCandidate?.name}</strong> from catalog?
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteCandidate(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={handleDeleteProduct}
            >
              Delete Product
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Product, ProductVariant, CategoryType } from '@/types';
import {
  Tag,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Package,
  Sparkles,
  Layers,
  ArrowRight,
  X,
  Check,
  Percent,
  AlertTriangle,
} from 'lucide-react';

const CATEGORIES: CategoryType[] = [
  'Milk',
  'Ghee',
  'Oils',
  'Dairy',
  'Farm Products',
  'Herbal & Wellness',
  'Personal Care',
  'Traditional Staples',
  'Mindful Living',
];

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, updateProductPrice, deleteProduct, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Quick Price Edit Modal State
  const [quickPriceModal, setQuickPriceModal] = useState<{
    product: Product;
    variant: ProductVariant;
    newPrice: number;
    newMrp: number;
    newStock: number;
  } | null>(null);

  // Full Edit Product Modal State
  const [editProductModal, setEditProductModal] = useState<Product | null>(null);

  // Add Product Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdTagline, setNewProdTagline] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<CategoryType>('Milk');
  const [newProdPrice, setNewProdPrice] = useState<number>(95);
  const [newProdMrp, setNewProdMrp] = useState<number>(110);
  const [newProdUnit, setNewProdUnit] = useState('1 L');
  const [newProdStock, setNewProdStock] = useState<number>(150);
  const [newProdImage, setNewProdImage] = useState('/products/cow-milk-1.jpg');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdSubscription, setNewProdSubscription] = useState(true);
  const [newProdBestSeller, setNewProdBestSeller] = useState(false);

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  // Calculate statistics
  const totalProducts = products.length;
  const totalVariants = products.reduce((acc, p) => acc + p.variants.length, 0);
  const subscriptionCount = products.filter((p) => p.isSubscriptionEligible).length;

  const handleSaveQuickPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPriceModal) return;

    updateProductPrice(
      quickPriceModal.product.id,
      quickPriceModal.variant.id,
      quickPriceModal.newPrice,
      quickPriceModal.newMrp
    );

    // Also update stock if modified
    if (quickPriceModal.newStock !== quickPriceModal.variant.stock) {
      const updatedVariants = quickPriceModal.product.variants.map((v) =>
        v.id === quickPriceModal.variant.id ? { ...v, stock: quickPriceModal.newStock } : v
      );
      updateProduct(quickPriceModal.product.id, { variants: updatedVariants });
    }

    setQuickPriceModal(null);
  };

  const handleSaveFullEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProductModal) return;

    updateProduct(editProductModal.id, {
      name: editProductModal.name,
      tagline: editProductModal.tagline,
      category: editProductModal.category,
      description: editProductModal.description,
      isSubscriptionEligible: editProductModal.isSubscriptionEligible,
      isBestSeller: editProductModal.isBestSeller,
      isFeatured: editProductModal.isFeatured,
      variants: editProductModal.variants,
    });

    setEditProductModal(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const discountPct = newProdMrp > newProdPrice ? Math.round(((newProdMrp - newProdPrice) / newProdMrp) * 100) : 0;

    const created = addProduct({
      name: newProdName,
      tagline: newProdTagline || '100% Pure, Organic & Farm-Fresh',
      category: newProdCategory,
      description: newProdDesc || `${newProdName} fresh from Savera Farms Panchkula & Morni foothills.`,
      ingredients: [newProdName, 'Natural Farm Produce'],
      nutritionalInfo: [
        { label: 'Purity', value: '100% Unadulterated' },
        { label: 'Farm Origin', value: 'Panchkula / Morni Hills' },
      ],
      storageInstructions: 'Store in cool and hygienic conditions.',
      shelfLife: 'Best before expiry marked on package.',
      manufacturingInfo: 'Savera Godhan Agri Farm, Panchkula, Haryana.',
      origin: 'Panchkula / Morni Foothills, Haryana',
      benefits: ['Chemical-free', 'Traditionally processed', 'Nutrient dense'],
      howItIsMade: ['Cold-chain handled', 'Tested for 0% chemicals'],
      faqs: [{ question: 'Is this fresh?', answer: 'Yes, delivered directly within 12 hours of farm harvest.' }],
      images: [newProdImage || '/products/cow-milk-1.jpg'],
      rating: 4.9,
      reviewCount: 18,
      isSubscriptionEligible: newProdSubscription,
      isBestSeller: newProdBestSeller,
      variants: [
        {
          id: `var-${Date.now()}-1`,
          name: newProdUnit,
          price: newProdPrice,
          mrp: newProdMrp,
          discountPct,
          stock: newProdStock,
          sku: `SAV-${newProdCategory.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
          weightVolume: newProdUnit,
        },
      ],
    });

    setShowAddModal(false);
    setNewProdName('');
    setNewProdTagline('');
    setNewProdPrice(95);
    setNewProdMrp(110);
    setNewProdStock(150);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-savera-saffron font-bold uppercase tracking-wider mb-1">
            <Tag className="w-3.5 h-3.5" />
            <span>Catalog & Pricing Engine</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">Products & Live Prices</h1>
          <p className="text-xs text-slate-400">
            Super Admin control: Update selling prices, manage MRPs, configure stock, and add new farm products.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-savera-saffron hover:bg-amber-500 text-savera-dark font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Total Products</span>
          <span className="font-serif text-2xl font-bold text-white">{totalProducts}</span>
          <span className="text-[10px] text-slate-500 block">Across 9 Farm Categories</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Active SKUs / Sizes</span>
          <span className="font-serif text-2xl font-bold text-savera-saffron">{totalVariants}</span>
          <span className="text-[10px] text-slate-500 block">Independently priced</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Subscription Items</span>
          <span className="font-serif text-2xl font-bold text-emerald-400">{subscriptionCount}</span>
          <span className="text-[10px] text-slate-500 block">Daily 5 AM Morning Drop</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Delivery Base</span>
          <span className="font-serif text-2xl font-bold text-white">Tricity</span>
          <span className="text-[10px] text-emerald-400 font-bold block">Panchkula & Chandigarh</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search products by name, category, or size..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-savera-saffron"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-savera-saffron text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All ({products.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-savera-saffron text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Catalog Grid */}
      <div className="space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="bg-slate-950 p-12 rounded-3xl border border-slate-800 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-white">No Products Found</h3>
            <p className="text-xs text-slate-400">Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-slate-950 rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                {/* Product Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={prod.images[0] || '/products/cow-milk-1.jpg'}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-slate-900 text-savera-saffron font-bold px-2 py-0.5 rounded-full border border-slate-800">
                        {prod.category}
                      </span>
                      {prod.isSubscriptionEligible && (
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-800/40">
                          Daily Milk Sub
                        </span>
                      )}
                      {prod.isBestSeller && (
                        <span className="text-[10px] bg-amber-950 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                          ⭐ Best Seller
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-base font-bold text-white truncate mt-0.5">{prod.name}</h3>
                    <p className="text-[11px] text-slate-400 truncate">{prod.tagline}</p>
                  </div>
                </div>

                {/* Main Product Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => setEditProductModal(prod)}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-savera-saffron" />
                    <span>Edit Product</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to remove "${prod.name}" from the store catalog?`)) {
                        deleteProduct(prod.id);
                      }
                    }}
                    className="p-1.5 rounded-xl border border-red-900/40 text-red-400 hover:bg-red-950/60 transition"
                    title="Delete Product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Variants & Pricing List */}
              <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Priced Variants & Real-Time Rates:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {prod.variants.map((v) => (
                    <div
                      key={v.id}
                      className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-xs">{v.name}</span>
                          <span className="text-[9px] text-slate-500 font-mono">({v.sku})</span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-savera-saffron font-bold text-sm">₹{v.price}</span>
                          {v.mrp > v.price && (
                            <span className="text-slate-500 line-through text-[11px]">₹{v.mrp}</span>
                          )}
                          {v.discountPct > 0 && (
                            <span className="text-[10px] text-emerald-400 font-bold">({v.discountPct}% OFF)</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Stock: {v.stock} units</span>
                      </div>

                      {/* Quick Price Update Trigger */}
                      <button
                        onClick={() =>
                          setQuickPriceModal({
                            product: prod,
                            variant: v,
                            newPrice: v.price,
                            newMrp: v.mrp,
                            newStock: v.stock,
                          })
                        }
                        className="bg-slate-900 hover:bg-slate-800 text-savera-saffron hover:text-white border border-slate-700 font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition shrink-0"
                      >
                        Update Price
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Price Update Modal */}
      {quickPriceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-3xl p-6 max-w-sm w-full border border-slate-800 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-savera-saffron font-bold uppercase tracking-wider block">
                  Quick Price Modification
                </span>
                <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                  {quickPriceModal.product.name}
                </h3>
                <span className="text-xs text-slate-400">Variant: {quickPriceModal.variant.name}</span>
              </div>
              <button
                onClick={() => setQuickPriceModal(null)}
                className="text-slate-500 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickPrice} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Selling Price (₹) <span className="text-emerald-400 font-normal">- Customer Pays</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={quickPriceModal.newPrice}
                  onChange={(e) =>
                    setQuickPriceModal({ ...quickPriceModal, newPrice: Number(e.target.value) })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-base focus:outline-none focus:border-savera-saffron"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  MRP / Strike Price (₹) <span className="text-slate-500 font-normal">- Original Value</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={quickPriceModal.newMrp}
                  onChange={(e) =>
                    setQuickPriceModal({ ...quickPriceModal, newMrp: Number(e.target.value) })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-savera-saffron"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Stock Available (units)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={quickPriceModal.newStock}
                  onChange={(e) =>
                    setQuickPriceModal({ ...quickPriceModal, newStock: Number(e.target.value) })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-savera-saffron"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-savera-saffron hover:bg-amber-500 text-savera-dark font-bold py-2.5 rounded-xl transition shadow-md"
                >
                  Save Live Price
                </button>
                <button
                  type="button"
                  onClick={() => setQuickPriceModal(null)}
                  className="bg-slate-900 text-slate-400 hover:text-white px-4 py-2.5 rounded-xl border border-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Edit Product Modal */}
      {editProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-3xl p-6 max-w-xl w-full border border-slate-800 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-savera-saffron font-bold uppercase tracking-wider block">
                  Product Details Editor
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-0.5">
                  Edit {editProductModal.name}
                </h3>
              </div>
              <button
                onClick={() => setEditProductModal(null)}
                className="text-slate-500 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFullEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={editProductModal.name}
                    onChange={(e) => setEditProductModal({ ...editProductModal, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-savera-saffron"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Category</label>
                  <select
                    value={editProductModal.category}
                    onChange={(e) =>
                      setEditProductModal({ ...editProductModal, category: e.target.value as CategoryType })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-savera-saffron"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Tagline</label>
                <input
                  type="text"
                  value={editProductModal.tagline}
                  onChange={(e) => setEditProductModal({ ...editProductModal, tagline: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-savera-saffron"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={editProductModal.description}
                  onChange={(e) => setEditProductModal({ ...editProductModal, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-savera-saffron"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={editProductModal.isSubscriptionEligible}
                    onChange={(e) =>
                      setEditProductModal({ ...editProductModal, isSubscriptionEligible: e.target.checked })
                    }
                    className="rounded bg-slate-900 border-slate-700 text-savera-saffron focus:ring-0"
                  />
                  <span>Subscription Eligible (Daily Milk)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={editProductModal.isBestSeller}
                    onChange={(e) =>
                      setEditProductModal({ ...editProductModal, isBestSeller: e.target.checked })
                    }
                    className="rounded bg-slate-900 border-slate-700 text-savera-saffron focus:ring-0"
                  />
                  <span>Best Seller Badge</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-savera-saffron hover:bg-amber-500 text-savera-dark font-bold py-2.5 rounded-xl transition shadow-md"
                >
                  Save Product Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditProductModal(null)}
                  className="bg-slate-900 text-slate-400 hover:text-white px-4 py-2.5 rounded-xl border border-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-3xl p-6 max-w-xl w-full border border-slate-800 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-savera-saffron font-bold uppercase tracking-wider block">
                  Catalog Expansion
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-0.5">
                  Add New Farm Product
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A2 Malai Paneer"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-savera-saffron"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as CategoryType)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-savera-saffron"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Fresh curd-churned traditional paneer"
                  value={newProdTagline}
                  onChange={(e) => setNewProdTagline(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-savera-saffron"
                />
              </div>

              {/* Price, MRP, Size, Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-savera-saffron focus:outline-none focus:border-savera-saffron"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProdMrp}
                    onChange={(e) => setNewProdMrp(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-savera-saffron"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Size / Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500 g"
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-savera-saffron"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-savera-saffron"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Image URL</label>
                <input
                  type="text"
                  placeholder="/products/cow-milk-1.jpg"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-savera-saffron"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Freshly prepared in Panchkula workshop..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-savera-saffron"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={newProdSubscription}
                    onChange={(e) => setNewProdSubscription(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-savera-saffron focus:ring-0"
                  />
                  <span>Subscription Eligible</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={newProdBestSeller}
                    onChange={(e) => setNewProdBestSeller(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-savera-saffron focus:ring-0"
                  />
                  <span>Mark as Best Seller</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-savera-saffron hover:bg-amber-500 text-savera-dark font-bold py-2.5 rounded-xl transition shadow-md"
                >
                  Publish Product to Store
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-900 text-slate-400 hover:text-white px-4 py-2.5 rounded-xl border border-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


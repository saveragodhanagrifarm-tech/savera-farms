'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ProductCard } from '@/components/shop/ProductCard';
import { SubscribeModal } from '@/components/shop/SubscribeModal';
import { CategoryType, Product } from '@/types';
import { Filter, Search, Sparkles, ArrowUpDown, X } from 'lucide-react';

function ShopContent() {
  const { products, syncCatalogFromCloud } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Sync catalog prices from cloud on page load
  useEffect(() => {
    syncCatalogFromCloud();
  }, []);

  const urlCategory = searchParams.get('cat') as CategoryType | null;
  const urlQuery = searchParams.get('q') || '';

  const [activeCategory, setActiveCategory] = useState<CategoryType | 'All'>(
    urlCategory || 'All'
  );
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [selectedSubProduct, setSelectedSubProduct] = useState<{
    product: Product;
    variantId: string;
  } | null>(null);

  // Sync state if searchParams change in the URL
  useEffect(() => {
    if (urlCategory) {
      setActiveCategory(urlCategory);
    } else {
      setActiveCategory('All');
    }
  }, [urlCategory]);

  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);

  const categories: (CategoryType | 'All')[] = [
    'All',
    'Herbal & Wellness',
    'Personal Care',
    'Traditional Staples',
    'Milk',
    'Ghee',
    'Dairy',
    'Oils',
    'Mindful Living',
  ];

  const handleCategorySelect = (cat: CategoryType | 'All') => {
    setActiveCategory(cat);
    if (cat === 'All') {
      router.push('/shop');
    } else {
      router.push(`/shop?cat=${encodeURIComponent(cat)}`);
    }
  };

  const handleClearFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setSortBy('featured');
    router.push('/shop');
  };

  // Filter products
  let filteredProducts = products.filter((p) => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.variants[0]?.price || 0;
    const priceB = b.variants[0]?.price || 0;
    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    // default: featured first, then bestsellers
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-28 sm:pb-12 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="bg-savera-dark text-savera-cream rounded-3xl p-6 sm:p-10 shadow-floating flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-savera-saffron uppercase tracking-widest block mb-1">
            Organic • Natural • Traditional
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">The Savera Product Range</h1>
          <p className="text-xs sm:text-sm text-savera-cream/80 mt-1 max-w-xl leading-relaxed">
            A thoughtfully curated range for everyday living — Natural inspiration for simple daily rituals, pure A2 dairy, and traditional wellness.
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-savera-green/40 p-4 rounded-2xl border border-savera-saffron/30 shrink-0">
          <Sparkles className="w-5 h-5 text-savera-saffron" />
          <div className="text-left">
            <span className="text-xs font-bold text-white block">Morning Chilled Delivery</span>
            <span className="text-[10px] text-savera-cream/80 block">Dispatched Daily at 4:30 AM</span>
          </div>
        </div>
      </div>

      {/* Filters, Search & Sorting Bar */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                activeCategory === cat
                  ? 'bg-savera-dark text-savera-saffron shadow-sm'
                  : 'bg-white border border-savera-dark/10 text-savera-dark hover:bg-savera-cream'
              }`}
            >
              <span>{cat === 'All' ? '🌱 All Farm Products' : cat}</span>
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-savera-dark/10 shadow-soft">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search products by name or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl pl-9 pr-8 py-2 text-xs text-savera-dark focus:outline-none focus:ring-2 focus:ring-savera-green"
            />
            <Search className="w-4 h-4 text-savera-brown/50 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-savera-brown font-semibold">
              Showing <strong>{filteredProducts.length}</strong> items
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-savera-offwhite px-3 py-1.5 rounded-xl border border-savera-dark/15">
              <ArrowUpDown className="w-3.5 h-3.5 text-savera-green" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-savera-dark focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured / Best Sellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-savera-dark/10 p-8 space-y-4 shadow-soft">
          <div className="w-16 h-16 rounded-full bg-savera-cream flex items-center justify-center mx-auto text-savera-brown">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-savera-dark">No Products Found</h3>
          <p className="text-xs text-savera-brown/70 max-w-sm mx-auto">
            No products match your selected category <strong>"{activeCategory}"</strong> or query <strong>"{searchQuery}"</strong>.
          </p>
          <button
            onClick={handleClearFilters}
            className="bg-savera-dark text-savera-cream font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-savera-green transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSubscribe={(prod, vId) => setSelectedSubProduct({ product: prod, variantId: vId })}
            />
          ))}
        </div>
      )}

      {/* Milk Subscription Modal */}
      {selectedSubProduct && (
        <SubscribeModal
          product={selectedSubProduct.product}
          initialVariantId={selectedSubProduct.variantId}
          onClose={() => setSelectedSubProduct(null)}
        />
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs">Loading Catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}

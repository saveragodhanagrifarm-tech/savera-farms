'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import { Star, ShoppingBag, Calendar, Sparkles, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSubscribe: (product: Product, variantId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSubscribe }) => {
  const { addToCart } = useApp();
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id || '');
  const [justAdded, setJustAdded] = useState(false);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  const handleAddToCart = () => {
    addToCart(product, selectedVariant.id, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-savera-dark/10 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col group relative">
      {/* Discount & Special Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
        {selectedVariant.discountPct > 0 && (
          <span className="bg-savera-dark text-savera-saffron text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            {selectedVariant.discountPct}% OFF
          </span>
        )}
        {product.fatPercentage && (
          <span className="bg-savera-cream text-savera-brown border border-savera-saffron/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {product.fatPercentage} Fat
          </span>
        )}
      </div>

      {product.isBestSeller && (
        <div className="absolute top-3 right-3 z-10 bg-savera-saffron text-savera-brown text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm pointer-events-none">
          <Sparkles className="w-3 h-3 text-savera-dark" />
          <span>Best Seller</span>
        </div>
      )}

      {/* Image Gallery Container */}
      <Link href={`/shop/${product.id}`} className="relative h-56 w-full bg-savera-offwhite overflow-hidden block">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
      </Link>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-wider text-savera-green uppercase">
              {product.category} {product.subcategory ? `• ${product.subcategory}` : ''}
            </span>
            <div className="flex items-center gap-1 bg-savera-cream/80 px-2 py-0.5 rounded-full text-[11px] font-bold text-savera-brown">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{product.rating}</span>
              <span className="text-gray-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          <Link href={`/shop/${product.id}`} className="hover:text-savera-green transition">
            <h3 className="font-serif text-lg font-bold text-savera-dark leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-savera-brown/80 line-clamp-2 mt-1 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Variant Selector Dropdown */}
        {product.variants.length > 1 && (
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-savera-dark/70 uppercase tracking-wide">
              Select Package Size:
            </label>
            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-1.5 text-xs text-savera-dark font-semibold focus:outline-none focus:ring-2 focus:ring-savera-green/30"
            >
              {product.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} — ₹{v.price} {v.mrp > v.price ? `(MRP ₹${v.mrp})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Pricing Display */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold font-serif text-savera-dark">₹{selectedVariant.price}</span>
          {selectedVariant.mrp > selectedVariant.price && (
            <span className="text-xs text-gray-400 line-through">₹{selectedVariant.mrp}</span>
          )}
          <span className="text-[10px] font-semibold text-savera-green ml-auto">
            {selectedVariant.weightVolume}
          </span>
        </div>

        {/* Action Buttons: Add to Cart vs Subscribe */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
              justAdded
                ? 'bg-savera-green text-white shadow-sm'
                : 'bg-savera-cream hover:bg-savera-paleGreen border border-savera-saffronDark/30 text-savera-dark'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-savera-dark" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          {product.isSubscriptionEligible ? (
            <button
              onClick={() => onSubscribe(product, selectedVariant.id)}
              className="flex items-center justify-center gap-1.5 bg-savera-dark hover:bg-savera-green text-savera-cream py-2.5 px-3 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-savera-saffron" />
              <span>Subscribe</span>
            </button>
          ) : (
            <Link
              href={`/shop/${product.id}`}
              className="flex items-center justify-center bg-savera-dark hover:bg-savera-green text-white py-2.5 px-3 rounded-xl text-xs font-bold transition"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

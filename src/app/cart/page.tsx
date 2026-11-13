'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ProductCard } from '@/components/shop/ProductCard';
import { SubscribeModal } from '@/components/shop/SubscribeModal';
import { Product } from '@/types';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  Truck,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    cartDiscount,
    freeShippingThreshold,
    deliveryFee,
    cartTotal,
    appliedCoupon,
    coupons,
    applyCoupon,
    removeCoupon,
    products,
    syncCatalogFromCloud,
  } = useApp();

  useEffect(() => {
    syncCatalogFromCloud();
  }, []);

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [selectedSubProduct, setSelectedSubProduct] = useState<{
    product: Product;
    variantId: string;
  } | null>(null);

  const neededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingPct = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) setCouponError(res.message);
    else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const handleApplyQuickCoupon = (code: string) => {
    const res = applyCoupon(code);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  // Recommend products not already in the cart
  const cartProductIds = cart.map((i) => i.productId);
  const recommendedProducts = products.filter((p) => !cartProductIds.includes(p.id)).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-28 sm:pb-12 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-savera-dark/10">
        <div>
          <h1 className="font-serif text-3xl font-bold text-savera-dark">Your Shopping Cart</h1>
          <p className="text-xs text-savera-brown font-semibold">
            {cart.length > 0 ? `${cart.length} unique item${cart.length > 1 ? 's' : ''} in your cart` : 'Review your fresh items before checkout'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cart</span>
            </button>
          )}
          <Link href="/shop" className="text-xs font-bold text-savera-green hover:underline">
            + Continue Shopping
          </Link>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-savera-dark/10 shadow-soft space-y-4">
          <div className="w-16 h-16 rounded-full bg-savera-cream flex items-center justify-center mx-auto text-savera-brown">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-savera-dark">Your Cart is Currently Empty</h3>
          <p className="text-xs text-savera-brown/70 max-w-sm mx-auto">
            Discover the goodness of pure A2 Desi Cow Milk, Vedic Bilona Ghee, fresh paneer, and cold-pressed oils.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-savera-dark text-savera-cream font-bold px-8 py-3.5 rounded-2xl text-xs hover:bg-savera-green transition shadow-md"
          >
            Browse Farm Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Delivery Bar */}
            <div className="bg-savera-cream p-4 rounded-2xl border border-savera-saffron/40">
              {neededForFreeShipping > 0 ? (
                <div>
                  <p className="text-xs font-bold text-savera-brown flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-savera-green" />
                    <span>
                      Add <strong className="text-savera-dark">₹{neededForFreeShipping}</strong> more to unlock FREE Morning Delivery!
                    </span>
                  </p>
                  <div className="w-full bg-savera-saffron/30 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-savera-green h-full rounded-full transition-all duration-500"
                      style={{ width: `${freeShippingPct}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-xs font-bold text-savera-green flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-savera-saffron" />
                  <span>🎉 You unlocked FREE Morning Doorstep Delivery (5:00 AM – 7:00 AM)!</span>
                </p>
              )}
            </div>

            {/* Cart Items Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-savera-dark/10 shadow-soft divide-y divide-savera-dark/10">
              {cart.map((item) => (
                <div key={item.variantId} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden relative bg-savera-offwhite border border-savera-dark/10 shrink-0">
                      <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif font-bold text-savera-dark text-sm sm:text-base truncate">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.variantId)}
                          className="sm:hidden text-gray-400 hover:text-red-500 p-1 shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-xs text-savera-green font-semibold block">{item.variantName}</span>
                      <div className="text-xs font-bold text-savera-dark mt-0.5">₹{item.price} / unit</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-19 sm:pl-0">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-savera-offwhite border border-savera-dark/15 rounded-xl px-2.5 py-1">
                      <button
                        onClick={() => updateQuantity(item.variantId, -1)}
                        className="p-0.5 text-savera-dark hover:text-red-500"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-savera-dark w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantId, 1)}
                        className="p-0.5 text-savera-dark hover:text-savera-green"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-serif text-base font-bold text-savera-dark block">
                        ₹{item.price * item.quantity}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        className="hidden sm:inline-flex text-xs text-red-500 hover:underline items-center gap-1 mt-1 font-semibold"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Summary Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-savera-dark/10 shadow-soft space-y-6 self-start">
            <h3 className="font-serif text-lg font-bold text-savera-dark pb-3 border-b border-savera-dark/10">
              Order Summary
            </h3>

            {/* Coupon Code Section */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-savera-paleGreen p-3 rounded-xl border border-savera-green/30 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-savera-green" />
                    <div>
                      <span className="font-bold text-savera-dark uppercase">{appliedCoupon.code}</span>
                      <p className="text-[10px] text-savera-brown">{appliedCoupon.description}</p>
                    </div>
                  </div>
                  <button onClick={removeCoupon} className="text-xs text-red-600 font-bold hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code (e.g. FIRST100)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-savera-offwhite border border-savera-dark/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-savera-green font-mono uppercase"
                    />
                    <button type="submit" className="bg-savera-dark text-savera-cream font-bold px-4 py-2 rounded-xl text-xs hover:bg-savera-green transition">
                      Apply
                    </button>
                  </form>

                  {/* 1-Click Available Coupon Pills */}
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-savera-brown/70 block mb-1">
                      Available Offers (1-Click Apply):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {coupons.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleApplyQuickCoupon(c.code)}
                          className="bg-savera-cream hover:bg-savera-saffron/40 border border-savera-saffronDark/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg text-savera-brown transition"
                        >
                          {c.code}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {couponError && <p className="text-[10px] text-red-500 mt-1 font-semibold">{couponError}</p>}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-savera-brown">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-savera-dark">₹{cartSubtotal}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-savera-green font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{cartDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <strong className="text-savera-green font-bold">FREE</strong>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-serif font-bold text-savera-dark pt-3 border-t border-savera-dark/10">
                <span>Total Amount</span>
                <span className="text-xl text-savera-green font-sans font-bold">₹{cartTotal}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full bg-savera-dark text-savera-cream font-bold py-4 rounded-2xl text-xs hover:bg-savera-green transition shadow-floating flex items-center justify-center gap-2"
            >
              <span>Proceed to Express Checkout</span>
              <ArrowRight className="w-4 h-4 text-savera-saffron" />
            </Link>

            <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-savera-green" />
              <span>Safe & Secure Checkout • 100% Purity Guarantee</span>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Products Slider */}
      {recommendedProducts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-savera-dark/10">
          <div>
            <span className="text-xs font-bold text-savera-green uppercase tracking-wider block">Frequently Bought Together</span>
            <h2 className="font-serif text-2xl font-bold text-savera-dark">Complete Your Healthy Pantry</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recommendedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSubscribe={(prod, vId) => setSelectedSubProduct({ product: prod, variantId: vId })}
              />
            ))}
          </div>
        </div>
      )}

      {/* Subscription Modal for Recommended Products */}
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

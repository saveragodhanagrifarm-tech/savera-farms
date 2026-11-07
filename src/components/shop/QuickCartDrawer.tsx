'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { X, ShoppingBag, Plus, Minus, Trash2, Tag, ArrowRight, Truck, Sparkles, ExternalLink } from 'lucide-react';

interface QuickCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickCartDrawer: React.FC<QuickCartDrawerProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartDiscount,
    freeShippingThreshold,
    deliveryFee,
    cartTotal,
    appliedCoupon,
    coupons,
    applyCoupon,
    removeCoupon,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const neededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingPct = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleApplyCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const handleQuickApply = (code: string) => {
    const res = applyCoupon(code);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-white shadow-floating border-l border-savera-dark/10 flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-savera-dark/10 bg-savera-offwhite flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-savera-dark" />
              <h3 className="font-serif text-lg font-bold text-savera-dark">Your Shopping Bag</h3>
              <span className="bg-savera-dark text-savera-cream text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-savera-dark transition rounded-lg hover:bg-gray-100"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Progress Indicator */}
          <div className="bg-savera-cream p-3 px-5 border-b border-savera-saffron/30">
            {neededForFreeShipping > 0 ? (
              <div>
                <p className="text-xs font-bold text-savera-brown flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-savera-green" />
                  <span>
                    Add <strong className="text-savera-dark">₹{neededForFreeShipping}</strong> more to unlock FREE Delivery!
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
                <span>🎉 You unlocked FREE Morning Doorstep Delivery!</span>
              </p>
            )}
          </div>

          {/* Cart Items Scroll Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-savera-cream flex items-center justify-center mx-auto text-savera-brown">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-lg font-bold text-savera-dark">Your Bag is Empty</h4>
                <p className="text-xs text-savera-brown/70 max-w-xs mx-auto">
                  Explore pure A2 milk, Vedic Bilona Ghee, and farm fresh dairy products.
                </p>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="inline-block mt-4 bg-savera-dark text-savera-cream font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-savera-green transition"
                >
                  Explore Storefront
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 p-3.5 rounded-2xl bg-savera-offwhite border border-savera-dark/5 hover:border-savera-green/30 transition"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden relative bg-white shrink-0 border border-savera-dark/10">
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="truncate">
                        <h4 className="text-xs font-bold font-serif text-savera-dark truncate">
                          {item.productName}
                        </h4>
                        <span className="text-[10px] text-savera-green font-semibold block">{item.variantName}</span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        className="text-gray-400 hover:text-red-500 p-1 shrink-0"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-savera-dark">₹{item.price * item.quantity}</span>
                      <div className="flex items-center gap-2 bg-white border border-savera-dark/15 rounded-lg px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.variantId, -1)}
                          className="text-gray-500 hover:text-savera-dark p-0.5"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-savera-dark w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, 1)}
                          className="text-gray-500 hover:text-savera-dark p-0.5"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div
              className="p-4 sm:p-5 border-t border-savera-dark/10 bg-savera-cream/30 space-y-4"
              style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
            >
              {/* Promo Coupon Section */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-savera-paleGreen p-2.5 rounded-xl border border-savera-green/30 text-xs text-savera-dark">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-savera-green" />
                      <div>
                        <span className="font-bold uppercase">{appliedCoupon.code}</span>
                        <p className="text-[10px] text-savera-brown">{appliedCoupon.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-600 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <form onSubmit={handleApplyCouponSubmit} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter promo code (e.g. FIRST100)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 bg-white border border-savera-dark/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-savera-green font-mono uppercase"
                      />
                      <button
                        type="submit"
                        className="bg-savera-dark text-savera-cream font-bold px-3 py-2 rounded-xl text-xs hover:bg-savera-green transition"
                      >
                        Apply
                      </button>
                    </form>

                    {/* Quick coupon buttons */}
                    <div className="flex gap-1.5 overflow-x-auto py-0.5">
                      {coupons.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleQuickApply(c.code)}
                          className="bg-white hover:bg-savera-cream border border-savera-dark/10 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md text-savera-brown shrink-0"
                        >
                          {c.code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {couponError && <p className="text-[10px] text-red-500 mt-1">{couponError}</p>}
              </div>

              {/* Summary Breakdown */}
              <div className="space-y-1.5 text-xs text-savera-brown">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-savera-dark">₹{cartSubtotal}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-savera-green font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{cartDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryFee === 0 ? <strong className="text-savera-green">FREE</strong> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-serif font-bold text-savera-dark pt-2 border-t border-savera-dark/10">
                  <span>Total Payable</span>
                  <span className="text-lg text-savera-green font-sans font-bold">₹{cartTotal}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="bg-savera-cream hover:bg-savera-paleGreen border border-savera-saffronDark/30 text-savera-dark font-bold py-3.5 rounded-2xl text-xs transition flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Full Cart</span>
                </Link>

                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="bg-savera-dark text-savera-cream font-bold py-3.5 rounded-2xl text-xs hover:bg-savera-green transition shadow-floating flex items-center justify-center gap-1.5"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4 text-savera-saffron" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

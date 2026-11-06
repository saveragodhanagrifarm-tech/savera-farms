'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import OrderTrackingPage from './orders/[id]/OrderTrackingClient';
import { Leaf, Home, ShoppingBag, Phone } from 'lucide-react';

export default function NotFound() {
  const [isOrderRoute, setIsOrderRoute] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname.includes('/orders/') && !pathname.endsWith('/orders/')) {
        setIsOrderRoute(true);
      }
    }
  }, []);

  if (isOrderRoute) {
    return <OrderTrackingPage />;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-savera-cream/20">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-savera-dark/10 shadow-soft text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-savera-cream text-savera-brown flex items-center justify-center mx-auto shadow-inner">
          <Leaf className="w-8 h-8 text-savera-green" />
        </div>
        <div>
          <span className="text-xs font-bold text-savera-saffron uppercase tracking-widest font-mono">
            404 • Page Not Found
          </span>
          <h2 className="font-serif text-2xl font-bold text-savera-dark mt-1">Looking for Farm Fresh Milk?</h2>
          <p className="text-xs text-savera-brown/80 mt-2 leading-relaxed">
            The page you requested may have moved or doesn&apos;t exist. Explore our farm direct pure A2 milk, Vedic Bilona ghee, and traditional wellness products.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link
            href="/"
            className="bg-savera-dark text-savera-cream font-bold py-3 rounded-xl text-xs hover:bg-savera-green transition flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Farm Home</span>
          </Link>
          <Link
            href="/shop"
            className="bg-savera-saffron text-savera-brown font-bold py-3 rounded-xl text-xs hover:bg-savera-saffronDark transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-savera-dark" />
            <span>Explore Shop</span>
          </Link>
        </div>
        <div className="pt-4 border-t border-savera-dark/10 text-[11px] text-gray-500 flex items-center justify-center gap-2">
          <Phone className="w-3.5 h-3.5 text-savera-green" />
          <span>Need help? Call: +91 98765 43210</span>
        </div>
      </div>
    </div>
  );
}

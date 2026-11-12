'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Package, Clock, ArrowRight, RefreshCw, CheckCircle2, AlertCircle, Lock } from 'lucide-react';

export default function CustomerOrdersPage() {
  const router = useRouter();
  const { user, profile, isAdmin, openAuthModal } = useAuth();
  const { orders, addToCart, products } = useApp();
  const [filterTab, setFilterTab] = useState<'All' | 'Active' | 'Delivered' | 'Cancelled'>('All');

  if (!user && !isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-savera-dark text-savera-saffron flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-savera-dark">Sign In to Track Your Orders</h2>
        <p className="text-xs text-savera-brown max-w-md mx-auto leading-relaxed">
          Log in with your verified Savera Farms account to check real-time morning 5 AM delivery dispatches and past order invoices.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="bg-savera-dark hover:bg-savera-green text-savera-cream font-bold px-8 py-3.5 rounded-2xl text-xs transition shadow-lg inline-flex items-center gap-2"
        >
          <span>Sign In / Register</span>
          <ArrowRight className="w-4 h-4 text-savera-saffron" />
        </button>
      </div>
    );
  }

  const myOrders = orders.filter((o) => {
    if (isAdmin) return true;
    if (user) {
      return (
        o.customerId === user.id ||
        o.customerId === user.email ||
        (profile?.full_name && o.customerName === profile.full_name) ||
        (user.email && o.customerName === user.email.split('@')[0])
      );
    }
    return false;
  });

  const filteredOrders = myOrders.filter((o) => {
    if (filterTab === 'All') return true;
    if (filterTab === 'Active') return o.status !== 'Delivered' && o.status !== 'Cancelled';
    if (filterTab === 'Delivered') return o.status === 'Delivered';
    if (filterTab === 'Cancelled') return o.status === 'Cancelled';
    return true;
  });

  const handleReorder = (order: (typeof orders)[0]) => {
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.variantId, item.quantity);
      }
    });
    router.push('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-savera-dark/10">
        <div>
          <h1 className="font-serif text-3xl font-bold text-savera-dark">My Orders</h1>
          <p className="text-xs text-savera-brown font-semibold">
            Track deliveries, view past orders, and quickly re-order your favorite dairy items
          </p>
        </div>
        <Link
          href="/shop"
          className="bg-savera-dark text-savera-cream hover:bg-savera-green px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
        >
          + Place New Order
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-savera-dark/10 pb-3 overflow-x-auto">
        {(['All', 'Active', 'Delivered', 'Cancelled'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterTab === tab
                ? 'bg-savera-dark text-savera-saffron shadow-sm'
                : 'bg-white text-savera-dark hover:bg-savera-cream border border-savera-dark/10'
            }`}
          >
            {tab} {tab === 'All' ? `(${orders.length})` : ''}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-savera-dark/10 shadow-soft space-y-3">
          <Package className="w-12 h-12 text-savera-brown/40 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-savera-dark">No Orders Found</h3>
          <p className="text-xs text-savera-brown">There are no orders matching your selected status.</p>
          <Link
            href="/shop"
            className="inline-block mt-2 bg-savera-dark text-savera-cream px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-savera-green transition"
          >
            Explore Farm Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-3xl p-6 border border-savera-dark/10 shadow-soft hover:shadow-card transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs text-savera-dark font-mono">Order #{ord.orderNumber}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      ord.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-savera-paleGreen text-savera-green'
                    }`}
                  >
                    {ord.status}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium">
                    Placed: {new Date(ord.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-savera-brown font-medium">
                  Scheduled for: <strong className="text-savera-dark">{ord.deliveryDate} ({ord.deliverySlot})</strong>
                </p>

                {/* Items preview snippet */}
                <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-gray-600">
                  {ord.items.map((it, idx) => (
                    <span key={idx} className="bg-savera-offwhite px-2 py-0.5 rounded-md border border-savera-dark/5">
                      {it.productName} ({it.variantName}) x{it.quantity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-savera-dark/10">
                <div className="text-right">
                  <span className="font-serif text-xl font-bold text-savera-dark block">₹{ord.totalAmount}</span>
                  <span className="text-[10px] text-gray-500 font-medium">{ord.paymentMethod}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReorder(ord)}
                    className="p-2.5 bg-savera-cream hover:bg-savera-paleGreen border border-savera-saffronDark/30 text-savera-dark rounded-xl transition"
                    title="Re-order these items"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <Link
                    href={`/orders/${ord.id}`}
                    className="bg-savera-dark text-savera-cream font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-savera-green transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Track Order</span>
                    <ArrowRight className="w-3.5 h-3.5 text-savera-saffron" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

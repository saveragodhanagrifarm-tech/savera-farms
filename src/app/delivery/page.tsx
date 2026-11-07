'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Truck,
  Phone,
  Navigation,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Key,
  ArrowLeft,
  Sparkles,
  Check,
  AlertTriangle,
  X,
} from 'lucide-react';

export default function DeliveryExecutivePage() {
  const { orders, updateOrderStatus, addToast } = useApp();

  const [otpInput, setOtpInput] = useState<{ [orderId: string]: string }>({});
  const [filterTab, setFilterTab] = useState<'All' | 'Pending' | 'Delivered'>('Pending');
  const [failedModalOrderId, setFailedModalOrderId] = useState<string | null>(null);
  const [failedReason, setFailedReason] = useState('Door locked / Customer not answering');

  const filteredOrders = orders.filter((o) => {
    if (filterTab === 'All') return true;
    if (filterTab === 'Pending') return o.status !== 'Delivered' && o.status !== 'Cancelled';
    if (filterTab === 'Delivered') return o.status === 'Delivered';
    return true;
  });

  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;

  const handleMarkDelivered = (orderId: string, expectedOtp?: string) => {
    const entered = otpInput[orderId];
    if (expectedOtp && entered !== expectedOtp) {
      addToast('Invalid OTP', `OTP "${entered || ''}" does not match customer OTP. Expected 4-digit code.`, 'error');
      return;
    }
    updateOrderStatus(orderId, 'Delivered');
    addToast('Delivery Confirmed!', `Order ${orderId} marked as Delivered successfully.`, 'success');
  };

  const handleConfirmFailed = () => {
    if (!failedModalOrderId) return;
    updateOrderStatus(failedModalOrderId, 'Cancelled');
    addToast('Delivery Marked Failed', `Order ${failedModalOrderId} marked as Delivery Failed.`, 'info');
    setFailedModalOrderId(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 space-y-6 max-w-lg mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <Link href="/" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Exit App</span>
        </Link>
        <div className="text-center">
          <h1 className="font-serif font-bold text-lg text-savera-saffron">Savera Express</h1>
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
            Delivery Rider Portal
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-savera-dark text-savera-saffron font-bold text-xs flex items-center justify-center border border-savera-saffron/40">
          RK
        </div>
      </div>

      {/* Driver Info Banner */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
        <div>
          <span className="text-slate-400 block">Agent: Ramesh Kumar</span>
          <span className="font-bold text-white">Route: Panchkula Sector 9, MDC & Chandigarh Sector 18</span>
        </div>
        <div className="text-right">
          <span className="bg-emerald-950 text-emerald-400 font-bold px-2.5 py-1 rounded-full text-[10px] block mb-1">
            Slot: 5 AM – 7 AM
          </span>
          <span className="text-[10px] text-slate-400">
            {deliveredCount}/{orders.length} Completed
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['Pending', 'Delivered', 'All'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${
              filterTab === tab
                ? 'bg-savera-saffron text-slate-950 border-savera-saffron font-extrabold shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Assigned Route Deliveries */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="font-serif font-bold text-white text-base">No Orders in this list</h3>
            <p className="text-xs text-slate-400">All morning assigned deliveries in this view are completed!</p>
          </div>
        ) : (
          filteredOrders.map((ord) => (
            <div key={ord.id} className="bg-slate-950 rounded-3xl p-5 border border-slate-800 space-y-4 shadow-soft">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-xs font-bold text-savera-saffron">{ord.orderNumber}</span>
                  <h4 className="font-serif font-bold text-white text-base mt-0.5">
                    {ord.deliveryAddress?.fullName || ord.customerName}
                  </h4>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    ord.status === 'Delivered'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : ord.status === 'Cancelled'
                      ? 'bg-red-950 text-red-400'
                      : 'bg-savera-dark text-savera-saffron'
                  }`}
                >
                  {ord.status}
                </span>
              </div>

              {/* Address Details */}
              <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    {ord.deliveryAddress
                      ? `${ord.deliveryAddress.houseFlat}, ${ord.deliveryAddress.street}, ${ord.deliveryAddress.area}, ${ord.deliveryAddress.city} - ${ord.deliveryAddress.pincode}`
                      : 'Panchkula Central'}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-1 border-t border-slate-800/80">
                  <Clock className="w-3.5 h-3.5 text-savera-saffron" />
                  <span>Drop Slot: {ord.deliverySlot}</span>
                </div>
              </div>

              {/* Items Summary */}
              <div className="text-xs text-slate-400 bg-slate-900/50 p-3 rounded-xl border border-slate-800/50 space-y-1">
                <span className="font-bold text-slate-200 block mb-1">Items to Deliver:</span>
                {ord.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-[11px]">
                    <span>• {it.productName} ({it.variantName})</span>
                    <span className="font-bold text-white">x{it.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${ord.deliveryAddress?.mobileNumber || ord.customerPhone || '+919876543210'}`}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call ({ord.deliveryAddress?.mobileNumber || ord.customerPhone || 'Customer'})</span>
                </a>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    ord.deliveryAddress
                      ? `${ord.deliveryAddress.houseFlat} ${ord.deliveryAddress.street} ${ord.deliveryAddress.city}`
                      : 'Panchkula'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Navigation className="w-3.5 h-3.5 text-savera-saffron" />
                  <span>Navigate</span>
                </a>
              </div>

              {/* Delivery Confirmation Controls */}
              {ord.status !== 'Delivered' && ord.status !== 'Cancelled' && (
                <div className="pt-2 space-y-2 border-t border-slate-800">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Enter OTP (Hint: ${ord.otp})`}
                      value={otpInput[ord.id] || ''}
                      onChange={(e) => setOtpInput({ ...otpInput, [ord.id]: e.target.value })}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => handleMarkDelivered(ord.id, ord.otp)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Delivered</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setFailedModalOrderId(ord.id)}
                    className="w-full text-red-400 hover:text-red-300 text-[11px] font-bold text-center block pt-1 hover:underline"
                  >
                    Mark Delivery Failed / Customer Unavailable
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Delivery Failed Modal */}
      {failedModalOrderId && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-3xl p-6 max-w-sm w-full border border-slate-800 space-y-4">
            <h3 className="font-serif font-bold text-white text-base">Record Delivery Exception</h3>
            <p className="text-xs text-slate-400">
              Select reason why this order could not be completed on this route:
            </p>
            <select
              value={failedReason}
              onChange={(e) => setFailedReason(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="Door locked / Customer not answering">Door locked / Customer not answering</option>
              <option value="Customer asked to reschedule">Customer asked to reschedule</option>
              <option value="Wrong delivery address entered">Wrong delivery address entered</option>
              <option value="Bottle damaged in transit">Bottle damaged in transit</option>
            </select>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleConfirmFailed}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                Confirm Failure
              </button>
              <button
                onClick={() => setFailedModalOrderId(null)}
                className="bg-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

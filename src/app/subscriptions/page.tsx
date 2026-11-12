'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { SubscribeModal } from '@/components/shop/SubscribeModal';
import { Product, SubscriptionFrequency, DeliverySlot } from '@/types';
import {
  Calendar,
  Clock,
  MapPin,
  PauseCircle,
  PlayCircle,
  XCircle,
  Plus,
  Minus,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Milk,
  Edit,
  X,
  Check,
  Lock,
  ArrowRight,
} from 'lucide-react';

export default function SubscriptionsPage() {
  const { user, profile, isAdmin, openAuthModal } = useAuth();
  const {
    subscriptions,
    togglePauseSubscription,
    skipSubscriptionDate,
    cancelSubscription,
    updateSubscription,
    products,
  } = useApp();

  const [selectedSubId, setSelectedSubId] = useState<string>('');
  const [showNewSubModal, setShowNewSubModal] = useState(false);
  const [editingSubId, setEditingSubId] = useState<string | null>(null);

  // Edit Subscription Form State
  const [editQty, setEditQty] = useState(1);
  const [editSlot, setEditSlot] = useState<DeliverySlot>('5:00 AM - 7:00 AM');
  const [editFrequency, setEditFrequency] = useState<SubscriptionFrequency>('Daily');

  if (!user && !isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-savera-dark text-savera-saffron flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-savera-dark">Sign In to Manage Your Subscriptions</h2>
        <p className="text-xs text-savera-brown max-w-md mx-auto leading-relaxed">
          Log in with your verified Savera account to access daily 5 AM recurring morning milk drops, pause deliveries, or skip dates.
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

  const activeName = profile?.full_name || user?.email?.split('@')[0] || '';
  const mySubscriptions = subscriptions.filter((s) => {
    if (isAdmin) return true;
    if (user) {
      return (
        s.customerId === user.id ||
        (user.email && s.customerId === user.email) ||
        (activeName && s.customerName.toLowerCase() === activeName.toLowerCase()) ||
        (profile?.phone && s.customerPhone === profile.phone)
      );
    }
    return false;
  });

  const activeSub = mySubscriptions.find((s) => s.id === selectedSubId) || mySubscriptions[0];

  const milkProducts = products.filter((p) => p.isSubscriptionEligible);
  const defaultMilkProduct = milkProducts[0] || products[0];

  // Generate next 14 calendar days for interactive schedule matrix
  const daysList = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    return { dateStr, dayName, dayNum, monthName };
  });

  const handleOpenEdit = () => {
    if (!activeSub) return;
    setEditQty(activeSub.quantityPerDelivery);
    setEditSlot(activeSub.deliverySlot);
    setEditFrequency(activeSub.frequency);
    setEditingSubId(activeSub.id);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSub) return;
    let monthlyDeliveries = 30;
    if (editFrequency === 'Alternate Days') monthlyDeliveries = 15;
    if (editFrequency === '3 Days/Week') monthlyDeliveries = 12;
    if (editFrequency === 'Weekly') monthlyDeliveries = 4;
    const newEstimate = monthlyDeliveries * activeSub.pricePerUnit * editQty;

    updateSubscription(activeSub.id, {
      quantityPerDelivery: editQty,
      deliverySlot: editSlot,
      frequency: editFrequency,
      monthlyEstimate: newEstimate,
    });
    setEditingSubId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-28 sm:pb-12 space-y-6 sm:space-y-8">
      {/* Page Title */}
      <div className="bg-savera-dark text-savera-cream rounded-3xl p-5 sm:p-8 shadow-floating flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-savera-saffron uppercase tracking-widest block mb-1">
            Fresh Morning Delivery Engine
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">My Milk Subscriptions</h1>
          <p className="text-xs text-savera-cream/80 mt-1 max-w-xl">
            Manage your daily recurring A2 Desi Cow Milk. Pause, skip specific dates, or adjust delivery slots anytime.
          </p>
        </div>

        <button
          onClick={() => setShowNewSubModal(true)}
          className="bg-savera-saffron hover:bg-savera-saffronDark text-savera-brown font-bold px-6 py-3 rounded-2xl text-xs shadow-md flex items-center gap-2 transition"
        >
          <Milk className="w-4 h-4 text-savera-dark" />
          <span>+ Add New Subscription</span>
        </button>
      </div>

      {mySubscriptions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-savera-dark/10 shadow-soft space-y-4">
          <div className="w-16 h-16 rounded-full bg-savera-cream flex items-center justify-center mx-auto text-savera-brown">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-savera-dark">No Active Milk Subscriptions</h3>
          <p className="text-xs text-savera-brown/70 max-w-md mx-auto">
            Subscribe to 100% pure A2 Desi Cow Milk and enjoy guaranteed morning doorstep delivery before 7:00 AM.
          </p>
          <button
            onClick={() => setShowNewSubModal(true)}
            className="inline-block bg-savera-dark text-savera-cream font-bold px-8 py-3.5 rounded-2xl text-xs hover:bg-savera-green transition shadow-md"
          >
            Setup Milk Subscription Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Subscriptions List */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-serif text-lg font-bold text-savera-dark">Your Subscription Cards</h3>
            {mySubscriptions.map((sub) => (
              <div
                key={sub.id}
                onClick={() => setSelectedSubId(sub.id)}
                className={`cursor-pointer p-5 rounded-3xl border transition duration-300 ${
                  activeSub?.id === sub.id
                    ? 'bg-savera-cream/80 border-savera-green shadow-card ring-2 ring-savera-green/30'
                    : 'bg-white border-savera-dark/10 hover:border-savera-green/40 shadow-soft'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-savera-green uppercase tracking-wider bg-savera-paleGreen px-2.5 py-0.5 rounded-full">
                    {sub.frequency}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sub.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : sub.status === 'Paused'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-savera-dark text-base">{sub.productName}</h4>
                <p className="text-xs text-savera-brown font-semibold">
                  {sub.quantityPerDelivery}x {sub.variantName} per delivery
                </p>

                <div className="mt-3 pt-3 border-t border-savera-dark/10 flex items-center justify-between text-xs text-savera-dark font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-savera-green" />
                    {sub.deliverySlot.split(' ')[0]} Drop
                  </span>
                  <span className="font-serif font-bold text-savera-dark">₹{sub.monthlyEstimate} / mo</span>
                </div>
              </div>
            ))}
          </div>

          {/* Subscription Calendar & Controls */}
          {activeSub && (
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-savera-dark/10 shadow-soft space-y-6">
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-savera-dark/10">
                <div>
                  <span className="text-[10px] font-bold text-savera-brown uppercase">
                    Subscription ID: {activeSub.id}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-savera-dark">{activeSub.productName}</h3>
                  <p className="text-xs text-savera-green font-semibold mt-0.5">
                    {activeSub.quantityPerDelivery}x {activeSub.variantName} • Delivery Slot: {activeSub.deliverySlot}
                  </p>
                </div>

                {/* Status Toggle & Edit Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenEdit}
                    className="p-2.5 rounded-xl border border-savera-dark/15 text-savera-dark hover:bg-savera-cream transition"
                    title="Edit quantity & slot"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => togglePauseSubscription(activeSub.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                      activeSub.status === 'Active'
                        ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                    }`}
                  >
                    {activeSub.status === 'Active' ? (
                      <>
                        <PauseCircle className="w-4 h-4" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4" />
                        <span>Resume</span>
                      </>
                    )}
                  </button>

                  {activeSub.status !== 'Cancelled' && (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to cancel this milk subscription?')) {
                          cancelSubscription(activeSub.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-xl"
                      title="Cancel Subscription"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-savera-offwhite p-4 rounded-2xl border border-savera-dark/10 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-savera-green shrink-0 mt-0.5" />
                <div className="text-xs text-savera-dark">
                  <span className="font-bold block">Delivery Address:</span>
                  <p className="text-savera-brown">
                    {activeSub.deliveryAddress.houseFlat}, {activeSub.deliveryAddress.street}, {activeSub.deliveryAddress.area}, {activeSub.deliveryAddress.city} - {activeSub.deliveryAddress.pincode}
                  </p>
                </div>
              </div>

              {/* Upcoming Delivery Calendar Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-savera-dark text-sm">Upcoming 14-Day Delivery Calendar</h4>
                    <span className="text-[10px] text-savera-brown font-semibold">
                      Click any date below to SKIP or UN-SKIP that morning's delivery
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Confirmed
                    </span>
                    <span className="flex items-center gap-1 text-red-700">
                      <span className="w-2 h-2 rounded-full bg-red-400" /> Skipped
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {daysList.map((day) => {
                    const isSkipped = activeSub.skippedDates.includes(day.dateStr);
                    const isPaused = activeSub.status === 'Paused';
                    return (
                      <button
                        key={day.dateStr}
                        onClick={() => skipSubscriptionDate(activeSub.id, day.dateStr)}
                        disabled={isPaused}
                        className={`p-1 sm:p-3 rounded-xl sm:rounded-2xl text-center border transition flex flex-col items-center justify-between min-h-[58px] sm:min-h-[78px] ${
                          isPaused
                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                            : isSkipped
                            ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100 shadow-sm'
                            : 'bg-savera-cream/70 border-savera-saffron/40 text-savera-dark hover:border-savera-green hover:shadow-sm'
                        }`}
                      >
                        <span className="text-[9px] sm:text-[10px] uppercase font-bold opacity-70 leading-none">{day.dayName}</span>
                        <span className="font-serif text-xs sm:text-base font-bold my-0.5">{day.dayNum}</span>
                        <span
                          className={`text-[8px] sm:text-[9px] font-extrabold uppercase tracking-tight px-1 py-0.5 rounded ${
                            isPaused
                              ? 'bg-gray-200 text-gray-600'
                              : isSkipped
                              ? 'bg-red-200 text-red-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isPaused ? 'PAUSED' : isSkipped ? 'SKIP' : `${activeSub.quantityPerDelivery}L`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Billing Summary Box */}
              <div className="bg-savera-cream/60 p-4 rounded-2xl border border-savera-saffron/30 flex items-center justify-between text-xs text-savera-dark">
                <div>
                  <span className="font-bold block">Recurring Monthly Billing Estimate:</span>
                  <span className="text-savera-brown">Auto-calculated based on delivered bottles minus skipped dates.</span>
                </div>
                <div className="text-right">
                  <span className="font-serif text-2xl font-bold text-savera-dark">₹{activeSub.monthlyEstimate}</span>
                  <span className="text-[10px] text-savera-green font-bold block">Auto-Debit / Savera Wallet</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Subscription Modal */}
      {editingSubId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-floating border border-savera-dark/10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-lg font-bold text-savera-dark">Edit Subscription Preferences</h3>
              <button onClick={() => setEditingSubId(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-savera-dark block mb-1">Quantity per Delivery:</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((q) => (
                    <button
                      type="button"
                      key={q}
                      onClick={() => setEditQty(q)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                        editQty === q
                          ? 'bg-savera-dark text-savera-cream border-savera-dark'
                          : 'bg-savera-offwhite border-savera-dark/10'
                      }`}
                    >
                      {q} Litre{q > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-savera-dark block mb-1">Delivery Frequency:</label>
                <select
                  value={editFrequency}
                  onChange={(e) => setEditFrequency(e.target.value as SubscriptionFrequency)}
                  className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-xs font-bold"
                >
                  <option value="Daily">Daily (Every Morning)</option>
                  <option value="Alternate Days">Alternate Days</option>
                  <option value="3 Days/Week">3 Days / Week (Mon, Wed, Fri)</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-savera-dark block mb-1">Morning Time Slot:</label>
                <select
                  value={editSlot}
                  onChange={(e) => setEditSlot(e.target.value as DeliverySlot)}
                  className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-xs font-bold"
                >
                  <option value="5:00 AM - 7:00 AM">5:00 AM - 7:00 AM (Early Morning Drop)</option>
                  <option value="7:00 AM - 9:00 AM">7:00 AM - 9:00 AM (Breakfast Slot)</option>
                  <option value="5:00 PM - 7:00 PM">5:00 PM - 7:00 PM (Evening Slot)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-savera-dark text-savera-cream font-bold py-3 rounded-xl text-xs hover:bg-savera-green transition shadow-md"
              >
                Save Delivery Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Subscription Setup Modal */}
      {showNewSubModal && (
        <SubscribeModal
          product={defaultMilkProduct}
          initialVariantId={defaultMilkProduct.variants[0]?.id}
          onClose={() => setShowNewSubModal(false)}
        />
      )}
    </div>
  );
}

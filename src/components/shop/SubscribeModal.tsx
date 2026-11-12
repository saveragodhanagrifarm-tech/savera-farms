'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, SubscriptionFrequency, DeliverySlot, Address } from '@/types';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { openRazorpayCheckout } from '@/lib/razorpay';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle,
  ShieldCheck,
  CreditCard,
  Wallet,
  Lock,
  ArrowRight,
  User,
  Plus,
} from 'lucide-react';

interface SubscribeModalProps {
  product: Product;
  initialVariantId?: string;
  onClose: () => void;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({
  product,
  initialVariantId,
  onClose,
}) => {
  const router = useRouter();
  const { user, profile, openAuthModal } = useAuth();
  const {
    addSubscription,
    customer,
    selectedPincode,
    rechargeWallet,
    debitWallet,
    addAddress,
    addToast,
  } = useApp();

  const [selectedVariantId, setSelectedVariantId] = useState(
    initialVariantId || product.variants[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [frequency, setFrequency] = useState<SubscriptionFrequency>('Daily');
  const [deliverySlot, setDeliverySlot] = useState<DeliverySlot>('5:00 AM - 7:00 AM');
  const [customDays, setCustomDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);

  // Advance Plan Billing Cycle (Deposit required to activate daily doorstep drops)
  const [advancePlan, setAdvancePlan] = useState<'7days' | '15days' | '30days'>('7days');

  // Address Selection
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    customer.addresses.find((a) => a.isDefault)?.id || customer.addresses[0]?.id || ''
  );
  const [showNewAddressFields, setShowNewAddressFields] = useState(customer.addresses.length === 0);
  const [newHouse, setNewHouse] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newPincode, setNewPincode] = useState(selectedPincode || '134109');

  // Payment Selection
  const [paymentOption, setPaymentOption] = useState<'wallet' | 'online'>('online');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  // Estimate monthly deliveries based on frequency
  let monthlyDeliveries = 30;
  if (frequency === 'Alternate Days') monthlyDeliveries = 15;
  if (frequency === '3 Days/Week') monthlyDeliveries = 12;
  if (frequency === 'Weekly') monthlyDeliveries = 4;
  if (frequency === 'Custom') monthlyDeliveries = customDays.length * 4;

  const pricePerUnit = selectedVariant.price;
  const monthlyEstimate = monthlyDeliveries * pricePerUnit * quantity;

  // Advance deposit calculation
  const planDays = advancePlan === '7days' ? 7 : advancePlan === '15days' ? 15 : 30;
  const advanceAmount = Math.round((monthlyEstimate / 30) * planDays);

  const walletHasEnough = customer.walletBalance >= advanceAmount;

  const toggleCustomDay = (day: string) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleConfirmAndPay = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      addToast('Sign-In Required', 'Please sign in to securely link your milk deliveries to your account.', 'info');
      openAuthModal('login');
      return;
    }

    // Resolve Delivery Address
    let addressToUse: Address | undefined = customer.addresses.find((a) => a.id === selectedAddressId);
    if (!addressToUse && showNewAddressFields) {
      if (!newHouse.trim() || !newStreet.trim()) {
        addToast('Address Required', 'Please enter your house and street details for morning delivery.', 'error');
        return;
      }
      const newId = addAddress({
        fullName: profile?.full_name || customer.fullName,
        mobileNumber: profile?.phone || customer.phone,
        houseFlat: newHouse.trim(),
        street: newStreet.trim(),
        area: newArea.trim() || newStreet.trim(),
        city: 'Panchkula',
        state: 'Haryana',
        pincode: newPincode.trim(),
        type: 'Home',
        isDefault: true,
      });
      addressToUse = {
        id: newId,
        fullName: profile?.full_name || customer.fullName,
        mobileNumber: profile?.phone || customer.phone,
        houseFlat: newHouse.trim(),
        street: newStreet.trim(),
        area: newArea.trim() || newStreet.trim(),
        city: 'Panchkula',
        state: 'Haryana',
        pincode: newPincode.trim(),
        type: 'Home',
        isDefault: true,
      };
    }

    if (!addressToUse) {
      addressToUse = {
        id: 'addr-default',
        fullName: profile?.full_name || customer.fullName,
        mobileNumber: profile?.phone || customer.phone,
        houseFlat: 'Main Doorstep',
        street: 'Sector 9 Hub',
        area: 'Sector 9',
        city: 'Panchkula',
        state: 'Haryana',
        pincode: selectedPincode || '134109',
        type: 'Home',
      };
    }

    setIsProcessing(true);

    const subscriptionPayload = {
      customerId: user.id || customer.id,
      customerName: profile?.full_name || customer.fullName,
      customerPhone: profile?.phone || customer.phone,
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      quantityPerDelivery: quantity,
      pricePerUnit,
      frequency,
      customDays: frequency === 'Custom' ? customDays : undefined,
      deliverySlot,
      deliveryAddress: addressToUse,
      monthlyEstimate,
    };

    // CASE 1: Pay using Savera Wallet Balance
    if (paymentOption === 'wallet') {
      if (!walletHasEnough) {
        addToast('Low Wallet Balance', `Please choose Online Payment or recharge your wallet by ₹${advanceAmount - customer.walletBalance}.`, 'error');
        setIsProcessing(false);
        return;
      }

      const success = debitWallet(
        advanceAmount,
        `SUB-ACT-${Date.now().toString().slice(-6)}`,
        `Advance ${planDays}-day deposit for ${product.name} daily subscription`
      );

      if (success) {
        addSubscription(subscriptionPayload);
        try {
          confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
        } catch (err) {}
        addToast(
          'Subscription Activated! 🥛',
          `₹${advanceAmount} debited from wallet. Deliveries start tomorrow 5:00 AM.`,
          'success'
        );
        setIsProcessing(false);
        onClose();
        router.push('/subscriptions');
      } else {
        setIsProcessing(false);
      }
      return;
    }

    // CASE 2: Online Payment via Razorpay / Savera Pay Gateway
    await openRazorpayCheckout({
      amountInRupees: advanceAmount,
      customerName: profile?.full_name || customer.fullName,
      customerEmail: user.email || customer.email,
      customerPhone: profile?.phone || customer.phone,
      orderNumber: `SUB-DEP-${Math.floor(10000 + Math.random() * 90000)}`,
      onSuccess: (paymentId) => {
        // 1. Credit wallet with the paid advance
        rechargeWallet(
          advanceAmount,
          paymentId,
          `Paid ${planDays}-day advance deposit for ${product.name} subscription`
        );
        // 2. Activate subscription
        addSubscription(subscriptionPayload);
        try {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        } catch (err) {}
        addToast(
          'Subscription Activated! 🥛',
          `Payment of ₹${advanceAmount} verified (Ref: ${paymentId}). Daily deliveries start tomorrow!`,
          'success'
        );
        setIsProcessing(false);
        onClose();
        router.push('/subscriptions');
      },
      onFailure: (err) => {
        setIsProcessing(false);
        addToast(
          'Subscription Not Activated',
          err.message || 'Payment was cancelled or unsuccessful. No subscription was created.',
          'info'
        );
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-floating border border-savera-dark/10 relative my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-savera-dark p-2"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-savera-dark text-savera-saffron flex items-center justify-center shadow-sm">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-savera-dark">Setup Milk Subscription</h3>
            <p className="text-xs text-savera-green font-semibold">Fresh Morning Delivery Straight to Door</p>
          </div>
        </div>

        {/* Auth prompt if unauthenticated */}
        {!user && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-amber-900 block">Sign-in recommended</span>
              <p className="text-[11px] text-amber-700">Link daily deliveries directly to your customer account.</p>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="bg-savera-dark text-savera-cream font-bold px-3 py-1.5 rounded-xl text-xs hover:bg-savera-green transition shrink-0"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Product Details Banner */}
        <div className="bg-savera-cream/70 rounded-2xl p-3.5 mb-4 border border-savera-saffron/30 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0 bg-white">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-savera-dark text-sm">{product.name}</h4>
            <div className="flex items-center gap-2 text-xs font-semibold text-savera-brown mt-0.5">
              <span>₹{pricePerUnit} / unit</span>
              <span>•</span>
              <span className="text-savera-green">{selectedVariant.name}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleConfirmAndPay} className="space-y-4">
          {/* Variant Choice */}
          <div>
            <label className="text-xs font-bold text-savera-dark block mb-1">Select Bottle Size:</label>
            <div className="grid grid-cols-3 gap-2">
              {product.variants.map((v) => (
                <button
                  type="button"
                  key={v.id}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center transition ${
                    selectedVariantId === v.id
                      ? 'bg-savera-dark text-savera-cream border-savera-dark shadow-sm'
                      : 'bg-savera-offwhite border-savera-dark/10 text-savera-dark hover:bg-savera-cream'
                  }`}
                >
                  {v.name}
                  <span className="block text-[10px] font-normal opacity-80 mt-0.5">₹{v.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="text-xs font-bold text-savera-dark block mb-1">Quantity per Delivery:</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((qty) => (
                <button
                  type="button"
                  key={qty}
                  onClick={() => setQuantity(qty)}
                  className={`flex-1 h-9 rounded-xl border text-xs font-bold transition flex items-center justify-center ${
                    quantity === qty
                      ? 'bg-savera-green text-white border-savera-green shadow-sm'
                      : 'bg-savera-offwhite text-savera-dark border-savera-dark/10'
                  }`}
                >
                  {qty} {selectedVariant.weightVolume.includes('L') ? 'L' : 'Unit'}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Frequency */}
          <div>
            <label className="text-xs font-bold text-savera-dark block mb-1">Delivery Frequency:</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Daily', 'Alternate Days', '3 Days/Week', 'Custom'] as SubscriptionFrequency[]).map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`p-2 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between ${
                    frequency === f
                      ? 'bg-savera-dark text-savera-saffron border-savera-dark shadow-sm'
                      : 'bg-savera-offwhite text-savera-dark border-savera-dark/10'
                  }`}
                >
                  <span>{f}</span>
                  {frequency === f && <CheckCircle className="w-3.5 h-3.5 text-savera-saffron" />}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Days Picker */}
          {frequency === 'Custom' && (
            <div>
              <label className="text-[11px] font-bold text-savera-brown block mb-1">Select Delivery Days:</label>
              <div className="flex gap-1.5 justify-between">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                  const active = customDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleCustomDay(day)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                        active ? 'bg-savera-green text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Delivery Slot */}
          <div>
            <label className="text-xs font-bold text-savera-dark block mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-savera-green" />
              <span>Select Delivery Slot:</span>
            </label>
            <select
              value={deliverySlot}
              onChange={(e) => setDeliverySlot(e.target.value as DeliverySlot)}
              className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-xs font-bold text-savera-dark"
            >
              <option value="5:00 AM - 7:00 AM">5:00 AM - 7:00 AM (Early Morning Drop)</option>
              <option value="7:00 AM - 9:00 AM">7:00 AM - 9:00 AM (Morning Breakfast Slot)</option>
              <option value="5:00 PM - 7:00 PM">5:00 PM - 7:00 PM (Evening Slot)</option>
            </select>
          </div>

          {/* Delivery Address Section */}
          <div className="bg-savera-offwhite p-3.5 rounded-2xl border border-savera-dark/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-savera-dark flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-savera-green" />
                <span>Morning Delivery Address:</span>
              </span>
              {customer.addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowNewAddressFields(!showNewAddressFields)}
                  className="text-[11px] text-savera-green font-bold hover:underline"
                >
                  {showNewAddressFields ? 'Use Saved' : '+ New Address'}
                </button>
              )}
            </div>

            {customer.addresses.length > 0 && !showNewAddressFields ? (
              <div className="space-y-1.5">
                {customer.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`cursor-pointer p-2 rounded-xl border text-xs transition ${
                      selectedAddressId === addr.id
                        ? 'bg-white border-savera-green ring-1 ring-savera-green text-savera-dark'
                        : 'bg-white/60 border-savera-dark/10 text-slate-600'
                    }`}
                  >
                    <span className="font-bold block">{addr.fullName} ({addr.type})</span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {addr.houseFlat}, {addr.street}, {addr.area} - {addr.pincode}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="House / Flat / Villa No."
                    value={newHouse}
                    onChange={(e) => setNewHouse(e.target.value)}
                    className="w-full bg-white border border-savera-dark/20 rounded-xl px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Street / Society / Sector"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full bg-white border border-savera-dark/20 rounded-xl px-2.5 py-1.5 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Area (e.g. Sector 9)"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full bg-white border border-savera-dark/20 rounded-xl px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Pincode"
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    className="w-full bg-white border border-savera-dark/20 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Subscription Initial Advance Billing Deposit (Strict Payment Gateway) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-savera-dark flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-savera-green" />
                <span>Initial Activation Deposit Plan:</span>
              </label>
              <span className="text-[10px] text-savera-green font-bold bg-savera-paleGreen px-2 py-0.5 rounded-full">
                Prepaid Morning Drops
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAdvancePlan('7days')}
                className={`p-2.5 rounded-xl border text-xs text-center transition ${
                  advancePlan === '7days'
                    ? 'bg-savera-dark text-savera-cream border-savera-dark shadow-sm'
                    : 'bg-savera-offwhite border-savera-dark/10 text-savera-dark hover:bg-savera-cream'
                }`}
              >
                <span className="font-bold block">7 Days Trial</span>
                <span className="font-serif font-bold text-sm block mt-0.5 text-savera-saffron">
                  ₹{Math.round((monthlyEstimate / 30) * 7)}
                </span>
                <span className="text-[9px] opacity-75 block">7 drops</span>
              </button>

              <button
                type="button"
                onClick={() => setAdvancePlan('15days')}
                className={`p-2.5 rounded-xl border text-xs text-center transition ${
                  advancePlan === '15days'
                    ? 'bg-savera-dark text-savera-cream border-savera-dark shadow-sm'
                    : 'bg-savera-offwhite border-savera-dark/10 text-savera-dark hover:bg-savera-cream'
                }`}
              >
                <span className="font-bold block">15 Days Plan</span>
                <span className="font-serif font-bold text-sm block mt-0.5 text-savera-saffron">
                  ₹{Math.round((monthlyEstimate / 30) * 15)}
                </span>
                <span className="text-[9px] opacity-75 block">15 drops</span>
              </button>

              <button
                type="button"
                onClick={() => setAdvancePlan('30days')}
                className={`p-2.5 rounded-xl border text-xs text-center transition ${
                  advancePlan === '30days'
                    ? 'bg-savera-dark text-savera-cream border-savera-dark shadow-sm'
                    : 'bg-savera-offwhite border-savera-dark/10 text-savera-dark hover:bg-savera-cream'
                }`}
              >
                <span className="font-bold block">Full Month</span>
                <span className="font-serif font-bold text-sm block mt-0.5 text-savera-saffron">
                  ₹{monthlyEstimate}
                </span>
                <span className="text-[9px] opacity-75 block">~30 drops</span>
              </button>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-700 block">Select Activation Payment Method:</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentOption('wallet')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                  paymentOption === 'wallet'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <div>
                  <span className="flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Savera Wallet</span>
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Balance: ₹{customer.walletBalance}
                  </span>
                </div>
                {walletHasEnough && (
                  <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-extrabold">
                    1-Click
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setPaymentOption('online')}
                className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                  paymentOption === 'online'
                    ? 'bg-savera-cream/80 border-savera-dark text-savera-dark font-bold'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <div>
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-savera-green" />
                    <span>Razorpay UPI / Cards</span>
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Instant Gateway
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-savera-dark text-savera-cream font-bold py-3.5 rounded-2xl text-xs hover:bg-savera-green transition shadow-floating flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-savera-saffron" />
              <span>
                {isProcessing
                  ? 'Connecting to Secure Gateway...'
                  : `Pay ₹${advanceAmount} & Activate Milk Subscription`}
              </span>
            </button>
            <p className="text-[10px] text-center text-gray-500 mt-2">
              Payment is required to activate. You can pause, skip days, or cancel anytime from your dashboard.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

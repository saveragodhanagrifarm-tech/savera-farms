'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Address, DeliverySlot } from '@/types';
import {
  MapPin,
  Clock,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  QrCode,
  Building,
  Home,
  User,
  Trash2,
  Check,
  ShieldCheck,
  Phone,
  FileText,
  Wallet,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { openRazorpayCheckout } from '@/lib/razorpay';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    customer,
    selectedPincode,
    addAddress,
    deleteAddress,
    placeOrder,
    cartSubtotal,
    cartDiscount,
    deliveryFee,
    cartTotal,
    appliedCoupon,
    addToast,
  } = useApp();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    customer.addresses[0]?.id || ''
  );

  // Address Form state
  const [showAddressForm, setShowAddressForm] = useState(customer.addresses.length === 0);
  const [fullName, setFullName] = useState(customer.fullName);
  const [mobileNumber, setMobileNumber] = useState(customer.phone);
  const [houseFlat, setHouseFlat] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Panchkula');
  const [state, setState] = useState('Haryana');
  const [pincode, setPincode] = useState(selectedPincode || '134109');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');

  useEffect(() => {
    if (customer.fullName && customer.fullName !== 'Savera Guest') {
      setFullName(customer.fullName);
    }
    if (customer.phone && customer.phone !== '+91 98765 43210') {
      setMobileNumber(customer.phone);
    }
    if (customer.addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(customer.addresses[0].id);
    }
  }, [customer.fullName, customer.phone, customer.addresses, selectedAddressId]);

  // Delivery Slot & Payment state
  const [deliverySlot, setDeliverySlot] = useState<DeliverySlot>('5:00 AM - 7:00 AM');
  const [deliveryNotes, setDeliveryNotes] = useState('Leave in milk cooler box at main entrance.');
  const [paymentMethod, setPaymentMethod] = useState<
    'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Wallets' | 'Cash on Delivery'
  >('UPI');

  // Payment inputs
  const [upiId, setUpiId] = useState('customer@okhdfcbank');
  const [showQrCode, setShowQrCode] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const selectedAddress =
    customer.addresses.find((a) => a.id === selectedAddressId) || customer.addresses[0];

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!houseFlat || !street || !area) return;
    const newId = addAddress({
      fullName,
      mobileNumber,
      houseFlat,
      street,
      area,
      landmark,
      city,
      state,
      pincode,
      type: addressType,
    });
    setSelectedAddressId(newId);
    setShowAddressForm(false);
    setHouseFlat('');
    setStreet('');
    setArea('');
    setLandmark('');
  };

  const handleCompleteCheckout = () => {
    const addressToUse = selectedAddress || {
      id: 'addr-temp',
      fullName,
      mobileNumber,
      houseFlat: houseFlat || 'House 14',
      street: street || 'Main Boulevard',
      area: area || 'Sector 9',
      city,
      state,
      pincode,
      type: addressType,
    };

    if (paymentMethod === 'Wallets') {
      if (customer.walletBalance < cartTotal) {
        addToast(
          'Insufficient Wallet Balance',
          `Your wallet balance is ₹${customer.walletBalance}. Please recharge or select UPI/Card.`,
          'error'
        );
        return;
      }
      const newOrder = placeOrder(addressToUse, deliverySlot, 'Wallets');
      addToast(
        'Paid with Savera Wallet! 🎉',
        `₹${cartTotal} debited from your wallet. Remaining: ₹${customer.walletBalance - cartTotal}`,
        'success'
      );
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {}
      router.push(`/orders/${newOrder.id}`);
      return;
    }

    if (paymentMethod !== 'Cash on Delivery') {
      openRazorpayCheckout({
        amountInRupees: cartTotal,
        customerName: addressToUse.fullName,
        customerEmail: customer.email,
        customerPhone: addressToUse.mobileNumber,
        orderNumber: `SAV-${Math.floor(1000 + Math.random() * 9000)}`,
        onSuccess: (paymentId) => {
          const newOrder = placeOrder(addressToUse, deliverySlot, paymentMethod);
          addToast('Payment Successful!', `Razorpay Transaction ID: ${paymentId}`, 'success');
          try {
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
            });
          } catch (e) {}
          router.push(`/orders/${newOrder.id}`);
        },
        onFailure: (err) => {
          addToast('Payment Incomplete', err.message || 'Payment was not completed', 'info');
        },
      });
      return;
    }

    const newOrder = placeOrder(addressToUse, deliverySlot, paymentMethod);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    router.push(`/orders/${newOrder.id}`);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-savera-cream flex items-center justify-center mx-auto text-savera-brown">
          <CheckCircle2 className="w-8 h-8 text-savera-green" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-savera-dark">Your Cart is Currently Empty</h2>
        <p className="text-xs text-savera-brown">Add items to your cart before proceeding to checkout.</p>
        <Link href="/shop" className="inline-block bg-savera-dark text-savera-cream font-bold px-8 py-3 rounded-xl text-xs hover:bg-savera-green transition shadow-md">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Title */}
      <div className="flex items-center justify-between pb-4 border-b border-savera-dark/10">
        <div>
          <span className="text-xs font-bold text-savera-green uppercase tracking-widest block">
            Farm-to-Doorstep Delivery
          </span>
          <h1 className="font-serif text-3xl font-bold text-savera-dark">Express Checkout</h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-savera-green font-bold bg-savera-paleGreen px-3.5 py-1.5 rounded-full">
          <Lock className="w-4 h-4" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Checkout Steps */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Delivery Address */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-savera-dark/10 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-savera-dark flex items-center gap-2">
                <MapPin className="w-5 h-5 text-savera-green" />
                <span>1. Select Delivery Address</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-xs font-bold text-savera-green hover:underline flex items-center gap-1"
              >
                {showAddressForm ? 'Cancel' : '+ Add New Address'}
              </button>
            </div>

            {/* Saved Address Cards */}
            {!showAddressForm && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {customer.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition relative ${
                      selectedAddressId === addr.id
                        ? 'bg-savera-cream/90 border-savera-green shadow-sm ring-2 ring-savera-green/20'
                        : 'bg-savera-offwhite border-savera-dark/10 hover:border-savera-green/40'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-savera-dark">{addr.fullName}</span>
                      <div className="flex items-center gap-2">
                        <span className="bg-savera-dark text-savera-saffron text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {addr.type}
                        </span>
                        {customer.addresses.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAddress(addr.id);
                            }}
                            className="text-gray-400 hover:text-red-500 p-0.5"
                            title="Delete address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-savera-brown leading-relaxed">
                      {addr.houseFlat}, {addr.street}, {addr.area}, {addr.city} - {addr.pincode}
                    </p>
                    <span className="text-[11px] font-semibold text-savera-green block mt-1">
                      Phone: {addr.mobileNumber}
                    </span>
                    {selectedAddressId === addr.id && (
                      <div className="absolute top-3 right-3 text-savera-green">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Address Creation Form */}
            {showAddressForm && (
              <form onSubmit={handleSaveAddress} className="space-y-3 pt-2 bg-savera-offwhite p-5 rounded-2xl border border-savera-dark/10">
                <span className="text-xs font-bold text-savera-dark block">Enter Delivery Details:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-savera-dark/20 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full bg-white border border-savera-dark/20 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="House / Flat / Villa No."
                    value={houseFlat}
                    onChange={(e) => setHouseFlat(e.target.value)}
                    className="w-full bg-white border border-savera-dark/20 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Street / Building / Society Name"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-white border border-savera-dark/20 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Area / Sector"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-white border border-savera-dark/20 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border border-savera-dark/20 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-white border border-savera-dark/20 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="bg-savera-dark text-savera-cream font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-savera-green transition"
                  >
                    Save & Select This Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="bg-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Step 2: Delivery Slot & Special Instructions */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-savera-dark/10 shadow-soft space-y-4">
            <h3 className="font-serif text-lg font-bold text-savera-dark flex items-center gap-2">
              <Clock className="w-5 h-5 text-savera-green" />
              <span>2. Choose Morning Delivery Slot</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { slot: '5:00 AM - 7:00 AM', desc: 'Early Morning Chilled Drop (Recommended)' },
                { slot: '7:00 AM - 9:00 AM', desc: 'Breakfast Time Delivery' },
                { slot: '5:00 PM - 7:00 PM', desc: 'Evening Milk Drop' },
              ].map((s) => (
                <button
                  type="button"
                  key={s.slot}
                  onClick={() => setDeliverySlot(s.slot as DeliverySlot)}
                  className={`p-4 rounded-2xl border text-left transition ${
                    deliverySlot === s.slot
                      ? 'bg-savera-dark text-savera-saffron border-savera-dark shadow-sm ring-2 ring-savera-saffron/30'
                      : 'bg-savera-offwhite border-savera-dark/10 text-savera-dark hover:bg-savera-cream'
                  }`}
                >
                  <span className="text-xs font-bold block">{s.slot}</span>
                  <span className="text-[10px] font-normal opacity-80 block mt-0.5">{s.desc}</span>
                </button>
              ))}
            </div>

            {/* Special drop notes */}
            <div className="pt-2">
              <label className="text-xs font-bold text-savera-dark flex items-center gap-1.5 mb-1">
                <FileText className="w-3.5 h-3.5 text-savera-green" />
                <span>Delivery Instructions for Rider:</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Leave in insulated bag at door, do not ring bell before 6 AM..."
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-xs text-savera-dark"
              />
            </div>
          </div>

          {/* Step 3: Payment Options & Interactive Forms */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-savera-dark/10 shadow-soft space-y-4">
            <h3 className="font-serif text-lg font-bold text-savera-dark flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-savera-green" />
              <span>3. Payment Options</span>
            </h3>

            <div className="space-y-3">
              {[
                { id: 'Wallets', title: `Savera Wallet (Balance: ₹${customer.walletBalance})`, icon: Wallet, badge: customer.walletBalance >= cartTotal ? '1-Click Pay' : 'Low Balance' },
                { id: 'UPI', title: 'UPI Instant (GPay / PhonePe / Paytm / BHIM)', icon: QrCode },
                { id: 'Credit Card', title: 'Credit / Debit Card (Visa, Mastercard, RuPay)', icon: CreditCard },
                { id: 'Net Banking', title: 'Net Banking (All Indian Banks)', icon: Building },
                { id: 'Cash on Delivery', title: 'Cash on Delivery / Pay on Drop', icon: Home },
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = paymentMethod === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setPaymentMethod(p.id as any)}
                    className={`cursor-pointer p-4 rounded-2xl border transition ${
                      isSelected
                        ? 'bg-savera-cream/80 border-savera-green shadow-sm'
                        : 'bg-savera-offwhite border-savera-dark/10 text-savera-dark hover:bg-savera-cream/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-savera-green" />
                        <div>
                          <span className="text-xs font-bold block">{p.title}</span>
                          {p.badge && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${p.badge === '1-Click Pay' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {p.badge}
                            </span>
                          )}
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-savera-green" />}
                    </div>

                    {/* Interactive Payment Fields */}
                    {isSelected && p.id === 'UPI' && (
                      <div className="mt-3 pt-3 border-t border-savera-dark/10 space-y-2">
                        <label className="text-[11px] font-bold text-savera-dark block">Enter Virtual Payment Address (VPA):</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="e.g. yourname@okhdfcbank"
                            className="flex-1 bg-white border border-savera-dark/20 rounded-xl px-3 py-1.5 text-xs font-mono font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() => setShowQrCode(!showQrCode)}
                            className="bg-savera-dark text-savera-saffron font-bold px-3 py-1.5 rounded-xl text-xs hover:bg-savera-green transition"
                          >
                            {showQrCode ? 'Hide QR' : 'Scan QR'}
                          </button>
                        </div>
                        {showQrCode && (
                          <div className="p-3 bg-white rounded-xl border border-savera-dark/10 text-center space-y-2">
                            <div className="w-28 h-28 bg-slate-900 mx-auto rounded-lg flex items-center justify-center text-savera-saffron font-mono text-[10px] p-2 text-center">
                              [DEMO QR CODE] UPI://SAVERA-FARMS/PAY
                            </div>
                            <span className="text-[10px] text-gray-500 block">Scan with any UPI app to pay ₹{cartTotal}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {isSelected && p.id === 'Credit Card' && (
                      <div className="mt-3 pt-3 border-t border-savera-dark/10 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div className="col-span-2 sm:col-span-3">
                          <label className="text-[11px] font-bold text-savera-dark block mb-0.5">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full bg-white border border-savera-dark/20 rounded-xl px-3 py-1.5 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-savera-dark block mb-0.5">Expiry Date</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-white border border-savera-dark/20 rounded-xl px-3 py-1.5 text-xs font-mono text-center"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-savera-dark block mb-0.5">CVV / CVC</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            maxLength={4}
                            className="w-full bg-white border border-savera-dark/20 rounded-xl px-3 py-1.5 text-xs font-mono text-center"
                          />
                        </div>
                      </div>
                    )}

                    {isSelected && p.id === 'Net Banking' && (
                      <div className="mt-3 pt-3 border-t border-savera-dark/10 space-y-1.5">
                        <label className="text-[11px] font-bold text-savera-dark block">Select Your Bank:</label>
                        <div className="flex flex-wrap gap-2">
                          {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank'].map((bank) => (
                            <button
                              type="button"
                              key={bank}
                              onClick={() => setSelectedBank(bank)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                                selectedBank === bank
                                  ? 'bg-savera-dark text-savera-saffron border-savera-dark'
                                  : 'bg-white text-savera-dark border-savera-dark/15'
                              }`}
                            >
                              {bank}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {isSelected && p.id === 'Cash on Delivery' && (
                      <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                        ✓ Pay safely at doorstep with cash or any UPI app upon morning milk delivery.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-4 sm:p-6 border border-savera-dark/10 shadow-soft space-y-5 sm:space-y-6 self-start">
          <div className="flex justify-between items-center pb-3 border-b border-savera-dark/10">
            <h3 className="font-serif text-lg font-bold text-savera-dark">
              Order Items ({cart.length})
            </h3>
            <Link href="/cart" className="text-xs font-bold text-savera-green hover:underline">
              Edit Bag
            </Link>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.variantId} className="flex justify-between items-center text-xs text-savera-dark">
                <div className="flex items-center gap-2.5">
                  <img src={item.image} alt={item.productName} className="w-10 h-10 rounded-xl object-cover border" />
                  <div>
                    <span className="font-bold block line-clamp-1">{item.productName}</span>
                    <span className="text-[10px] text-savera-brown">
                      {item.variantName} x {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="font-serif font-bold shrink-0">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-savera-brown pt-3 border-t border-savera-dark/10">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-bold text-savera-dark">₹{cartSubtotal}</span>
            </div>
            {cartDiscount > 0 && (
              <div className="flex justify-between text-savera-green font-bold">
                <span>Coupon ({appliedCoupon?.code})</span>
                <span>-₹{cartDiscount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Doorstep Delivery Fee</span>
              <span>{deliveryFee === 0 ? <strong className="text-savera-green">FREE</strong> : `₹${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-sm font-serif font-bold text-savera-dark pt-2 border-t border-savera-dark/10">
              <span>Total Payable</span>
              <span className="text-xl text-savera-green font-sans font-bold">₹{cartTotal}</span>
            </div>
          </div>

          <button
            onClick={handleCompleteCheckout}
            className="w-full bg-savera-dark text-savera-cream font-bold py-4 rounded-2xl text-xs hover:bg-savera-green transition shadow-floating flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-savera-saffron" />
            <span>Confirm & Place Order (₹{cartTotal})</span>
          </button>

          <div className="p-3 bg-savera-cream/60 rounded-2xl border border-savera-saffron/30 text-[11px] text-savera-brown space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-savera-dark">
              <ShieldCheck className="w-4 h-4 text-savera-green" />
              <span>Savera Purity & Freshness Assurance</span>
            </div>
            <p>Bottled at 4°C zero-touch inline chillers. If not satisfied, receive 100% replacement or refund.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

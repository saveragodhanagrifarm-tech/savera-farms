'use client';

import React, { useState } from 'react';
import { Product, SubscriptionFrequency, DeliverySlot } from '@/types';
import { useApp } from '@/context/AppContext';
import { X, Calendar, Clock, MapPin, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';

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
  const { addSubscription, customer, selectedPincode, deliveryZones } = useApp();

  const [selectedVariantId, setSelectedVariantId] = useState(
    initialVariantId || product.variants[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [frequency, setFrequency] = useState<SubscriptionFrequency>('Daily');
  const [deliverySlot, setDeliverySlot] = useState<DeliverySlot>('5:00 AM - 7:00 AM');
  const [customDays, setCustomDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  // Estimate monthly deliveries based on frequency
  let monthlyDeliveries = 30;
  if (frequency === 'Alternate Days') monthlyDeliveries = 15;
  if (frequency === '3 Days/Week') monthlyDeliveries = 12;
  if (frequency === 'Weekly') monthlyDeliveries = 4;
  if (frequency === 'Custom') monthlyDeliveries = customDays.length * 4;

  const pricePerUnit = selectedVariant.price;
  const monthlyEstimate = monthlyDeliveries * pricePerUnit * quantity;

  const toggleCustomDay = (day: string) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleConfirmSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    const address = customer.addresses[0] || {
      id: 'addr-default',
      fullName: customer.fullName,
      mobileNumber: customer.phone,
      houseFlat: 'House #12',
      street: 'Main Road',
      area: 'Local Colony',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: selectedPincode,
      type: 'Home',
    };

    addSubscription({
      customerId: customer.id,
      customerName: customer.fullName,
      customerPhone: customer.phone,
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      quantityPerDelivery: quantity,
      pricePerUnit,
      frequency,
      customDays: frequency === 'Custom' ? customDays : undefined,
      deliverySlot,
      deliveryAddress: address,
      monthlyEstimate,
    });

    onClose();
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
          <div className="w-10 h-10 rounded-2xl bg-savera-dark text-savera-saffron flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-savera-dark">Setup Milk Subscription</h3>
            <p className="text-xs text-savera-green font-semibold">Fresh Morning Delivery Straight to Door</p>
          </div>
        </div>

        {/* Product Details Banner */}
        <div className="bg-savera-cream/70 rounded-2xl p-4 mb-5 border border-savera-saffron/30 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden relative shrink-0 bg-white">
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

        <form onSubmit={handleConfirmSubscription} className="space-y-4">
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
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4].map((qty) => (
                <button
                  type="button"
                  key={qty}
                  onClick={() => setQuantity(qty)}
                  className={`w-12 h-10 rounded-xl border text-xs font-bold transition flex items-center justify-center ${
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
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between ${
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
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
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

          {/* Delivery Time Slot */}
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

          {/* Monthly Estimate Summary */}
          <div className="bg-savera-paleGreen/60 p-3.5 rounded-2xl border border-savera-green/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-savera-dark uppercase tracking-wider block">Estimated Monthly Billing</span>
              <span className="text-[10px] text-savera-brown font-medium">~{monthlyDeliveries} deliveries / month</span>
            </div>
            <div className="text-right">
              <span className="font-serif text-xl font-bold text-savera-dark">₹{monthlyEstimate}</span>
              <span className="text-[10px] text-savera-green block font-bold">Auto-calculated</span>
            </div>
          </div>

          {/* Controls */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-savera-dark text-savera-cream font-bold py-3.5 rounded-2xl text-xs hover:bg-savera-green transition shadow-floating flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-savera-saffron" />
              <span>Activate Milk Subscription</span>
            </button>
            <p className="text-[10px] text-center text-gray-500 mt-2">
              You can pause, skip specific dates, or cancel anytime from your Customer Dashboard.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

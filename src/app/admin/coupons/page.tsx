'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Tag, Plus, Trash2, Copy, Check, X } from 'lucide-react';
import { Coupon } from '@/types';

export default function AdminCouponsPage() {
  const { coupons, addCoupon, deleteCoupon, addToast } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'Percentage' | 'Flat Amount'>('Flat Amount');
  const [discountValue, setDiscountValue] = useState(100);
  const [minOrderAmount, setMinOrderAmount] = useState(499);
  const [maxDiscount, setMaxDiscount] = useState<number | undefined>(200);
  const [description, setDescription] = useState('Festive offer: Flat ₹100 off on farm orders');
  const [validUntil, setValidUntil] = useState('2026-12-31');

  const handleCopyCode = (c: string) => {
    navigator.clipboard.writeText(c);
    setCopiedCode(c);
    addToast('Code Copied', `Coupon ${c} copied to clipboard.`, 'info');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const newCoupon: Coupon = {
      code: code.trim().toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount: discountType === 'Percentage' ? maxDiscount : undefined,
      description,
      validUntil,
    };
    addCoupon(newCoupon);
    setShowAddModal(false);
    setCode('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Coupons & Offer Engine</h1>
          <p className="text-xs text-slate-400">
            Create, manage promo codes, discount percentages, and minimum order values ({coupons.length} active)
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-savera-dark hover:bg-savera-green border border-savera-green/50 text-savera-saffron font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c.code} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3 text-xs relative group">
            <div className="flex justify-between items-center">
              <span className="font-mono font-bold text-savera-saffron text-lg uppercase tracking-wider">
                {c.code}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopyCode(c.code)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900"
                  title="Copy coupon code"
                >
                  {copiedCode === c.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => deleteCoupon(c.code)}
                  className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg bg-slate-900"
                  title="Delete coupon"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <span className="inline-block bg-slate-900 text-slate-300 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
              {c.discountType === 'Flat Amount' ? `Flat ₹${c.discountValue} OFF` : `${c.discountValue}% OFF`}
            </span>

            <p className="text-slate-300 leading-relaxed">{c.description}</p>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between font-medium">
              <span>Min Order: ₹{c.minOrderAmount}</span>
              <span>Valid till: {c.validUntil}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Coupon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-3xl p-6 max-w-md w-full border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-white text-lg">Create Promotional Coupon</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  placeholder="e.g. MONSOON20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Flat Amount">Flat Amount (₹)</option>
                    <option value="Percentage">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Discount Value</label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Valid Until Date</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description / Customer Banner</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-savera-saffron text-slate-950 font-bold py-3 rounded-xl text-xs hover:bg-white transition"
              >
                Publish Coupon Code
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

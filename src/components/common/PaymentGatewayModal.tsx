'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  X,
  CreditCard,
  QrCode,
  Smartphone,
  Building,
  ArrowRight,
  Lock,
  Sparkles,
} from 'lucide-react';

export interface PaymentModalData {
  isOpen: boolean;
  amount: number;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  onSuccess: (paymentId: string) => void;
  onFailure: (err: any) => void;
}

export const PaymentGatewayModal: React.FC<{
  data: PaymentModalData | null;
  onClose: () => void;
}> = ({ data, onClose }) => {
  const [tab, setTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'other'>('phonepe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (data?.isOpen) {
      setIsProcessing(false);
      setIsSuccess(false);
    }
  }, [data?.isOpen]);

  if (!data || !data.isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        const mockTxnId = 'pay_sav_' + Math.random().toString(36).substring(2, 11).toUpperCase();
        data.onSuccess(mockTxnId);
        onClose();
      }, 1000);
    }, 1200);
  };

  const handleCancel = () => {
    data.onFailure(new Error('Payment was cancelled by the customer.'));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-savera-dark/15 overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-savera-dark to-[#163023] text-savera-cream p-5 relative">
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-savera-saffron text-savera-brown font-mono font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
              Savera Pay Gateway
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-300 font-bold">
              <Lock className="w-3 h-3" /> 256-Bit SSL
            </span>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-[11px] text-savera-cream/70 font-mono">Order #{data.orderNumber}</p>
              <h3 className="font-serif text-lg font-bold">Savera Godhan Agri Farm</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-savera-cream/70 block uppercase">Amount to Pay</span>
              <span className="font-serif text-2xl font-bold text-savera-saffron">₹{data.amount}</span>
            </div>
          </div>
        </div>

        {/* Success View */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-xl font-bold text-savera-dark">Payment Authorized!</h3>
            <p className="text-xs text-savera-brown">
              ₹{data.amount} successfully transferred. Finalizing your fresh farm order...
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-2 bg-savera-offwhite p-1 rounded-2xl border border-savera-dark/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => setTab('upi')}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  tab === 'upi' ? 'bg-savera-dark text-savera-cream shadow-sm' : 'text-savera-brown hover:text-savera-dark'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>UPI / QR</span>
              </button>
              <button
                type="button"
                onClick={() => setTab('card')}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  tab === 'card' ? 'bg-savera-dark text-savera-cream shadow-sm' : 'text-savera-brown hover:text-savera-dark'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setTab('netbanking')}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  tab === 'netbanking' ? 'bg-savera-dark text-savera-cream shadow-sm' : 'text-savera-brown hover:text-savera-dark'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>NetBanking</span>
              </button>
            </div>

            {/* Tab: UPI */}
            {tab === 'upi' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <button
                    type="button"
                    onClick={() => setUpiApp('phonepe')}
                    className={`p-3 rounded-2xl border transition ${
                      upiApp === 'phonepe'
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold ring-2 ring-purple-600/20'
                        : 'border-savera-dark/15 hover:bg-savera-offwhite'
                    }`}
                  >
                    <span className="text-lg block">🟣</span>
                    <span className="text-[11px] block mt-1">PhonePe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUpiApp('gpay')}
                    className={`p-3 rounded-2xl border transition ${
                      upiApp === 'gpay'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-600/20'
                        : 'border-savera-dark/15 hover:bg-savera-offwhite'
                    }`}
                  >
                    <span className="text-lg block">🔵</span>
                    <span className="text-[11px] block mt-1">Google Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUpiApp('paytm')}
                    className={`p-3 rounded-2xl border transition ${
                      upiApp === 'paytm'
                        ? 'border-cyan-600 bg-cyan-50 text-cyan-900 font-bold ring-2 ring-cyan-600/20'
                        : 'border-savera-dark/15 hover:bg-savera-offwhite'
                    }`}
                  >
                    <span className="text-lg block">🔷</span>
                    <span className="text-[11px] block mt-1">Paytm UPI</span>
                  </button>
                </div>

                {/* QR Code preview */}
                <div className="p-3.5 bg-savera-cream/60 rounded-2xl border border-savera-saffron/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl border border-savera-dark/15 flex items-center justify-center p-1">
                      <QrCode className="w-9 h-9 text-savera-dark" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-savera-dark block">Dynamic UPI Intent</span>
                      <span className="text-[10px] text-savera-brown font-mono">saverafarms@icici</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-savera-green text-white px-2 py-1 rounded-full">
                    Instant Auto-Verify
                  </span>
                </div>
              </div>
            )}

            {/* Tab: Card */}
            {tab === 'card' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-savera-dark font-bold block mb-1">Card Number</label>
                  <input
                    type="text"
                    readOnly
                    value="4242 •••• •••• 4242 (Visa Test Card)"
                    className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-savera-dark font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-savera-dark font-bold block mb-1">Expiry</label>
                    <input
                      type="text"
                      readOnly
                      value="12 / 28"
                      className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-savera-dark font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-savera-dark font-bold block mb-1">CVV</label>
                    <input
                      type="text"
                      readOnly
                      value="888"
                      className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-savera-dark font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Netbanking */}
            {tab === 'netbanking' && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank'].map((b) => (
                  <div
                    key={b}
                    className="p-3 rounded-2xl border border-savera-dark/15 bg-savera-offwhite font-bold text-savera-dark text-center"
                  >
                    🏦 {b}
                  </div>
                ))}
              </div>
            )}

            {/* Pay Button */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full bg-savera-green hover:bg-savera-dark text-white font-bold py-3.5 rounded-2xl text-sm transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Communicating with Bank...</span>
                  </>
                ) : (
                  <>
                    <span>Approve & Pay ₹{data.amount}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-gray-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Zero convenience fee &bull; 100% Secure Checkout</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

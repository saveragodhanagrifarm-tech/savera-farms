'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import { OrderStatus } from '@/types';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  Phone,
  ShieldCheck,
  Package,
  ArrowLeft,
  Key,
  Copy,
  Check,
  RefreshCw,
  XCircle,
  Download,
  AlertTriangle,
} from 'lucide-react';

export default function OrderTrackingPage() {
  const params = useParams();
  const [resolvedId, setResolvedId] = useState<string>((params?.id as string) || '');

  useEffect(() => {
    if (params?.id) {
      setResolvedId(params.id as string);
    } else if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const last = parts[parts.length - 1];
      if (last && last !== 'orders') {
        setResolvedId(last);
      }
    }
  }, [params?.id]);

  const id = resolvedId || (params?.id as string) || '';
  const router = useRouter();
  const { orders, cancelOrder, addToCart, products, addToast } = useApp();

  const [copiedOtp, setCopiedOtp] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of plans / Travelling');
  const [dbOrder, setDbOrder] = useState<any>(null);

  useEffect(() => {
    if (id && !orders.some((o) => o.id === id || o.orderNumber === id)) {
      supabase
        .from('orders')
        .select('*')
        .or(`id.eq.${id},order_number.eq.${id}`)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setDbOrder({
              id: data.id,
              orderNumber: data.order_number,
              customerName: data.customer_name,
              customerPhone: data.customer_phone,
              deliveryAddress: data.delivery_address || {},
              items: data.items || [],
              subtotal: data.subtotal || 0,
              discount: data.discount || 0,
              deliveryFee: data.delivery_fee || 0,
              totalAmount: data.total_amount || 0,
              paymentMethod: data.payment_method || 'Online',
              paymentStatus: data.payment_status || 'Paid',
              status: data.status || 'Order Placed',
              deliveryDate: data.delivery_date,
              deliverySlot: data.delivery_slot,
              otp: data.otp || '4821',
              driverName: data.driver_name || 'Ramesh Kumar (Savera Delivery Partner)',
              driverPhone: data.driver_phone || '+91 98112 33445',
              createdAt: data.created_at,
            });
          }
        });
    }
  }, [id, orders]);

  const order = orders.find((o) => o.id === id || o.orderNumber === id) || dbOrder || orders[0];

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-savera-dark">Order Not Found</h2>
        <Link href="/orders" className="bg-savera-dark text-savera-cream px-6 py-2.5 rounded-xl text-xs font-bold">
          View All Orders
        </Link>
      </div>
    );
  }

  const statuses: OrderStatus[] = [
    'Order Placed',
    'Confirmed',
    'Preparing',
    'Packed',
    'Out for Delivery',
    'Delivered',
  ];

  const currentStatusIndex = statuses.indexOf(order.status);
  const canCancel = order.status === 'Order Placed' || order.status === 'Confirmed';

  const handleCopyOtp = () => {
    if (order.otp) {
      navigator.clipboard.writeText(order.otp);
      setCopiedOtp(true);
      addToast('OTP Copied', `Delivery OTP ${order.otp} copied to clipboard.`, 'info');
      setTimeout(() => setCopiedOtp(false), 2500);
    }
  };

  const handleReorder = () => {
    order.items.forEach((item: any) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.variantId, item.quantity);
      }
    });
    router.push('/cart');
  };

  const handleConfirmCancel = () => {
    cancelOrder(order.id, cancelReason);
    setShowCancelModal(false);
  };

  const handleDownloadInvoice = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Back Navigation & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-savera-dark hover:text-savera-green transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadInvoice}
            className="bg-white border border-savera-dark/15 hover:bg-savera-cream text-savera-dark px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-savera-green" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={handleReorder}
            className="bg-savera-dark hover:bg-savera-green text-savera-cream px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-savera-saffron" />
            <span>Re-order Items</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-savera-dark text-savera-cream rounded-3xl p-6 sm:p-8 shadow-floating flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-savera-saffron uppercase font-mono tracking-wider">
              Order #{order.orderNumber}
            </span>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                order.status === 'Delivered'
                  ? 'bg-emerald-900 text-emerald-300'
                  : order.status === 'Cancelled'
                  ? 'bg-red-900 text-red-300'
                  : 'bg-savera-green/40 text-savera-cream'
              }`}
            >
              {order.status}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">Real-Time Order Tracking</h1>
          <p className="text-xs text-savera-cream/80 mt-1">
            Scheduled Delivery:{' '}
            <strong className="text-savera-saffron">
              {order.deliveryDate} ({order.deliverySlot})
            </strong>
          </p>
        </div>

        {order.otp && order.status !== 'Delivered' && order.status !== 'Cancelled' && (
          <div className="bg-savera-saffron text-savera-brown p-4 rounded-2xl border border-savera-saffronDark text-center relative shadow-md">
            <span className="text-[10px] uppercase font-bold tracking-wider block">Delivery OTP</span>
            <span className="font-mono text-2xl font-extrabold tracking-widest block my-0.5">{order.otp}</span>
            <button
              onClick={handleCopyOtp}
              className="text-[10px] font-bold text-savera-dark hover:underline flex items-center justify-center gap-1 mx-auto mt-1"
            >
              {copiedOtp ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
              <span>{copiedOtp ? 'Copied' : 'Copy OTP'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Interactive Timeline Pipeline */}
      {order.status !== 'Cancelled' ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-savera-dark/10 shadow-soft space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-savera-dark">Delivery Pipeline</h3>
            <span className="text-xs font-semibold text-savera-green">
              Estimated Delivery: 5:00 AM – 7:00 AM
            </span>
          </div>

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {statuses.map((st, idx) => {
              const isPassed = idx <= currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;
              return (
                <div key={st} className="flex sm:flex-col items-center gap-3 sm:gap-2 flex-1 relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition ${
                      isCurrent
                        ? 'bg-savera-saffron text-savera-brown ring-4 ring-savera-saffron/30 shadow-md scale-110'
                        : isPassed
                        ? 'bg-savera-green text-white'
                        : 'bg-savera-offwhite text-gray-400 border border-gray-200'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span
                    className={`text-xs text-center font-bold ${
                      isCurrent ? 'text-savera-green' : isPassed ? 'text-savera-dark' : 'text-gray-400'
                    }`}
                  >
                    {st}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 p-6 rounded-3xl text-center space-y-2">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="font-serif font-bold text-red-900 text-base">This Order Has Been Cancelled</h3>
          <p className="text-xs text-red-700">Any payments made via online modes will be credited back to your account within 24 hours.</p>
        </div>
      )}

      {/* Delivery Partner & Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-savera-dark/10 shadow-soft space-y-3">
          <h3 className="font-serif text-base font-bold text-savera-dark flex items-center gap-2">
            <Truck className="w-5 h-5 text-savera-green" />
            <span>Assigned Delivery Executive</span>
          </h3>
          <div className="bg-savera-cream/60 p-4 rounded-2xl border border-savera-saffron/30 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs text-savera-dark">{order.driverName || 'Ramesh Kumar (Savera Delivery Partner)'}</h4>
              <span className="text-[11px] text-savera-brown font-semibold block mt-0.5">
                Panchkula & Chandigarh Morning Cold-Chain Route
              </span>
            </div>
            <a
              href={`tel:${order.driverPhone || '9811233445'}`}
              className="bg-savera-dark text-savera-cream p-2.5 rounded-xl hover:bg-savera-green transition flex items-center gap-1 text-xs font-bold"
            >
              <Phone className="w-3.5 h-3.5 text-savera-saffron" />
              <span>Call Rider</span>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-savera-dark/10 shadow-soft space-y-3">
          <h3 className="font-serif text-base font-bold text-savera-dark flex items-center gap-2">
            <MapPin className="w-5 h-5 text-savera-green" />
            <span>Delivery Destination</span>
          </h3>
          <p className="text-xs text-savera-brown leading-relaxed bg-savera-offwhite p-4 rounded-2xl border border-savera-dark/10">
            <strong className="text-savera-dark block">{order.deliveryAddress.fullName}</strong>
            {order.deliveryAddress.houseFlat}, {order.deliveryAddress.street}, {order.deliveryAddress.area},{' '}
            {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
          </p>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-savera-dark/10 shadow-soft space-y-4">
        <h3 className="font-serif text-lg font-bold text-savera-dark">Ordered Items</h3>
        <div className="divide-y divide-savera-dark/10">
          {order.items.map((item: any, idx: number) => (
            <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img src={item.image} alt={item.productName} className="w-12 h-12 rounded-xl object-cover border" />
                <div>
                  <h4 className="font-bold text-savera-dark">{item.productName}</h4>
                  <span className="text-[10px] text-savera-green font-semibold">
                    {item.variantName} x {item.quantity}
                  </span>
                </div>
              </div>
              <span className="font-serif font-bold text-savera-dark">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-savera-dark/10 space-y-1.5 text-xs text-savera-brown">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-bold text-savera-dark">₹{order.subtotal}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-savera-green font-bold">
              <span>Coupon Discount ({order.couponCode || 'PROMO'}):</span>
              <span>-₹{order.discount}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery Fee:</span>
            <span>{order.deliveryFee === 0 ? <strong className="text-savera-green">FREE</strong> : `₹${order.deliveryFee}`}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-savera-dark/10 text-sm font-bold text-savera-dark">
            <span>Total Paid ({order.paymentMethod}):</span>
            <span className="text-lg text-savera-green font-serif font-bold">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Cancel Order Action */}
        {canCancel && (
          <div className="pt-4 border-t border-savera-dark/10 flex justify-end">
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel Order</span>
            </button>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-floating border border-savera-dark/10 space-y-4">
            <h3 className="font-serif text-lg font-bold text-savera-dark">Cancel Order #{order.orderNumber}</h3>
            <p className="text-xs text-savera-brown">
              Are you sure you want to cancel this order? It is scheduled for delivery on {order.deliveryDate}.
            </p>
            <div>
              <label className="text-xs font-bold text-savera-dark block mb-1">Reason for Cancellation:</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-xs"
              >
                <option value="Travelling / Not at home">Travelling / Not at home</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Need to change delivery address">Need to change delivery address</option>
                <option value="Other reasons">Other reasons</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleConfirmCancel}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                Confirm Cancellation
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="bg-gray-100 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs"
              >
                Keep Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

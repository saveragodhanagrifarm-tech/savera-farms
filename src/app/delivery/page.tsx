'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useAuth, PRESET_ACCOUNTS } from '@/context/AuthContext';
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
  LogOut,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

export default function DeliveryExecutivePage() {
  const { orders, updateOrderStatus, addToast } = useApp();
  const { user, profile, isRider, isAdmin, isLoading, signIn, signOut } = useAuth();

  const [riderEmail, setRiderEmail] = useState('');
  const [riderPassword, setRiderPassword] = useState('');
  const [riderError, setRiderError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [otpInput, setOtpInput] = useState<{ [orderId: string]: string }>({});
  const [otpAttempts, setOtpAttempts] = useState<{ [orderId: string]: number }>({});
  const [lockedOrders, setLockedOrders] = useState<{ [orderId: string]: boolean }>({});

  const [filterTab, setFilterTab] = useState<'All' | 'Pending' | 'Delivered'>('Pending');
  const [failedModalOrderId, setFailedModalOrderId] = useState<string | null>(null);
  const [failedReason, setFailedReason] = useState('Door locked / Customer not answering');

  // -------------------------------------------------------------------
  // RIDER ROUTE ISOLATION:
  // Each field partner ONLY receives deliveries in their assigned hub!
  // Rider 1 -> Panchkula (134xxx)
  // Rider 2 -> Chandigarh & Mohali (160xxx)
  // -------------------------------------------------------------------
  const isPanchkulaRider =
    profile?.email === 'rider1@saverafarms.com' ||
    profile?.email === 'rider.ramesh@saverafarms.com' ||
    profile?.assignedRoute?.toLowerCase().includes('panchkula');
  const isChandigarhRider =
    profile?.email === 'rider2@saverafarms.com' ||
    profile?.email === 'rider.gurpreet@saverafarms.com' ||
    profile?.assignedRoute?.toLowerCase().includes('chandigarh');

  const routeFilteredOrders = orders.filter((o) => {
    if (isAdmin) return true; // Super admin preview can view all
    const pCode = o.deliveryAddress?.pincode || '';
    const city = (o.deliveryAddress?.city || '').toLowerCase();
    if (isPanchkulaRider) {
      return pCode.startsWith('134') || city.includes('panchkula');
    }
    if (isChandigarhRider) {
      return pCode.startsWith('160') || city.includes('chandigarh') || city.includes('mohali');
    }
    return true;
  });

  const filteredOrders = routeFilteredOrders.filter((o) => {
    if (filterTab === 'All') return true;
    if (filterTab === 'Pending') return o.status !== 'Delivered' && o.status !== 'Cancelled';
    if (filterTab === 'Delivered') return o.status === 'Delivered';
    return true;
  });

  const deliveredCount = routeFilteredOrders.filter((o) => o.status === 'Delivered').length;

  const handleMarkDelivered = (orderId: string, expectedOtp?: string) => {
    if (lockedOrders[orderId]) {
      addToast('Order Verification Locked', 'Too many failed OTP attempts. Contact Panchkula dispatch.', 'error');
      return;
    }

    const entered = (otpInput[orderId] || '').trim();
    if (!entered || entered.length !== 4) {
      addToast('Invalid OTP Format', 'Please enter the 4-digit code provided verbally by customer.', 'error');
      return;
    }

    if (expectedOtp && entered !== expectedOtp) {
      const attempts = (otpAttempts[orderId] || 0) + 1;
      setOtpAttempts({ ...otpAttempts, [orderId]: attempts });

      if (attempts >= 3) {
        setLockedOrders({ ...lockedOrders, [orderId]: true });
        addToast(
          'Security Lockout Activated',
          '3 incorrect OTP attempts. Order locked. Please contact dispatch at +91 172 4567890.',
          'error'
        );
        return;
      }

      addToast(
        'Incorrect OTP',
        `The code "${entered}" is incorrect (${3 - attempts} attempt${3 - attempts === 1 ? '' : 's'} remaining).`,
        'error'
      );
      return;
    }

    updateOrderStatus(orderId, 'Delivered');
    addToast('Delivery Confirmed!', `Order ${orderId} marked as Delivered successfully.`, 'success');
  };

  const handleConfirmFailed = () => {
    if (!failedModalOrderId) return;
    updateOrderStatus(failedModalOrderId, 'Cancelled');
    addToast('Delivery Marked Failed', `Order ${failedModalOrderId} recorded as delivery exception.`, 'info');
    setFailedModalOrderId(null);
  };

  const handleRiderLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setRiderError('');
    setIsLoggingIn(true);
    const { error, profile: loggedProfile } = await signIn(riderEmail, riderPassword);
    if (error) {
      setRiderError(error.message);
    } else if (loggedProfile?.role !== 'rider' && loggedProfile?.role !== 'admin') {
      setRiderError('Access Denied: Please sign in with an assigned Delivery Rider account.');
    }
    setIsLoggingIn(false);
  };

  const handleFillRider = (index: number) => {
    setRiderEmail(PRESET_ACCOUNTS[index].email);
    setRiderPassword(PRESET_ACCOUNTS[index].password);
    setRiderError('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-400">Loading Delivery Partner Route...</p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RIDER AUTHENTICATION GATE:
  // Unauthenticated visitors CANNOT see any customer names,
  // addresses, phone numbers, or delivery routes!
  // -------------------------------------------------------------
  if (!user || (!isRider && !isAdmin)) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <Truck className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-white">Savera Express Rider</h1>
            <p className="text-xs text-slate-400">
              Morning 5 AM Doorstep Drop Management. Authenticate with your assigned driver credentials to access your route.
            </p>
          </div>

          {riderError && (
            <div className="bg-red-950/80 border border-red-800/60 text-red-300 text-xs p-3 rounded-xl">
              {riderError}
            </div>
          )}

          {/* Quick Preset Rider Accounts (Rider 1 & Rider 2) */}
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Assigned Field Delivery Accounts:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleFillRider(3)}
                className="text-left p-2.5 rounded-xl border border-slate-700 bg-slate-950 hover:border-emerald-500 hover:bg-slate-800 transition"
              >
                <span className="font-bold text-emerald-400 block truncate">🚚 Rider 1 (Panchkula)</span>
                <span className="text-[10px] text-slate-400 block truncate font-mono">rider1@saverafarms.com</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillRider(4)}
                className="text-left p-2.5 rounded-xl border border-slate-700 bg-slate-950 hover:border-emerald-500 hover:bg-slate-800 transition"
              >
                <span className="font-bold text-emerald-400 block truncate">🚚 Rider 2 (Chandigarh)</span>
                <span className="text-[10px] text-slate-400 block truncate font-mono">rider2@saverafarms.com</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleRiderLogin} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Rider Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="rider1@saverafarms.com or rider2@saverafarms.com"
                  value={riderEmail}
                  onChange={(e) => setRiderEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={riderPassword}
                  onChange={(e) => setRiderPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              <span>{isLoggingIn ? 'Verifying...' : 'Sign In as Delivery Partner'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800">
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition">
              ← Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE RIDER PORTAL (Zero financial data / Zero OTP hints)
  // -------------------------------------------------------------
  const activeRiderName = profile?.full_name || (isChandigarhRider ? 'Delivery Partner 2 (Chandigarh)' : 'Delivery Partner 1 (Panchkula)');
  const activeRoute = profile?.assignedRoute || (
    isChandigarhRider
      ? 'Chandigarh Sectors 1–40 & Mohali (160xxx)'
      : 'Panchkula Sectors 1–15 & MDC (134xxx)'
  );
  const initials = activeRiderName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'DP';

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
        <div className="flex items-center gap-2">
          <button
            onClick={() => signOut()}
            title="Sign Out of Rider Portal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full bg-savera-dark text-savera-saffron font-bold text-xs flex items-center justify-center border border-savera-saffron/40">
            {initials}
          </div>
        </div>
      </div>

      {/* Driver Info Banner (Zero Financial Data) */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
        <div>
          <span className="text-slate-400 block">Driver: <strong className="text-white">{activeRiderName}</strong></span>
          <span className="font-medium text-emerald-400 text-[11px] block mt-0.5">Route: {activeRoute}</span>
        </div>
        <div className="text-right shrink-0">
          <span className="bg-emerald-950 text-emerald-400 font-bold px-2.5 py-1 rounded-full text-[10px] block mb-1">
            5 AM – 7 AM Slot
          </span>
          <span className="text-[10px] text-slate-400">
            {deliveredCount}/{routeFilteredOrders.length} Delivered
          </span>
        </div>
      </div>

      {isAdmin && (
        <div className="bg-amber-950/40 border border-amber-800/40 p-2.5 rounded-xl text-xs text-amber-300 flex items-center justify-between">
          <span>Super Admin Preview (Viewing All Routes)</span>
          <Link href="/admin" className="font-bold underline hover:text-white">
            Admin Console →
          </Link>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['Pending', 'Delivered', 'All'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${
              filterTab === tab
                ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-extrabold shadow-sm'
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
            <p className="text-xs text-slate-400">All morning assigned deliveries on this route are completed!</p>
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
                      : 'Panchkula Sector 9'}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-1 border-t border-slate-800/80">
                  <Clock className="w-3.5 h-3.5 text-savera-saffron" />
                  <span>Drop Slot: {ord.deliverySlot}</span>
                </div>
              </div>

              {/* Items Summary (Bottles/Quantities ONLY - zero financial figures) */}
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
                  <span>Call Customer</span>
                </a>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    ord.deliveryAddress
                      ? `${ord.deliveryAddress.houseFlat} ${ord.deliveryAddress.street} ${ord.deliveryAddress.city}`
                      : 'Panchkula Sector 9'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Navigation className="w-3.5 h-3.5 text-savera-saffron" />
                  <span>Navigate</span>
                </a>
              </div>

              {/* Delivery Confirmation Controls (NO plaintext OTP hints) */}
              {ord.status !== 'Delivered' && ord.status !== 'Cancelled' && (
                <div className="pt-2 space-y-2 border-t border-slate-800">
                  {lockedOrders[ord.id] ? (
                    <div className="bg-red-950/80 border border-red-800/60 p-3 rounded-xl text-center space-y-1">
                      <div className="flex items-center justify-center gap-1.5 text-red-300 font-bold text-xs">
                        <ShieldAlert className="w-4 h-4 text-red-400" />
                        <span>Order Verification Locked</span>
                      </div>
                      <p className="text-[11px] text-red-400">
                        3 incorrect attempts. Please contact dispatch supervisor to override.
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="Enter 4-digit customer OTP"
                        value={otpInput[ord.id] || ''}
                        onChange={(e) => setOtpInput({ ...otpInput, [ord.id]: e.target.value.replace(/[^0-9]/g, '') })}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 tracking-wider text-center"
                      />
                      <button
                        onClick={() => handleMarkDelivered(ord.id, ord.otp)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Delivered</span>
                      </button>
                    </div>
                  )}

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

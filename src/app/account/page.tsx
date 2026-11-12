'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { supabase } from '@/lib/supabase';
import {
  User,
  Wallet,
  Gift,
  Share2,
  MapPin,
  Calendar,
  Package,
  Headphones,
  Plus,
  Copy,
  Check,
  Trash2,
  Edit,
  X,
  CreditCard,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

export default function CustomerAccountPage() {
  const { user, profile, openAuthModal, signOut } = useAuth();
  const {
    customer,
    subscriptions,
    orders,
    supportTickets,
    createSupportTicket,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    rechargeWallet,
    walletTransactions,
    updateCustomerProfile,
    addToast,
  } = useApp();

  const [copied, setCopied] = useState(false);

  // Modals state
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState<number>(1000);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [newFullName, setNewFullName] = useState(customer.fullName);
  const [newMobile, setNewMobile] = useState(customer.phone);
  const [newHouse, setNewHouse] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newCity, setNewCity] = useState('Panchkula');
  const [newState, setNewState] = useState('Haryana');
  const [newPincode, setNewPincode] = useState('134109');
  const [newType, setNewType] = useState<'Home' | 'Work' | 'Other'>('Home');

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileName, setProfileName] = useState(customer.fullName);
  const [profilePhone, setProfilePhone] = useState(customer.phone);
  const [profileEmail, setProfileEmail] = useState(customer.email);

  useEffect(() => {
    if (user) {
      const activeName = profile?.full_name || customer.fullName;
      const activePhone = profile?.phone || customer.phone;
      const activeEmail = user.email || customer.email;
      setProfileName(activeName);
      setProfilePhone(activePhone);
      setProfileEmail(activeEmail);
      setNewFullName(activeName);
      setNewMobile(activePhone);
    }
  }, [user, profile, customer.fullName, customer.phone, customer.email]);

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketCategory, setTicketCategory] = useState<any>('Subscription Issue');
  const [ticketDesc, setTicketDesc] = useState('');

  // -------------------------------------------------------------
  // PRIVACY & DATA ISOLATION GATE:
  // If user is unauthenticated, NEVER expose any customer profile,
  // orders, wallet balances, or delivery addresses.
  // -------------------------------------------------------------
  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-savera-cream text-savera-green flex items-center justify-center mx-auto shadow-soft border border-savera-dark/10">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-savera-paleGreen text-savera-green px-3 py-1 rounded-full text-xs font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Customer Portal</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-savera-dark">Your Savera Account</h1>
          <p className="text-xs text-savera-brown max-w-md mx-auto leading-relaxed">
            Please sign in to view your daily 5 AM morning milk delivery schedules, check real-time wallet balance, access order tracking, and manage delivery addresses.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => openAuthModal('login')}
            className="w-full sm:w-auto bg-savera-dark text-savera-cream font-bold px-8 py-3.5 rounded-xl text-xs hover:bg-savera-green transition shadow-md flex items-center justify-center gap-2"
          >
            <span>Sign In to Account</span>
            <ArrowRight className="w-4 h-4 text-savera-saffron" />
          </button>
          <button
            onClick={() => openAuthModal('signup')}
            className="w-full sm:w-auto bg-savera-offwhite text-savera-dark border border-savera-dark/15 font-bold px-8 py-3.5 rounded-xl text-xs hover:bg-white transition"
          >
            Create New Account
          </button>
        </div>

        <div className="pt-8 border-t border-savera-dark/10 max-w-sm mx-auto text-left text-xs text-savera-brown/80 space-y-2">
          <p className="font-bold text-savera-dark text-center">Why create an account?</p>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-savera-green shrink-0" />
            <span>Automate daily 5 AM milk deliveries with 1-click pauses</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-savera-green shrink-0" />
            <span>Earn ₹100 referral cashback on every friend who tries Savera</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-savera-green shrink-0" />
            <span>Recharge Savera Wallet for hassle-free morning drops</span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED CUSTOMER VIEW (Strict User-Level Filtering)
  // -------------------------------------------------------------
  const activeName = profile?.full_name || customer.fullName || user.email?.split('@')[0] || 'Customer';
  const activePhone = profile?.phone || customer.phone || '';
  const activeEmail = user.email || customer.email || '';
  const activeWallet = typeof profile?.wallet_balance === 'number' ? profile.wallet_balance : customer.walletBalance;

  // Filter orders and subscriptions belonging ONLY to this customer
  const normEmail = (user.email || activeEmail || '').toLowerCase().trim();
  const normName = activeName.toLowerCase().trim();
  const normPhone = activePhone.replace(/[^0-9]/g, '');

  const userOrders = orders.filter((o) => {
    if (o.customerId === user.id) return true;
    if (normEmail) {
      if (o.customerId && o.customerId.toLowerCase().trim() === normEmail) return true;
      if (o.customerEmail && o.customerEmail.toLowerCase().trim() === normEmail) return true;
    }
    const oName = (o.customerName || '').toLowerCase().trim();
    if (normName && oName && (oName === normName || oName.includes(normName) || normName.includes(oName))) return true;
    const oPhone = (o.customerPhone || '').replace(/[^0-9]/g, '');
    if (normPhone && oPhone && normPhone.length >= 10 && oPhone.length >= 10 && normPhone.slice(-10) === oPhone.slice(-10)) return true;
    return false;
  });

  const userSubscriptions = subscriptions.filter((s) => {
    if (s.customerId === user.id) return true;
    if (normEmail && s.customerId && s.customerId.toLowerCase().trim() === normEmail) return true;
    const sName = (s.customerName || '').toLowerCase().trim();
    if (normName && sName && (sName === normName || sName.includes(normName) || normName.includes(sName))) return true;
    const sPhone = (s.customerPhone || '').replace(/[^0-9]/g, '');
    if (normPhone && sPhone && normPhone.length >= 10 && sPhone.length >= 10 && normPhone.slice(-10) === sPhone.slice(-10)) return true;
    return false;
  });

  const copyReferralCode = () => {
    navigator.clipboard.writeText(customer.referralCode);
    setCopied(true);
    addToast('Referral Code Copied!', `Share ${customer.referralCode} with friends to earn ₹100.`, 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleRechargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rechargeAmount <= 0) return;

    setShowRechargeModal(false);

    await openRazorpayCheckout({
      amountInRupees: rechargeAmount,
      customerName: activeName,
      customerEmail: activeEmail,
      customerPhone: activePhone,
      orderNumber: `WAL-${Math.floor(10000 + Math.random() * 90000)}`,
      onSuccess: (paymentId) => {
        rechargeWallet(rechargeAmount, paymentId, 'Online Wallet Recharge via Razorpay');
      },
      onFailure: (err) => {
        addToast('Recharge Cancelled', err.message || 'Payment not completed.', 'info');
      },
    });
  };

  const handleStartAddAddress = () => {
    setEditingAddressId(null);
    setNewFullName(activeName);
    setNewMobile(activePhone);
    setNewHouse('');
    setNewStreet('');
    setNewArea('');
    setNewLandmark('');
    setNewCity('Panchkula');
    setNewState('Haryana');
    setNewPincode('134109');
    setNewType('Home');
    setShowAddressModal(true);
  };

  const handleStartEditAddress = (addr: (typeof customer.addresses)[0]) => {
    setEditingAddressId(addr.id);
    setNewFullName(addr.fullName);
    setNewMobile(addr.mobileNumber);
    setNewHouse(addr.houseFlat);
    setNewStreet(addr.street);
    setNewArea(addr.area || '');
    setNewLandmark(addr.landmark || '');
    setNewCity(addr.city);
    setNewState(addr.state);
    setNewPincode(addr.pincode);
    setNewType(addr.type);
    setShowAddressModal(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHouse || !newStreet) {
      addToast('Missing Details', 'Please enter your house/flat number and street.', 'error');
      return;
    }
    const areaVal = newArea.trim() || newStreet.trim();

    if (editingAddressId) {
      updateAddress(editingAddressId, {
        fullName: newFullName,
        mobileNumber: newMobile,
        houseFlat: newHouse,
        street: newStreet,
        area: areaVal,
        landmark: newLandmark,
        city: newCity,
        state: newState,
        pincode: newPincode,
        type: newType,
      });
    } else {
      addAddress({
        fullName: newFullName,
        mobileNumber: newMobile,
        houseFlat: newHouse,
        street: newStreet,
        area: areaVal,
        landmark: newLandmark,
        city: newCity,
        state: newState,
        pincode: newPincode,
        type: newType,
      });
    }

    setShowAddressModal(false);
    setEditingAddressId(null);
    setNewHouse('');
    setNewStreet('');
    setNewArea('');
    setNewLandmark('');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile({
      fullName: profileName,
      phone: profilePhone,
      email: profileEmail,
    });
    setShowEditProfileModal(false);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketDesc.trim()) return;
    createSupportTicket({
      name: activeName,
      phone: activePhone,
      category: ticketCategory,
      description: ticketDesc,
    });
    setShowTicketModal(false);
    setTicketDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-28 sm:pb-12 space-y-6 sm:space-y-8">
      {/* Account Profile Banner */}
      <div className="bg-savera-dark text-savera-cream rounded-3xl p-5 sm:p-8 shadow-floating flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-savera-saffron text-savera-brown flex items-center justify-center font-serif text-2xl font-bold shadow-md shrink-0">
            {activeName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold">{activeName}</h1>
              <button
                onClick={() => setShowEditProfileModal(true)}
                className="text-savera-saffron hover:text-white p-1"
                title="Edit Profile"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-savera-cream/80 mt-0.5">
              {activePhone ? `${activePhone} • ` : ''}{activeEmail}
            </p>
          </div>
        </div>

        {/* Savera Wallet & Rewards */}
        <div className="flex items-center gap-4 bg-savera-green/40 p-4 rounded-2xl border border-savera-saffron/30 w-full sm:w-auto">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] uppercase font-bold text-savera-saffron block">Savera Wallet</span>
              <button
                onClick={() => setShowRechargeModal(true)}
                className="text-[10px] bg-savera-saffron text-savera-brown px-2 py-0.5 rounded-md font-bold hover:bg-white transition"
              >
                + Recharge
              </button>
            </div>
            <span className="font-serif text-2xl font-bold text-white block mt-0.5">₹{activeWallet}</span>
          </div>

          <div className="h-10 w-px bg-savera-cream/20" />

          <div>
            <span className="text-[10px] uppercase font-bold text-savera-saffron block">Reward Points</span>
            <span className="font-serif text-2xl font-bold text-white block mt-0.5">{customer.rewardPoints} Pts</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Referral & Rewards Card */}
        <div className="lg:col-span-6 bg-savera-cream/70 rounded-3xl p-6 border border-savera-saffron/40 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-savera-brown" />
              <h3 className="font-serif text-lg font-bold text-savera-dark">Refer & Earn ₹100</h3>
            </div>
            <span className="bg-savera-saffron text-savera-brown text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              Give ₹100, Get ₹100
            </span>
          </div>
          <p className="text-xs text-savera-brown/90 leading-relaxed">
            Invite your friends & neighbors in Chandigarh and Panchkula to try pure A2 Desi Cow Milk. They get ₹100 off on their first order, and you get ₹100 credited to your Savera Wallet!
          </p>

          <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-savera-dark/15">
            <span className="text-xs font-mono font-bold text-savera-dark flex-1 px-2">{customer.referralCode}</span>
            <button
              onClick={copyReferralCode}
              className="bg-savera-dark text-savera-cream font-bold px-4 py-2 rounded-xl text-xs hover:bg-savera-green transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-savera-saffron" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Quick Links (Isolated to this customer) */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <Link
            href="/subscriptions"
            className="bg-white rounded-3xl p-6 border border-savera-dark/10 shadow-soft hover:shadow-hover transition space-y-2 group block"
          >
            <div className="w-10 h-10 rounded-2xl bg-savera-paleGreen text-savera-green flex items-center justify-center group-hover:scale-105 transition">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-savera-dark text-base">Milk Subscriptions</h4>
            <span className="text-xs text-savera-brown font-semibold block">
              {userSubscriptions.length} active recurring {userSubscriptions.length === 1 ? 'schedule' : 'schedules'}
            </span>
          </Link>

          <Link
            href="/orders"
            className="bg-white rounded-3xl p-6 border border-savera-dark/10 shadow-soft hover:shadow-hover transition space-y-2 group block"
          >
            <div className="w-10 h-10 rounded-2xl bg-savera-cream text-savera-brown flex items-center justify-center group-hover:scale-105 transition">
              <Package className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-savera-dark text-base">Order History</h4>
            <span className="text-xs text-savera-brown font-semibold block">
              {userOrders.length} total orders placed
            </span>
          </Link>
        </div>

        {/* Wallet Transaction Ledger (Auditable Financial Ledger) */}
        <div className="lg:col-span-12 bg-white rounded-3xl p-6 sm:p-8 border border-savera-dark/10 shadow-soft space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-savera-dark flex items-center gap-2">
              <Wallet className="w-5 h-5 text-savera-green" />
              <span>Wallet Passbook & Transaction Ledger</span>
            </h3>
            <button
              onClick={() => setShowRechargeModal(true)}
              className="text-xs font-bold text-savera-green hover:underline"
            >
              + Add Funds
            </button>
          </div>

          <div className="space-y-2">
            {walletTransactions.length === 0 ? (
              <p className="text-xs text-gray-500 py-3">No transactions recorded yet. Recharge your wallet for automated morning deductions.</p>
            ) : (
              walletTransactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-2xl bg-savera-offwhite border border-savera-dark/10 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                        tx.type === 'Credit'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {tx.type === 'Credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-bold text-savera-dark">{tx.description}</p>
                      <span className="text-[10px] text-gray-500 font-mono">Ref: {tx.referenceId} • {new Date(tx.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-serif font-bold text-sm block ${
                        tx.type === 'Credit' ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {tx.type === 'Credit' ? '+' : '-'}₹{tx.amount}
                    </span>
                    <span className="text-[10px] text-gray-500">Bal: ₹{tx.balanceAfter}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Saved Delivery Addresses */}
        <div className="lg:col-span-12 bg-white rounded-3xl p-6 sm:p-8 border border-savera-dark/10 shadow-soft space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg font-bold text-savera-dark flex items-center gap-2">
                <MapPin className="w-5 h-5 text-savera-green" />
                <span>Saved Delivery Addresses</span>
              </h3>
              <p className="text-xs text-savera-brown/70">Manage delivery locations in Panchkula, Chandigarh & Mohali</p>
            </div>
            <button
              onClick={handleStartAddAddress}
              className="bg-savera-dark text-savera-cream font-bold px-4 py-2 rounded-xl text-xs hover:bg-savera-green transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {customer.addresses.length === 0 ? (
              <div className="sm:col-span-3 text-center py-10 bg-savera-offwhite/50 rounded-2xl border border-dashed border-savera-dark/20 space-y-2">
                <MapPin className="w-8 h-8 text-savera-brown/40 mx-auto" />
                <p className="text-xs font-bold text-savera-dark">No delivery addresses saved yet.</p>
                <p className="text-[11px] text-savera-brown/70">Click &quot;+ Add New Address&quot; above to add your Tricity home or office address.</p>
              </div>
            ) : (
              customer.addresses.map((addr) => (
                <div key={addr.id} className="p-4 rounded-2xl bg-savera-offwhite border border-savera-dark/15 space-y-2 relative flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-savera-dark text-xs">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Default
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="bg-savera-dark text-savera-saffron text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {addr.type}
                        </span>
                        <button
                          onClick={() => handleStartEditAddress(addr)}
                          className="text-gray-500 hover:text-savera-dark p-1 rounded-lg hover:bg-black/5 transition"
                          title="Edit address"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-black/5 transition"
                          title="Delete address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-savera-brown leading-relaxed">
                      {addr.houseFlat}, {addr.street}{addr.area ? `, ${addr.area}` : ''}
                      {addr.landmark ? `, Landmark: ${addr.landmark}` : ''}
                    </p>
                    <p className="text-xs font-semibold text-savera-dark">
                      {addr.city}, {addr.state} - <span className="font-mono font-bold text-savera-green">{addr.pincode}</span>
                    </p>
                    <span className="text-[11px] font-semibold text-savera-green block">Ph: {addr.mobileNumber}</span>
                  </div>

                  {!addr.isDefault && (
                    <div className="pt-2 border-t border-savera-dark/10 flex justify-end">
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-[11px] font-bold text-savera-brown hover:text-savera-green transition underline"
                      >
                        Set as Default
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Customer Support Desk */}
        <div className="lg:col-span-12 bg-white rounded-3xl p-6 sm:p-8 border border-savera-dark/10 shadow-soft space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-savera-dark flex items-center gap-2">
              <Headphones className="w-5 h-5 text-savera-green" />
              <span>Customer Support Desk</span>
            </h3>
            <button
              onClick={() => setShowTicketModal(true)}
              className="bg-savera-dark text-savera-cream font-bold px-4 py-2 rounded-xl text-xs hover:bg-savera-green transition"
            >
              + Raise Support Ticket
            </button>
          </div>

          <div className="space-y-3">
            {supportTickets.length === 0 ? (
              <p className="text-xs text-gray-500">No active support tickets.</p>
            ) : (
              supportTickets.map((tkt) => (
                <div key={tkt.id} className="p-4 rounded-2xl bg-savera-offwhite border border-savera-dark/10 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-savera-dark font-mono">{tkt.ticketNumber} • {tkt.issueCategory}</span>
                    <p className="text-savera-brown mt-0.5">{tkt.description}</p>
                    <span className="text-[10px] text-gray-400 block mt-1">{tkt.createdAt}</span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      tkt.status === 'Resolved' || tkt.status === 'Closed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {tkt.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sign Out Action */}
        <div className="lg:col-span-12 pt-4 text-center">
          <button
            onClick={() => signOut()}
            className="text-xs text-red-600 hover:text-red-700 font-bold inline-flex items-center gap-1.5 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Savera Account</span>
          </button>
        </div>
      </div>

      {/* Recharge Wallet Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 shadow-floating border border-savera-dark/10">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-savera-dark">Recharge Savera Wallet</h3>
              <button onClick={() => setShowRechargeModal(false)} className="text-gray-400 hover:text-savera-dark">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-savera-brown">
              Add funds for automated, hassle-free morning milk subscription deductions.
            </p>

            <form onSubmit={handleRechargeSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-savera-dark block mb-2">Select Amount:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[500, 1000, 2000].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setRechargeAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        rechargeAmount === amt
                          ? 'bg-savera-green text-white border-savera-green'
                          : 'bg-savera-offwhite text-savera-dark border-savera-dark/15'
                      }`}
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-savera-dark block mb-1">Or Enter Custom Amount (₹):</label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-savera-dark/20 text-xs font-bold text-savera-dark focus:outline-none focus:border-savera-green"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-savera-dark text-savera-cream font-bold py-3 rounded-xl text-xs hover:bg-savera-green transition shadow-md"
              >
                Confirm & Add ₹{rechargeAmount} to Wallet
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-floating border border-savera-dark/10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif text-xl font-bold text-savera-dark">
                  {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                </h3>
                <p className="text-xs text-savera-brown/70">
                  {editingAddressId ? 'Update your saved location details' : 'Save a new delivery address for morning milk orders'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddressModal(false);
                  setEditingAddressId(null);
                }}
                className="text-gray-400 hover:text-savera-dark"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-savera-dark block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-savera-dark/20"
                />
              </div>

              <div>
                <label className="font-bold text-savera-dark block mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={newMobile}
                  onChange={(e) => setNewMobile(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-savera-dark/20"
                />
              </div>

              <div>
                <label className="font-bold text-savera-dark block mb-1">House / Flat / Kothi No.</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House #142 or Flat 402, Block B"
                  value={newHouse}
                  onChange={(e) => setNewHouse(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-savera-dark/20"
                />
              </div>

              <div>
                <label className="font-bold text-savera-dark block mb-1">Street / Building / Society</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Madhya Marg Ext or Sunshine Heights"
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-savera-dark/20"
                />
              </div>

              <div>
                <label className="font-bold text-savera-dark block mb-1">Sector / Area / Colony</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 9 Hub or Sector 22"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-savera-dark/20"
                />
              </div>

              <div>
                <label className="font-bold text-savera-dark block mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Near Geeta Mandir or Opposite Community Centre"
                  value={newLandmark}
                  onChange={(e) => setNewLandmark(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-savera-dark/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-savera-dark block mb-1">City (Tricity)</label>
                  <select
                    value={newCity}
                    onChange={(e) => {
                      const c = e.target.value;
                      setNewCity(c);
                      if (c === 'Panchkula') {
                        setNewState('Haryana');
                        setNewPincode('134109');
                      } else if (c === 'Chandigarh') {
                        setNewState('Chandigarh');
                        setNewPincode('160022');
                      } else if (c === 'Mohali') {
                        setNewState('Punjab');
                        setNewPincode('160055');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-savera-dark/20 bg-white"
                  >
                    <option value="Panchkula">Panchkula (Haryana)</option>
                    <option value="Chandigarh">Chandigarh (UT)</option>
                    <option value="Mohali">Mohali (Punjab)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-savera-dark block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-savera-dark/20 font-mono font-bold text-savera-green"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-savera-dark block mb-1">Address Type</label>
                <div className="flex gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setNewType(t)}
                      className={`flex-1 py-2 rounded-xl border font-bold ${
                        newType === t
                          ? 'bg-savera-green text-white border-savera-green'
                          : 'bg-savera-offwhite border-savera-dark/15'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-savera-dark text-savera-cream font-bold py-3 rounded-xl hover:bg-savera-green transition mt-2 shadow-md"
              >
                {editingAddressId ? 'Update Address' : 'Save Delivery Address'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 shadow-floating border border-savera-dark/10">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-savera-dark">Edit Profile</h3>
              <button onClick={() => setShowEditProfileModal(false)} className="text-gray-400 hover:text-savera-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-savera-dark block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-savera-dark/20"
                />
              </div>

              <div>
                <label className="font-bold text-savera-dark block mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  required
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-savera-dark/20"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-savera-dark text-savera-cream font-bold py-3 rounded-xl hover:bg-savera-green transition mt-2 shadow-md"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Support Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-floating border border-savera-dark/10">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-savera-dark">Raise Support Ticket</h3>
              <button onClick={() => setShowTicketModal(false)} className="text-gray-400 hover:text-savera-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-savera-dark block mb-1">Issue Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-savera-dark/20"
                >
                  <option value="Subscription Issue">Subscription Issue (Quantity / Frequency)</option>
                  <option value="Delivery Issue">Delivery Delay or Missed Drop</option>
                  <option value="Product Issue">Bottle Quality or Packaging</option>
                  <option value="Payment Issue">Wallet Recharge or Invoice</option>
                  <option value="Other">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-savera-dark block mb-1">Describe Issue</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please describe your issue in detail..."
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-savera-dark/20"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-savera-dark text-savera-cream font-bold py-3 rounded-xl hover:bg-savera-green transition mt-2 shadow-md"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

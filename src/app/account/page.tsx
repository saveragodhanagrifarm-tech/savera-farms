'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
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
} from 'lucide-react';

export default function CustomerAccountPage() {
  const {
    customer,
    subscriptions,
    orders,
    supportTickets,
    createSupportTicket,
    addAddress,
    deleteAddress,
    rechargeWallet,
    updateCustomerProfile,
    addToast,
  } = useApp();

  const [copied, setCopied] = useState(false);

  // Modals state
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState<number>(1000);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newFullName, setNewFullName] = useState(customer.fullName);
  const [newMobile, setNewMobile] = useState(customer.phone);
  const [newHouse, setNewHouse] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newCity, setNewCity] = useState('Gurugram');
  const [newState, setNewState] = useState('Haryana');
  const [newPincode, setNewPincode] = useState('122002');
  const [newType, setNewType] = useState<'Home' | 'Work' | 'Other'>('Home');

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileName, setProfileName] = useState(customer.fullName);
  const [profilePhone, setProfilePhone] = useState(customer.phone);
  const [profileEmail, setProfileEmail] = useState(customer.email);

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketCategory, setTicketCategory] = useState<any>('Subscription Issue');
  const [ticketDesc, setTicketDesc] = useState('');

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
      customerName: customer.fullName,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      orderNumber: `WAL-${Math.floor(10000 + Math.random() * 90000)}`,
      onSuccess: (paymentId) => {
        rechargeWallet(rechargeAmount);
        addToast(
          'Wallet Recharged Successfully! 🎉',
          `₹${rechargeAmount} added to your Savera Wallet. Ref ID: ${paymentId}`,
          'success'
        );
        // Sync wallet transaction to Supabase
        try {
          supabase.from('orders').insert({
            id: 'WAL-' + Date.now(),
            order_number: 'WAL-' + Math.floor(10000 + Math.random() * 90000),
            customer_name: customer.fullName,
            customer_phone: customer.phone,
            delivery_address: {},
            items: [
              {
                productId: 'wallet-recharge',
                productName: 'Savera Wallet Top-up',
                price: rechargeAmount,
                quantity: 1,
              },
            ],
            total_amount: rechargeAmount,
            payment_method: 'Online Payment Gateway',
            payment_status: 'Paid',
            status: 'Completed',
          }).then(({ error }) => {
            if (error) console.warn('Wallet recharge sync note:', error.message);
          });
        } catch (e) {}
      },
      onFailure: (err) => {
        addToast('Payment Cancelled', 'Wallet recharge was not completed.', 'info');
      },
    });
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHouse || !newStreet || !newArea) return;
    addAddress({
      fullName: newFullName,
      mobileNumber: newMobile,
      houseFlat: newHouse,
      street: newStreet,
      area: newArea,
      city: newCity,
      state: newState,
      pincode: newPincode,
      type: newType,
    });
    setShowAddressModal(false);
    setNewHouse('');
    setNewStreet('');
    setNewArea('');
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
      name: customer.fullName,
      phone: customer.phone,
      category: ticketCategory,
      description: ticketDesc,
    });
    setShowTicketModal(false);
    setTicketDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Account Profile Banner */}
      <div className="bg-savera-dark text-savera-cream rounded-3xl p-8 shadow-floating flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-savera-saffron text-savera-brown flex items-center justify-center font-serif text-2xl font-bold shadow-md">
            {customer.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold">{customer.fullName}</h1>
              <button
                onClick={() => setShowEditProfileModal(true)}
                className="text-savera-saffron hover:text-white p-1"
                title="Edit Profile"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-savera-cream/80">
              {customer.phone} • {customer.email}
            </p>
          </div>
        </div>

        {/* Savera Wallet & Rewards */}
        <div className="flex items-center gap-4 bg-savera-green/40 p-4 rounded-2xl border border-savera-saffron/30">
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
            <span className="font-serif text-2xl font-bold text-white block mt-0.5">₹{customer.walletBalance}</span>
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
            Invite your friends to try pure A2 Desi Cow Milk. They get ₹100 off on their first order, and you get ₹100 in your Savera Wallet!
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

        {/* Quick Shortcuts */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <Link
            href="/subscriptions"
            className="bg-white p-6 rounded-3xl border border-savera-dark/10 shadow-soft hover:shadow-card transition flex flex-col justify-between group"
          >
            <Calendar className="w-8 h-8 text-savera-green mb-2 group-hover:scale-110 transition" />
            <div>
              <h4 className="font-serif font-bold text-savera-dark text-base">Active Subscriptions</h4>
              <span className="text-xs text-savera-brown font-semibold">{subscriptions.length} recurring schedules</span>
            </div>
          </Link>

          <Link
            href="/orders"
            className="bg-white p-6 rounded-3xl border border-savera-dark/10 shadow-soft hover:shadow-card transition flex flex-col justify-between group"
          >
            <Package className="w-8 h-8 text-savera-brown mb-2 group-hover:scale-110 transition" />
            <div>
              <h4 className="font-serif font-bold text-savera-dark text-base">Order History</h4>
              <span className="text-xs text-savera-brown font-semibold">{orders.length} total orders placed</span>
            </div>
          </Link>
        </div>

        {/* Saved Addresses Section */}
        <div className="lg:col-span-12 bg-white rounded-3xl p-6 sm:p-8 border border-savera-dark/10 shadow-soft space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-savera-dark flex items-center gap-2">
              <MapPin className="w-5 h-5 text-savera-green" />
              <span>Saved Delivery Addresses</span>
            </h3>
            <button
              onClick={() => setShowAddressModal(true)}
              className="bg-savera-dark text-savera-cream font-bold px-4 py-2 rounded-xl text-xs hover:bg-savera-green transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-savera-saffron" />
              <span>+ Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customer.addresses.map((addr) => (
              <div key={addr.id} className="p-4 rounded-2xl bg-savera-offwhite border border-savera-dark/10 space-y-2 relative">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-savera-dark">{addr.fullName}</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-savera-dark text-savera-saffron text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {addr.type}
                    </span>
                    {customer.addresses.length > 1 && (
                      <button
                        onClick={() => deleteAddress(addr.id)}
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
                <span className="text-[11px] font-semibold text-savera-green block">Ph: {addr.mobileNumber}</span>
              </div>
            ))}
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
      </div>

      {/* Wallet Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-floating border border-savera-dark/10 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-savera-dark flex items-center gap-2">
                <Wallet className="w-5 h-5 text-savera-green" />
                <span>Recharge Savera Wallet</span>
              </h3>
              <button onClick={() => setShowRechargeModal(false)} className="text-gray-400 hover:text-gray-600">
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
                          ? 'bg-savera-dark text-savera-saffron border-savera-dark'
                          : 'bg-savera-offwhite border-savera-dark/15 text-savera-dark'
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
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(Number(e.target.value))}
                  min={100}
                  max={25000}
                  className="w-full bg-savera-offwhite border border-savera-dark/20 rounded-xl px-3 py-2 text-sm font-bold font-mono"
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

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-floating border border-savera-dark/10 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-savera-dark">Add New Delivery Address</h3>
              <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-xs"
                  required
                />
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={newMobile}
                  onChange={(e) => setNewMobile(e.target.value)}
                  className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="House / Flat / Tower No."
                value={newHouse}
                onChange={(e) => setNewHouse(e.target.value)}
                className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-xs"
                required
              />
              <input
                type="text"
                placeholder="Street / Society / Building Name"
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-xs"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Area / Sector"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-xs"
                  required
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={newPincode}
                  onChange={(e) => setNewPincode(e.target.value)}
                  className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  required
                />
              </div>
              <div className="flex gap-2">
                {(['Home', 'Work', 'Other'] as const).map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setNewType(t)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                      newType === t ? 'bg-savera-dark text-savera-saffron' : 'bg-savera-offwhite'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                className="w-full bg-savera-dark text-savera-cream font-bold py-3 rounded-xl text-xs hover:bg-savera-green transition shadow-md"
              >
                Save Delivery Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-floating border border-savera-dark/10 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-savera-dark">Edit Profile Details</h3>
              <button onClick={() => setShowEditProfileModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-savera-dark block mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-savera-dark block mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-xs font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-savera-dark block mb-1">Email Address</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-savera-dark text-savera-cream font-bold py-3 rounded-xl text-xs hover:bg-savera-green transition shadow-md"
              >
                Save Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Support Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-floating border border-savera-dark/10 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-savera-dark">Raise Support Request</h3>
              <button onClick={() => setShowTicketModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-savera-dark block mb-1">Issue Category:</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value as any)}
                  className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="Subscription Issue">Subscription Issue</option>
                  <option value="Delivery Issue">Delivery Delay or Time Issue</option>
                  <option value="Product Issue">Product Quality / Glass Bottle</option>
                  <option value="Payment Issue">Wallet or Payment Question</option>
                  <option value="Other">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-savera-dark block mb-1">Description:</label>
                <textarea
                  rows={3}
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  placeholder="Explain your inquiry or issue..."
                  className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-savera-dark text-savera-cream font-bold py-3 rounded-xl text-xs hover:bg-savera-green transition shadow-md"
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

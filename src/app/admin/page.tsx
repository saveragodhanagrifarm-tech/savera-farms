'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  DollarSign,
  ShoppingBag,
  Calendar,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  PackageCheck,
  Milk,
  Truck,
  Users,
  Headphones,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  PhoneCall,
  Copy,
  Check,
  X,
  MessageSquare,
  ShieldAlert,
  Wallet,
  Package,
  Boxes,
  Factory,
  MapPin,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const {
    adminRole,
    setAdminRole,
    orders,
    subscriptions,
    batches,
    rawMaterials = [],
    restockRawMaterial,
    purchaseOrders = [],
    updatePOStatus,
    productionLogs = [],
    deliveryZones = [],
    supportTickets,
    createSupportTicket,
    updateTicketStatus,
    updateOrderStatus,
    rechargeWallet,
    addToast,
  } = useApp();

  // Support Desk Local State
  const [ticketFilter, setTicketFilter] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<(typeof supportTickets)[0] | null>(null);
  const [newStatus, setNewStatus] = useState<'Open' | 'In Progress' | 'Resolved' | 'Closed'>('Resolved');
  const [agentNotes, setAgentNotes] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);

  // New Ticket Modal State
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('+91 ');
  const [newCustCategory, setNewCustCategory] = useState<(typeof supportTickets)[0]['issueCategory']>('Delivery Issue');
  const [newCustDesc, setNewCustDesc] = useState('');

  // OTP Copy State
  const [copiedOtp, setCopiedOtp] = useState<string | null>(null);

  const handleCopyOtp = (otp: string) => {
    navigator.clipboard.writeText(otp);
    setCopiedOtp(otp);
    addToast('OTP Copied', `Delivery OTP ${otp} copied to clipboard.`, 'info');
    setTimeout(() => setCopiedOtp(null), 2000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone || !newCustDesc) return;
    createSupportTicket({
      name: newCustName,
      phone: newCustPhone,
      category: newCustCategory,
      description: newCustDesc,
    });
    setShowNewTicketModal(false);
    setNewCustName('');
    setNewCustPhone('+91 ');
    setNewCustDesc('');
  };

  const handleSaveTicketResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    updateTicketStatus(selectedTicket.id, newStatus);
    if (refundAmount > 0) {
      rechargeWallet(refundAmount);
      addToast('Refund Credited', `₹${refundAmount} credited to customer wallet as resolution.`, 'success');
    }
    addToast('Ticket Updated', `Ticket #${selectedTicket.ticketNumber} marked as ${newStatus}.`, 'success');
    setSelectedTicket(null);
    setRefundAmount(0);
    setAgentNotes('');
  };

  // Filtered Tickets
  const filteredTickets = supportTickets.filter((t) => {
    if (ticketFilter !== 'All' && t.status !== ticketFilter) return false;
    const q = customerSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      t.ticketNumber.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.customerPhone.toLowerCase().includes(q) ||
      t.issueCategory.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  });

  // Filtered Orders for Support Lookup
  const searchedOrders = orders.filter((o) => {
    const q = customerSearch.toLowerCase().trim();
    if (!q) return true;
    const addr = o.deliveryAddress
      ? `${o.deliveryAddress.houseFlat} ${o.deliveryAddress.street} ${o.deliveryAddress.area}`
      : '';
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      (o.customerPhone && o.customerPhone.toLowerCase().includes(q)) ||
      addr.toLowerCase().includes(q)
    );
  });

  // ==========================================
  // VIEW 1: CUSTOMER SUPPORT & HELPDESK VIEW
  // ==========================================
  if (adminRole === 'Customer Support') {
    const openTicketsCount = supportTickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;
    const resolvedCount = supportTickets.filter((t) => t.status === 'Resolved').length;

    return (
      <div className="space-y-8">
        {/* Support Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-savera-dark text-savera-saffron text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                Care Desk
              </span>
              <span className="text-xs text-slate-400">Restricted Role (No Financials Visible)</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-white flex items-center gap-2">
              <Headphones className="w-7 h-7 text-savera-saffron" />
              Customer Support & Care Desk
            </h1>
            <p className="text-xs text-slate-400">
              Live customer inquiry queue, phone complaint resolution, and delivery assistance
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="bg-savera-saffron hover:bg-savera-saffronDark text-savera-brown font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Log Customer Ticket</span>
            </button>
          </div>
        </div>

        {/* Support KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Tickets</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-950 text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-serif text-3xl font-bold text-white">{openTicketsCount}</h3>
            <span className="text-[11px] text-amber-400 flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5" /> Requires Agent Attention
            </span>
          </div>

          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Response SLA</span>
              <div className="w-10 h-10 rounded-2xl bg-blue-950 text-blue-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-serif text-3xl font-bold text-white">12 Mins</h3>
            <span className="text-[11px] text-blue-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Under 15m Target Time
            </span>
          </div>

          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer CSAT</span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold">
                ★
              </div>
            </div>
            <h3 className="font-serif text-3xl font-bold text-white">4.92 / 5.0</h3>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> 97.8% Satisfaction Rate
            </span>
          </div>

          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolved Today</span>
              <div className="w-10 h-10 rounded-2xl bg-savera-dark text-savera-saffron flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-serif text-3xl font-bold text-white">{resolvedCount + 14}</h3>
            <span className="text-[11px] text-savera-saffron flex items-center gap-1 font-semibold">
              <Milk className="w-3.5 h-3.5" /> Milk Replacements Handled
            </span>
          </div>
        </div>

        {/* Customer Quick Search Tool */}
        <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Search customer by name, mobile (+91), Order ID, or issue..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-savera-saffron"
              />
            </div>
            <div className="flex items-center gap-2">
              {(['All', 'Open', 'In Progress', 'Resolved'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTicketFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    ticketFilter === filter
                      ? 'bg-savera-dark text-savera-saffron border border-savera-green/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Support Tickets Queue Table */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-xl font-bold text-white">Live Customer Tickets Queue</h3>
              <p className="text-xs text-slate-400">Click &ldquo;Resolve / Respond&rdquo; to update ticket or issue refund</p>
            </div>
            <span className="text-xs text-slate-400 font-bold">Showing {filteredTickets.length} tickets</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase font-bold">
                <tr>
                  <th className="p-3">Ticket #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">
                      No tickets matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-mono font-bold text-savera-saffron">{t.ticketNumber}</td>
                      <td className="p-3 font-semibold text-white">{t.customerName}</td>
                      <td className="p-3">
                        <a
                          href={`tel:${t.customerPhone}`}
                          className="text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>{t.customerPhone}</span>
                        </a>
                      </td>
                      <td className="p-3">
                        <span className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-700 text-[11px] font-medium">
                          {t.issueCategory}
                        </span>
                      </td>
                      <td className="p-3 max-w-xs truncate text-slate-400">{t.description}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === 'Open'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                              : t.status === 'In Progress'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800/40'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedTicket(t);
                            setNewStatus(t.status);
                            setAgentNotes(t.internalNotes || '');
                          }}
                          className="bg-savera-dark hover:bg-savera-green text-savera-saffron hover:text-white font-bold px-3 py-1.5 rounded-lg text-xs transition"
                        >
                          Resolve / Respond
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Deliveries & Assistance Table */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-xl font-bold text-white">Customer Deliveries Assistance (Order Lookup)</h3>
              <p className="text-xs text-slate-400">
                Quickly look up delivery OTP, address, and live status for customer calls
              </p>
            </div>
            <Link href="/admin/orders" className="text-xs font-bold text-savera-saffron hover:underline">
              All Orders Desk →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase font-bold">
                <tr>
                  <th className="p-3">Order Number</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Delivery OTP</th>
                  <th className="p-3">Address & Slot</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {searchedOrders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-mono font-bold text-white">{ord.orderNumber}</td>
                    <td className="p-3">
                      <div className="font-semibold text-white">{ord.customerName}</div>
                      <div className="text-[11px] text-slate-400">
                        {ord.customerPhone || ord.deliveryAddress?.mobileNumber || '+91 98765 43210'}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="inline-flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                        <span className="font-mono font-bold text-savera-saffron">{ord.otp || '5821'}</span>
                        <button
                          onClick={() => handleCopyOtp(ord.otp || '5821')}
                          title="Copy OTP"
                          className="text-slate-400 hover:text-white"
                        >
                          {copiedOtp === (ord.otp || '5821') ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-slate-300">
                      <div>
                        {ord.deliveryAddress
                          ? `${ord.deliveryAddress.houseFlat}, ${ord.deliveryAddress.street}, ${ord.deliveryAddress.area}`
                          : 'DLF Phase 1, Gurugram'}
                      </div>
                      <div className="text-[11px] text-slate-400">Slot: {ord.deliverySlot}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-white font-medium">{ord.items.length} items</div>
                      <div className="text-[11px] text-slate-400 font-mono">₹{ord.totalAmount}</div>
                    </td>
                    <td className="p-3">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as (typeof ord)['status'])}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-savera-saffron font-bold focus:outline-none"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <a
                        href={`tel:${ord.customerPhone || ord.deliveryAddress?.mobileNumber || '+919876543210'}`}
                        className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 px-2.5 py-1.5 rounded-lg text-xs font-bold transition"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Resolve / Respond Ticket */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-950 rounded-3xl border border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-floating">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-savera-saffron font-bold">
                    Ticket #{selectedTicket.ticketNumber}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white">Resolve Customer Inquiry</h3>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="font-bold text-white">{selectedTicket.customerName}</span>
                  <span className="text-slate-400">{selectedTicket.customerPhone}</span>
                </div>
                <div className="text-savera-saffron font-semibold">{selectedTicket.issueCategory}</div>
                <p className="text-slate-300 text-[11px] pt-1">{selectedTicket.description}</p>
              </div>

              <form onSubmit={handleSaveTicketResolution} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Update Ticket Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as typeof newStatus)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">
                    Agent Resolution Notes / Customer Communication
                  </label>
                  <textarea
                    rows={3}
                    value={agentNotes}
                    onChange={(e) => setAgentNotes(e.target.value)}
                    placeholder="e.g. Spoke to customer; replacement bottle scheduled for tomorrow morning."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold flex items-center justify-between">
                    <span>Issue Wallet Credit / Refund (₹)</span>
                    <span className="text-[10px] text-emerald-400">Optional customer appeasement</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    placeholder="0"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(null)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-savera-saffron hover:bg-savera-saffronDark text-savera-brown font-bold px-5 py-2 rounded-xl"
                  >
                    Save Resolution
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: New Customer Ticket */}
        {showNewTicketModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-950 rounded-3xl border border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-floating">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-serif text-lg font-bold text-white">Log Customer Ticket / Complaint</h3>
                <button onClick={() => setShowNewTicketModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Customer Full Name</label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={newCustPhone}
                      onChange={(e) => setNewCustPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Issue Category</label>
                    <select
                      value={newCustCategory}
                      onChange={(e) => setNewCustCategory(e.target.value as typeof newCustCategory)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="Delivery Issue">Delivery Delay / Issue</option>
                      <option value="Product Issue">Milk Quality / Sour / Leakage</option>
                      <option value="Subscription Issue">Subscription Pause / Modify</option>
                      <option value="Payment Issue">Payment / Billing</option>
                      <option value="Refund">Refund Request</option>
                      <option value="Order Issue">Missing Order Items</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Complaint / Request Details</label>
                  <textarea
                    rows={3}
                    required
                    value={newCustDesc}
                    onChange={(e) => setNewCustDesc(e.target.value)}
                    placeholder="Detail the customer issue..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-400"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewTicketModal(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-savera-saffron hover:bg-savera-saffronDark text-savera-brown font-bold px-5 py-2 rounded-xl"
                  >
                    Save & Assign Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: INVENTORY MANAGER DASHBOARD VIEW
  // ==========================================
  if (adminRole === 'Inventory Manager') {
    const expiringBatches = batches.filter((b) => b.status === 'Expiring Soon');
    const lowStockMaterials = rawMaterials.filter((rm) => rm.currentStock <= rm.minStockLevel);
    const pendingPOs = purchaseOrders.filter((po) => po.status === 'Sent' || po.status === 'Draft');

    return (
      <div className="space-y-8">
        {/* Inventory Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-savera-dark text-savera-saffron text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                Inventory Manager Active
              </span>
              <span className="text-xs text-slate-400">Restricted to FEFO Stock, Raw Materials & POs</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-white flex items-center gap-2">
              <Package className="w-7 h-7 text-savera-saffron" />
              Inventory & FEFO Stock Operations
            </h1>
            <p className="text-xs text-slate-400">
              Live batch shelf-life tracking, FEFO dispatch rotation, and raw material replenishment
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/inventory"
              className="bg-savera-dark hover:bg-savera-green border border-savera-green/40 text-savera-saffron font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <Package className="w-3.5 h-3.5" />
              <span>+ Add Batch</span>
            </Link>
            <Link
              href="/admin/raw-materials"
              className="bg-savera-dark hover:bg-savera-green border border-savera-green/40 text-savera-saffron font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>+ Restock Material</span>
            </Link>
            <Link
              href="/admin/suppliers"
              className="bg-savera-saffron hover:bg-savera-saffronDark text-savera-brown font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Create PO</span>
            </Link>
          </div>
        </div>

        {/* Inventory KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Batches</span>
              <div className="w-10 h-10 rounded-2xl bg-savera-dark text-savera-saffron flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-serif text-3xl font-bold text-white">{batches.length}</h3>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> In Active FEFO Rotation
            </span>
          </div>

          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">FEFO Expiry Alerts</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-950 text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-serif text-3xl font-bold text-white">{expiringBatches.length || 2}</h3>
            <span className="text-[11px] text-amber-400 flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5" /> Expiring Within 3 Days
            </span>
          </div>

          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Raw Materials</span>
              <div className="w-10 h-10 rounded-2xl bg-red-950 text-red-400 flex items-center justify-center">
                <Boxes className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-serif text-3xl font-bold text-white">{lowStockMaterials.length}</h3>
            <span className="text-[11px] text-red-400 flex items-center gap-1 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" /> Below Safety Threshold
            </span>
          </div>

          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Vendor POs</span>
              <div className="w-10 h-10 rounded-2xl bg-blue-950 text-blue-400 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-serif text-3xl font-bold text-white">{pendingPOs.length}</h3>
            <span className="text-[11px] text-blue-400 flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5" /> Supplier Shipments Expected
            </span>
          </div>
        </div>

        {/* Section 1: FEFO Batches & Expiry Monitor */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-savera-saffron" />
                <span>FEFO Batch Expiry Schedule</span>
              </h3>
              <p className="text-xs text-slate-400">First-Expiring batches prioritized for morning dispatch pick</p>
            </div>
            <Link href="/admin/inventory" className="text-xs font-bold text-savera-saffron hover:underline">
              Batch Inventory Desk →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase font-bold">
                <tr>
                  <th className="p-3">Batch Number</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Variant</th>
                  <th className="p-3">Mfg Date</th>
                  <th className="p-3">Expiry Date</th>
                  <th className="p-3">Units Left</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {batches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-mono font-bold text-savera-saffron">{b.batchId}</td>
                    <td className="p-3 font-semibold text-white">{b.productName}</td>
                    <td className="p-3">{b.variantName}</td>
                    <td className="p-3 text-slate-400 font-mono">{b.productionDate}</td>
                    <td className="p-3 font-mono font-bold text-red-400">{b.expiryDate}</td>
                    <td className="p-3 font-bold text-white">{b.quantityProduced - b.quantitySold} units</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === 'Expiring Soon'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : b.status === 'Depleted'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Raw Materials & Packaging Restock Monitor */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Boxes className="w-5 h-5 text-savera-saffron" />
                <span>Raw Materials & Packaging Replenishment</span>
              </h3>
              <p className="text-xs text-slate-400">Click &ldquo;+100 Quick Restock&rdquo; to instantly increment warehouse stock</p>
            </div>
            <Link href="/admin/raw-materials" className="text-xs font-bold text-savera-saffron hover:underline">
              Raw Materials Desk →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rawMaterials.map((rm) => (
              <div key={rm.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-[10px] mb-1">
                    <span className="font-bold uppercase text-slate-400">{rm.category}</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        rm.currentStock <= rm.minStockLevel
                          ? 'bg-red-950 text-red-400'
                          : 'bg-emerald-950 text-emerald-400'
                      }`}
                    >
                      {rm.currentStock <= rm.minStockLevel ? 'Low Stock' : 'Good'}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-white text-sm">{rm.name}</h4>
                  <div className="flex justify-between items-baseline mt-2">
                    <span className="text-slate-400 text-xs">Stock:</span>
                    <span className="font-mono font-bold text-lg text-savera-saffron">
                      {rm.currentStock} <span className="text-xs font-normal text-slate-400">{rm.unit}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    restockRawMaterial(rm.id, 100);
                    addToast('Stock Restocked', `+100 ${rm.unit} added to ${rm.name}.`, 'success');
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold py-1.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5 text-savera-saffron" />
                  <span>Quick Restock (+100)</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Purchase Orders & Vendor Delivery Tracking */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-savera-saffron" />
                <span>Supplier Purchase Orders</span>
              </h3>
              <p className="text-xs text-slate-400">Track dairy supplier shipments and update PO fulfillment status</p>
            </div>
            <Link href="/admin/suppliers" className="text-xs font-bold text-savera-saffron hover:underline">
              Suppliers & POs Desk →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase font-bold">
                <tr>
                  <th className="p-3">PO Number</th>
                  <th className="p-3">Supplier</th>
                  <th className="p-3">Item Description</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Expected Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-mono font-bold text-white">{po.poNumber}</td>
                    <td className="p-3 font-semibold">{po.supplierName}</td>
                    <td className="p-3 text-slate-300">{po.itemDescription}</td>
                    <td className="p-3 font-bold text-white">{po.quantity}</td>
                    <td className="p-3 font-serif font-bold text-emerald-400">₹{po.totalAmount.toLocaleString()}</td>
                    <td className="p-3 font-mono text-slate-400">{po.expectedDelivery}</td>
                    <td className="p-3">
                      <select
                        value={po.status}
                        onChange={(e) => updatePOStatus(po.id, e.target.value as (typeof po)['status'])}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-savera-saffron font-bold focus:outline-none"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Partially Received">Partially Received</option>
                        <option value="Received">Received</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: PRODUCTION MANAGER DASHBOARD VIEW
  // ==========================================
  if (adminRole === 'Production Manager') {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-savera-dark text-savera-saffron text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                Production Manager Active
              </span>
              <span className="text-xs text-slate-400">Restricted to Dairy Processing, Yield & Raw Materials</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-white flex items-center gap-2">
              <Factory className="w-7 h-7 text-savera-saffron" />
              Dairy Processing & Production Yield
            </h1>
            <p className="text-xs text-slate-400">Milk pasteurization, curd set, bilona churning, and yield efficiency</p>
          </div>

          <Link
            href="/admin/production"
            className="bg-savera-saffron hover:bg-savera-saffronDark text-savera-brown font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Production Record</span>
          </Link>
        </div>

        {/* Production KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Daily Milk Intake</span>
            <h3 className="font-serif text-3xl font-bold text-white">1,200 L</h3>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <Milk className="w-3.5 h-3.5" /> 100% Chilled at 4°C
            </span>
          </div>

          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Average Yield Efficiency</span>
            <h3 className="font-serif text-3xl font-bold text-white">97.4%</h3>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Zero-defect target met
            </span>
          </div>

          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Processing Wastage</span>
            <h3 className="font-serif text-3xl font-bold text-white">1.8%</h3>
            <span className="text-[11px] text-blue-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Under 2.5% benchmark
            </span>
          </div>

          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Batches Today</span>
            <h3 className="font-serif text-3xl font-bold text-white">{productionLogs.length}</h3>
            <span className="text-[11px] text-savera-saffron font-semibold flex items-center gap-1">
              <Factory className="w-3.5 h-3.5" /> Paneer, Curd & Ghee
            </span>
          </div>
        </div>

        {/* Production Records Table */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl font-bold text-white">Dairy Processing Logs</h3>
            <Link href="/admin/production" className="text-xs font-bold text-savera-saffron hover:underline">
              Full Production Desk →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase font-bold">
                <tr>
                  <th className="p-3">Batch Number</th>
                  <th className="p-3">Product Created</th>
                  <th className="p-3">Raw Material Used</th>
                  <th className="p-3">Input</th>
                  <th className="p-3">Output</th>
                  <th className="p-3">Wastage</th>
                  <th className="p-3">Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {productionLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-mono font-bold text-savera-saffron">{log.batchNumber}</td>
                    <td className="p-3 font-semibold text-white">{log.productName}</td>
                    <td className="p-3 text-slate-400">{log.rawMaterialUsed}</td>
                    <td className="p-3">{log.inputQuantity}</td>
                    <td className="p-3 font-bold text-white">{log.outputQuantity}</td>
                    <td className="p-3 text-amber-400">{log.wastage}</td>
                    <td className="p-3 font-bold text-emerald-400">{log.efficiencyPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 4: DELIVERY MANAGER DASHBOARD VIEW
  // ==========================================
  if (adminRole === 'Delivery Manager') {
    const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
    const outForDeliveryCount = orders.filter((o) => o.status === 'Out for Delivery').length;

    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-savera-dark text-savera-saffron text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                Delivery Manager Active
              </span>
              <span className="text-xs text-slate-400">Restricted to Route Dispatch, Zones & Fulfillment</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-white flex items-center gap-2">
              <Truck className="w-7 h-7 text-savera-saffron" />
              Delivery Fleet & Route Dispatch
            </h1>
            <p className="text-xs text-slate-400">Morning 5:00 AM – 7:00 AM delivery execution, OTP drops, and route coverage</p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/delivery"
              className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <Truck className="w-4 h-4" />
              <span>Launch Driver App</span>
            </Link>
          </div>
        </div>

        {/* Delivery KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Morning On-Time Rate</span>
            <h3 className="font-serif text-3xl font-bold text-white">94%</h3>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 5:00 AM – 7:00 AM Slots
            </span>
          </div>

          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Delivery Hubs</span>
            <h3 className="font-serif text-3xl font-bold text-white">
              {deliveryZones.filter((z) => z.isServiceable).length}
            </h3>
            <span className="text-[11px] text-blue-400 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Gurugram & South Delhi
            </span>
          </div>

          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">En Route Drops</span>
            <h3 className="font-serif text-3xl font-bold text-white">{outForDeliveryCount}</h3>
            <span className="text-[11px] text-savera-saffron font-semibold flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" /> Out for Delivery
            </span>
          </div>

          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Completed Deliveries</span>
            <h3 className="font-serif text-3xl font-bold text-white">{deliveredCount}</h3>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> OTP Verified
            </span>
          </div>
        </div>

        {/* Dispatch Orders Table */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl font-bold text-white">Morning Dispatch Queue</h3>
            <Link href="/admin/orders" className="text-xs font-bold text-savera-saffron hover:underline">
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase font-bold">
                <tr>
                  <th className="p-3">Order Number</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Slot</th>
                  <th className="p-3">OTP</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-mono font-bold text-white">{ord.orderNumber}</td>
                    <td className="p-3 font-semibold text-white">{ord.customerName}</td>
                    <td className="p-3 font-mono text-slate-400">{ord.customerPhone}</td>
                    <td className="p-3 text-[11px]">{ord.deliverySlot}</td>
                    <td className="p-3 font-mono text-savera-saffron font-bold">{ord.otp || '5821'}</td>
                    <td className="p-3">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as (typeof ord)['status'])}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-savera-saffron font-bold focus:outline-none"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <a
                        href={`tel:${ord.customerPhone}`}
                        className="bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 5: DELIVERY EXECUTIVE FIELD DASHBOARD
  // ==========================================
  if (adminRole === 'Delivery Executive') {
    const myDeliveries = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled');
    const completedDeliveries = orders.filter((o) => o.status === 'Delivered');

    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-savera-dark text-savera-saffron text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                Delivery Executive Active
              </span>
              <span className="text-xs text-slate-400">Assigned Route & Morning Field Drops</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-white flex items-center gap-2">
              <Truck className="w-7 h-7 text-savera-saffron" />
              Driver Field Run-Sheet
            </h1>
            <p className="text-xs text-slate-400">Morning 5:00 AM – 7:00 AM doorstep delivery routes and live OTP drops</p>
          </div>

          <Link
            href="/delivery"
            className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <Truck className="w-4 h-4" />
            <span>Open Dedicated Driver App</span>
          </Link>
        </div>

        {/* Executive KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pending Drops</span>
            <h3 className="font-serif text-3xl font-bold text-white">{myDeliveries.length}</h3>
            <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Next slot: 5:00 AM – 7:00 AM
            </span>
          </div>

          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Delivered Today</span>
            <h3 className="font-serif text-3xl font-bold text-emerald-400">{completedDeliveries.length}</h3>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Doorstep OTP Confirmed
            </span>
          </div>

          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Assigned Route</span>
            <h3 className="font-serif text-xl font-bold text-savera-saffron">DLF Ph 1 – Ph 5, Gurugram</h3>
            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Hub: Sector 43 Cold Depot
            </span>
          </div>
        </div>

        {/* Drops Queue */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl font-bold text-white">Today&apos;s Field Drops</h3>
            <span className="text-xs font-bold text-savera-saffron">{myDeliveries.length} drops remaining</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase font-bold">
                <tr>
                  <th className="p-3">Order #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Delivery OTP</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {orders.map((ord) => {
                  const addrStr = ord.deliveryAddress
                    ? `${ord.deliveryAddress.houseFlat}, ${ord.deliveryAddress.street}, ${ord.deliveryAddress.area}`
                    : 'Gurugram Hub Drop';
                  return (
                    <tr key={ord.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-mono font-bold text-white">{ord.orderNumber}</td>
                      <td className="p-3">
                        <div className="font-semibold text-white">{ord.customerName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{ord.customerPhone}</div>
                      </td>
                      <td className="p-3 text-slate-300 max-w-xs truncate">{addrStr}</td>
                      <td className="p-3 font-mono text-savera-saffron font-bold text-sm">
                        {ord.otp || '5821'}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-950 text-emerald-400'
                              : 'bg-amber-950 text-amber-400'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {ord.status !== 'Delivered' && (
                          <button
                            onClick={() => {
                              updateOrderStatus(ord.id, 'Delivered');
                              addToast('Drop Confirmed', `Order #${ord.orderNumber} delivered successfully.`, 'success');
                            }}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition"
                          >
                            <Check className="w-3 h-3" />
                            <span>Mark Delivered</span>
                          </button>
                        )}
                        <a
                          href={`tel:${ord.customerPhone}`}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition"
                        >
                          <PhoneCall className="w-3 h-3 text-savera-saffron" />
                          <span>Call</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 6: SUPER ADMIN & EXECUTIVE CONTROL VIEW
  // ==========================================
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 124580);
  const ordersToday = orders.length + 246;
  const activeSubsCount = subscriptions.filter((s) => s.status === 'Active').length + 135;
  const lowStockCount = batches.filter((b) => b.status === 'Expiring Soon' || b.status === 'Depleted').length + 16;

  return (
    <div className="space-y-8">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-savera-dark text-savera-saffron text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              {adminRole}
            </span>
            <span className="text-xs text-slate-400">Full Business & Financial Oversight</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">Business Control Dashboard</h1>
          <p className="text-xs text-slate-400">Live operational overview for Savera Farms D2C Platform</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/reports"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs transition"
          >
            Export Reports (CSV)
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <h3 className="font-serif text-3xl font-bold text-white">₹{totalRevenue.toLocaleString()}</h3>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs last week
          </span>
        </div>

        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Orders Today</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-950 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-serif text-3xl font-bold text-white">{ordersToday}</h3>
          <span className="text-[11px] text-blue-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> 94% Morning Slots Delivered
          </span>
        </div>

        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Subscriptions</span>
            <div className="w-10 h-10 rounded-2xl bg-savera-dark text-savera-saffron flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-serif text-3xl font-bold text-white">{activeSubsCount}</h3>
          <span className="text-[11px] text-savera-saffron flex items-center gap-1 font-semibold">
            <Milk className="w-3.5 h-3.5" /> 245L Daily Milk Volume Forecast
          </span>
        </div>

        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock / Expiry Alerts</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-950 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-serif text-3xl font-bold text-white">{lowStockCount}</h3>
          <span className="text-[11px] text-amber-400 flex items-center gap-1 font-semibold">
            FEFO Alert: Batch expires in 2 days
          </span>
        </div>
      </div>

      {/* Tables & Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl font-bold text-white">Recent Orders Today</h3>
            <Link href="/admin/orders" className="text-xs font-bold text-savera-saffron hover:underline">
              View All Orders
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase font-bold">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Slot</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-mono font-bold text-white">{ord.orderNumber}</td>
                    <td className="p-3 font-semibold">{ord.customerName}</td>
                    <td className="p-3">{ord.items.length} items</td>
                    <td className="p-3 font-serif font-bold text-emerald-400">₹{ord.totalAmount}</td>
                    <td className="p-3 text-[11px]">{ord.deliverySlot}</td>
                    <td className="p-3">
                      <span className="bg-savera-dark text-savera-saffron px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FEFO Expiry & Production Alerts */}
        <div className="lg:col-span-4 bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>FEFO Expiry Alerts</span>
          </h3>

          <div className="space-y-3">
            {batches.map((b) => (
              <div key={b.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold font-mono text-white">{b.batchId}</span>
                  <span className="bg-amber-950 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {b.status}
                  </span>
                </div>
                <p className="text-slate-300 font-semibold">
                  {b.productName} ({b.variantName})
                </p>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>
                    Expiry Date: <strong className="text-red-400">{b.expiryDate}</strong>
                  </span>
                  <span>Rem: {b.quantityProduced - b.quantitySold} units</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

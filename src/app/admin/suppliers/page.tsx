'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Users, FileText, Plus, X, CheckCircle2 } from 'lucide-react';
import { PurchaseOrder } from '@/types';

export default function AdminSuppliersPage() {
  const { suppliers, addSupplier, purchaseOrders, addPurchaseOrder, updatePOStatus } = useApp();

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showPOModal, setShowPOModal] = useState(false);

  // Supplier Form
  const [supName, setSupName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gstin, setGstin] = useState('06AAACS1234F1Z5');
  const [paymentTerms, setPaymentTerms] = useState('Net 15 Days');
  const [productsSupplied, setProductsSupplied] = useState('');
  const [rating, setRating] = useState(5.0);

  // PO Form
  const [poNumber, setPoNumber] = useState(`PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [itemDescription, setItemDescription] = useState('1000 Litres Raw A2 Desi Cow Milk');
  const [quantity, setQuantity] = useState(1000);
  const [unitRate, setUnitRate] = useState(45);
  const [expectedDelivery, setExpectedDelivery] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName.trim()) return;
    addSupplier({
      name: supName,
      contactPerson,
      phone,
      email,
      gstin,
      paymentTerms,
      productsSupplied,
      outstandingBalance: 0,
      rating,
    });
    setShowSupplierModal(false);
    setSupName('');
    setContactPerson('');
    setPhone('');
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find((s) => s.id === selectedSupplierId) || suppliers[0];
    addPurchaseOrder({
      poNumber,
      supplierId: sup.id,
      supplierName: sup.name,
      itemDescription,
      quantity,
      unitRate,
      totalAmount: quantity * unitRate,
      expectedDelivery,
      status: 'Sent',
    });
    setShowPOModal(false);
    setPoNumber(`PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Suppliers & Purchase Orders</h1>
          <p className="text-xs text-slate-400">
            Manage dairy estates, feed growers, bottle manufacturers, and purchase orders ({suppliers.length} vendors)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSupplierModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Supplier</span>
          </button>
          <button
            onClick={() => setShowPOModal(true)}
            className="bg-savera-dark hover:bg-savera-green border border-savera-green/50 text-savera-saffron font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create PO</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Suppliers Card */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl font-bold text-white">Active Verified Suppliers</h3>
            <span className="text-xs font-bold text-savera-saffron">{suppliers.length} partners</span>
          </div>

          <div className="space-y-3">
            {suppliers.map((sup) => (
              <div key={sup.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">{sup.name}</span>
                  <span className="bg-amber-950 text-amber-400 font-bold px-2 py-0.5 rounded-full text-[10px]">
                    ★ {sup.rating} Rating
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-400">
                  <p>Contact: <strong className="text-slate-200">{sup.contactPerson}</strong></p>
                  <p>Phone: <strong className="text-slate-200">{sup.phone}</strong></p>
                </div>
                <p className="text-slate-300">Supplies: {sup.productsSupplied}</p>
                <div className="pt-2 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-400">
                  <span>Terms: {sup.paymentTerms}</span>
                  <span>GSTIN: {sup.gstin}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PO List */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl font-bold text-white">Purchase Orders Log</h3>
            <span className="text-xs font-bold text-emerald-400">{purchaseOrders.length} orders</span>
          </div>

          <div className="space-y-3">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between items-center font-mono font-bold">
                  <span className="text-savera-saffron text-sm">{po.poNumber}</span>
                  <span className="text-emerald-400 font-serif text-base">₹{po.totalAmount}</span>
                </div>
                <div>
                  <span className="text-white font-semibold block">{po.supplierName}</span>
                  <p className="text-slate-300 text-[11px] mt-0.5">{po.itemDescription}</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400 text-[11px]">Expected: {po.expectedDelivery}</span>
                  <select
                    value={po.status}
                    onChange={(e) => updatePOStatus(po.id, e.target.value as any)}
                    className="bg-slate-950 border border-slate-700 text-savera-saffron text-[10px] font-bold px-2 py-1 rounded-lg"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Partially Received">Partially Received</option>
                    <option value="Received">Received</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Supplier Modal */}
      {showSupplierModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-3xl p-6 max-w-md w-full border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-white text-lg">Add Sourcing Supplier</h3>
              <button onClick={() => setShowSupplierModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateSupplier} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Company / Farm Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kisan Bio Fodder Farms"
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Products Supplied</label>
                <input
                  type="text"
                  placeholder="e.g. Organic Lucerne Grass & Maize Fodder"
                  value={productsSupplied}
                  onChange={(e) => setProductsSupplied(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-savera-saffron text-slate-950 font-bold py-3 rounded-xl text-xs hover:bg-white transition"
              >
                Register Supplier
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create PO Modal */}
      {showPOModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-3xl p-6 max-w-md w-full border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-white text-lg">Generate Purchase Order</h3>
              <button onClick={() => setShowPOModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreatePO} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">PO Number</label>
                  <input
                    type="text"
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Select Supplier</label>
                  <select
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Item Description</label>
                <input
                  type="text"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Unit Rate (₹)</label>
                  <input
                    type="number"
                    value={unitRate}
                    onChange={(e) => setUnitRate(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Expected Delivery Date</label>
                <input
                  type="date"
                  value={expectedDelivery}
                  onChange={(e) => setExpectedDelivery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="p-3 bg-slate-900 rounded-xl text-right">
                <span className="text-slate-400 text-xs mr-2">Total PO Value:</span>
                <strong className="text-emerald-400 font-serif text-lg">₹{quantity * unitRate}</strong>
              </div>

              <button
                type="submit"
                className="w-full bg-savera-saffron text-slate-950 font-bold py-3 rounded-xl text-xs hover:bg-white transition"
              >
                Dispatch Purchase Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

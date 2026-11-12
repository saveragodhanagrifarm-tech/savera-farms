'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Plus, AlertTriangle, Package } from 'lucide-react';

export default function AdminInventoryPage() {
  const { batches, addBatch, products } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);

  const [batchId, setBatchId] = useState(`BATCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-A2M`);
  const [selectedProdId, setSelectedProdId] = useState(products[0]?.id || '');
  const [productionDate, setProductionDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [quantityProduced, setQuantityProduced] = useState(300);
  const [unitCost, setUnitCost] = useState(45);

  const selectedProd = products.find((p) => p.id === selectedProdId) || products[0];

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    addBatch({
      batchId,
      productId: selectedProd.id,
      productName: selectedProd.name,
      variantId: selectedProd.variants[0].id,
      variantName: selectedProd.variants[0].name,
      productionDate,
      expiryDate,
      quantityProduced,
      wastage: 0,
      unitCost,
      supplierSource: 'Savera Farm Estate Unit-1',
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">FEFO Batch Inventory</h1>
          <p className="text-xs text-slate-400">
            Track batch expiry, stock levels, and production costs. To update catalog selling prices, visit{' '}
            <Link href="/admin/products" className="text-savera-saffron font-bold underline hover:text-amber-400">
              Products & Pricing
            </Link>
            .
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-savera-dark text-savera-saffron font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Cancel' : '+ Add New Batch'}</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateBatch} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 text-xs">
          <h3 className="font-serif font-bold text-white text-base">Create Production Batch</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Batch Number ID</label>
              <input
                type="text"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Select Product</label>
              <select
                value={selectedProdId}
                onChange={(e) => setSelectedProdId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Quantity Produced</label>
              <input
                type="number"
                value={quantityProduced}
                onChange={(e) => setQuantityProduced(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Production Date</label>
              <input
                type="date"
                value={productionDate}
                onChange={(e) => setProductionDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Expiry Date (FEFO Alert)</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Unit Cost Price (₹)</label>
              <input
                type="number"
                value={unitCost}
                onChange={(e) => setUnitCost(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <button type="submit" className="bg-savera-saffron text-savera-brown font-bold px-6 py-2.5 rounded-xl">
            Save Batch Record
          </button>
        </form>
      )}

      <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-400 uppercase font-bold">
            <tr>
              <th className="p-3">Batch ID</th>
              <th className="p-3">Product Name</th>
              <th className="p-3">Variant</th>
              <th className="p-3">Produced</th>
              <th className="p-3">Sold</th>
              <th className="p-3">Expiry Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {batches.map((b) => (
              <tr key={b.id} className="hover:bg-slate-900/50">
                <td className="p-3 font-mono font-bold text-white">{b.batchId}</td>
                <td className="p-3 font-semibold">{b.productName}</td>
                <td className="p-3 text-[11px]">{b.variantName}</td>
                <td className="p-3 font-bold text-emerald-400">{b.quantityProduced}</td>
                <td className="p-3 font-bold text-slate-400">{b.quantitySold}</td>
                <td className="p-3 font-mono text-red-400 font-bold">{b.expiryDate}</td>
                <td className="p-3">
                  <span className="bg-amber-950 text-amber-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

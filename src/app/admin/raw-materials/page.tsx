'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Boxes, Package, Plus, RefreshCw, X } from 'lucide-react';
import { RawMaterial } from '@/types';

export default function AdminRawMaterialsPage() {
  const { rawMaterials, restockRawMaterial, addRawMaterial } = useApp();
  const [restockModalItem, setRestockModalItem] = useState<RawMaterial | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(200);

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<RawMaterial['category']>('Milk');
  const [currentStock, setCurrentStock] = useState(500);
  const [unit, setUnit] = useState('Litres');
  const [minStockLevel, setMinStockLevel] = useState(100);
  const [costPerUnit, setCostPerUnit] = useState(45);
  const [supplier, setSupplier] = useState('Savera Farm Estate Herd');

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockModalItem || restockAmount <= 0) return;
    restockRawMaterial(restockModalItem.id, restockAmount);
    setRestockModalItem(null);
  };

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addRawMaterial({
      name,
      category,
      currentStock,
      unit,
      minStockLevel,
      costPerUnit,
      lastRestocked: new Date().toISOString().split('T')[0],
      supplier,
    });
    setShowAddModal(false);
    setName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Raw Materials & Packaging Inventory</h1>
          <p className="text-xs text-slate-400">
            Track raw A2 milk, glass bottles, brass lids, and dairy packaging supplies ({rawMaterials.length} items)
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-savera-dark hover:bg-savera-green border border-savera-green/50 text-savera-saffron font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Raw Material</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {rawMaterials.map((rm) => (
          <div key={rm.id} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3 relative flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-400 uppercase font-bold text-[10px] bg-slate-900 px-2 py-0.5 rounded-md">
                  {rm.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    rm.currentStock <= rm.minStockLevel
                      ? 'bg-amber-950 text-amber-400'
                      : 'bg-emerald-950 text-emerald-400'
                  }`}
                >
                  {rm.currentStock <= rm.minStockLevel ? 'Low Stock' : 'Adequate'}
                </span>
              </div>

              <h3 className="font-serif font-bold text-white text-base">{rm.name}</h3>
              <p className="text-[11px] text-slate-400 mt-1">Supplier: {rm.supplier}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-400 text-xs">Current Stock:</span>
                <span className="font-serif text-2xl font-bold text-savera-saffron">
                  {rm.currentStock} <span className="text-xs font-sans text-slate-300 font-normal">{rm.unit}</span>
                </span>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span>Unit Cost: ₹{rm.costPerUnit}</span>
                <span>Restocked: {rm.lastRestocked}</span>
              </div>

              <button
                onClick={() => {
                  setRestockModalItem(rm);
                  setRestockAmount(200);
                }}
                className="w-full mt-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>+ Restock Stock</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Restock Modal */}
      {restockModalItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-3xl p-6 max-w-sm w-full border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-white text-base">Restock: {restockModalItem.name}</h3>
              <button onClick={() => setRestockModalItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRestockSubmit} className="space-y-4 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl">
                <span className="text-slate-400 block">Current Stock:</span>
                <strong className="text-white text-sm">{restockModalItem.currentStock} {restockModalItem.unit}</strong>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Quantity to Add ({restockModalItem.unit}):</label>
                <input
                  type="number"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Number(e.target.value))}
                  min={1}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                Confirm Restock
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add New Material Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-3xl p-6 max-w-md w-full border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-white text-lg">Add New Raw Material</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateMaterial} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Material Name</label>
                <input
                  type="text"
                  placeholder="e.g. 500ml Sanitized Glass Jars"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Milk">Milk</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Containers">Containers</option>
                    <option value="Ingredients">Ingredients</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Unit of Measurement</label>
                  <input
                    type="text"
                    placeholder="e.g. Litres / Bottles"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Cost Per Unit (₹)</label>
                  <input
                    type="number"
                    value={costPerUnit}
                    onChange={(e) => setCostPerUnit(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Supplier / Sourcing Partner</label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-savera-saffron text-slate-950 font-bold py-3 rounded-xl text-xs hover:bg-white transition"
              >
                Save Raw Material Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

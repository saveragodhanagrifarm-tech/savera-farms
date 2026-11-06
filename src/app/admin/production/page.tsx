'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Factory, Plus, Sparkles } from 'lucide-react';

export default function AdminProductionPage() {
  const { productionLogs, addProductionLog } = useApp();
  const [showLogForm, setShowLogForm] = useState(false);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [productName, setProductName] = useState('Fresh A2 Malai Paneer');
  const [rawMaterialUsed, setRawMaterialUsed] = useState('Pure Raw A2 Milk');
  const [inputQuantity, setInputQuantity] = useState('500 Litres');
  const [outputQuantity, setOutputQuantity] = useState('85 KG Paneer');
  const [wastage, setWastage] = useState('12 Litres');
  const [batchNumber, setBatchNumber] = useState(`BATCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-PAN`);
  const [productionCost, setProductionCost] = useState(22500);
  const [operator, setOperator] = useState('Manoj Kumar (Production Manager)');

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    addProductionLog({
      date,
      productName,
      rawMaterialUsed,
      inputQuantity,
      outputQuantity,
      wastage,
      batchNumber,
      productionCost,
      operator,
      notes: 'Yield efficiency verified at 97.6%.',
    });
    setShowLogForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Dairy Production & Yield Efficiency</h1>
          <p className="text-xs text-slate-400">Record milk processing, Paneer, Curd & Ghee yield logs</p>
        </div>
        <button
          onClick={() => setShowLogForm(!showLogForm)}
          className="bg-savera-dark text-savera-saffron font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{showLogForm ? 'Cancel' : '+ New Production Record'}</span>
        </button>
      </div>

      {showLogForm && (
        <form onSubmit={handleSaveRecord} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 text-xs">
          <h3 className="font-serif font-bold text-white text-base">Record Dairy Production Output</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Product Created</label>
              <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Raw Material Used</label>
              <input type="text" value={rawMaterialUsed} onChange={(e) => setRawMaterialUsed(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Input Quantity (e.g. 500 L)</label>
              <input type="text" value={inputQuantity} onChange={(e) => setInputQuantity(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Output Quantity (e.g. 85 KG)</label>
              <input type="text" value={outputQuantity} onChange={(e) => setOutputQuantity(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Wastage / Loss</label>
              <input type="text" value={wastage} onChange={(e) => setWastage(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" />
            </div>
          </div>

          <button type="submit" className="bg-savera-saffron text-savera-brown font-bold px-6 py-2.5 rounded-xl">
            Save Production Log
          </button>
        </form>
      )}

      <div className="space-y-4">
        {productionLogs.map((log) => (
          <div key={log.id} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono text-savera-saffron font-bold">{log.batchNumber}</span>
              <span className="bg-emerald-950 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full">
                Yield Efficiency: {log.efficiencyPct}%
              </span>
            </div>
            <h3 className="font-serif font-bold text-white text-lg">{log.productName}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-400 block">Raw Material Input</span>
                <span className="font-bold text-white">{log.inputQuantity}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Finished Output</span>
                <span className="font-bold text-emerald-400">{log.outputQuantity}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Wastage</span>
                <span className="font-bold text-amber-400">{log.wastage}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Operator Logged</span>
                <span className="font-bold text-white">{log.operator}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

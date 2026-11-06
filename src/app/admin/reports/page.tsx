'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Download, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';

export default function AdminReportsPage() {
  const {
    orders,
    subscriptions,
    batches,
    rawMaterials,
    suppliers,
    purchaseOrders,
    supportTickets,
    addToast,
  } = useApp();

  const exportCSV = (type: string, data: any[]) => {
    if (!data || data.length === 0) {
      addToast('No Data', `No records found to export for ${type}.`, 'info');
      return;
    }
    const keys = Object.keys(data[0]);
    const csvRows = [
      keys.join(','),
      ...data.map((row) =>
        keys
          .map((k) => {
            const val = typeof row[k] === 'object' ? JSON.stringify(row[k]) : row[k];
            return `"${String(val ?? '').replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `savera_farms_${type}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    addToast('Report Exported!', `${type.toUpperCase()} report downloaded successfully.`, 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Business Intelligence & Export Center</h1>
        <p className="text-xs text-slate-400">
          Download real-time formatted CSV accounting and audit reports for finance, logistics, and dairy supply chain
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sales & Orders */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-lg">Sales & Customer Orders</h3>
              <p className="text-xs text-slate-400 mt-1">
                Complete dataset of orders placed, customer phone, subtotal, discount, delivery fee, payment mode, and fulfillment status.
              </p>
            </div>
          </div>
          <button
            onClick={() => exportCSV('customer_orders', orders)}
            className="w-full bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Orders ({orders.length} Rows)</span>
          </button>
        </div>

        {/* Milk Subscriptions */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-savera-dark text-savera-saffron flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-lg">Milk Subscriptions Matrix</h3>
              <p className="text-xs text-slate-400 mt-1">
                Active recurring schedules, frequency, quantity per delivery, monthly billing estimates, and skipped delivery dates.
              </p>
            </div>
          </div>
          <button
            onClick={() => exportCSV('milk_subscriptions', subscriptions)}
            className="w-full bg-savera-dark hover:bg-savera-green border border-savera-green/40 text-savera-saffron font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Subscriptions ({subscriptions.length} Rows)</span>
          </button>
        </div>

        {/* FEFO Batches */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-950 text-amber-400 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-lg">FEFO Batch Inventory</h3>
              <p className="text-xs text-slate-400 mt-1">
                Batch number IDs, production dates, expiry dates, quantities produced, quantities sold, wastage, and cost per unit.
              </p>
            </div>
          </div>
          <button
            onClick={() => exportCSV('inventory_batches', batches)}
            className="w-full bg-amber-950 hover:bg-amber-900 border border-amber-700/50 text-amber-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Inventory Batches</span>
          </button>
        </div>

        {/* Raw Materials */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-950 text-blue-400 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-lg">Raw Materials & Packaging</h3>
              <p className="text-xs text-slate-400 mt-1">
                Stock counts for raw milk, glass bottles, caps, and organic feed with safety stock thresholds and unit pricing.
              </p>
            </div>
          </div>
          <button
            onClick={() => exportCSV('raw_materials', rawMaterials)}
            className="w-full bg-blue-950 hover:bg-blue-900 border border-blue-700/50 text-blue-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Materials ({rawMaterials.length} Items)</span>
          </button>
        </div>

        {/* Purchase Orders */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-950 text-purple-400 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-lg">Purchase Orders & Suppliers</h3>
              <p className="text-xs text-slate-400 mt-1">
                Dispatched purchase orders, vendor invoices, delivery dates, quantities, and receipt confirmations.
              </p>
            </div>
          </div>
          <button
            onClick={() => exportCSV('purchase_orders', purchaseOrders)}
            className="w-full bg-purple-950 hover:bg-purple-900 border border-purple-700/50 text-purple-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Purchase Orders</span>
          </button>
        </div>

        {/* Support Tickets */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-950 text-rose-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-lg">Customer Support Requests</h3>
              <p className="text-xs text-slate-400 mt-1">
                Raised customer support tickets, categories, phone contact, status, and resolution timestamps.
              </p>
            </div>
          </div>
          <button
            onClick={() => exportCSV('support_tickets', supportTickets)}
            className="w-full bg-rose-950 hover:bg-rose-900 border border-rose-700/50 text-rose-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Support Tickets</span>
          </button>
        </div>
      </div>
    </div>
  );
}

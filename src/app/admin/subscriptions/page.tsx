'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Milk, Calendar, PauseCircle, PlayCircle, RefreshCw } from 'lucide-react';

export default function AdminSubscriptionsPage() {
  const { subscriptions, togglePauseSubscription, refreshSubscriptions, addToast } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    refreshSubscriptions();
  }, []);

  const totalVolumeForecast = subscriptions
    .filter((s) => s.status === 'Active')
    .reduce((sum, s) => sum + s.quantityPerDelivery, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Milk Subscription Management</h1>
          <p className="text-xs text-slate-400">View active recurring subscriptions and daily volume forecasting</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              setIsRefreshing(true);
              if (typeof window !== 'undefined') {
                localStorage.removeItem('savera_baseline_timestamp');
              }
              await refreshSubscriptions();
              setIsRefreshing(false);
              addToast('Subscriptions Synced', 'Latest recurring milk orders fetched from database.', 'success');
            }}
            disabled={isRefreshing}
            className="bg-slate-900 hover:bg-slate-800 text-savera-saffron border border-slate-700 font-bold px-3 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
            title="Refresh subscriptions from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          <div className="bg-savera-dark text-savera-saffron p-3 rounded-2xl border border-savera-green/40 flex items-center gap-3">
            <Milk className="w-6 h-6 text-savera-saffron" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Daily Volume Forecast</span>
              <span className="font-serif text-xl font-bold text-white">{totalVolumeForecast} Litres Required</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-400 uppercase font-bold">
            <tr>
              <th className="p-3">Sub ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Product</th>
              <th className="p-3">Qty/Day</th>
              <th className="p-3">Frequency</th>
              <th className="p-3">Slot</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">
                  No active milk subscriptions registered. Customer subscriptions will appear here.
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-900/50">
                  <td className="p-3 font-mono font-bold text-white">{sub.id}</td>
                  <td className="p-3 font-semibold">{sub.customerName}</td>
                  <td className="p-3">{sub.productName}</td>
                  <td className="p-3 font-bold text-emerald-400">{sub.quantityPerDelivery}L</td>
                  <td className="p-3">{sub.frequency}</td>
                  <td className="p-3 text-[11px]">{sub.deliverySlot}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${sub.status === 'Active' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => togglePauseSubscription(sub.id)}
                      className="bg-slate-900 border border-slate-700 text-slate-300 px-3 py-1 rounded-lg hover:text-white"
                    >
                      {sub.status === 'Active' ? 'Pause' : 'Resume'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

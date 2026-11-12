'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { OrderStatus } from '@/types';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredOrders = orders.filter((o) => filterStatus === 'All' || o.status === filterStatus);

  const statusOptions: OrderStatus[] = [
    'Order Placed',
    'Confirmed',
    'Preparing',
    'Packed',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Refunded',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Order Management</h1>
          <p className="text-xs text-slate-400">View, update, and manage customer orders and delivery slots</p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-savera-saffron focus:outline-none"
        >
          <option value="All">All Order Statuses</option>
          {statusOptions.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-400 uppercase font-bold">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Slot</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  No orders found. When customer orders are placed, they will show here with real-time status controls.
                </td>
              </tr>
            ) : (
              filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-900/50">
                  <td className="p-3 font-mono font-bold text-white">{ord.orderNumber}</td>
                  <td className="p-3 font-semibold">{ord.customerName}</td>
                  <td className="p-3 font-mono">{ord.customerPhone}</td>
                  <td className="p-3 text-[11px]">{ord.deliverySlot}</td>
                  <td className="p-3 font-serif font-bold text-emerald-400">₹{ord.totalAmount}</td>
                  <td className="p-3 text-[11px] font-bold text-slate-400">{ord.paymentMethod} ({ord.paymentStatus})</td>
                  <td className="p-3">
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-savera-saffron font-bold focus:outline-none"
                    >
                      {statusOptions.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
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

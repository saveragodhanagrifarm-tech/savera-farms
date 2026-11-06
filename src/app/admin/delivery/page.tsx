'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Truck, MapPin, Plus, CheckCircle2, XCircle, X } from 'lucide-react';

export default function AdminDeliveryPage() {
  const { deliveryZones, addDeliveryZone, toggleZoneServiceable } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [pincode, setPincode] = useState('');
  const [areaName, setAreaName] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(30);
  const [freeThreshold, setFreeThreshold] = useState(299);
  const [morningSlotCap, setMorningSlotCap] = useState(150);
  const [eveningSlotCap, setEveningSlotCap] = useState(80);

  const handleCreateZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim() || !areaName.trim()) return;
    addDeliveryZone({
      pincode: pincode.trim(),
      areaName: areaName.trim(),
      deliveryFee,
      freeThreshold,
      morningSlotCap,
      eveningSlotCap,
      isServiceable: true,
    });
    setShowAddModal(false);
    setPincode('');
    setAreaName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Delivery Management & Service Zones</h1>
          <p className="text-xs text-slate-400">
            Configure serviceable pincodes, slot capacity caps, and delivery fees ({deliveryZones.length} registered zones)
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-savera-dark hover:bg-savera-green border border-savera-green/50 text-savera-saffron font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Delivery Hub / Zone</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliveryZones.map((zone) => (
          <div key={zone.id} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-mono font-bold text-savera-saffron text-base">{zone.pincode}</span>
              <button
                onClick={() => toggleZoneServiceable(zone.pincode)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1 ${
                  zone.isServiceable
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-red-950 text-red-400 border border-red-800'
                }`}
              >
                {zone.isServiceable ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                <span>{zone.isServiceable ? 'Active' : 'Inactive'}</span>
              </button>
            </div>

            <h3 className="font-serif font-bold text-white text-base">{zone.areaName}</h3>

            <div className="space-y-2 text-slate-300 border-t border-slate-800 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Morning Capacity Cap:</span>
                <span className="font-bold text-white">{zone.morningSlotCap} bottles/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Evening Slot Cap:</span>
                <span className="font-bold text-white">{zone.eveningSlotCap} bottles/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Standard Delivery Fee:</span>
                <span className="font-bold text-white">₹{zone.deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Free Delivery Threshold:</span>
                <span className="font-bold text-emerald-400">&gt; ₹{zone.freeThreshold}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Zone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-3xl p-6 max-w-md w-full border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-white text-lg">Register New Delivery Hub</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateZone} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Pincode (6 digits)</label>
                  <input
                    type="text"
                    placeholder="e.g. 122018"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Hub Area Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Golf Course Extension"
                    value={areaName}
                    onChange={(e) => setAreaName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Morning Slot Capacity</label>
                  <input
                    type="number"
                    value={morningSlotCap}
                    onChange={(e) => setMorningSlotCap(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Evening Slot Capacity</label>
                  <input
                    type="number"
                    value={eveningSlotCap}
                    onChange={(e) => setEveningSlotCap(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Delivery Fee (₹)</label>
                  <input
                    type="number"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Free Shipping Above (₹)</label>
                  <input
                    type="number"
                    value={freeThreshold}
                    onChange={(e) => setFreeThreshold(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-savera-saffron text-slate-950 font-bold py-3 rounded-xl text-xs hover:bg-white transition"
              >
                Register Delivery Zone
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const { createSupportTicket, addToast } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'Subscription Issue' | 'Delivery Issue' | 'Product Issue' | 'Other'>('Other');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    createSupportTicket({
      name,
      phone,
      category,
      description: message + (email ? ` (Email: ${email})` : ''),
    });

    setSubmitted(true);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-savera-green uppercase tracking-widest">Talk to Savera Farms</span>
        <h1 className="font-serif text-4xl font-bold text-savera-dark">Get in Touch</h1>
        <p className="text-xs text-savera-brown">We are always happy to answer your dairy, delivery, or farm questions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 bg-savera-dark text-savera-cream rounded-3xl p-8 shadow-floating space-y-6">
          <h3 className="font-serif text-2xl font-bold text-white">Head Office & Operations</h3>

          <div className="space-y-4 text-xs text-savera-cream/80">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-savera-saffron shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Panchkula Head Office:</span>
                Savera Godhan Agri Farm, SCO 84-85, Sector 9, Panchkula, Haryana - 134109
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-savera-saffron shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Dairy Farm Estate:</span>
                Savera Organic Dairy Estate, Morni Foothills Belt, Panchkula, Haryana - 134109
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-savera-saffron shrink-0" />
              <div>
                <span className="font-bold text-white block">Customer Support Phone:</span>
                <a href="tel:+919876543210" className="hover:text-savera-saffron transition">
                  +91 98765 43210 / +91 172 4567890
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-savera-saffron shrink-0" />
              <div>
                <span className="font-bold text-white block">Email Inquiry:</span>
                <a href="mailto:care@saverafarms.com" className="hover:text-savera-saffron transition">
                  care@saverafarms.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-savera-saffron shrink-0" />
              <div>
                <span className="font-bold text-white block">Operating Hours:</span>
                Mon - Sun: 5:00 AM - 9:00 PM (Morning delivery drops begin 5:00 AM)
              </div>
            </div>
          </div>
        </div>

        {/* Contact Inquiry Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-savera-dark/10 shadow-soft">
          <h3 className="font-serif text-2xl font-bold text-savera-dark mb-4">Send Us a Message</h3>

          {submitted && (
            <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Your inquiry has been received and registered under Customer Support Desk. Our team will contact you shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-savera-dark block mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-savera-green"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-savera-dark block mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="Enter mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-savera-green"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-savera-dark block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-savera-green"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-savera-dark block mb-1">Inquiry Topic</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-savera-green"
                >
                  <option value="Subscription Issue">Milk Subscription Question</option>
                  <option value="Delivery Issue">Delivery Area & Timing</option>
                  <option value="Product Issue">A2 Purity & Bilona Ghee Quality</option>
                  <option value="Other">General Farm Inquiry / Bulk Order</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-savera-dark block mb-1">Your Message or Question</label>
              <textarea
                rows={4}
                placeholder="Ask about milk subscriptions, delivery areas, bulk ghee orders..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-savera-green"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-savera-dark hover:bg-savera-green text-savera-cream font-bold px-8 py-3.5 rounded-2xl text-xs transition flex items-center gap-2 shadow-floating"
            >
              <Send className="w-4 h-4 text-savera-saffron" />
              <span>Submit Message to Savera Farms</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

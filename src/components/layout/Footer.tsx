'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Shield, Truck, Award, Sparkles, Phone, Mail, MapPin, Instagram, Facebook, Youtube, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { addToast } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Invalid Email', 'Please enter a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    addToast('Subscribed!', 'Thank you for joining the Savera Farms newsletter. Check your inbox for farm updates and exclusive seasonal discounts!', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-savera-dark text-savera-cream pt-16 pb-24 md:pb-12 border-t border-savera-green/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Indicators Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-savera-cream/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-savera-green/40 flex items-center justify-center text-savera-saffron">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Pure A2 Milk</h4>
              <p className="text-[11px] text-savera-cream/70">Gir & Sahiwal Desi Cow Breed</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-savera-green/40 flex items-center justify-center text-savera-saffron">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fresh 5 AM Delivery</h4>
              <p className="text-[11px] text-savera-cream/70">Cold-chain insulated doorstep drop</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-savera-green/40 flex items-center justify-center text-savera-saffron">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Vedic Bilona Method</h4>
              <p className="text-[11px] text-savera-cream/70">Traditional curd-churned Ghee</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-savera-green/40 flex items-center justify-center text-savera-saffron">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Zero Additives</h4>
              <p className="text-[11px] text-savera-cream/70">No oxytocin, hormones or starch</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-savera-saffron/40 flex items-center justify-center">
                <img src="/logo.png" alt="Savera Farms Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-wide">
                SAVERA FARMS
              </span>
            </div>
            <p className="text-xs text-savera-cream/80 leading-relaxed">
              “Bringing you the purest milk from Desi breed.” Farm-fresh A2 milk, traditional Bilona ghee, and cold-pressed oils brought straight from Savera Organic Dairy Estate to your family.
            </p>
            <div className="flex items-center gap-3 pt-2 text-savera-saffron">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                title="Follow us on Instagram"
                className="p-2 rounded-full bg-savera-green/30 hover:bg-savera-green transition"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                title="Follow us on Facebook"
                className="p-2 rounded-full bg-savera-green/30 hover:bg-savera-green transition"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                title="Watch our farm stories on YouTube"
                className="p-2 rounded-full bg-savera-green/30 hover:bg-savera-green transition"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-sm font-serif font-bold text-white mb-4 text-savera-saffron">Product Categories</h4>
            <ul className="space-y-2 text-xs text-savera-cream/80">
              <li><Link href="/shop/prod-a2-milk" className="hover:text-white transition">A2 Desi Cow Milk</Link></li>
              <li><Link href="/shop/prod-a2-ghee" className="hover:text-white transition">A2 Vedic Bilona Ghee</Link></li>
              <li><Link href="/shop/prod-fresh-paneer" className="hover:text-white transition">Fresh Malai Paneer</Link></li>
              <li><Link href="/shop/prod-farm-curd" className="hover:text-white transition">Farm Fresh Curd (Dahi)</Link></li>
              <li><Link href="/shop/prod-cold-mustard" className="hover:text-white transition">Cold Pressed Mustard Oil</Link></li>
              <li><Link href="/shop/prod-coconut-oil" className="hover:text-white transition">Cold Pressed Coconut Oil</Link></li>
              <li><Link href="/shop/prod-rog-nasak-chai" className="hover:text-white transition">Rog Nasak Herbal Chai</Link></li>
              <li><Link href="/shop/prod-himalayan-shilajit" className="hover:text-white transition">Himalayan Shilajit Resin</Link></li>
              <li><Link href="/subscriptions" className="text-savera-saffron font-bold hover:underline">Daily Milk Subscriptions</Link></li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-sm font-serif font-bold text-white mb-4 text-savera-saffron">Quick Links & Portals</h4>
            <ul className="space-y-2 text-xs text-savera-cream/80">
              <li><Link href="/farm-story" className="hover:text-white transition">Our Farm Story</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Savera Farms</Link></li>
              <li><Link href="/orders" className="hover:text-white transition">Track Customer Orders</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact Customer Support</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">Milk Delivery FAQs</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Farm Blog & Health Guides</Link></li>
              <li><Link href="/admin" className="text-savera-saffron font-bold hover:underline">Admin Management Portal</Link></li>
              <li><Link href="/delivery" className="text-emerald-400 font-bold hover:underline">Delivery Executive App</Link></li>
            </ul>
          </div>

          {/* Farm Contact Details & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-serif font-bold text-white mb-2 text-savera-saffron">Savera Farm Contact</h4>
            <div className="space-y-2 text-xs text-savera-cream/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-savera-saffron shrink-0 mt-0.5" />
                <span>Savera Godhan Agri Farm, SCO 84-85, Sector 9, Panchkula, Haryana - 134109</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-savera-saffron shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition">
                  +91 98765 43210 / +91 172 4567890
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-savera-saffron shrink-0" />
                <a href="mailto:care@saverafarms.com" className="hover:text-white transition">
                  care@saverafarms.com
                </a>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold text-white block mb-2">Subscribe for Farm Updates & Offers</span>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-savera-green/30 border border-savera-cream/20 rounded-xl px-3 py-2 text-xs text-white placeholder-savera-cream/50 focus:outline-none focus:ring-1 focus:ring-savera-saffron w-full"
                />
                <button
                  type="submit"
                  className="bg-savera-saffron text-savera-brown font-bold px-3 py-2 rounded-xl text-xs hover:bg-white transition shrink-0 flex items-center gap-1"
                >
                  {subscribed ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{subscribed ? 'Joined' : 'Join'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 border-t border-savera-cream/10 text-center text-[11px] text-savera-cream/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 Savera Farms D2C Platform. All Rights Reserved. Pure. Traditional. Farm Fresh.</p>
          <p className="text-[10px]">FSSAI Central Dairy License: #10823005000981</p>
        </div>
      </div>
    </footer>
  );
};

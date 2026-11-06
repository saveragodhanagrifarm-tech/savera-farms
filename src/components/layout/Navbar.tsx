'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import {
  MapPin,
  Search,
  ShoppingBag,
  User,
  Calendar,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronDown,
  X,
  Menu,
  CheckCircle2,
  Package,
  LogOut,
  LogIn,
} from 'lucide-react';

export const Navbar: React.FC<{ onOpenCart: () => void }> = ({ onOpenCart }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { cart, selectedPincode, setSelectedPincode, deliveryZones, products } = useApp();
  const { user, profile, isAdmin, openAuthModal, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const [pinInput, setPinInput] = useState(selectedPincode);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim()) {
      setSelectedPincode(pinInput.trim());
      setShowPincodeModal(false);
    }
  };

  const handleSelectPincodeZone = (pincode: string) => {
    setSelectedPincode(pincode);
    setPinInput(pincode);
    setShowPincodeModal(false);
  };

  const activeZone = deliveryZones.find((z) => z.pincode === selectedPincode);

  // Search suggestions
  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      setMobileMenuOpen(false);
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-savera-dark/10 shadow-soft">
      {/* Top Announcement Bar */}
      <div className="bg-savera-dark text-savera-cream text-xs py-2 px-4 flex items-center justify-between text-center font-medium">
        <div className="hidden md:flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-savera-saffron" />
          <span>Fresh A2 Desi Cow Milk — Milked & Bottled Daily at Savera Farms</span>
        </div>
        <div className="mx-auto md:mx-0 flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-savera-lightGreen" />
          <span>Order before 8 PM for 5 AM Morning Delivery</span>
          <span className="bg-savera-saffron text-savera-brown px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ml-1">
            Free Delivery &gt; ₹{activeZone?.freeThreshold || 299}
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-4 text-[11px] opacity-90">
          <a href="tel:+919876543210" className="hover:text-savera-saffron transition">
            Call: +91 98765 43210
          </a>
          <Link href="/faq" className="hover:underline">
            Support FAQ
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-savera-dark overflow-hidden flex items-center justify-center border-2 border-savera-saffron/40 shadow-md group-hover:scale-105 transition transform">
              <img src="/logo.png" alt="Savera Farms Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold text-savera-dark tracking-tight leading-none block">
                SAVERA FARMS
              </span>
              <span className="text-[10px] text-savera-green font-medium tracking-wider uppercase block mt-0.5">
                Purest Milk from Desi Breed
              </span>
            </div>
          </Link>

          {/* Location Pincode Picker */}
          <button
            onClick={() => setShowPincodeModal(true)}
            className="hidden sm:flex items-center gap-2 bg-savera-cream/60 hover:bg-savera-cream border border-savera-saffronDark/30 px-3.5 py-2 rounded-full text-xs font-semibold text-savera-dark transition"
            title="Click to change delivery pincode"
          >
            <MapPin className="w-4 h-4 text-savera-green" />
            <div className="text-left leading-tight">
              <span className="block text-[10px] text-savera-brown/70 font-normal">Delivering to</span>
              <span className="flex items-center gap-1 text-xs font-bold text-savera-dark">
                {selectedPincode} {activeZone ? `(${activeZone.areaName.split(' ')[0]})` : ''}
                <ChevronDown className="w-3 h-3 text-savera-brown" />
              </span>
            </div>
          </button>

          {/* Global Search Input with Auto-Suggest Dropdown */}
          <div ref={searchRef} className="hidden lg:flex flex-1 max-w-md relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search A2 Milk, Bilona Ghee, Paneer, Oils..."
                value={searchQuery}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-full pl-10 pr-9 py-2.5 text-xs text-savera-dark placeholder-savera-brown/50 focus:outline-none focus:ring-2 focus:ring-savera-green/40 shadow-inner transition"
              />
              <button
                type="submit"
                aria-label="Submit Search"
                className="absolute left-3.5 top-3 text-savera-brown/50 hover:text-savera-green"
              >
                <Search className="w-4 h-4" />
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Live Search Suggestions Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-floating border border-savera-dark/10 overflow-hidden z-50">
                <div className="p-2 bg-savera-offwhite text-[10px] font-bold text-savera-brown/70 uppercase tracking-wider px-3 flex justify-between items-center">
                  <span>Suggested Products</span>
                  <Link
                    href={`/shop?q=${encodeURIComponent(searchQuery)}`}
                    onClick={() => setShowSearchDropdown(false)}
                    className="text-savera-green hover:underline lowercase font-semibold"
                  >
                    view all &rarr;
                  </Link>
                </div>
                <div className="divide-y divide-savera-dark/5">
                  {searchResults.map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/shop/${prod.id}`}
                      onClick={() => {
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-savera-cream/50 transition"
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-savera-offwhite shrink-0">
                        <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-xs text-savera-dark truncate">{prod.name}</h4>
                        <span className="text-[10px] text-savera-green font-semibold">{prod.category}</span>
                      </div>
                      <span className="font-serif font-bold text-xs text-savera-dark">
                        ₹{prod.variants[0]?.price}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Nav Action Links */}
          <div className="flex items-center gap-3">
            <Link
              href="/subscriptions"
              className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                pathname === '/subscriptions'
                  ? 'bg-savera-dark text-savera-cream'
                  : 'bg-savera-paleGreen/50 text-savera-dark hover:bg-savera-paleGreen'
              }`}
            >
              <Calendar className="w-4 h-4 text-savera-green" />
              <span>Milk Subscriptions</span>
            </Link>

            {/* Auth / Account Profile Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-savera-cream border border-savera-dark/15 text-savera-dark transition text-xs font-bold"
                >
                  <div className="w-6 h-6 rounded-full bg-savera-green text-white flex items-center justify-center text-[11px] font-bold">
                    {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate">{profile?.full_name?.split(' ')[0] || 'User'}</span>
                  {isAdmin && (
                    <span className="hidden lg:inline bg-savera-saffron/40 text-savera-brown text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase">
                      Admin
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-floating border border-savera-dark/10 p-2 z-50 animate-in fade-in zoom-in-95"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-savera-dark/10">
                      <p className="font-bold text-xs text-savera-dark truncate">{profile?.full_name || 'Savera Customer'}</p>
                      <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                      <span className={`inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${isAdmin ? 'bg-amber-100 text-amber-900 font-mono' : 'bg-emerald-100 text-emerald-900'}`}>
                        {isAdmin ? '🛡️ Administrator' : '🌱 Verified Customer'}
                      </span>
                    </div>

                    <div className="py-1 text-xs font-semibold">
                      <Link
                        href="/account"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-savera-cream text-savera-dark transition"
                      >
                        <User className="w-3.5 h-3.5 text-savera-green" />
                        <span>My Account & Details</span>
                      </Link>

                      <Link
                        href="/subscriptions"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-savera-cream text-savera-dark transition"
                      >
                        <Calendar className="w-3.5 h-3.5 text-savera-green" />
                        <span>Milk Subscriptions</span>
                      </Link>

                      <Link
                        href="/orders"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-savera-cream text-savera-dark transition"
                      >
                        <Package className="w-3.5 h-3.5 text-savera-green" />
                        <span>Order Tracking</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-savera-saffron/20 text-savera-brown font-bold transition border-t border-savera-dark/10 mt-1 pt-2"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-savera-saffron" />
                          <span>Admin Portal</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-savera-dark/10">
                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs text-red-600 hover:bg-red-50 font-bold transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-savera-cream hover:bg-savera-saffron/30 text-savera-dark text-xs font-bold transition border border-savera-dark/15 shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-savera-green" />
                <span>Sign In</span>
              </button>
            )}

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-savera-dark text-savera-cream hover:bg-savera-green transition shadow-md"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-savera-saffron text-savera-dark text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse-subtle">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-savera-dark hover:bg-savera-cream"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Secondary Category Nav Ribbon */}
        <nav className="hidden lg:flex items-center justify-between border-t border-savera-dark/5 py-2.5 text-xs font-semibold text-savera-dark/80">
          <div className="flex items-center gap-6">
            <Link href="/" className={`hover:text-savera-dark transition ${pathname === '/' ? 'text-savera-green font-bold' : ''}`}>
              Home
            </Link>
            <Link href="/shop?cat=Milk" className="hover:text-savera-green transition">
              A2 Milk
            </Link>
            <Link href="/shop?cat=Ghee" className="hover:text-savera-green transition">
              A2 Bilona Ghee
            </Link>
            <Link href="/shop?cat=Dairy" className="hover:text-savera-green transition">
              Paneer & Curd
            </Link>
            <Link href="/shop?cat=Oils" className="hover:text-savera-green transition">
              Cold Pressed Oils
            </Link>
            <Link href="/subscriptions" className="text-savera-brown font-bold hover:underline flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-savera-saffron" />
              Daily Milk Delivery
            </Link>
            <Link href="/orders" className="hover:text-savera-green transition">
              My Orders
            </Link>
            <Link href="/farm-story" className="hover:text-savera-green transition">
              Our Farm Story
            </Link>
            <Link href="/about" className="hover:text-savera-green transition">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-savera-green transition">
              Contact Us
            </Link>
          </div>
          <div className="text-savera-green font-semibold flex items-center gap-1">
            <span>🌿 100% Pure Organic Farm Direct</span>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-savera-dark/10 px-4 py-4 space-y-3">
          {/* Mobile Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search pure milk, ghee, paneer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-savera-dark focus:outline-none focus:ring-2 focus:ring-savera-green"
            />
            <Search className="w-4 h-4 text-savera-brown/50 absolute left-3.5 top-3" />
          </form>

          <button
            onClick={() => {
              setShowPincodeModal(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between bg-savera-cream/70 p-3 rounded-xl text-xs font-bold text-savera-dark"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-savera-green" />
              <span>Delivering to: {selectedPincode}</span>
            </div>
            <span className="text-savera-brown font-semibold underline">Change</span>
          </button>

          {/* Mobile Category Quick Chips */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-savera-green px-1">Categories</span>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-savera-dark">
              <Link
                href="/shop?cat=Milk"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-savera-cream/80 hover:bg-savera-cream flex items-center gap-2 border border-savera-saffron/30"
              >
                <span>🥛</span> <span>A2 Milk</span>
              </Link>
              <Link
                href="/shop?cat=Ghee"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-savera-cream/80 hover:bg-savera-cream flex items-center gap-2 border border-savera-saffron/30"
              >
                <span>🧈</span> <span>Vedic Ghee</span>
              </Link>
              <Link
                href="/shop?cat=Dairy"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-savera-cream/80 hover:bg-savera-cream flex items-center gap-2 border border-savera-saffron/30"
              >
                <span>🧀</span> <span>Paneer & Curd</span>
              </Link>
              <Link
                href="/shop?cat=Oils"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-savera-cream/80 hover:bg-savera-cream flex items-center gap-2 border border-savera-saffron/30"
              >
                <span>🌿</span> <span>Cold Pressed Oils</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-savera-dark pt-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-savera-offwhite hover:bg-savera-cream flex items-center gap-2"
            >
              🏡 <span>Home</span>
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-savera-offwhite hover:bg-savera-cream flex items-center gap-2"
            >
              🥛 <span>Product Catalog</span>
            </Link>
            <Link
              href="/subscriptions"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-savera-paleGreen/50 text-savera-dark flex items-center gap-2"
            >
              📅 <span>Milk Subscriptions</span>
            </Link>
            <Link
              href="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-savera-offwhite text-savera-dark flex items-center gap-2"
            >
              📦 <span>My Orders</span>
            </Link>
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-savera-offwhite text-savera-dark flex items-center gap-2"
            >
              👤 <span>Customer Account</span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-savera-saffron/30 text-savera-brown flex items-center gap-2"
            >
              🛡️ <span>Admin Portal</span>
            </Link>
            <Link
              href="/delivery"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-emerald-100 text-emerald-900 flex items-center gap-2 col-span-2"
            >
              🚚 <span>Delivery Executive App</span>
            </Link>
          </div>
        </div>
      )}

      {/* Pincode Change Modal */}
      {showPincodeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-floating border border-savera-dark/10">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-savera-green" />
                <h3 className="text-lg font-serif font-bold text-savera-dark">Delivery Location</h3>
              </div>
              <button
                onClick={() => setShowPincodeModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-savera-brown/80 mb-4">
              Enter your pincode or select one of our active morning milk delivery hubs in Gurugram & Delhi NCR:
            </p>
            <form onSubmit={handlePincodeSubmit} className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit pincode"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-savera-dark/20 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-savera-green"
                />
                <button
                  type="submit"
                  className="bg-savera-dark text-savera-cream font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-savera-green transition"
                >
                  Verify
                </button>
              </div>

              {/* Serviceable Zones Clickable Pills */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-savera-dark block">
                  Quick Select Active Delivery Hub:
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {deliveryZones.map((z) => (
                    <button
                      type="button"
                      key={z.id}
                      onClick={() => handleSelectPincodeZone(z.pincode)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${
                        selectedPincode === z.pincode
                          ? 'bg-savera-cream/90 border-savera-green font-bold text-savera-dark'
                          : 'bg-savera-offwhite border-savera-dark/10 hover:border-savera-green/40 text-savera-brown'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-savera-green">{z.pincode}</span>
                        <span>{z.areaName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-savera-green font-bold">
                        <span>Free &gt; ₹{z.freeThreshold}</span>
                        {selectedPincode === z.pincode && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-gray-500 bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200">
                🌱 <strong>Morning Guarantee:</strong> All orders confirmed before 8:00 PM are dispatched in refrigerated vehicles for delivery between 5:00 AM – 7:00 AM.
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

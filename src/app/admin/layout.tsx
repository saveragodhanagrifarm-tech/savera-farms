'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useAuth, PRESET_ACCOUNTS } from '@/context/AuthContext';
import { AdminRole } from '@/types';
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  Users,
  Package,
  Factory,
  Boxes,
  Truck,
  Tag,
  BarChart3,
  Settings,
  ShieldCheck,
  Headphones,
  FileSpreadsheet,
  FileText,
  LogOut,
  ChevronDown,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, profile, isAdmin, isRider, isLoading, signIn, signOut } = useAuth();

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const cleanPath = (p: string) => p.replace(/\/+$/, '') || '/';
  const normalizedCurrentPath = cleanPath(pathname);

  // Enterprise Super Admin navigation items
  const allNavItems = [
    { href: '/admin', label: 'Executive Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products & Pricing', icon: Tag },
    { href: '/admin/orders', label: 'Orders & Tracking', icon: ShoppingBag },
    { href: '/admin/subscriptions', label: 'Milk Subscriptions', icon: Calendar },
    { href: '/admin/inventory', label: 'Batch Inventory', icon: Package },
    { href: '/admin/production', label: 'Dairy Processing', icon: Factory },
    { href: '/admin/raw-materials', label: 'Raw Materials & Stock', icon: Boxes },
    { href: '/admin/suppliers', label: 'Suppliers & POs', icon: Users },
    { href: '/admin/delivery', label: 'Delivery Dispatch & Zones', icon: Truck },
    { href: '/admin/coupons', label: 'Coupons & Promos', icon: Sparkles },
    { href: '/admin/reports', label: 'Reports & Export', icon: BarChart3 },
    { href: '/admin/audit-logs', label: 'Audit Trail', icon: FileText },
  ];

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setIsLoggingIn(true);
    const { error, profile: loggedProfile } = await signIn(adminEmail, adminPassword);
    if (error) {
      setAdminError(error.message);
    } else if (loggedProfile?.role !== 'admin') {
      setAdminError('Access Denied: This account does not possess Super Admin privileges. Delivery riders and customers cannot view business financials.');
    }
    setIsLoggingIn(false);
  };

  const handleFillAdmin = (presetIndex: number) => {
    setAdminEmail(PRESET_ACCOUNTS[presetIndex].email);
    setAdminPassword(PRESET_ACCOUNTS[presetIndex].password);
    setAdminError('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-savera-saffron border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-400">Verifying Super Administrator Credentials...</p>
        </div>
      </div>
    );
  }

  // Delivery Rider Attempting to Access Admin: Strict RBAC Block
  if (user && isRider) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-950/60 border border-amber-600/40 text-savera-saffron flex items-center justify-center mx-auto shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-white">Delivery Rider Console</h1>
            <span className="text-xs text-amber-400 font-bold block mt-1">Admin Access Restricted</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Signed in as <strong className="text-white">{profile?.full_name}</strong> (Delivery Partner).
            Business revenue, financials, pricing, and system configurations are strictly restricted to Super Admins.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/delivery"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg"
            >
              <Truck className="w-4 h-4" />
              <span>Go to Field Delivery Portal</span>
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              className="text-xs text-slate-400 hover:text-white underline pt-1"
            >
              Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Non-Admin User Attempting Access: Admin Authentication Wall
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-savera-saffron/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-savera-saffron/30 text-savera-saffron flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-white">Savera Super Admin Console</h1>
              <p className="text-xs text-slate-400">
                Panchkula & Chandigarh Head Office Portal. Authorized Super Administrators only.
              </p>
            </div>

            {adminError && (
              <div className="bg-red-950/80 border border-red-800/60 text-red-300 text-xs p-3 rounded-xl">
                {adminError}
              </div>
            )}

            {user && !isAdmin && (
              <div className="bg-amber-950/60 border border-amber-800/40 text-amber-300 text-xs p-3 rounded-xl space-y-1">
                <p className="font-bold">Signed in as: {user.email}</p>
                <p className="text-[11px] text-amber-400">Your account does not possess Admin privileges. Please unlock using an authorized Super Admin account.</p>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="text-xs font-bold underline hover:text-white mt-1 block"
                >
                  Sign Out of Customer Account
                </button>
              </div>
            )}

            {/* Quick Preset Admin Fill */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Authorized Super Admin Accounts:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleFillAdmin(0)}
                  className="text-left p-2 rounded-xl border border-slate-700 bg-slate-900 hover:border-savera-saffron hover:bg-slate-800 transition"
                >
                  <span className="font-bold text-savera-saffron block truncate">👑 Super Admin</span>
                  <span className="text-[10px] text-slate-400 block truncate">admin@saverafarms.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillAdmin(1)}
                  className="text-left p-2 rounded-xl border border-slate-700 bg-slate-900 hover:border-savera-saffron hover:bg-slate-800 transition"
                >
                  <span className="font-bold text-amber-400 block truncate">⚙️ Operations Admin</span>
                  <span className="text-[10px] text-slate-400 block truncate">operations@saverafarms.com</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Super Admin Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="admin@saverafarms.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-savera-saffron"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-savera-saffron"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-savera-saffron hover:bg-amber-500 text-savera-dark font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                <span>{isLoggingIn ? 'Authenticating...' : 'Unlock Admin Operations'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center border-t border-slate-800">
              <Link
                href="/"
                className="text-xs text-slate-400 hover:text-white transition font-medium"
              >
                ← Return to Public Storefront
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Super Admin View
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo & Head Office Badge */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-savera-saffron text-savera-brown flex items-center justify-center font-serif font-bold text-xl shadow-md">
              S
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white tracking-wide block">SAVERA ENTERPRISE</span>
              <span className="text-[10px] text-savera-saffron uppercase tracking-widest block">
                Panchkula & Chandigarh Hub
              </span>
            </div>
          </div>

          {/* Authenticated Identity Card (Strict RBAC - No arbitrary role switching) */}
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Logged In Identity:</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-savera-saffron text-savera-dark flex items-center justify-center font-bold text-xs shadow-sm">
                SA
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{profile?.full_name || 'Super Admin'}</p>
                <span className="text-[10px] text-savera-saffron font-mono uppercase block">Super Administrator</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight pt-1 border-t border-slate-800/80">
              Full enterprise privileges: Live product pricing, catalog, batches, revenue, & dispatch.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {allNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = cleanPath(pathname) === cleanPath(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-savera-dark text-savera-saffron border border-savera-green/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-savera-saffron' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer Controls */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <Link
            href="/delivery"
            className="flex items-center justify-between text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 px-3 py-2 rounded-xl transition"
          >
            <span className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5" />
              <span>Driver Portal View</span>
            </span>
            <span className="text-[10px] uppercase font-bold">Open</span>
          </Link>

          <div className="flex items-center justify-between px-2 text-xs">
            <Link href="/" className="text-slate-400 hover:text-white transition flex items-center gap-1.5">
              <span>Public Storefront</span>
            </Link>
            <button
              onClick={() => signOut()}
              className="text-red-400 hover:text-red-300 transition flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

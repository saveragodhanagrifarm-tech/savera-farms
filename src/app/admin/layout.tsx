'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
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
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { adminRole, setAdminRole } = useApp();
  const { user, profile, isAdmin, isLoading, signIn, signOut } = useAuth();

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Role-based permissions mapping
  const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
    'Super Admin': [
      '/admin',
      '/admin/orders',
      '/admin/subscriptions',
      '/admin/inventory',
      '/admin/production',
      '/admin/raw-materials',
      '/admin/suppliers',
      '/admin/delivery',
      '/admin/coupons',
      '/admin/reports',
      '/admin/audit-logs',
    ],
    'Customer Support': [
      '/admin',
      '/admin/orders',
      '/admin/subscriptions',
      '/admin/coupons',
    ],
    'Delivery Manager': [
      '/admin',
      '/admin/orders',
      '/admin/subscriptions',
      '/admin/delivery',
    ],
    'Production Manager': [
      '/admin',
      '/admin/production',
      '/admin/raw-materials',
      '/admin/inventory',
      '/admin/suppliers',
    ],
    'Inventory Manager': [
      '/admin',
      '/admin/inventory',
      '/admin/raw-materials',
      '/admin/suppliers',
      '/admin/orders',
    ],
    'Delivery Executive': [
      '/admin',
      '/admin/orders',
      '/admin/delivery',
    ],
  };

  const cleanPath = (p: string) => p.replace(/\/+$/, '') || '/';
  const normalizedCurrentPath = cleanPath(pathname);

  const getDashboardLabel = () => {
    switch (adminRole) {
      case 'Customer Support':
        return 'Support Desk';
      case 'Inventory Manager':
        return 'Inventory Dashboard';
      case 'Production Manager':
        return 'Production Dashboard';
      case 'Delivery Manager':
        return 'Delivery Dashboard';
      case 'Delivery Executive':
        return 'Driver Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const allNavItems = [
    {
      href: '/admin',
      label: getDashboardLabel(),
      icon:
        adminRole === 'Customer Support'
          ? Headphones
          : adminRole === 'Inventory Manager'
          ? Package
          : adminRole === 'Production Manager'
          ? Factory
          : adminRole === 'Delivery Manager' || adminRole === 'Delivery Executive'
          ? Truck
          : LayoutDashboard,
    },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/subscriptions', label: 'Subscriptions', icon: Calendar },
    { href: '/admin/inventory', label: 'Batch Inventory', icon: Package },
    { href: '/admin/production', label: 'Dairy Production', icon: Factory },
    { href: '/admin/raw-materials', label: 'Raw Materials', icon: Boxes },
    { href: '/admin/suppliers', label: 'Suppliers & POs', icon: Users },
    { href: '/admin/delivery', label: 'Delivery & Zones', icon: Truck },
    { href: '/admin/coupons', label: 'Coupons & Offers', icon: Tag },
    { href: '/admin/reports', label: 'Reports & Export', icon: BarChart3 },
    { href: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
  ];

  const allowedRoutes = ROLE_PERMISSIONS[adminRole] || ROLE_PERMISSIONS['Super Admin'];
  const visibleNavItems = allNavItems.filter((item) =>
    allowedRoutes.some((route) => cleanPath(route) === cleanPath(item.href))
  );

  const isCurrentRouteAllowed = allowedRoutes.some((route) => {
    const normRoute = cleanPath(route);
    if (normRoute === '/admin') {
      return normalizedCurrentPath === '/admin';
    }
    return normalizedCurrentPath === normRoute || normalizedCurrentPath.startsWith(normRoute + '/');
  });

  const roles: AdminRole[] = [
    'Super Admin',
    'Customer Support',
    'Delivery Manager',
    'Production Manager',
    'Inventory Manager',
    'Delivery Executive',
  ];

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setIsLoggingIn(true);
    const { error, profile: loggedProfile } = await signIn(adminEmail, adminPassword);
    if (error) {
      setAdminError(error.message);
    } else if (loggedProfile?.role !== 'admin') {
      setAdminError('Access Denied: This account is registered as a Customer. Administrator privileges are required.');
    }
    setIsLoggingIn(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-savera-saffron border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-400">Verifying Administrator Credentials...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="font-serif text-2xl font-bold text-white">Savera Farms Admin Console</h1>
              <p className="text-xs text-slate-400">
                Authorized farm managers & staff only. Enter your administrator credentials to access operations.
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
                <p className="text-[11px] text-amber-400">Your account role is "Customer". Please sign in with an Admin account.</p>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="text-xs font-bold underline hover:text-white mt-1 block"
                >
                  Sign Out of Customer Account
                </button>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Admin Email</label>
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
                <span>{isLoggingIn ? 'Authenticating...' : 'Unlock Admin Console'}</span>
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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-savera-saffron text-savera-brown flex items-center justify-center font-serif font-bold text-xl">
              S
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white tracking-wide block">SAVERA ADMIN</span>
              <span className="text-[10px] text-savera-saffron uppercase tracking-widest block">
                {adminRole === 'Customer Support' ? 'Helpdesk & Care' : 'Business Operations'}
              </span>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Role (RBAC):</span>
              <span className="w-2 h-2 rounded-full bg-savera-saffron" />
            </div>
            <select
              value={adminRole}
              onChange={(e) => setAdminRole(e.target.value as AdminRole)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-savera-saffron font-bold focus:outline-none cursor-pointer"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 leading-tight">
              {adminRole === 'Customer Support' && 'Restricted to Customer Care, Tickets, Orders & Assistance.'}
              {adminRole === 'Super Admin' && 'Unrestricted access to all Financials, Reports & Systems.'}
              {adminRole === 'Delivery Manager' && 'Restricted to Route Dispatch, Zones & Fulfillment.'}
              {adminRole === 'Production Manager' && 'Restricted to Dairy Processing, Yield & Raw Materials.'}
              {adminRole === 'Inventory Manager' && 'Restricted to FEFO Stock, Raw Materials & POs.'}
              {adminRole === 'Delivery Executive' && 'Assigned to field deliveries & live OTP drops.'}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {visibleNavItems.map((item) => {
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

        {/* Footer Link back to storefront */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <Link
            href="/delivery"
            className="w-full flex items-center justify-center gap-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 py-2 rounded-xl text-xs font-bold transition"
          >
            <Truck className="w-4 h-4" />
            <span>Delivery Agent View</span>
          </Link>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 py-2 rounded-xl text-xs font-bold transition"
          >
            <LogOut className="w-4 h-4 text-savera-saffron" />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-savera-dark text-savera-saffron text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {adminRole} View
            </span>
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
              {adminRole === 'Customer Support'
                ? 'Savera Customer Care & Support Center'
                : 'Savera Farms Enterprise Operations Platform'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Synced
            </span>
            <div className="w-8 h-8 rounded-full bg-savera-saffron text-savera-brown font-serif font-bold flex items-center justify-center">
              {adminRole.charAt(0)}
            </div>
          </div>
        </header>

        <main className="p-6">
          {isCurrentRouteAllowed ? (
            children
          ) : (
            <div className="bg-slate-950 p-8 rounded-3xl border border-red-900/40 text-center max-w-xl mx-auto space-y-4 my-12">
              <div className="w-16 h-16 rounded-full bg-red-950/60 text-red-400 flex items-center justify-center mx-auto text-2xl font-bold">
                🔒
              </div>
              <h2 className="font-serif text-2xl font-bold text-white">Access Restricted (RBAC)</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your current role <strong className="text-savera-saffron">{adminRole}</strong> does not have permission to view or modify this enterprise module.
              </p>
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-left text-xs space-y-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Permitted Sections for {adminRole}:
                </span>
                <ul className="list-disc list-inside text-slate-400 space-y-1">
                  {allowedRoutes.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <Link
                  href="/admin"
                  className="bg-savera-dark text-savera-saffron font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-savera-green transition"
                >
                  Return to Allowed Dashboard
                </Link>
                <button
                  onClick={() => setAdminRole('Super Admin')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-5 py-2.5 rounded-xl text-xs transition"
                >
                  Elevate to Super Admin
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

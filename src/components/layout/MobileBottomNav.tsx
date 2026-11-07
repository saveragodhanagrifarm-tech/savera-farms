'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Calendar, PackageCheck, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { cart } = useApp();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/shop', label: 'Shop', icon: ShoppingBag },
    { href: '/subscriptions', label: 'Daily Milk', icon: Calendar },
    { href: '/orders', label: 'Orders', icon: PackageCheck },
    { href: '/account', label: 'Account', icon: User },
  ];

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-savera-dark/10 shadow-floating"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex justify-around items-center pt-1.5 pb-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-1 rounded-xl transition ${
                isActive ? 'text-savera-green font-bold scale-105' : 'text-savera-brown/70 hover:text-savera-dark'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-savera-green' : ''}`} />
                {item.href === '/shop' && cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-savera-saffron text-savera-dark text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

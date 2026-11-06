'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Calendar, PackageCheck, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/shop', label: 'Shop', icon: ShoppingBag },
    { href: '/subscriptions', label: 'Subscriptions', icon: Calendar },
    { href: '/orders', label: 'Orders', icon: PackageCheck },
    { href: '/account', label: 'Account', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-savera-dark/10 py-2 px-3 shadow-floating">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
                isActive ? 'text-savera-green font-bold scale-105' : 'text-savera-brown/70 hover:text-savera-dark'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-savera-green' : ''}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

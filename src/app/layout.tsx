'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { QuickCartDrawer } from '@/components/shop/QuickCartDrawer';
import { ToastContainer } from '@/components/common/ToastContainer';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isAdminOrDelivery = pathname?.startsWith('/admin') || pathname?.startsWith('/delivery');

  return (
    <html lang="en">
      <head>
        <title>Savera Farms — Bringing you the purest milk from Desi breed</title>
        <meta
          name="description"
          content="Farm fresh A2 Desi Cow Milk, Vedic Bilona Ghee, Paneer, Curd, and Cold-Pressed Oils delivered straight from Savera Farms to your family every morning."
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-savera-offwhite text-savera-dark selection:bg-savera-saffron selection:text-savera-brown">
        <AppProvider>
          {!isAdminOrDelivery && <Navbar onOpenCart={() => setIsCartOpen(true)} />}

          <main className="flex-1">{children}</main>

          {!isAdminOrDelivery && <Footer />}
          {!isAdminOrDelivery && <MobileBottomNav />}

          <QuickCartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}

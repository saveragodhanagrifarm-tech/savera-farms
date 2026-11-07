'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { QuickCartDrawer } from '@/components/shop/QuickCartDrawer';
import { ToastContainer } from '@/components/common/ToastContainer';
import { AuthModal } from '@/components/common/AuthModal';
import { PaymentGatewayModalHost } from '@/components/common/PaymentGatewayModalHost';
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#1b4332" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-savera-offwhite text-savera-dark selection:bg-savera-saffron selection:text-savera-brown">
        <AuthProvider>
          <AppProvider>
            {!isAdminOrDelivery && <Navbar onOpenCart={() => setIsCartOpen(true)} />}

            <main className="flex-1 pb-20 md:pb-0">{children}</main>

            {!isAdminOrDelivery && <Footer />}
            {!isAdminOrDelivery && <MobileBottomNav />}

            <QuickCartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <ToastContainer />
            <AuthModal />
            <PaymentGatewayModalHost />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

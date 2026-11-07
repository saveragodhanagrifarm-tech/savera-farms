'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { ProductCard } from '@/components/shop/ProductCard';
import { SubscribeModal } from '@/components/shop/SubscribeModal';
import { Product } from '@/types';
import {
  ShieldCheck,
  Truck,
  Award,
  Sparkles,
  Calendar,
  ChevronRight,
  Star,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  HeartHandshake,
  Milk,
  Flame,
  Droplets,
  Leaf,
  Sun,
} from 'lucide-react';

export default function HomePage() {
  const { products } = useApp();
  const [selectedSubProduct, setSelectedSubProduct] = useState<{
    product: Product;
    variantId: string;
  } | null>(null);

  const bestSellers = products.filter((p) => p.isBestSeller);
  const featuredProducts = products.filter((p) => p.isFeatured);

  const milkProduct = products.find((p) => p.id === 'prod-a2-milk');

  return (
    <div className="space-y-16 pb-12">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-savera-cream via-savera-cream/60 to-savera-offwhite pt-10 pb-20 overflow-hidden">
        {/* Background Decorative Accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-savera-saffron/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-savera-paleGreen/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-savera-dark text-savera-saffron px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SAVERA • ORGANIC . NATURAL . TRADITIONAL</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-savera-dark leading-[1.15] tracking-tight">
                A Thoughtfully Curated Range for Everyday Living
              </h1>

              <p className="text-base sm:text-lg text-savera-brown/90 leading-relaxed max-w-2xl font-normal">
                Natural inspiration for simple daily rituals — Farm-fresh A2 milk, Vedic Bilona ghee, Kashmiri saffron, wild Himalayan botanicals, and traditional everyday wellness.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
                <Link
                  href="/shop"
                  className="bg-savera-dark hover:bg-savera-green text-savera-cream font-bold px-8 py-4 rounded-2xl text-sm transition shadow-floating flex items-center justify-center gap-2 group w-full sm:w-auto"
                >
                  <span>Order Fresh Products</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </Link>

                {milkProduct && (
                  <button
                    onClick={() =>
                      setSelectedSubProduct({
                        product: milkProduct,
                        variantId: milkProduct.variants[0].id,
                      })
                    }
                    className="bg-savera-saffron hover:bg-savera-saffronDark text-savera-brown font-bold px-8 py-4 rounded-2xl text-sm transition shadow-soft flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <Calendar className="w-4 h-4 text-savera-dark" />
                    <span>Setup Milk Subscription</span>
                  </button>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-savera-dark/10">
                <div className="flex items-center gap-2 text-xs font-bold text-savera-dark">
                  <CheckCircle2 className="w-4 h-4 text-savera-green" />
                  <span>A2 Desi Cow Milk</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-savera-dark">
                  <CheckCircle2 className="w-4 h-4 text-savera-green" />
                  <span>Quality Tested</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-savera-dark">
                  <CheckCircle2 className="w-4 h-4 text-savera-green" />
                  <span>Hygienically Packed</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-savera-dark">
                  <CheckCircle2 className="w-4 h-4 text-savera-green" />
                  <span>Home Delivered</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-floating border-4 border-white bg-white group">
                <div className="relative h-[440px] w-full">
                  <Image
                    src="/images/farm-hero.png"
                    alt="Savera Farms A2 Desi Cow Milk"
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-savera-dark/80 via-transparent to-transparent" />
                </div>

                {/* Floating Overlay Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-panel text-savera-dark space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-savera-green">
                      🌟 Guaranteed Morning Delivery
                    </span>
                    <span className="bg-savera-dark text-savera-saffron text-[10px] font-bold px-2 py-0.5 rounded-full">
                      5 AM - 7 AM
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-savera-dark">
                    Pure Gir & Sahiwal Cow Milk
                  </h4>
                  <p className="text-[11px] text-savera-brown opacity-90">
                    Chilled glass bottles. Zero oxytocin. Zero preservatives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-savera-green uppercase">
              The Savera Collection
            </span>
            <h2 className="font-serif text-3xl font-bold text-savera-dark">Shop by Category</h2>
          </div>
          <Link href="/shop" className="text-xs font-bold text-savera-green hover:underline flex items-center gap-1">
            <span>Explore All Products</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <Link
            href="/shop?cat=Herbal%20%26%20Wellness"
            className="group p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-savera-cream/80 border border-savera-saffron/40 hover:bg-savera-cream hover:shadow-card transition duration-300 text-center space-y-2"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-savera-green text-white flex items-center justify-center mx-auto group-hover:scale-110 transition">
              <Leaf className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-savera-dark">Herbal & Wellness</h3>
            <p className="text-[10px] sm:text-[11px] text-savera-brown/80 line-clamp-2">Chai, Shilajit, Kesar & Rasayana</p>
          </Link>

          <Link
            href="/shop?cat=Personal%20Care"
            className="group p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-savera-cream/80 border border-savera-saffron/40 hover:bg-savera-cream hover:shadow-card transition duration-300 text-center space-y-2"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-700 text-emerald-100 flex items-center justify-center mx-auto group-hover:scale-110 transition">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-savera-dark">Personal Care</h3>
            <p className="text-[10px] sm:text-[11px] text-savera-brown/80 line-clamp-2">Face Packs, Ubtan, Soaps & Gulab Jal</p>
          </Link>

          <Link
            href="/shop?cat=Traditional%20Staples"
            className="group p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-savera-cream/80 border border-savera-saffron/40 hover:bg-savera-cream hover:shadow-card transition duration-300 text-center space-y-2"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-800 text-amber-200 flex items-center justify-center mx-auto group-hover:scale-110 transition">
              <Sun className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-savera-dark">Traditional Staples</h3>
            <p className="text-[10px] sm:text-[11px] text-savera-brown/80 line-clamp-2">Gud Chana, Desi Khand & Mukhwas</p>
          </Link>

          <Link
            href="/shop?cat=Milk"
            className="group p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-savera-cream/80 border border-savera-saffron/40 hover:bg-savera-cream hover:shadow-card transition duration-300 text-center space-y-2"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-savera-dark text-savera-saffron flex items-center justify-center mx-auto group-hover:scale-110 transition">
              <Milk className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-savera-dark">A2 Desi Cow Milk</h3>
            <p className="text-[10px] sm:text-[11px] text-savera-brown/80 line-clamp-2">Gir & Sahiwal fresh chilled milk</p>
          </Link>

          <Link
            href="/shop?cat=Ghee"
            className="group p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-savera-cream/80 border border-savera-saffron/40 hover:bg-savera-cream hover:shadow-card transition duration-300 text-center space-y-2"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-savera-brown text-savera-saffron flex items-center justify-center mx-auto group-hover:scale-110 transition">
              <Flame className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-savera-dark">Vedic Bilona Ghee</h3>
            <p className="text-[10px] sm:text-[11px] text-savera-brown/80 line-clamp-2">Hand-churned from curd</p>
          </Link>

          <Link
            href="/shop?cat=Oils"
            className="group p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-savera-cream/80 border border-savera-saffron/40 hover:bg-savera-cream hover:shadow-card transition duration-300 text-center space-y-2"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-700 text-amber-200 flex items-center justify-center mx-auto group-hover:scale-110 transition">
              <Droplets className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-savera-dark">Cold Pressed Oils</h3>
            <p className="text-[10px] sm:text-[11px] text-savera-brown/80 line-clamp-2">Mustard & Virgin Coconut oils</p>
          </Link>
        </div>
      </section>

      {/* BEST SELLERS PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-savera-green uppercase">
              Customer Favorites
            </span>
            <h2 className="font-serif text-3xl font-bold text-savera-dark">Best Selling Farm Products</h2>
          </div>
          <Link href="/shop" className="text-xs font-bold text-savera-green hover:underline">
            View Full Catalog
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSubscribe={(prod, vId) => setSelectedSubProduct({ product: prod, variantId: vId })}
            />
          ))}
        </div>
      </section>

      {/* MILK SUBSCRIPTION HIGHLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-savera-dark text-savera-cream rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-floating">
          <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-12 translate-y-12">
            <Milk className="w-96 h-96 text-savera-saffron" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-savera-saffron text-savera-brown px-3 py-1 rounded-full text-xs font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Smart Recurring Milk Delivery</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-white">
              Never Run Out of Morning Milk. Pause or Skip Anytime.
            </h2>

            <p className="text-sm sm:text-base text-savera-cream/80 leading-relaxed">
              Subscribe to daily A2 Desi Cow Milk deliveries in glass bottles. Modify quantity per day, pause while travelling, or change delivery slots in 1-click.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {milkProduct && (
                <button
                  onClick={() =>
                    setSelectedSubProduct({
                      product: milkProduct,
                      variantId: milkProduct.variants[0].id,
                    })
                  }
                  className="bg-savera-saffron hover:bg-white text-savera-brown font-bold px-8 py-4 rounded-2xl text-xs sm:text-sm transition shadow-md"
                >
                  Start Milk Subscription
                </button>
              )}

              <Link
                href="/subscriptions"
                className="border border-savera-cream/30 hover:bg-savera-green/40 text-savera-cream font-bold px-6 py-4 rounded-2xl text-xs sm:text-sm transition"
              >
                Learn How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — 4 STEP PIPELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold tracking-widest text-savera-green uppercase">
            From Farm to Family
          </span>
          <h2 className="font-serif text-3xl font-bold text-savera-dark">How Savera Milk Delivery Works</h2>
          <p className="text-xs text-savera-brown/80">Uncompromising purity and traditional care at every step.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <div className="bg-white p-6 rounded-3xl border border-savera-dark/10 shadow-soft text-center space-y-3 relative">
            <span className="text-4xl font-serif font-bold text-savera-saffron/40 block">01</span>
            <h3 className="font-serif text-lg font-bold text-savera-dark">We Care for Our Cows</h3>
            <p className="text-xs text-savera-brown/80 leading-relaxed">
              Our Gir & Sahiwal cows graze freely on organic green fodder, loved like family members.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-savera-dark/10 shadow-soft text-center space-y-3 relative">
            <span className="text-4xl font-serif font-bold text-savera-saffron/40 block">02</span>
            <h3 className="font-serif text-lg font-bold text-savera-dark">Fresh Milk Collected</h3>
            <p className="text-xs text-savera-brown/80 leading-relaxed">
              Zero-touch milking directly into inline chillers at 4°C to retain raw microbial goodness.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-savera-dark/10 shadow-soft text-center space-y-3 relative">
            <span className="text-4xl font-serif font-bold text-savera-saffron/40 block">03</span>
            <h3 className="font-serif text-lg font-bold text-savera-dark">Quality Checked & Packed</h3>
            <p className="text-xs text-savera-brown/80 leading-relaxed">
              Tested for purity, fat, and adulterants. Sealed in eco-friendly sanitized glass bottles.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-savera-dark/10 shadow-soft text-center space-y-3 relative">
            <span className="text-4xl font-serif font-bold text-savera-saffron/40 block">04</span>
            <h3 className="font-serif text-lg font-bold text-savera-dark">Delivered to Your Door</h3>
            <p className="text-xs text-savera-brown/80 leading-relaxed">
              Dispatched in cold-chain vehicles for 5:00 AM to 7:00 AM doorstep delivery.
            </p>
          </div>
        </div>
      </section>

      {/* WHY SAVERA FARMS — BRAND STORY */}
      <section className="bg-savera-cream/50 py-16 border-y border-savera-saffron/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-card border-4 border-white">
              <Image
                src="/images/gir-cows-grazing.png"
                alt="Savera Farms Desi Cows"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-6">
              <span className="text-xs font-bold tracking-widest text-savera-green uppercase">
                Our Promise & Vision
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-savera-dark leading-tight">
                Restoring Pure Traditional Dairy to Indian Households
              </h2>
              <p className="text-xs sm:text-sm text-savera-brown/90 leading-relaxed">
                At Savera Farms, we believe that real nourishment comes from respecting nature. We do not use chemical hormones, high-heat processing, or synthetic preservatives. Every bottle of A2 milk and jar of Bilona ghee represents our dedication to traditional Indian farm practices.
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-savera-dark pt-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-savera-green" />
                  <span>100% Desi Breed A2 Protein</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-savera-green" />
                  <span>Ethical Cow Care & Calves First</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-savera-green" />
                  <span>Vedic Bilona Churning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-savera-green" />
                  <span>Insulated Cold-Chain Logistics</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/farm-story"
                  className="inline-flex items-center gap-2 text-xs font-bold text-savera-dark hover:text-savera-green underline"
                >
                  <span>Read our complete Farm Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VERIFIED REVIEWS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="flex items-center justify-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-500" />
            ))}
          </div>
          <h2 className="font-serif text-3xl font-bold text-savera-dark">Trusted by 5,000+ Happy Families</h2>
          <p className="text-xs text-savera-brown/80">Real reviews from verified daily milk subscribers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-savera-dark/10 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-savera-dark text-base">Kavita Rastogi</h4>
                <span className="text-[10px] text-savera-green font-semibold">Panchkula (Sec 14) • Daily Subscriber (1L)</span>
              </div>
              <span className="bg-savera-paleGreen text-savera-green text-[10px] font-bold px-2.5 py-1 rounded-full">
                Verified Purchase
              </span>
            </div>
            <p className="text-xs text-savera-brown/90 leading-relaxed italic">
              “The thick natural cream layer on top after boiling reminds me of our ancestral home in Haryana. Very gentle on my kids’ digestion. The delivery boys arrive quietly before 6:30 AM every morning!”
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-savera-dark/10 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-savera-dark text-base">Amitabh Sen</h4>
                <span className="text-[10px] text-savera-green font-semibold">Chandigarh (Sec 18) • Ghee Customer</span>
              </div>
              <span className="bg-savera-paleGreen text-savera-green text-[10px] font-bold px-2.5 py-1 rounded-full">
                Verified Purchase
              </span>
            </div>
            <p className="text-xs text-savera-brown/90 leading-relaxed italic">
              “Splendid aroma and grainy texture in the A2 Bilona Ghee. You can instantly tell it is made from cultured curd butter and not raw cream. Made our festival sweets taste heavenly!”
            </p>
          </div>
        </div>
      </section>

      {/* MILK SUBSCRIPTION MODAL POPUP */}
      {selectedSubProduct && (
        <SubscribeModal
          product={selectedSubProduct.product}
          initialVariantId={selectedSubProduct.variantId}
          onClose={() => setSelectedSubProduct(null)}
        />
      )}
    </div>
  );
}

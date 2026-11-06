'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, HeartHandshake, Award, Truck, Milk, Flame, CheckCircle2, ArrowRight } from 'lucide-react';

export default function FarmStoryPage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Header */}
      <section className="bg-savera-dark text-savera-cream py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto shadow-floating text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="text-xs font-bold text-savera-saffron uppercase tracking-widest">
            From Our Farm to Your Family
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
            The Savera Farms Story
          </h1>
          <p className="text-sm sm:text-base text-savera-cream/80 leading-relaxed">
            Honoring traditional Indian dairy wisdom. Pure A2 milk from free-grazing Gir & Sahiwal cows, packaged with modern cold-chain integrity.
          </p>
        </div>
      </section>

      {/* Chapter 1: Desi Breed Cows */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-card border-4 border-white">
            <Image
              src="/images/gir-cows-grazing.png"
              alt="Desi Gir Cow at Savera Farms"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-4">
            <span className="text-xs font-bold text-savera-green uppercase tracking-wider">Chapter 01</span>
            <h2 className="font-serif text-3xl font-bold text-savera-dark">Our Indigenous Desi Cow Breeds</h2>
            <p className="text-xs sm:text-sm text-savera-brown/90 leading-relaxed">
              We exclusively rear native Indian cow breeds — primarily **Gir** (from Gujarat) and **Sahiwal** (from Punjab/Haryana). Unlike crossbred cows, indigenous Desi cows possess a natural hump (Suryaketu Nadi) and produce 100% pure A2 beta-casein protein milk, which is exceptionally gentle on human digestion.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-savera-dark">
                <CheckCircle2 className="w-4 h-4 text-savera-green" />
                <span>Free-range grazing on organic green fodder</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-savera-dark">
                <CheckCircle2 className="w-4 h-4 text-savera-green" />
                <span>Zero synthetic oxytocin injections or antibiotics</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-savera-dark">
                <CheckCircle2 className="w-4 h-4 text-savera-green" />
                <span>Ahinsa Milking: Calves are nourished first</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 2: The Vedic Bilona Method */}
      <section className="bg-savera-cream/50 py-16 border-y border-savera-saffron/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 order-2 lg:order-1">
              <span className="text-xs font-bold text-savera-green uppercase tracking-wider">Chapter 02</span>
              <h2 className="font-serif text-3xl font-bold text-savera-dark">The Art of Bilona Churning</h2>
              <p className="text-xs sm:text-sm text-savera-brown/90 leading-relaxed">
                Commercial ghee is mass-produced by rapidly heating raw industrial cream. At Savera Farms, we preserve the 5-step Vedic Bilona process: boiling pure A2 milk, culturing it into dahi (curd), hand-churning the dahi bi-directionally with a wooden bilona to isolate fresh Makkhan, and slow simmering over low fire in brass vessels.
              </p>
              <div className="p-4 bg-white rounded-2xl border border-savera-dark/10 text-xs font-semibold text-savera-dark">
                ✨ Result: A golden, highly aromatic, granular ghee high in butyric acid and digestive enzymes.
              </div>
            </div>
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-card border-4 border-white order-1 lg:order-2">
              <Image
                src="/images/bilona-churning-process.png"
                alt="Traditional Bilona Ghee Preparation"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 text-center py-8">
        <div className="bg-savera-dark text-savera-cream rounded-3xl p-10 max-w-3xl mx-auto space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">Experience Pure Farm Goodness Today</h2>
          <p className="text-xs text-savera-cream/80">Delivered fresh in chilled glass bottles every morning.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-savera-saffron hover:bg-white text-savera-brown font-bold px-8 py-3.5 rounded-2xl text-xs transition"
          >
            <span>Explore Savera Store</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

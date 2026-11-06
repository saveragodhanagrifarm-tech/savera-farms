'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-savera-green uppercase tracking-widest">About Savera Farms</span>
        <h1 className="font-serif text-4xl font-bold text-savera-dark">Our Mission & Values</h1>
        <p className="text-xs text-savera-brown max-w-xl mx-auto">
          Authentic, warm, trustworthy, and family-oriented farm-to-home platform.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-savera-dark/10 shadow-soft space-y-6 text-xs text-savera-brown leading-relaxed">
        <h2 className="font-serif text-xl font-bold text-savera-dark">Our Mission</h2>
        <p>
          At Savera Farms, our mission is to eliminate industrial adulteration from daily household dairy by providing 100% pure A2 Desi Cow Milk, hand-churned Bilona Ghee, and cold-pressed oils straight from our organic estate to your doorstep every morning.
        </p>

        <h2 className="font-serif text-xl font-bold text-savera-dark">Our Vision</h2>
        <p>
          To build India’s most trusted farm-to-home ecosystem that empowers native cow breeds, promotes sustainable agriculture, and nourishes millions of families with pure traditional food.
        </p>

        <h2 className="font-serif text-xl font-bold text-savera-dark">Our Core Values</h2>
        <ul className="list-disc pl-5 space-y-2 text-savera-dark font-medium">
          <li><strong>Purity Without Compromise:</strong> Zero chemicals, zero oxytocin, zero synthetic preservatives.</li>
          <li><strong>Ethical Animal Care:</strong> Calves receive milk first. Free-grazing environments.</li>
          <li><strong>Complete Transparency:</strong> Daily lab testing and open farm tours.</li>
          <li><strong>Customer Convenience:</strong> Seamless recurring morning delivery subscription model.</li>
        </ul>
      </div>
    </div>
  );
}

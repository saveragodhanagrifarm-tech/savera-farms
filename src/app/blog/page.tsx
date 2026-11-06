'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SEED_BLOGS } from '@/lib/db';

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-savera-green uppercase tracking-widest">Farm Stories & Dairy Guides</span>
        <h1 className="font-serif text-4xl font-bold text-savera-dark">Savera Farms Journal</h1>
        <p className="text-xs text-savera-brown max-w-xl mx-auto">
          Articles on A2 milk nutrition, Vedic ghee craftsmanship, and traditional wellness.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SEED_BLOGS.map((post) => (
          <div key={post.id} className="bg-white rounded-3xl overflow-hidden border border-savera-dark/10 shadow-soft flex flex-col">
            <div className="relative h-60 w-full">
              <Image src={post.image} alt={post.title} fill className="object-cover" />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex justify-between items-center text-[10px] font-bold text-savera-green uppercase mb-1">
                  <span>{post.category}</span>
                  <span className="text-gray-400">{post.readTime}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-savera-dark leading-snug">{post.title}</h3>
                <p className="text-xs text-savera-brown/90 mt-2 line-clamp-3 leading-relaxed">{post.excerpt}</p>
              </div>
              <div className="pt-2 flex justify-between items-center text-xs border-t border-savera-dark/10">
                <span className="text-gray-500 font-medium">By {post.author}</span>
                <span className="text-savera-green font-bold">{post.publishDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

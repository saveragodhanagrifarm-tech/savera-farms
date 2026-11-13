'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Sparkles,
  Milk,
  ChevronRight,
  ArrowRight,
  Flame,
  CheckCircle2,
  Calendar,
  User,
  Clock
} from 'lucide-react';
import { SEED_BLOGS } from '@/lib/db';
import { AYURVEDIC_RECIPES } from '@/lib/recipes';
import RecipeCard from '@/components/blog/RecipeCard';

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'recipes' | 'articles'>('all');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const displayedRecipes = activeTab === 'articles' ? [] : AYURVEDIC_RECIPES;
  const displayedArticles = activeTab === 'recipes' ? [] : SEED_BLOGS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-savera-green uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>Ayurvedic Wisdom & Dairy Kitchen</span>
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-savera-dark leading-tight">
          Savera Journal & Recipes
        </h1>
        <p className="text-xs sm:text-sm text-savera-brown max-w-xl mx-auto leading-relaxed">
          Step-by-step Ayurvedic recipe cards, ancient dairy craftsmanship guides, and scientific nutrition from our organic estate.
        </p>

        {/* Tab Filter Pills */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-savera-dark text-savera-saffron shadow-sm'
                : 'bg-savera-cream/70 text-savera-brown hover:bg-savera-cream border border-savera-saffron/30'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>All Guides ({AYURVEDIC_RECIPES.length + SEED_BLOGS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('recipes')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'recipes'
                ? 'bg-savera-green text-white shadow-sm'
                : 'bg-savera-cream/70 text-savera-brown hover:bg-savera-cream border border-savera-saffron/30'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>🍲 Ayurvedic Recipes ({AYURVEDIC_RECIPES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'articles'
                ? 'bg-amber-800 text-white shadow-sm'
                : 'bg-savera-cream/70 text-savera-brown hover:bg-savera-cream border border-savera-saffron/30'
            }`}
          >
            <Milk className="w-3.5 h-3.5" />
            <span>🥛 Dairy Science ({SEED_BLOGS.length})</span>
          </button>
        </div>
      </div>

      {/* SECTION: INTERACTIVE AYURVEDIC RECIPE CARDS */}
      {displayedRecipes.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-savera-dark/10 pb-4">
            <div>
              <span className="text-xs font-bold text-savera-green uppercase tracking-wider">
                Kitchen Craft & Vedic Rituals
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-savera-dark">
                Interactive Recipe Cards
              </h2>
            </div>
            <span className="text-xs text-savera-brown font-semibold hidden sm:inline">
              Scale servings &amp; shop farm ingredients
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {displayedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}

      {/* SECTION: DAIRY SCIENCE & TRADITIONAL ARTICLES */}
      {displayedArticles.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex items-end justify-between border-b border-savera-dark/10 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Vedic Heritage & Scientific Nutrition
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-savera-dark">
                Farm Research & Heritage Articles
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedArticles.map((post) => {
              const isSelected = selectedArticleId === post.id;

              return (
                <div
                  key={post.id}
                  className="bg-white rounded-3xl overflow-hidden border border-savera-dark/10 shadow-soft flex flex-col hover:shadow-card transition"
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/95 backdrop-blur-sm text-savera-green text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs text-savera-brown/70">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{post.publishDate}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{post.readTime}</span>
                        </span>
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-savera-dark leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-xs text-savera-brown/90 leading-relaxed">
                        {post.excerpt}
                      </p>

                      {isSelected && (
                        <div className="pt-4 border-t border-savera-dark/10 space-y-3 text-xs text-savera-brown/90 leading-relaxed animate-fade-in whitespace-pre-line">
                          {post.content}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-savera-dark/10">
                      <div className="flex items-center gap-2 text-xs text-savera-dark font-medium">
                        <User className="w-3.5 h-3.5 text-savera-green" />
                        <span>{post.author}</span>
                      </div>

                      <button
                        onClick={() =>
                          setSelectedArticleId(isSelected ? null : post.id)
                        }
                        className="text-xs font-bold text-savera-green hover:underline flex items-center gap-1"
                      >
                        <span>{isSelected ? 'Collapse' : 'Read Full Guide'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* BOTTOM CTA BANNER: FRESH A2 MILK DOORSTEP DELIVERY */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-savera-dark via-emerald-950 to-savera-dark text-white p-8 sm:p-12 shadow-card border-4 border-white">
        <div className="max-w-2xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-savera-saffron flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-savera-green" />
            <span>Farm Fresh Chilled Mornings • Tricity</span>
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
            Bring Pure Desi Cow Nutrition to Your Family
          </h2>
          <p className="text-xs sm:text-sm text-savera-cream/80 leading-relaxed">
            Order before 8:00 PM for guaranteed 5:00 AM – 7:00 AM chilled doorstep delivery across Panchkula, Chandigarh, and Mohali. Glass bottles, zero oxytocin, 100% natural.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/subscriptions"
              className="px-6 py-3 rounded-2xl bg-savera-green hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <span>Subscribe to Daily Milk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop"
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center gap-2"
            >
              <span>Explore All Farm Products</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

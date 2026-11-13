'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Clock,
  Flame,
  Users,
  CheckCircle2,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Share2,
  Printer,
  Sparkles,
  Info,
  Check,
  Heart
} from 'lucide-react';
import { RecipeItem } from '@/lib/recipes';
import { useApp } from '@/context/AppContext';

interface RecipeCardProps {
  recipe: RecipeItem;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { products, addToCart, addToast } = useApp();
  const [servingsMultiplier, setServingsMultiplier] = useState<number>(1);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const toggleStep = (stepNumber: number) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };

  const handleAddIngredientToCart = (productId: string, productName: string) => {
    const product = products.find((p) => p.id === productId);
    if (product && product.variants && product.variants.length > 0) {
      addToCart(product, product.variants[0].id, 1);
      addToast('Added to Cart', `${productName} added to your farm cart!`, 'success');
    } else {
      addToast('Product in Cart', `${productName} added to your cart.`, 'info');
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out this authentic Ayurvedic recipe: *${recipe.title}* from Savera Farms! 🌿\n\nhttps://savera-farms.pages.dev/blog/#${recipe.slug}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id={recipe.slug}
      className="bg-white rounded-3xl border border-savera-dark/10 shadow-soft overflow-hidden transition-all duration-300 hover:shadow-card flex flex-col"
    >
      {/* Hero Media Container */}
      <div className="relative h-72 sm:h-80 w-full group overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover group-hover:scale-105 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-savera-dark/85 via-savera-dark/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span className="bg-savera-green text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{recipe.category}</span>
          </span>
          <span className="bg-white/95 backdrop-blur-sm text-savera-dark text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
            {recipe.readTime}
          </span>
        </div>

        {/* Floating Bottom Card Over Media */}
        <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
          <div className="flex items-center gap-3 text-[11px] font-semibold text-savera-saffron">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Prep: {recipe.prepTime}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Cook: {recipe.cookTime}</span>
            </span>
            <span>•</span>
            <span className="bg-savera-cream/20 text-savera-cream border border-savera-cream/30 px-2 py-0.5 rounded-full text-[10px]">
              {recipe.difficulty}
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold leading-snug drop-shadow-sm">
            {recipe.title}
          </h2>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-7 flex-1 flex flex-col space-y-6">
        {/* Subtitle & Ayurvedic Summary */}
        <div className="space-y-2">
          <p className="text-xs sm:text-sm font-medium text-savera-green italic">
            &ldquo;{recipe.subtitle}&rdquo;
          </p>
          <p className="text-xs text-savera-brown/90 leading-relaxed">
            {recipe.summary}
          </p>
        </div>

        {/* Ayurvedic Dosha Balance Panel */}
        <div className="bg-savera-cream/60 rounded-2xl p-3.5 border border-savera-saffron/30 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-savera-dark">
            <span className="uppercase tracking-wider text-savera-green flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-savera-green" />
              <span>Ayurvedic Tridosha Profile</span>
            </span>
            <span className="text-savera-brown text-[10px] bg-white px-2 py-0.5 rounded-full border border-savera-saffron/30">
              Optimal: {recipe.dosha.bestTime}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="bg-white p-2 rounded-xl border border-savera-dark/5">
              <span className="block font-bold text-savera-dark">Vata</span>
              <span className="text-[10px] font-semibold text-emerald-700">
                {recipe.dosha.vata}
              </span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-savera-dark/5">
              <span className="block font-bold text-savera-dark">Pitta</span>
              <span className="text-[10px] font-semibold text-amber-700">
                {recipe.dosha.pitta}
              </span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-savera-dark/5">
              <span className="block font-bold text-savera-dark">Kapha</span>
              <span className="text-[10px] font-semibold text-emerald-700">
                {recipe.dosha.kapha}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Servings Bar */}
        <div className="flex items-center justify-between border-y border-savera-dark/10 py-3">
          <div className="flex items-center gap-2 text-xs font-bold text-savera-dark">
            <Users className="w-4 h-4 text-savera-green" />
            <span>Scale Servings:</span>
          </div>
          <div className="flex items-center gap-1 bg-savera-cream/70 p-1 rounded-xl border border-savera-saffron/30">
            {[1, 2, 4].map((mult) => (
              <button
                key={mult}
                onClick={() => setServingsMultiplier(mult)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  servingsMultiplier === mult
                    ? 'bg-savera-green text-white shadow-sm'
                    : 'text-savera-brown hover:bg-white/80'
                }`}
              >
                {mult * recipe.baseServings}{' '}
                {mult * recipe.baseServings === 1 ? 'Serving' : 'Servings'}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Ingredients Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-savera-dark flex items-center gap-2">
              <span>Ingredients</span>
              <span className="text-xs font-sans text-savera-brown font-normal">
                (Click to check off)
              </span>
            </h3>
            <span className="text-[11px] font-bold text-savera-green">
              {Object.values(checkedIngredients).filter(Boolean).length}/
              {recipe.ingredients.length} Ready
            </span>
          </div>

          <div className="space-y-2">
            {recipe.ingredients.map((ing, idx) => {
              const scaledAmount = Number((ing.amount * servingsMultiplier).toFixed(2));
              const isChecked = !!checkedIngredients[idx];

              return (
                <div
                  key={idx}
                  onClick={() => toggleIngredient(idx)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isChecked
                      ? 'bg-emerald-50/50 border-emerald-200 opacity-60'
                      : 'bg-white border-savera-dark/10 hover:border-savera-green/50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 transition ${
                      isChecked
                        ? 'bg-savera-green border-savera-green text-white'
                        : 'border-savera-dark/30 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`font-bold text-savera-dark ${
                          isChecked ? 'line-through text-gray-400' : ''
                        }`}
                      >
                        {scaledAmount} {ing.unit} — {ing.name}
                      </span>
                    </div>
                    {ing.notes && (
                      <p className="text-[10px] text-savera-brown/80 mt-0.5">
                        {ing.notes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Savera Farm Ingredients Buy Box */}
        {recipe.ingredients.some((ing) => ing.saveraProductId) && (
          <div className="bg-gradient-to-br from-savera-cream via-amber-50/50 to-white p-4 rounded-2xl border border-savera-saffron/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-savera-green uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Cook with Pure Farm Ingredients</span>
              </span>
              <span className="text-[10px] font-bold text-savera-brown bg-white px-2 py-0.5 rounded-full border border-savera-saffron/30">
                Fresh Farm Dispatch
              </span>
            </div>

            <div className="space-y-2">
              {recipe.ingredients
                .filter((ing) => ing.saveraProductId)
                .map((farmIng, fIdx) => (
                  <div
                    key={fIdx}
                    className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-savera-dark/10 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      {farmIng.saveraProductImage && (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-savera-cream shrink-0 border border-savera-dark/5">
                          <Image
                            src={farmIng.saveraProductImage}
                            alt={farmIng.saveraProductName || farmIng.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-savera-dark line-clamp-1">
                          {farmIng.saveraProductName || farmIng.name}
                        </h4>
                        <span className="text-xs font-bold text-savera-green">
                          ₹{farmIng.saveraProductPrice}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        farmIng.saveraProductId &&
                        handleAddIngredientToCart(
                          farmIng.saveraProductId,
                          farmIng.saveraProductName || farmIng.name
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-savera-dark text-savera-saffron text-xs font-bold hover:bg-savera-green hover:text-white transition flex items-center gap-1.5 shrink-0"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Step-by-Step Interactive Cooking Method */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-savera-dark">
              Step-by-Step Vedic Method
            </h3>
            <span className="text-[11px] font-bold text-savera-green">
              {Object.values(checkedSteps).filter(Boolean).length}/
              {recipe.steps.length} Steps Done
            </span>
          </div>

          <div className="space-y-3">
            {recipe.steps.map((st) => {
              const isStepDone = !!checkedSteps[st.number];

              return (
                <div
                  key={st.number}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                    isStepDone
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-savera-dark/10 hover:border-savera-green/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleStep(st.number)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs transition ${
                        isStepDone
                          ? 'bg-savera-green text-white'
                          : 'bg-savera-cream text-savera-dark border border-savera-saffron/40 hover:bg-savera-green hover:text-white'
                      }`}
                    >
                      {isStepDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : st.number}
                    </button>

                    <div className="space-y-1 flex-1">
                      <h4
                        className={`text-xs font-bold text-savera-dark ${
                          isStepDone ? 'line-through text-gray-400' : ''
                        }`}
                      >
                        {st.title}
                      </h4>
                      <p className="text-xs text-savera-brown/90 leading-relaxed">
                        {st.description}
                      </p>

                      {st.proTip && (
                        <div className="mt-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-2 text-[11px] text-amber-900">
                          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Ayurvedic Pro Tip: </span>
                            <span>{st.proTip}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expandable Section: Ayurvedic Wisdom & FAQs */}
        {isExpanded && (
          <div className="space-y-5 pt-4 border-t border-savera-dark/10 animate-fade-in">
            {/* Ancient Rationale */}
            <div className="space-y-2">
              <h4 className="font-serif text-sm font-bold text-savera-dark flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-savera-green" />
                <span>Charaka Samhita Ayurvedic Rationale</span>
              </h4>
              <p className="text-xs text-savera-brown leading-relaxed bg-savera-cream/50 p-3.5 rounded-2xl border border-savera-saffron/30">
                {recipe.ayurvedicWisdom}
              </p>
            </div>

            {/* Health Benefits */}
            <div className="space-y-2">
              <h4 className="font-serif text-sm font-bold text-savera-dark">
                Key Wellness Benefits
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {recipe.healthBenefits.map((b, bIdx) => (
                  <div
                    key={bIdx}
                    className="flex items-center gap-2 p-2 bg-emerald-50/50 rounded-xl border border-emerald-100 text-emerald-900 text-[11px]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-savera-green shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs Accordion */}
            {recipe.faqs && recipe.faqs.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-savera-dark">
                  Frequently Asked Questions
                </h4>
                <div className="space-y-2">
                  {recipe.faqs.map((faq, fIdx) => (
                    <div
                      key={fIdx}
                      className="border border-savera-dark/10 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setActiveFaq(activeFaq === fIdx ? null : fIdx)
                        }
                        className="w-full p-3 text-left bg-savera-cream/30 hover:bg-savera-cream/60 flex items-center justify-between text-xs font-bold text-savera-dark transition"
                      >
                        <span>{faq.question}</span>
                        {activeFaq === fIdx ? (
                          <ChevronUp className="w-4 h-4 text-savera-green" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-savera-brown" />
                        )}
                      </button>
                      {activeFaq === fIdx && (
                        <div className="p-3 bg-white text-xs text-savera-brown/90 leading-relaxed border-t border-savera-dark/5">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-savera-dark/10 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-savera-green hover:underline flex items-center gap-1"
          >
            <span>
              {isExpanded
                ? 'Show Less'
                : 'Read Ayurvedic Rationale, Benefits & FAQs'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print Recipe Card"
              className="p-2 rounded-xl bg-savera-cream/80 hover:bg-savera-cream text-savera-dark border border-savera-saffron/40 transition"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleShareWhatsApp}
              title="Share on WhatsApp"
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <Share2 className="w-3 h-3" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

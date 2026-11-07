'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { SubscribeModal } from '@/components/shop/SubscribeModal';
import { ProductCard } from '@/components/shop/ProductCard';
import {
  Star,
  ShoppingBag,
  Calendar,
  ShieldCheck,
  Truck,
  Award,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle2,
  HelpCircle,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Check,
  X,
  MessageSquare,
} from 'lucide-react';

import { SEED_PRODUCTS } from '@/lib/db';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, addToCart, reviews, addReview } = useApp();

  const product =
    products.find((p) => p.id === id) ||
    SEED_PRODUCTS.find((p) => p.id === id) ||
    products[0] ||
    SEED_PRODUCTS[0];
  const [selectedVariantId, setSelectedVariantId] = useState(product?.variants[0]?.id || '');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showSubModal, setShowSubModal] = useState(false);
  const [subModalProduct, setSubModalProduct] = useState<typeof product | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'process' | 'reviews' | 'faq'>('details');
  const [justAdded, setJustAdded] = useState(false);

  // Reset state when navigating between products
  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedVariantId(product.variants[0].id);
      setActiveImageIndex(0);
      setQuantity(1);
    }
  }, [id, product?.id]);

  // Review Form Modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-savera-dark">Product Not Found</h2>
        <Link href="/shop" className="bg-savera-dark text-savera-cream px-6 py-2 rounded-xl text-xs font-bold">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id);

  // Customer reviews for this product
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant.id, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant.id, quantity);
    router.push('/checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewComment) return;
    addReview({
      productId: product.id,
      customerName: reviewerName,
      rating: reviewRating,
      title: reviewTitle || 'Farm Fresh Product Review',
      comment: reviewComment,
    });
    setShowReviewModal(false);
    setReviewerName('');
    setReviewTitle('');
    setReviewComment('');
    setActiveTab('reviews');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-savera-brown/70">
        <Link href="/" className="hover:text-savera-dark transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-savera-dark transition">Shop Catalog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-savera-green font-bold">{product.name}</span>
      </div>

      {/* Main Product Hero Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-savera-dark/10 shadow-soft">
        {/* Gallery Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative h-96 sm:h-[460px] w-full rounded-2xl overflow-hidden bg-savera-offwhite border border-savera-dark/10">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.fatPercentage && (
              <span className="absolute top-4 left-4 bg-savera-dark text-savera-saffron text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {product.fatPercentage} Natural Fat Content
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    activeImageIndex === idx ? 'border-savera-green shadow-sm' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Meta Column */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-savera-green bg-savera-paleGreen px-2.5 py-1 rounded-full uppercase tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full text-xs font-bold text-amber-700">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{product.rating}</span>
                <span className="text-gray-400 font-normal">
                  ({productReviews.length > 0 ? productReviews.length : product.reviewCount} reviews)
                </span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-savera-dark leading-tight">
              {product.name}
            </h1>

            <p className="text-sm text-savera-brown/90 mt-2 leading-relaxed">{product.tagline}</p>
          </div>

          {/* Pricing & Discounts */}
          <div className="bg-savera-cream/60 p-4 rounded-2xl border border-savera-saffron/30 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-savera-dark">₹{selectedVariant.price}</span>
                {selectedVariant.mrp > selectedVariant.price && (
                  <span className="text-sm text-gray-400 line-through">₹{selectedVariant.mrp}</span>
                )}
                {selectedVariant.discountPct > 0 && (
                  <span className="bg-savera-dark text-savera-saffron text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {selectedVariant.discountPct}% OFF
                  </span>
                )}
              </div>
              <span className="text-xs text-savera-brown font-semibold block mt-0.5">
                Inclusive of farm processing & sanitized cold-chain delivery
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-savera-green block">In Stock ({selectedVariant.stock} units)</span>
              <span className="text-[11px] text-gray-500">SKU: {selectedVariant.sku}</span>
            </div>
          </div>

          {/* Variant Selector */}
          <div>
            <label className="text-xs font-bold text-savera-dark uppercase tracking-wide block mb-2">
              Select Package Size:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition ${
                    selectedVariantId === v.id
                      ? 'bg-savera-dark text-savera-cream border-savera-dark shadow-sm'
                      : 'bg-savera-offwhite border-savera-dark/10 text-savera-dark hover:bg-savera-cream'
                  }`}
                >
                  {v.name}
                  <span className="block text-[10px] font-normal opacity-80">₹{v.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4">
              <div className="flex items-center justify-between sm:justify-start border border-savera-dark/20 rounded-xl bg-savera-offwhite px-3 py-2 shrink-0">
                <span className="sm:hidden text-xs font-bold text-savera-dark/80">Quantity:</span>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-savera-dark hover:text-savera-green"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-savera-dark">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-savera-dark hover:text-savera-green"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:flex-1 gap-2">
                <button
                  onClick={handleAddToCart}
                  className={`w-full border py-3.5 px-3 sm:px-6 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 shadow-sm ${
                    justAdded
                      ? 'bg-savera-green text-white border-savera-green'
                      : 'bg-savera-cream hover:bg-savera-paleGreen border-savera-saffronDark/40 text-savera-dark'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-savera-dark" />
                      <span className="truncate">Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-savera-dark hover:bg-savera-green text-white font-bold py-3.5 px-3 sm:px-6 rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-floating"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {product.isSubscriptionEligible && (
              <button
                onClick={() => {
                  setSubModalProduct(product);
                  setShowSubModal(true);
                }}
                className="w-full bg-savera-saffron hover:bg-savera-saffronDark text-savera-brown font-bold py-3.5 px-4 rounded-2xl text-xs sm:text-sm transition shadow-soft flex items-center justify-center gap-2 text-center"
              >
                <Calendar className="w-4 h-4 text-savera-dark shrink-0" />
                <span className="line-clamp-1">Subscribe & Save (Morning Delivery Before 7 AM)</span>
              </button>
            )}
          </div>

          {/* Quick Product Specs Bar */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs bg-savera-offwhite p-4 rounded-2xl border border-savera-dark/10">
            <div>
              <span className="text-[10px] uppercase font-bold text-savera-brown/70 block">Shelf Life</span>
              <span className="font-bold text-savera-dark">{product.shelfLife}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-savera-brown/70 block">Storage</span>
              <span className="font-bold text-savera-dark">{product.storageInstructions}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-savera-brown/70 block">Origin</span>
              <span className="font-bold text-savera-dark">{product.origin}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-savera-brown/70 block">Bottling</span>
              <span className="font-bold text-savera-dark">Sanitized Cold Glass Bottles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Content Tabs Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-savera-dark/10 shadow-soft">
        <div className="flex border-b border-savera-dark/10 gap-6 overflow-x-auto mb-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-xs sm:text-sm font-bold transition shrink-0 border-b-2 ${
              activeTab === 'details'
                ? 'border-savera-green text-savera-green'
                : 'border-transparent text-gray-500 hover:text-savera-dark'
            }`}
          >
            Product Overview & Benefits
          </button>
          <button
            onClick={() => setActiveTab('process')}
            className={`pb-3 text-xs sm:text-sm font-bold transition shrink-0 border-b-2 ${
              activeTab === 'process'
                ? 'border-savera-green text-savera-green'
                : 'border-transparent text-gray-500 hover:text-savera-dark'
            }`}
          >
            How It Is Made
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs sm:text-sm font-bold transition shrink-0 border-b-2 ${
              activeTab === 'reviews'
                ? 'border-savera-green text-savera-green'
                : 'border-transparent text-gray-500 hover:text-savera-dark'
            }`}
          >
            Customer Reviews ({productReviews.length > 0 ? productReviews.length : product.reviewCount})
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`pb-3 text-xs sm:text-sm font-bold transition shrink-0 border-b-2 ${
              activeTab === 'faq'
                ? 'border-savera-green text-savera-green'
                : 'border-transparent text-gray-500 hover:text-savera-dark'
            }`}
          >
            Product FAQs
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-savera-dark">Product Description</h3>
              <p className="text-xs sm:text-sm text-savera-brown/90 leading-relaxed">{product.description}</p>

              <h4 className="font-serif font-bold text-savera-dark text-sm pt-2">Key Health Benefits</h4>
              <ul className="space-y-2">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-savera-brown">
                    <CheckCircle2 className="w-4 h-4 text-savera-green shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 bg-savera-cream/50 p-6 rounded-2xl border border-savera-saffron/30">
              <h3 className="font-serif text-lg font-bold text-savera-dark">Nutritional Profile</h3>
              <div className="space-y-2 text-xs divide-y divide-savera-saffron/20">
                {product.nutritionalInfo.map((n, i) => (
                  <div key={i} className="flex justify-between py-1.5 font-medium">
                    <span className="text-savera-brown">{n.label}</span>
                    <span className="font-bold text-savera-dark">{n.value}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-savera-saffron/30">
                <span className="text-xs font-bold text-savera-dark block">Ingredients:</span>
                <p className="text-xs text-savera-brown mt-0.5">{product.ingredients.join(', ')}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'process' && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-savera-dark">Traditional Farm Process</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.howItIsMade.map((step, idx) => (
                <div key={idx} className="bg-savera-offwhite p-5 rounded-2xl border border-savera-dark/10 space-y-2">
                  <span className="text-xs font-bold text-savera-green bg-savera-paleGreen px-2 py-0.5 rounded-md inline-block">
                    Step 0{idx + 1}
                  </span>
                  <p className="text-xs text-savera-dark font-medium leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif text-xl font-bold text-savera-dark">Verified Customer Feedback</h3>
                <p className="text-xs text-savera-brown">Real testimonials from verified subscribers</p>
              </div>
              <button
                onClick={() => setShowReviewModal(true)}
                className="bg-savera-dark hover:bg-savera-green text-savera-cream text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-savera-saffron" />
                <span>Write a Review</span>
              </button>
            </div>

            <div className="space-y-4">
              {productReviews.length === 0 ? (
                <div className="p-8 text-center bg-savera-offwhite rounded-2xl">
                  <p className="text-xs text-savera-brown">Be the first to write a review for {product.name}!</p>
                </div>
              ) : (
                productReviews.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-2xl bg-savera-offwhite border border-savera-dark/10 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-savera-dark">{rev.customerName}</span>
                          {rev.isVerified && (
                            <span className="bg-savera-paleGreen text-savera-green text-[10px] font-bold px-2 py-0.2 rounded-full">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <h5 className="font-serif font-bold text-xs text-savera-dark mt-0.5">{rev.title}</h5>
                      </div>
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-savera-brown italic leading-relaxed">"{rev.comment}"</p>
                    <span className="text-[10px] text-gray-400 block">{rev.date}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-savera-dark">Frequently Asked Questions</h3>
            {product.faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-savera-offwhite border border-savera-dark/10 space-y-1">
                <h4 className="text-xs font-bold text-savera-dark flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-savera-green shrink-0" />
                  <span>{faq.question}</span>
                </h4>
                <p className="text-xs text-savera-brown pl-6">{faq.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-savera-dark">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSubscribe={(prod, vId) => {
                  setSubModalProduct(prod);
                  setShowSubModal(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-floating border border-savera-dark/10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-lg font-bold text-savera-dark">Write a Review</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-savera-dark block mb-1">Your Rating:</label>
                <div className="flex gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-savera-dark block mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Chandra"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-savera-dark block mb-1">Review Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Best fresh A2 milk in Gurugram!"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-savera-dark block mb-1">Detailed Feedback</label>
                <textarea
                  rows={3}
                  placeholder="Share details about taste, delivery, digestibility..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-savera-dark text-savera-cream font-bold py-3 rounded-xl text-xs hover:bg-savera-green transition shadow-md"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      {showSubModal && subModalProduct && (
        <SubscribeModal
          product={subModalProduct}
          initialVariantId={selectedVariant.id}
          onClose={() => {
            setShowSubModal(false);
            setSubModalProduct(null);
          }}
        />
      )}
    </div>
  );
}

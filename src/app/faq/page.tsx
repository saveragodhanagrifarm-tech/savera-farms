'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Milk & Digestibility',
      q: 'What is A2 Desi Cow Milk and why is it superior?',
      a: 'A2 milk comes exclusively from indigenous Indian cow breeds like Gir and Sahiwal that naturally produce 100% A2 beta-casein protein, making it easily digestible and gentle on the stomach compared to A1 milk from crossbred cows.'
    },
    {
      category: 'Delivery & Timing',
      q: 'When will my milk be delivered?',
      a: 'Milk is delivered every morning between 5:00 AM and 7:00 AM in insulated cold-chain glass bottles directly to your doorstep.'
    },
    {
      category: 'Subscription Controls',
      q: 'Can I pause my milk subscription when I travel?',
      a: 'Yes! You can pause your subscription or skip specific dates in 1-click through your Customer Subscriptions Dashboard.'
    },
    {
      category: 'Bilona Ghee',
      q: 'How is Savera Bilona Ghee made?',
      a: 'We follow the traditional 5-step Vedic method: boiling pure A2 milk, culturing into dahi, hand-churning dahi with a wooden bilona to isolate makkhan, and slow simmering over low flame.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-savera-green uppercase tracking-widest">Help & Support</span>
        <h1 className="font-serif text-4xl font-bold text-savera-dark">Frequently Asked Questions</h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-savera-dark/10 shadow-soft overflow-hidden transition"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-savera-cream/40 transition"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-savera-green bg-savera-paleGreen px-2 py-0.5 rounded-md mb-1 inline-block">
                    {faq.category}
                  </span>
                  <h3 className="font-serif font-bold text-savera-dark text-base">{faq.q}</h3>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-savera-green shrink-0" /> : <ChevronDown className="w-5 h-5 text-savera-brown shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-6 pb-6 text-xs text-savera-brown leading-relaxed border-t border-savera-dark/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PRICING_FEATURES, FAQ_ITEMS } from "@/lib/constants";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-cream-200 last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left group"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-slate-blue group-hover:text-forest-green transition-colors pr-4">
          {question}
        </span>
        <svg
          className={`w-5 h-5 text-slate-blue-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-5 animate-fade-in">
          <p className="text-slate-blue-500 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="pt-24 sm:pt-32">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-cream to-white">
        <div className="container-narrow text-center">
          <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-slate-blue mb-6">
            One Plan. <span className="text-forest-green">Everything Included.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-blue-500 max-w-2xl mx-auto">
            No tiers to compare, no hidden fees, no token anxiety. Just $30/month
            for a complete online presence.
          </p>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="section-padding bg-white -mt-8">
        <div className="container-narrow">
          <div className="max-w-2xl mx-auto">
            <div className="card border-2 border-forest-green p-8 sm:p-12">
              <div className="text-center mb-10">
                <h2 className="font-serif font-bold text-2xl text-slate-blue mb-4">
                  Professional Plan
                </h2>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-6xl sm:text-7xl font-bold text-forest-green">$30</span>
                  <span className="text-xl text-slate-blue-400">/month</span>
                </div>
                <p className="text-slate-blue-400">
                  Month-to-month. Cancel anytime. No setup fees.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {PRICING_FEATURES.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-forest-green flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-blue-600 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button variant="primary" size="lg" href="/contact" className="w-full">
                Start Building Today
              </Button>
            </div>
          </div>

          {/* Value comparison */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            <div className="text-center p-6 rounded-xl bg-cream">
              <div className="text-sm text-slate-blue-400 mb-2">Custom Web Agency</div>
              <div className="text-2xl font-bold text-slate-blue line-through decoration-red-400">$3,000-5,000</div>
              <div className="text-xs text-slate-blue-400 mt-1">One-time + maintenance fees</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-cream">
              <div className="text-sm text-slate-blue-400 mb-2">Thryv Website Bundle</div>
              <div className="text-2xl font-bold text-slate-blue line-through decoration-red-400">$199-499/mo</div>
              <div className="text-xs text-slate-blue-400 mt-1">6-month lock-in contract</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-forest-green/5 border-2 border-forest-green/20">
              <div className="text-sm text-forest-green font-medium mb-2">RapidBooth</div>
              <div className="text-2xl font-bold text-forest-green">$30/mo</div>
              <div className="text-xs text-forest-green-600 mt-1">No contract, full ownership</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-cream">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-slate-blue mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-cream-200 p-6 sm:p-8">
            {FAQ_ITEMS.map((item) => (
              <FAQItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-forest-green">
        <div className="container-narrow text-center">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-white mb-4">
            Start Building Your Website Today
          </h2>
          <p className="text-forest-green-200 text-lg mb-8">
            30 minutes from now, you could have a live, professional website.
          </p>
          <Button variant="primary" size="lg" href="/contact">
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
}

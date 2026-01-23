import React from "react";
import { Button } from "@/components/ui/Button";
import { PRICING_FEATURES } from "@/lib/constants";

export function Pricing() {
  return (
    <section className="section-padding bg-white" id="pricing">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-blue mb-4">
            Simple, <span className="text-forest-green">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-slate-blue-500 max-w-2xl mx-auto">
            No hidden fees. No token anxiety. No surprises. One plan that
            includes everything your business needs.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="relative">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-harvest-gold text-forest-green-900 text-sm font-bold shadow-md">
                Most Popular
              </span>
            </div>

            <div className="card border-2 border-forest-green p-8 sm:p-10">
              {/* Price */}
              <div className="text-center mb-8">
                <h3 className="font-serif font-bold text-2xl text-slate-blue mb-2">
                  Professional
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl sm:text-6xl font-bold text-forest-green">
                    $30
                  </span>
                  <span className="text-lg text-slate-blue-400">/month</span>
                </div>
                <p className="text-sm text-slate-blue-400 mt-2">
                  Cancel anytime. No long-term contracts.
                </p>
              </div>

              {/* Features list */}
              <ul className="space-y-4 mb-10">
                {PRICING_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-forest-green flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-slate-blue-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button variant="primary" size="lg" href="/contact" className="w-full">
                Start Building Today
              </Button>

              {/* Trust badges */}
              <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-blue-400">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  SSL Included
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  99.9% Uptime
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  No Hidden Fees
                </div>
              </div>
            </div>
          </div>

          {/* Comparison note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-blue-400">
              Compare: Custom websites cost $3,000-5,000. Thryv charges $199-499/mo with lock-in contracts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

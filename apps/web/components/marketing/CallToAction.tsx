import React from "react";
import { Button } from "@/components/ui/Button";

export function CallToAction() {
  return (
    <section className="section-padding bg-gradient-to-br from-forest-green-900 to-forest-green-700 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-harvest-gold/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-forest-green-600/20 blur-3xl" />
      </div>

      <div className="container-narrow relative">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
            Ready to Launch Your{" "}
            <span className="text-harvest-gold">Website?</span>
          </h2>
          <p className="text-lg sm:text-xl text-forest-green-200 mb-10 leading-relaxed">
            Join hundreds of small businesses who went from idea to live
            website in under 30 minutes. No coding required, no lock-in
            contracts, no surprises.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" href="/contact">
              Start Building Free
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              href="/pricing"
              className="text-white border-white/20 border hover:bg-white/10"
            >
              View Pricing
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-white/10">
            <div className="text-center">
              <div className="text-3xl font-bold text-harvest-gold mb-1">30 min</div>
              <div className="text-sm text-forest-green-200">Average build time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-harvest-gold mb-1">$30/mo</div>
              <div className="text-sm text-forest-green-200">All-inclusive pricing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-harvest-gold mb-1">100%</div>
              <div className="text-sm text-forest-green-200">Content ownership</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

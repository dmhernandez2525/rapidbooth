import React from "react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream to-white pt-32 sm:pt-40 pb-16 sm:pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-harvest-gold/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-forest-green/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-forest-green/10 text-forest-green text-sm font-medium mb-8 animate-fade-in">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            AI-Powered Website Generation
          </div>

          {/* Headline */}
          <h1 className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-slate-blue leading-tight mb-6 animate-slide-up">
            Fresh Sites,{" "}
            <span className="text-forest-green">Harvested</span> in{" "}
            <span className="relative inline-block">
              <span className="relative z-10">30 Minutes</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-harvest-gold/30 -z-0" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-blue-500 max-w-2xl mx-auto mb-10 animate-slide-up leading-relaxed">
            Tell us about your business through a simple conversation. Our AI
            builds you a professional, fully-functional website while you talk.
            No coding. No templates. No hassle.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Button variant="primary" size="lg" href="/contact">
              Start Building Free
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
            <Button variant="outline" size="lg" href="/features">
              See How It Works
            </Button>
          </div>

          {/* Social Proof */}
          <div className="mt-12 pt-8 border-t border-cream-300 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-sm text-slate-blue-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-forest-green-100 border-2 border-white flex items-center justify-center"
                    >
                      <span className="text-xs font-medium text-forest-green-700">
                        {String.fromCharCode(64 + i)}
                      </span>
                    </div>
                  ))}
                </div>
                <span className="font-medium">500+ businesses launched</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-5 h-5 text-harvest-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="font-medium ml-1">4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-16 sm:mt-20 relative max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-cream-200 bg-white">
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-cream-100 border-b border-cream-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-md px-3 py-1.5 text-sm text-slate-blue-400 text-center border border-cream-300">
                  yourbusiness.rapidbooth.com
                </div>
              </div>
            </div>
            {/* Mockup Content */}
            <div className="p-8 sm:p-12 bg-gradient-to-br from-forest-green-50 to-cream">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="h-4 w-24 bg-forest-green/20 rounded mb-4" />
                  <div className="h-8 w-full bg-forest-green/30 rounded mb-2" />
                  <div className="h-8 w-3/4 bg-forest-green/30 rounded mb-6" />
                  <div className="h-4 w-full bg-slate-blue/10 rounded mb-2" />
                  <div className="h-4 w-5/6 bg-slate-blue/10 rounded mb-6" />
                  <div className="h-10 w-32 bg-harvest-gold rounded-lg" />
                </div>
                <div className="hidden md:block">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-forest-green/20 to-harvest-gold/20 flex items-center justify-center">
                    <svg className="w-24 h-24 text-forest-green/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-forest-green/5 via-harvest-gold/5 to-forest-green/5 rounded-3xl blur-2xl -z-10" />
        </div>
      </div>
    </section>
  );
}

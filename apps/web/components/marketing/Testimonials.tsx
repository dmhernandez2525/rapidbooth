import React from "react";
import { TESTIMONIALS } from "@/lib/constants";

export function Testimonials() {
  return (
    <section className="section-padding bg-cream" id="testimonials">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-blue mb-4">
            Loved by <span className="text-forest-green">Small Businesses</span>
          </h2>
          <p className="text-lg text-slate-blue-500 max-w-2xl mx-auto">
            Join hundreds of business owners who launched their websites in
            under 30 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.name}
              className="card relative"
            >
              {/* Quote mark */}
              <div className="absolute -top-3 left-6">
                <span className="text-5xl font-serif text-harvest-gold leading-none">
                  &ldquo;
                </span>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 pt-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-harvest-gold"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-blue-600 leading-relaxed mb-6 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-cream-200">
                <div className="w-10 h-10 rounded-full bg-forest-green/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-forest-green">
                    {testimonial.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-slate-blue text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-slate-blue-400">
                    {testimonial.business}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

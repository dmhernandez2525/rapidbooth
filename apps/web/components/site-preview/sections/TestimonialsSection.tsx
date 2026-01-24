import React from "react";
import type { GeneratedContent, SiteTheme } from "../SiteRenderer";

interface Props {
  content: GeneratedContent;
  theme: SiteTheme;
}

export function TestimonialsSection({ content, theme }: Props) {
  return (
    <section className="w-full py-16 px-6" style={{ backgroundColor: "var(--site-bg)" }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl font-bold mb-12 text-center"
          style={{ color: theme.colors.primary, fontFamily: "var(--site-font)" }}
        >
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="p-6 bg-white shadow-sm"
              style={{ borderRadius: "var(--site-radius)" }}
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, star) => (
                  <svg
                    key={star}
                    className="w-4 h-4"
                    style={{ color: star < testimonial.rating ? theme.colors.secondary : "#e5e7eb" }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm italic mb-4 opacity-80" style={{ color: "var(--site-text)" }}>
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <p className="text-sm font-semibold" style={{ color: theme.colors.primary }}>
                {testimonial.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

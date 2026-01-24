import React from "react";
import type { GeneratedContent, SiteTheme } from "../SiteRenderer";

interface Props {
  content: GeneratedContent;
  theme: SiteTheme;
}

export function ServicesSection({ content, theme }: Props) {
  return (
    <section
      className="w-full py-16 px-6"
      style={{ backgroundColor: `${theme.colors.primary}08` }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl font-bold mb-12 text-center"
          style={{ color: theme.colors.primary, fontFamily: "var(--site-font)" }}
        >
          Our Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.services.map((service, i) => (
            <div
              key={i}
              className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
              style={{ borderRadius: "var(--site-radius)" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${theme.colors.accent}20` }}
              >
                <svg
                  className="w-5 h-5"
                  style={{ color: theme.colors.accent }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3
                className="font-semibold text-lg mb-2"
                style={{ color: "var(--site-text)" }}
              >
                {service.name}
              </h3>
              <p className="text-sm opacity-75 mb-3" style={{ color: "var(--site-text)" }}>
                {service.description}
              </p>
              {service.price && (
                <span
                  className="text-sm font-medium"
                  style={{ color: theme.colors.accent }}
                >
                  {service.price}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

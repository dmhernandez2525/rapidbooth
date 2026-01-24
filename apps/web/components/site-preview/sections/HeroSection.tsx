import React from "react";
import type { GeneratedContent, SiteTheme } from "../SiteRenderer";

interface Props {
  content: GeneratedContent;
  theme: SiteTheme;
}

export function HeroSection({ content, theme }: Props) {
  return (
    <section
      className="w-full py-20 px-6 text-center"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.secondary}10 100%)`,
      }}
    >
      <div className="max-w-3xl mx-auto">
        <h1
          className="text-4xl sm:text-5xl font-bold mb-6"
          style={{ color: theme.colors.primary, fontFamily: "var(--site-font)" }}
        >
          {content.heroTitle}
        </h1>
        <p className="text-lg sm:text-xl mb-8 opacity-80" style={{ color: "var(--site-text)" }}>
          {content.heroSubtitle}
        </p>
        <button
          className="px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all"
          style={{
            backgroundColor: theme.colors.primary,
            borderRadius: "var(--site-radius)",
          }}
        >
          {content.ctaButtonText}
        </button>
        <p className="mt-4 text-sm opacity-60" style={{ color: "var(--site-text)" }}>
          {content.tagline}
        </p>
      </div>
    </section>
  );
}

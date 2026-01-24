import React from "react";
import type { GeneratedContent, SiteTheme } from "../SiteRenderer";

interface Props {
  content: GeneratedContent;
  theme: SiteTheme;
}

export function GallerySection({ content: _content, theme }: Props) {
  const placeholders = [
    { label: "Our Work", shade: "15" },
    { label: "Featured Project", shade: "20" },
    { label: "Latest Work", shade: "12" },
    { label: "Gallery", shade: "18" },
    { label: "Before & After", shade: "25" },
    { label: "Portfolio", shade: "10" },
  ];

  return (
    <section className="w-full py-16 px-6" style={{ backgroundColor: "var(--site-bg)" }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl font-bold mb-12 text-center"
          style={{ color: theme.colors.primary, fontFamily: "var(--site-font)" }}
        >
          Our Work
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {placeholders.map((item, i) => (
            <div
              key={i}
              className="aspect-square flex items-center justify-center"
              style={{
                backgroundColor: `${theme.colors.primary}${item.shade}`,
                borderRadius: "var(--site-radius)",
              }}
            >
              <span className="text-sm opacity-50" style={{ color: theme.colors.primary }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

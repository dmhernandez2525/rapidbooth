import React from "react";
import type { GeneratedContent, SiteTheme } from "../SiteRenderer";

interface Props {
  content: GeneratedContent;
  theme: SiteTheme;
}

export function SiteNavbar({ content, theme }: Props) {
  return (
    <nav
      className="w-full py-4 px-6 flex items-center justify-between"
      style={{ backgroundColor: theme.colors.primary }}
    >
      <span className="text-white font-bold text-xl" style={{ fontFamily: "var(--site-font)" }}>
        {content.businessName}
      </span>
      <div className="hidden sm:flex items-center gap-6">
        {["Home", "About", "Services", "Contact"].map((item) => (
          <span
            key={item}
            className="text-white/90 text-sm font-medium hover:text-white cursor-pointer transition-colors"
          >
            {item}
          </span>
        ))}
        <span
          className="px-4 py-2 text-sm font-semibold rounded cursor-pointer transition-colors"
          style={{
            backgroundColor: theme.colors.secondary,
            color: theme.colors.text,
            borderRadius: "var(--site-radius)",
          }}
        >
          {content.ctaButtonText}
        </span>
      </div>
    </nav>
  );
}

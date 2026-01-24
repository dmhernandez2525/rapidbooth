import React from "react";
import type { GeneratedContent, SiteTheme } from "../SiteRenderer";

interface Props {
  content: GeneratedContent;
  theme: SiteTheme;
}

export function SiteFooter({ content, theme }: Props) {
  return (
    <footer
      className="w-full py-8 px-6 text-center"
      style={{ backgroundColor: theme.colors.primary }}
    >
      <p className="text-white/80 text-sm">{content.footerText}</p>
      <div className="flex items-center justify-center gap-6 mt-4">
        {["Home", "About", "Services", "Contact"].map((item) => (
          <span key={item} className="text-white/60 text-xs hover:text-white/90 cursor-pointer transition-colors">
            {item}
          </span>
        ))}
      </div>
    </footer>
  );
}

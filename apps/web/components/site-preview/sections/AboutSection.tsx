import React from "react";
import type { GeneratedContent, SiteTheme } from "../SiteRenderer";

interface Props {
  content: GeneratedContent;
  theme: SiteTheme;
}

export function AboutSection({ content, theme }: Props) {
  const paragraphs = content.aboutText.split("\n").filter((p) => p.trim());

  return (
    <section className="w-full py-16 px-6" style={{ backgroundColor: "var(--site-bg)" }}>
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: theme.colors.primary, fontFamily: "var(--site-font)" }}
        >
          {content.aboutTitle}
        </h2>
        <div className="space-y-4">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="text-base leading-relaxed opacity-85" style={{ color: "var(--site-text)" }}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

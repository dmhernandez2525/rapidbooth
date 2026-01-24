"use client";

import React from "react";
import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { ServicesSection } from "./sections/ServicesSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { ContactSection } from "./sections/ContactSection";
import { SiteNavbar } from "./sections/SiteNavbar";
import { SiteFooter } from "./sections/SiteFooter";
import { GallerySection } from "./sections/GallerySection";
import { BookingSection } from "./sections/BookingSection";

export interface SiteTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fontFamily: string;
  borderRadius: string;
  style: "modern" | "classic" | "rustic" | "bold";
}

export interface SiteComponent {
  id: string;
  type: string;
  order: number;
  props: Record<string, unknown>;
}

export interface GeneratedContent {
  businessName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  services: Array<{ name: string; description: string; price?: string }>;
  testimonials: Array<{ name: string; text: string; rating: number }>;
  contactInfo: {
    phone?: string;
    email?: string;
    address?: string;
    hours?: string;
  };
  ctaText: string;
  ctaButtonText: string;
  footerText: string;
}

export interface GeneratedSite {
  id: string;
  sessionId: string;
  template: string;
  components: SiteComponent[];
  theme: SiteTheme;
  content: GeneratedContent;
  status: "generating" | "ready" | "deployed";
  createdAt: string;
}

interface SiteRendererProps {
  site: GeneratedSite;
}

export function SiteRenderer({ site }: SiteRendererProps) {
  const { components, theme, content } = site;
  const sorted = [...components].sort((a, b) => a.order - b.order);

  const cssVars = {
    "--site-primary": theme.colors.primary,
    "--site-secondary": theme.colors.secondary,
    "--site-accent": theme.colors.accent,
    "--site-bg": theme.colors.background,
    "--site-text": theme.colors.text,
    "--site-radius": theme.borderRadius,
    "--site-font": theme.fontFamily === "serif"
      ? "'Georgia', 'Times New Roman', serif"
      : "'Inter', 'Helvetica', sans-serif",
  } as React.CSSProperties;

  return (
    <div className="w-full" style={cssVars}>
      <div
        style={{
          fontFamily: "var(--site-font)",
          color: "var(--site-text)",
          backgroundColor: "var(--site-bg)",
        }}
      >
        {sorted.map((component) => renderComponent(component, content, theme))}
      </div>
    </div>
  );
}

function renderComponent(
  component: SiteComponent,
  content: GeneratedContent,
  theme: SiteTheme
) {
  switch (component.type) {
    case "navbar":
      return <SiteNavbar key={component.id} content={content} theme={theme} />;
    case "hero":
      return <HeroSection key={component.id} content={content} theme={theme} />;
    case "about":
      return <AboutSection key={component.id} content={content} theme={theme} />;
    case "services":
    case "menu":
      return <ServicesSection key={component.id} content={content} theme={theme} />;
    case "gallery":
      return <GallerySection key={component.id} content={content} theme={theme} />;
    case "testimonials":
    case "reviews":
      return <TestimonialsSection key={component.id} content={content} theme={theme} />;
    case "contact":
    case "booking":
      return component.type === "booking"
        ? <BookingSection key={component.id} content={content} theme={theme} />
        : <ContactSection key={component.id} content={content} theme={theme} />;
    case "footer":
      return <SiteFooter key={component.id} content={content} theme={theme} />;
    default:
      return null;
  }
}

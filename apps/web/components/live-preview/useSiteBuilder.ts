"use client";

import { useState, useCallback, useMemo } from "react";
import type { GeneratedSite, SiteTheme, SiteComponent, GeneratedContent } from "../site-preview/SiteRenderer";

export type TemplateType = "home-services" | "restaurant" | "professional" | "retail";

export interface BusinessData {
  businessName?: string;
  businessType?: string;
  industry?: string;
  description?: string;
  location?: string;
  phone?: string;
  email?: string;
  targetCustomers?: string;
  uniqueValue?: string;
  needsScheduling?: boolean;
  needsMenu?: boolean;
  brandColors?: string[];
  brandVibe?: string;
}

function detectTemplate(data: BusinessData): TemplateType {
  const type = (data.businessType || data.industry || "").toLowerCase();

  if (type.includes("restaurant") || type.includes("cafe") || type.includes("bakery") || type.includes("food") || data.needsMenu) {
    return "restaurant";
  }
  if (type.includes("plumb") || type.includes("electric") || type.includes("hvac") || type.includes("landscap") || type.includes("clean") || type.includes("repair") || type.includes("home")) {
    return "home-services";
  }
  if (type.includes("law") || type.includes("account") || type.includes("consult") || type.includes("doctor") || type.includes("dental") || type.includes("therap")) {
    return "professional";
  }
  return "retail";
}

function getTemplateComponents(template: TemplateType, data: BusinessData): SiteComponent[] {
  const base: SiteComponent[] = [
    { id: "nav", type: "navbar", order: 0, props: {} },
    { id: "hero", type: "hero", order: 1, props: {} },
    { id: "about", type: "about", order: 2, props: {} },
    { id: "services", type: "services", order: 3, props: {} },
  ];

  switch (template) {
    case "restaurant":
      base.push({ id: "menu", type: "menu", order: 4, props: {} });
      if (data.needsScheduling) base.push({ id: "booking", type: "booking", order: 5, props: {} });
      base.push({ id: "testimonials", type: "testimonials", order: 6, props: {} });
      base.push({ id: "contact", type: "contact", order: 7, props: {} });
      break;
    case "home-services":
      base.push({ id: "gallery", type: "gallery", order: 4, props: {} });
      base.push({ id: "testimonials", type: "testimonials", order: 5, props: {} });
      if (data.needsScheduling) base.push({ id: "booking", type: "booking", order: 6, props: {} });
      base.push({ id: "contact", type: "contact", order: 7, props: {} });
      break;
    case "professional":
      base.push({ id: "testimonials", type: "testimonials", order: 4, props: {} });
      if (data.needsScheduling) base.push({ id: "booking", type: "booking", order: 5, props: {} });
      base.push({ id: "contact", type: "contact", order: 6, props: {} });
      break;
    default:
      base.push({ id: "gallery", type: "gallery", order: 4, props: {} });
      base.push({ id: "testimonials", type: "testimonials", order: 5, props: {} });
      base.push({ id: "contact", type: "contact", order: 6, props: {} });
      break;
  }

  base.push({ id: "footer", type: "footer", order: 99, props: {} });
  return base;
}

const TEMPLATE_COLORS: Record<TemplateType, SiteTheme["colors"]> = {
  "home-services": { primary: "#1E40AF", secondary: "#F59E0B", accent: "#10B981", background: "#F8FAFC", text: "#1E293B" },
  restaurant: { primary: "#991B1B", secondary: "#D97706", accent: "#065F46", background: "#FFFBEB", text: "#1C1917" },
  professional: { primary: "#1E3A5F", secondary: "#0D9488", accent: "#6366F1", background: "#F8FAFC", text: "#1E293B" },
  retail: { primary: "#7C3AED", secondary: "#EC4899", accent: "#06B6D4", background: "#FAFAFA", text: "#18181B" },
};

function getTheme(template: TemplateType, data: BusinessData): SiteTheme {
  const vibeToStyle: Record<string, SiteTheme["style"]> = {
    modern: "modern", sleek: "modern", professional: "classic", classic: "classic",
    elegant: "classic", rustic: "rustic", warm: "rustic", cozy: "rustic",
    bold: "bold", playful: "bold", vibrant: "bold",
  };

  const style = vibeToStyle[(data.brandVibe || "").toLowerCase()] || "modern";
  const colors = { ...TEMPLATE_COLORS[template] };

  if (data.brandColors && data.brandColors.length > 0) {
    colors.primary = data.brandColors[0];
    if (data.brandColors.length > 1) colors.secondary = data.brandColors[1];
  }

  return {
    colors,
    fontFamily: style === "classic" ? "serif" : "sans-serif",
    borderRadius: style === "modern" ? "0.75rem" : style === "bold" ? "1rem" : "0.375rem",
    style,
  };
}

function getContent(data: BusinessData, template: TemplateType): GeneratedContent {
  const name = data.businessName || "Your Business";
  const location = data.location || "your area";

  const templateContent: Record<TemplateType, Partial<GeneratedContent>> = {
    "home-services": {
      tagline: "Trusted professionals at your service",
      heroTitle: `Professional Services in ${location}`,
      heroSubtitle: `${name} provides reliable, high-quality services. Licensed, insured, and committed to your satisfaction.`,
      aboutTitle: "Why Choose Us",
      aboutText: `At ${name}, we deliver exceptional service to every customer. With years of experience serving ${location}, we've built our reputation on quality workmanship and outstanding care.\nOur team is fully licensed and insured, giving you peace of mind with every project.`,
      services: [
        { name: "Residential Service", description: "Complete solutions for your home", price: "Free Estimate" },
        { name: "Emergency Repairs", description: "Available 24/7 for urgent issues", price: "Call for pricing" },
        { name: "Maintenance Plans", description: "Prevent costly repairs", price: "From $99/mo" },
      ],
    },
    restaurant: {
      tagline: "A taste of something special",
      heroTitle: `Welcome to ${name}`,
      heroSubtitle: `Experience the finest flavors in ${location}. Fresh ingredients, passionate cooking, and a warm atmosphere.`,
      aboutTitle: "Our Story",
      aboutText: `${name} was founded to bring people together through exceptional food. Every dish is crafted with fresh, locally-sourced ingredients.\nWhether it's a quick lunch or special celebration, we make every visit memorable.`,
      services: [
        { name: "Dine-In", description: "Full menu in our welcoming space" },
        { name: "Takeout", description: "Your favorites, ready when you are" },
        { name: "Catering", description: "Let us make your event delicious", price: "Custom quotes" },
      ],
    },
    professional: {
      tagline: "Expert guidance you can trust",
      heroTitle: `Professional Services by ${name}`,
      heroSubtitle: `Dedicated to expert solutions in ${location}. Years of experience with a client-first approach.`,
      aboutTitle: "About Our Practice",
      aboutText: `${name} provides accessible, high-quality professional services. We build lasting relationships through transparency and results.\nOur team stays current with industry developments to ensure the best guidance.`,
      services: [
        { name: "Initial Consultation", description: "Thorough assessment of your needs", price: "Complimentary" },
        { name: "Ongoing Services", description: "Continuous support for your goals" },
        { name: "Specialized Solutions", description: "Expert handling of complex situations" },
      ],
    },
    retail: {
      tagline: "Quality products, exceptional service",
      heroTitle: `Shop ${name}`,
      heroSubtitle: `Discover curated products and personalized service. Serving ${location} with quality you can count on.`,
      aboutTitle: "About Us",
      aboutText: `At ${name}, we bring you the best products and shopping experience. Each item is carefully selected for quality, value, and style.\nOur knowledgeable staff is always ready to help you find exactly what you need.`,
      services: [
        { name: "In-Store Shopping", description: "Browse our full collection" },
        { name: "Personal Shopping", description: "Expert curated selections" },
        { name: "Gift Services", description: "Custom wrapping and gift cards" },
      ],
    },
  };

  const tc = templateContent[template];

  return {
    businessName: name,
    tagline: tc.tagline || "Quality service, every time",
    heroTitle: tc.heroTitle || `Welcome to ${name}`,
    heroSubtitle: tc.heroSubtitle || `Serving ${location} with excellence`,
    aboutTitle: tc.aboutTitle || "About Us",
    aboutText: tc.aboutText || `${name} is dedicated to serving our community.`,
    services: tc.services || [{ name: "Our Services", description: "Contact us to learn more" }],
    testimonials: [
      { name: "Sarah M.", text: `${name} exceeded my expectations. Professional and reliable!`, rating: 5 },
      { name: "Mike R.", text: "Seamless experience from start to finish. Highly recommended.", rating: 5 },
      { name: "Lisa K.", text: `Best in ${location}! Knowledgeable and friendly team.`, rating: 5 },
    ],
    contactInfo: {
      phone: data.phone,
      email: data.email,
      address: data.location,
    },
    ctaText: "Ready to get started? Reach out today.",
    ctaButtonText: data.needsScheduling ? "Book Now" : "Contact Us",
    footerText: `\u00A9 ${new Date().getFullYear()} ${name}. All rights reserved.`,
  };
}

export function useSiteBuilder() {
  const [businessData, setBusinessData] = useState<BusinessData>({});
  const [componentOverrides, setComponentOverrides] = useState<SiteComponent[] | null>(null);
  const [themeOverrides, setThemeOverrides] = useState<Partial<SiteTheme> | null>(null);

  const template = useMemo(() => detectTemplate(businessData), [businessData]);

  const site = useMemo((): GeneratedSite => {
    const baseTheme = getTheme(template, businessData);
    const theme: SiteTheme = themeOverrides
      ? { ...baseTheme, ...themeOverrides, colors: { ...baseTheme.colors, ...(themeOverrides.colors || {}) } }
      : baseTheme;

    const components = componentOverrides || getTemplateComponents(template, businessData);
    const content = getContent(businessData, template);

    return {
      id: "live_preview",
      sessionId: "live",
      template,
      components,
      theme,
      content,
      status: "generating",
      createdAt: new Date().toISOString(),
    };
  }, [businessData, template, componentOverrides, themeOverrides]);

  const updateBusinessData = useCallback((updates: Partial<BusinessData>) => {
    setBusinessData((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateTheme = useCallback((updates: Partial<SiteTheme>) => {
    setThemeOverrides((prev) => prev ? { ...prev, ...updates } : updates);
  }, []);

  const updateColors = useCallback((colors: Partial<SiteTheme["colors"]>) => {
    setThemeOverrides((prev) => {
      const current = prev || {};
      return { ...current, colors: { ...(current.colors || {}), ...colors } as SiteTheme["colors"] };
    });
  }, []);

  const reorderComponents = useCallback((fromIndex: number, toIndex: number) => {
    setComponentOverrides((prev) => {
      const components = prev || getTemplateComponents(template, businessData);
      const sorted = [...components].sort((a, b) => a.order - b.order);
      const movable = sorted.filter((c) => c.type !== "navbar" && c.type !== "footer");
      const navbar = sorted.find((c) => c.type === "navbar");
      const footer = sorted.find((c) => c.type === "footer");

      const [moved] = movable.splice(fromIndex, 1);
      movable.splice(toIndex, 0, moved);

      const result: SiteComponent[] = [];
      if (navbar) result.push({ ...navbar, order: 0 });
      movable.forEach((c, i) => result.push({ ...c, order: i + 1 }));
      if (footer) result.push({ ...footer, order: 99 });

      return result;
    });
  }, [template, businessData]);

  const resetTheme = useCallback(() => setThemeOverrides(null), []);
  const resetComponents = useCallback(() => setComponentOverrides(null), []);

  return {
    site,
    businessData,
    template,
    updateBusinessData,
    updateTheme,
    updateColors,
    reorderComponents,
    resetTheme,
    resetComponents,
  };
}

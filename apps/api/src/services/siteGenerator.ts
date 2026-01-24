import crypto from "crypto";
import type { ExtractedBusinessData, ColorScheme, SiteContent, GeneratedSiteConfig } from "@rapidbooth/shared";
import { env } from "../config/env";

const MAX_SITES = 500;
const SITE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const API_TIMEOUT_MS = 60_000; // 60 seconds for generation

export type TemplateType = "home-services" | "restaurant" | "professional" | "retail";

export interface SiteComponent {
  id: string;
  type: ComponentType;
  order: number;
  props: Record<string, unknown>;
}

export type ComponentType =
  | "navbar"
  | "hero"
  | "about"
  | "services"
  | "gallery"
  | "testimonials"
  | "contact"
  | "footer"
  | "menu"
  | "booking"
  | "reviews";

export interface GeneratedSite {
  id: string;
  sessionId: string;
  template: TemplateType;
  components: SiteComponent[];
  theme: SiteTheme;
  content: GeneratedContent;
  status: "generating" | "ready" | "deployed";
  createdAt: string;
}

export interface SiteTheme {
  colors: ColorScheme;
  fontFamily: string;
  borderRadius: string;
  style: "modern" | "classic" | "rustic" | "bold";
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

const sites = new Map<string, GeneratedSite>();

function evictExpiredSites(): void {
  const now = Date.now();
  for (const [id, site] of sites) {
    if (now - new Date(site.createdAt).getTime() > SITE_TTL_MS) {
      sites.delete(id);
    }
  }
}

function generateId(): string {
  return `site_${crypto.randomUUID()}`;
}

function detectTemplate(data: ExtractedBusinessData): TemplateType {
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

function getTemplateComponents(template: TemplateType, data: ExtractedBusinessData): SiteComponent[] {
  const base: SiteComponent[] = [
    { id: "nav", type: "navbar", order: 0, props: {} },
    { id: "hero", type: "hero", order: 1, props: {} },
    { id: "about", type: "about", order: 2, props: {} },
    { id: "services", type: "services", order: 3, props: {} },
  ];

  switch (template) {
    case "restaurant":
      base.push({ id: "menu", type: "menu", order: 4, props: {} });
      if (data.needsScheduling) {
        base.push({ id: "booking", type: "booking", order: 5, props: {} });
      }
      base.push({ id: "testimonials", type: "testimonials", order: 6, props: {} });
      base.push({ id: "contact", type: "contact", order: 7, props: {} });
      break;

    case "home-services":
      base.push({ id: "gallery", type: "gallery", order: 4, props: {} });
      base.push({ id: "testimonials", type: "testimonials", order: 5, props: {} });
      base.push({ id: "reviews", type: "reviews", order: 6, props: {} });
      if (data.needsScheduling) {
        base.push({ id: "booking", type: "booking", order: 7, props: {} });
      }
      base.push({ id: "contact", type: "contact", order: 8, props: {} });
      break;

    case "professional":
      base.push({ id: "testimonials", type: "testimonials", order: 4, props: {} });
      if (data.needsScheduling) {
        base.push({ id: "booking", type: "booking", order: 5, props: {} });
      }
      base.push({ id: "contact", type: "contact", order: 6, props: {} });
      break;

    default: // retail
      base.push({ id: "gallery", type: "gallery", order: 4, props: {} });
      base.push({ id: "testimonials", type: "testimonials", order: 5, props: {} });
      base.push({ id: "contact", type: "contact", order: 6, props: {} });
      break;
  }

  base.push({ id: "footer", type: "footer", order: 99, props: {} });
  return base;
}

function getDefaultTheme(template: TemplateType, data: ExtractedBusinessData): SiteTheme {
  const vibeToStyle: Record<string, SiteTheme["style"]> = {
    modern: "modern",
    sleek: "modern",
    professional: "classic",
    classic: "classic",
    elegant: "classic",
    rustic: "rustic",
    warm: "rustic",
    cozy: "rustic",
    bold: "bold",
    playful: "bold",
    vibrant: "bold",
  };

  const style = vibeToStyle[(data.brandVibe || "").toLowerCase()] || "modern";

  const templateColors: Record<TemplateType, ColorScheme> = {
    "home-services": {
      primary: "#1E40AF",
      secondary: "#F59E0B",
      accent: "#10B981",
      background: "#F8FAFC",
      text: "#1E293B",
    },
    restaurant: {
      primary: "#991B1B",
      secondary: "#D97706",
      accent: "#065F46",
      background: "#FFFBEB",
      text: "#1C1917",
    },
    professional: {
      primary: "#1E3A5F",
      secondary: "#0D9488",
      accent: "#6366F1",
      background: "#F8FAFC",
      text: "#1E293B",
    },
    retail: {
      primary: "#7C3AED",
      secondary: "#EC4899",
      accent: "#06B6D4",
      background: "#FAFAFA",
      text: "#18181B",
    },
  };

  if (data.brandColors && data.brandColors.length > 0) {
    templateColors[template].primary = data.brandColors[0];
    if (data.brandColors.length > 1) {
      templateColors[template].secondary = data.brandColors[1];
    }
  }

  return {
    colors: templateColors[template],
    fontFamily: style === "classic" ? "serif" : "sans-serif",
    borderRadius: style === "modern" ? "0.75rem" : style === "bold" ? "1rem" : "0.375rem",
    style,
  };
}

function sanitizeForPrompt(value: string | undefined, fallback: string, maxLength = 200): string {
  const v = (value || fallback).slice(0, maxLength);
  return v.replace(/[<>{}]/g, "");
}

async function generateContent(data: ExtractedBusinessData, template: TemplateType): Promise<GeneratedContent> {
  const apiKey = env.ANTHROPIC_API_KEY;

  if (apiKey) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          system: "You are a professional website copywriter. Generate website content based on the business information provided. Return ONLY valid JSON matching the specified structure. Do not include any markdown formatting or code blocks.",
          messages: [{
            role: "user",
            content: `Generate website content for this business:
Name: ${sanitizeForPrompt(data.businessName, "My Business")}
Type: ${sanitizeForPrompt(data.businessType || data.industry, template)}
Description: ${sanitizeForPrompt(data.description, "A local business serving the community")}
Location: ${sanitizeForPrompt(data.location, "Local area")}
Unique Value: ${sanitizeForPrompt(data.uniqueValue, "Quality service")}
Target Customers: ${sanitizeForPrompt(data.targetCustomers, "Local customers")}

Return JSON with this exact structure:
{
  "businessName": "string",
  "tagline": "short catchy tagline",
  "heroTitle": "compelling headline",
  "heroSubtitle": "2 sentence description",
  "aboutTitle": "about section title",
  "aboutText": "2-3 paragraph about text",
  "services": [{"name": "string", "description": "string", "price": "optional price string"}],
  "testimonials": [{"name": "string", "text": "string", "rating": 5}],
  "contactInfo": {"phone": "optional", "email": "optional", "address": "optional", "hours": "optional"},
  "ctaText": "call to action text",
  "ctaButtonText": "button text",
  "footerText": "footer copyright text"
}

Generate 3-5 services relevant to this business type, and 3 realistic testimonials.`,
          }],
        }),
        signal: controller.signal,
      });

      if (response.ok) {
        const result = (await response.json()) as { content?: Array<{ text?: string }> };
        const text = result?.content?.[0]?.text;
        if (text) {
          return JSON.parse(text) as GeneratedContent;
        }
      }
    } catch {
      // Fall through to default content
    } finally {
      clearTimeout(timeout);
    }
  }

  return getDefaultContent(data, template);
}

function getDefaultContent(data: ExtractedBusinessData, template: TemplateType): GeneratedContent {
  const name = data.businessName || "My Business";
  const location = data.location || "your local area";

  const templateContent: Record<TemplateType, Partial<GeneratedContent>> = {
    "home-services": {
      tagline: "Trusted professionals at your service",
      heroTitle: `Professional Home Services in ${location}`,
      heroSubtitle: `${name} provides reliable, high-quality services for your home. Licensed, insured, and committed to your satisfaction.`,
      aboutTitle: "Why Choose Us",
      aboutText: `At ${name}, we take pride in delivering exceptional service to every customer. With years of experience serving ${location}, we've built our reputation on quality workmanship, transparent pricing, and outstanding customer care.\n\nOur team of skilled professionals is fully licensed and insured, giving you peace of mind with every project. We treat your home like it's our own.`,
      services: [
        { name: "Residential Service", description: "Complete solutions for your home needs", price: "Free Estimate" },
        { name: "Emergency Repairs", description: "Available 24/7 for urgent situations", price: "Call for pricing" },
        { name: "Maintenance Plans", description: "Regular upkeep to prevent costly repairs", price: "From $99/mo" },
        { name: "New Installations", description: "Professional setup with warranty included", price: "Free Consultation" },
      ],
    },
    restaurant: {
      tagline: "A taste of something special",
      heroTitle: `Welcome to ${name}`,
      heroSubtitle: `Experience the finest flavors in ${location}. Fresh ingredients, passionate cooking, and a warm atmosphere await you.`,
      aboutTitle: "Our Story",
      aboutText: `${name} was founded with a simple mission: to bring people together through exceptional food. Every dish on our menu is crafted with fresh, locally-sourced ingredients and a passion for culinary excellence.\n\nWhether you're joining us for a quick lunch, a family dinner, or a special celebration, we're committed to making every visit memorable.`,
      services: [
        { name: "Dine-In", description: "Enjoy our full menu in our welcoming space" },
        { name: "Takeout", description: "Your favorites, ready when you are" },
        { name: "Catering", description: "Let us make your event delicious", price: "Custom quotes" },
        { name: "Private Events", description: "Reserve our space for your special occasion" },
      ],
    },
    professional: {
      tagline: "Expert guidance you can trust",
      heroTitle: `Professional Services by ${name}`,
      heroSubtitle: `Dedicated to providing expert solutions in ${location}. We bring years of experience and a client-first approach to every engagement.`,
      aboutTitle: "About Our Practice",
      aboutText: `${name} was established to provide accessible, high-quality professional services to our community. We believe in building lasting relationships with our clients through transparency, expertise, and results.\n\nOur team stays current with industry developments to ensure you receive the most up-to-date guidance and solutions for your needs.`,
      services: [
        { name: "Initial Consultation", description: "A thorough assessment of your needs", price: "Complimentary" },
        { name: "Ongoing Services", description: "Continuous support tailored to your goals" },
        { name: "Specialized Solutions", description: "Expert handling of complex situations" },
      ],
    },
    retail: {
      tagline: "Quality products, exceptional service",
      heroTitle: `Shop ${name}`,
      heroSubtitle: `Discover curated products and personalized service at ${name}. Serving ${location} with quality you can count on.`,
      aboutTitle: "About Us",
      aboutText: `At ${name}, we're passionate about bringing you the best products and shopping experience. Each item in our collection is carefully selected for quality, value, and style.\n\nVisit us to discover why locals have made us their go-to destination. Our knowledgeable staff is always ready to help you find exactly what you're looking for.`,
      services: [
        { name: "In-Store Shopping", description: "Browse our full collection in person" },
        { name: "Personal Shopping", description: "Let our experts curate selections for you" },
        { name: "Gift Services", description: "Custom wrapping and gift cards available" },
        { name: "Special Orders", description: "Can't find what you need? We'll source it" },
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
    aboutText: tc.aboutText || `${name} is dedicated to serving our community with excellence.`,
    services: tc.services || [{ name: "Our Services", description: "Contact us to learn more" }],
    testimonials: [
      { name: "Sarah M.", text: `${name} exceeded my expectations. Professional, reliable, and genuinely caring about their customers. Highly recommend!`, rating: 5 },
      { name: "Mike R.", text: "From start to finish, the experience was seamless. I've already recommended them to all my friends and family.", rating: 5 },
      { name: "Lisa K.", text: `Best in ${location}! The team is knowledgeable, friendly, and always goes the extra mile. Will definitely be back.`, rating: 5 },
    ],
    contactInfo: {
      phone: data.phone,
      email: data.email,
      address: data.location,
    },
    ctaText: "Ready to get started? Reach out today and let us show you what we can do.",
    ctaButtonText: data.needsScheduling ? "Book Now" : "Contact Us",
    footerText: `\u00A9 ${new Date().getFullYear()} ${name}. All rights reserved.`,
  };
}

export async function generateSite(sessionId: string, intakeData: ExtractedBusinessData): Promise<GeneratedSite> {
  evictExpiredSites();

  if (sites.size >= MAX_SITES) {
    throw new Error("Maximum stored sites reached. Please try again later.");
  }

  const template = detectTemplate(intakeData);
  const components = getTemplateComponents(template, intakeData);
  const theme = getDefaultTheme(template, intakeData);
  const content = await generateContent(intakeData, template);

  const site: GeneratedSite = {
    id: generateId(),
    sessionId,
    template,
    components,
    theme,
    content,
    status: "ready",
    createdAt: new Date().toISOString(),
  };

  sites.set(site.id, site);
  return site;
}

export function getSite(siteId: string): GeneratedSite | undefined {
  return sites.get(siteId);
}

export function getAllSites(): GeneratedSite[] {
  return Array.from(sites.values());
}

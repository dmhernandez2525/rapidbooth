"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SiteRenderer } from "@/components/site-preview";
import type { GeneratedSite } from "@/components/site-preview";

type DeviceView = "desktop" | "tablet" | "mobile";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const SAMPLE_SITES: Record<string, GeneratedSite> = {
  "home-services": {
    id: "demo_home_services",
    sessionId: "demo",
    template: "home-services",
    components: [
      { id: "nav", type: "navbar", order: 0, props: {} },
      { id: "hero", type: "hero", order: 1, props: {} },
      { id: "about", type: "about", order: 2, props: {} },
      { id: "services", type: "services", order: 3, props: {} },
      { id: "gallery", type: "gallery", order: 4, props: {} },
      { id: "testimonials", type: "testimonials", order: 5, props: {} },
      { id: "booking", type: "booking", order: 6, props: {} },
      { id: "contact", type: "contact", order: 7, props: {} },
      { id: "footer", type: "footer", order: 99, props: {} },
    ],
    theme: {
      colors: { primary: "#1E40AF", secondary: "#F59E0B", accent: "#10B981", background: "#F8FAFC", text: "#1E293B" },
      fontFamily: "sans-serif",
      borderRadius: "0.75rem",
      style: "modern",
    },
    content: {
      businessName: "Summit Plumbing & HVAC",
      tagline: "Your comfort is our craft",
      heroTitle: "Professional Plumbing & HVAC in Denver",
      heroSubtitle: "Summit Plumbing & HVAC delivers reliable, high-quality home services. Licensed, insured, and committed to keeping your home comfortable year-round.",
      aboutTitle: "Why Denver Trusts Summit",
      aboutText: "At Summit Plumbing & HVAC, we've been serving the Denver metro area for over 15 years. Our team of certified professionals handles everything from routine maintenance to emergency repairs with the same attention to detail.\nWe believe in transparent pricing, on-time arrivals, and treating your home like it's our own. That's why we're consistently rated 5 stars across Google and Yelp.",
      services: [
        { name: "Plumbing Repairs", description: "From leaky faucets to burst pipes, we handle it all", price: "From $89" },
        { name: "HVAC Installation", description: "New systems installed with manufacturer warranty", price: "Free Estimate" },
        { name: "Emergency Service", description: "24/7 availability for urgent plumbing & heating issues", price: "Call Now" },
        { name: "Maintenance Plans", description: "Annual tune-ups to prevent costly breakdowns", price: "$29/month" },
      ],
      testimonials: [
        { name: "Sarah M.", text: "Summit fixed our furnace on a freezing Saturday night. Professional, fast, and fairly priced. Can't recommend enough!", rating: 5 },
        { name: "James T.", text: "Best plumber in Denver. They've handled three jobs for us now and every time it's been top-notch quality.", rating: 5 },
        { name: "Maria L.", text: "Their maintenance plan has saved us from two potential emergencies already. Worth every penny!", rating: 5 },
      ],
      contactInfo: { phone: "(303) 555-0187", email: "service@summitphvac.com", address: "2847 Elm Street, Denver, CO 80205", hours: "Mon-Sat: 7AM-7PM | Emergency: 24/7" },
      ctaText: "Ready for reliable home service? Get a free estimate today.",
      ctaButtonText: "Book Now",
      footerText: "\u00A9 2025 Summit Plumbing & HVAC. All rights reserved.",
    },
    status: "ready",
    createdAt: new Date().toISOString(),
  },
  restaurant: {
    id: "demo_restaurant",
    sessionId: "demo",
    template: "restaurant",
    components: [
      { id: "nav", type: "navbar", order: 0, props: {} },
      { id: "hero", type: "hero", order: 1, props: {} },
      { id: "about", type: "about", order: 2, props: {} },
      { id: "services", type: "menu", order: 3, props: {} },
      { id: "testimonials", type: "testimonials", order: 4, props: {} },
      { id: "contact", type: "contact", order: 5, props: {} },
      { id: "footer", type: "footer", order: 99, props: {} },
    ],
    theme: {
      colors: { primary: "#991B1B", secondary: "#D97706", accent: "#065F46", background: "#FFFBEB", text: "#1C1917" },
      fontFamily: "serif",
      borderRadius: "0.375rem",
      style: "rustic",
    },
    content: {
      businessName: "Bella Cucina",
      tagline: "Authentic Italian, made with love",
      heroTitle: "Welcome to Bella Cucina",
      heroSubtitle: "Experience authentic Italian cuisine in the heart of downtown. Fresh pasta, wood-fired pizzas, and a warm atmosphere that feels like family.",
      aboutTitle: "Our Story",
      aboutText: "Bella Cucina was born from a simple dream: to bring the flavors of Nonna's kitchen to our community. Every dish is crafted with imported ingredients, traditional recipes, and a passion for hospitality.\nSince opening in 2018, we've become a neighborhood favorite for date nights, family celebrations, and anyone craving a true taste of Italy.",
      services: [
        { name: "Wood-Fired Pizza", description: "Neapolitan-style with San Marzano tomatoes", price: "$16-22" },
        { name: "Fresh Pasta", description: "Made daily with imported semolina flour", price: "$18-28" },
        { name: "Antipasti & Salads", description: "Seasonal starters with local produce", price: "$12-16" },
        { name: "Desserts", description: "Housemade tiramisu, panna cotta, and more", price: "$10-14" },
      ],
      testimonials: [
        { name: "David R.", text: "The best Italian food outside of Italy itself. The carbonara is absolutely perfect.", rating: 5 },
        { name: "Jennifer K.", text: "We come here every anniversary. The atmosphere, the food, the service - everything is wonderful.", rating: 5 },
        { name: "Mike S.", text: "Their wood-fired margherita is hands down the best pizza in the city. Don't skip the tiramisu!", rating: 5 },
      ],
      contactInfo: { phone: "(555) 234-5678", email: "ciao@bellacucina.com", address: "142 Main Street, Downtown", hours: "Tue-Sun: 5PM-10PM | Closed Monday" },
      ctaText: "Join us for an unforgettable dining experience.",
      ctaButtonText: "Reserve a Table",
      footerText: "\u00A9 2025 Bella Cucina. All rights reserved.",
    },
    status: "ready",
    createdAt: new Date().toISOString(),
  },
  professional: {
    id: "demo_professional",
    sessionId: "demo",
    template: "professional",
    components: [
      { id: "nav", type: "navbar", order: 0, props: {} },
      { id: "hero", type: "hero", order: 1, props: {} },
      { id: "about", type: "about", order: 2, props: {} },
      { id: "services", type: "services", order: 3, props: {} },
      { id: "testimonials", type: "testimonials", order: 4, props: {} },
      { id: "booking", type: "booking", order: 5, props: {} },
      { id: "contact", type: "contact", order: 6, props: {} },
      { id: "footer", type: "footer", order: 99, props: {} },
    ],
    theme: {
      colors: { primary: "#1E3A5F", secondary: "#0D9488", accent: "#6366F1", background: "#F8FAFC", text: "#1E293B" },
      fontFamily: "sans-serif",
      borderRadius: "0.75rem",
      style: "modern",
    },
    content: {
      businessName: "Clearview Family Dental",
      tagline: "Healthy smiles for the whole family",
      heroTitle: "Your Family Deserves the Best Dental Care",
      heroSubtitle: "At Clearview Family Dental, we combine modern technology with a gentle touch. From routine cleanings to cosmetic dentistry, your smile is in expert hands.",
      aboutTitle: "About Our Practice",
      aboutText: "Dr. Emily Chen and her team have been providing comprehensive dental care to families in Clearview for over a decade. We believe everyone deserves a healthy, confident smile.\nOur state-of-the-art office features digital X-rays, same-day crowns, and sedation options for anxious patients. We accept most insurance plans and offer flexible payment options.",
      services: [
        { name: "General Dentistry", description: "Cleanings, fillings, and preventive care for all ages", price: "Insurance accepted" },
        { name: "Cosmetic Dentistry", description: "Whitening, veneers, and smile makeovers", price: "Free Consultation" },
        { name: "Orthodontics", description: "Invisalign and traditional braces for teens and adults", price: "From $3,500" },
        { name: "Emergency Care", description: "Same-day appointments for dental emergencies", price: "Call for availability" },
      ],
      testimonials: [
        { name: "Rachel P.", text: "Dr. Chen is amazing with kids. My daughter actually looks forward to her dental visits now!", rating: 5 },
        { name: "Tom H.", text: "Got my Invisalign here and couldn't be happier with the results. Professional team from start to finish.", rating: 5 },
        { name: "Lisa W.", text: "Best dental office I've ever been to. They really take the time to explain everything and make you feel comfortable.", rating: 5 },
      ],
      contactInfo: { phone: "(555) 789-0123", email: "smile@clearviewdental.com", address: "500 Oak Avenue, Suite 200, Clearview", hours: "Mon-Fri: 8AM-5PM | Sat: 9AM-2PM" },
      ctaText: "Ready for a healthier smile? Schedule your visit today.",
      ctaButtonText: "Book Appointment",
      footerText: "\u00A9 2025 Clearview Family Dental. All rights reserved.",
    },
    status: "ready",
    createdAt: new Date().toISOString(),
  },
};

export default function PreviewPage() {
  const [site, setSite] = useState<GeneratedSite | null>(null);
  const [deviceView, setDeviceView] = useState<DeviceView>("desktop");
  const [activeTemplate, setActiveTemplate] = useState<string>("home-services");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSite = useCallback(async (siteId: string | null) => {
    if (!siteId) {
      setSite(SAMPLE_SITES[activeTemplate]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/sites/${siteId}`);
      if (!res.ok) throw new Error("Site not found");
      const data = await res.json();
      setSite(data.site);
    } catch {
      setError("Could not load site. Showing demo preview.");
      setSite(SAMPLE_SITES[activeTemplate]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTemplate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const siteId = params.get("siteId");
    loadSite(siteId);
  }, [loadSite]);

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).get("siteId")) {
      setSite(SAMPLE_SITES[activeTemplate]);
    }
  }, [activeTemplate]);

  const deviceWidths: Record<DeviceView, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 overflow-x-auto">
            <h1 className="text-sm font-semibold text-slate-blue hidden sm:block flex-shrink-0">Site Preview</h1>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 flex-shrink-0">
              {(Object.keys(SAMPLE_SITES) as string[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTemplate(key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTemplate === key
                      ? "bg-forest-green text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {key.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {(["desktop", "tablet", "mobile"] as DeviceView[]).map((view) => (
                <button
                  key={view}
                  onClick={() => setDeviceView(view)}
                  className={`p-2 rounded-md transition-colors ${
                    deviceView === view ? "bg-white shadow-sm text-forest-green" : "text-gray-400 hover:text-gray-600"
                  }`}
                  title={view}
                >
                  {view === "desktop" && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  {view === "tablet" && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )}
                  {view === "mobile" && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex justify-center py-8 px-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4">
              <svg className="animate-spin w-8 h-8 text-forest-green" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm text-gray-500">Loading site preview...</p>
            </div>
          </div>
        ) : site ? (
          <div
            className="bg-white shadow-2xl overflow-hidden transition-all duration-300"
            style={{
              width: deviceWidths[deviceView],
              maxWidth: "100%",
              borderRadius: deviceView !== "desktop" ? "1rem" : "0.5rem",
            }}
          >
            {deviceView !== "desktop" && (
              <div className="bg-gray-900 px-4 py-2 flex items-center justify-center">
                <div className="w-16 h-1 bg-gray-700 rounded-full" />
              </div>
            )}
            <div className="overflow-y-auto" style={{ maxHeight: "80vh" }}>
              <SiteRenderer site={site} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-32">
            <p className="text-gray-500">No site data available</p>
          </div>
        )}
      </div>

      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

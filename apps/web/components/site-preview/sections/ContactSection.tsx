import React from "react";
import type { GeneratedContent, SiteTheme } from "../SiteRenderer";

interface Props {
  content: GeneratedContent;
  theme: SiteTheme;
}

export function ContactSection({ content, theme }: Props) {
  return (
    <section
      className="w-full py-16 px-6"
      style={{ backgroundColor: `${theme.colors.primary}08` }}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-3xl font-bold mb-4 text-center"
          style={{ color: theme.colors.primary, fontFamily: "var(--site-font)" }}
        >
          Get In Touch
        </h2>
        <p className="text-center mb-10 opacity-80" style={{ color: "var(--site-text)" }}>
          {content.ctaText}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {content.contactInfo.phone && (
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${theme.colors.primary}15` }}
                >
                  <svg className="w-5 h-5" style={{ color: theme.colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-sm" style={{ color: "var(--site-text)" }}>{content.contactInfo.phone}</span>
              </div>
            )}
            {content.contactInfo.email && (
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${theme.colors.primary}15` }}
                >
                  <svg className="w-5 h-5" style={{ color: theme.colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm" style={{ color: "var(--site-text)" }}>{content.contactInfo.email}</span>
              </div>
            )}
            {content.contactInfo.address && (
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${theme.colors.primary}15` }}
                >
                  <svg className="w-5 h-5" style={{ color: theme.colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-sm" style={{ color: "var(--site-text)" }}>{content.contactInfo.address}</span>
              </div>
            )}
            {content.contactInfo.hours && (
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${theme.colors.primary}15` }}
                >
                  <svg className="w-5 h-5" style={{ color: theme.colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm" style={{ color: "var(--site-text)" }}>{content.contactInfo.hours}</span>
              </div>
            )}
          </div>
          <div
            className="bg-white p-6 shadow-sm"
            style={{ borderRadius: "var(--site-radius)" }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--site-text)" }}>Name</label>
                <div className="w-full h-10 rounded border border-gray-200 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--site-text)" }}>Email</label>
                <div className="w-full h-10 rounded border border-gray-200 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--site-text)" }}>Message</label>
                <div className="w-full h-24 rounded border border-gray-200 bg-gray-50" />
              </div>
              <button
                className="w-full py-3 text-white font-semibold text-sm"
                style={{
                  backgroundColor: theme.colors.primary,
                  borderRadius: "var(--site-radius)",
                }}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import type { SiteComponent } from "../site-preview/SiteRenderer";

interface Props {
  components: SiteComponent[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onReset: () => void;
}

const COMPONENT_LABELS: Record<string, string> = {
  navbar: "Navigation",
  hero: "Hero Banner",
  about: "About Section",
  services: "Services",
  menu: "Menu",
  gallery: "Gallery",
  testimonials: "Testimonials",
  reviews: "Reviews",
  booking: "Booking",
  contact: "Contact",
  footer: "Footer",
};

export function ComponentArranger({ components, onReorder, onReset }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const sorted = [...components].sort((a, b) => a.order - b.order);
  const movable = sorted.filter((c) => c.type !== "navbar" && c.type !== "footer");

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Sections
        </span>
        <svg className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-1 border-t border-gray-100 pt-3">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Drag to reorder sections</p>
          {movable.map((component, index) => (
            <div
              key={component.id}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md group"
            >
              <svg className="w-3.5 h-3.5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 6h2v2H8zM14 6h2v2h-2zM8 11h2v2H8zM14 11h2v2h-2zM8 16h2v2H8zM14 16h2v2h-2z" />
              </svg>
              <span className="flex-1 text-xs text-gray-700">
                {COMPONENT_LABELS[component.type] || component.type}
              </span>
              <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => index > 0 && onReorder(index, index - 1)}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                >
                  <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => index < movable.length - 1 && onReorder(index, index + 1)}
                  disabled={index === movable.length - 1}
                  className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                >
                  <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={onReset}
            className="w-full mt-2 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            Reset Order
          </button>
        </div>
      )}
    </div>
  );
}

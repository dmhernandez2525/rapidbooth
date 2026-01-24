"use client";

import React, { useState } from "react";
import type { SiteTheme } from "../site-preview/SiteRenderer";

interface Props {
  theme: SiteTheme;
  onUpdateColors: (colors: Partial<SiteTheme["colors"]>) => void;
  onUpdateTheme: (updates: Partial<SiteTheme>) => void;
  onReset: () => void;
}

const PRESET_PALETTES = [
  { name: "Ocean", colors: { primary: "#1E40AF", secondary: "#F59E0B", accent: "#10B981" } },
  { name: "Ember", colors: { primary: "#991B1B", secondary: "#D97706", accent: "#065F46" } },
  { name: "Navy", colors: { primary: "#1E3A5F", secondary: "#0D9488", accent: "#6366F1" } },
  { name: "Violet", colors: { primary: "#7C3AED", secondary: "#EC4899", accent: "#06B6D4" } },
  { name: "Forest", colors: { primary: "#1B4332", secondary: "#EEB422", accent: "#2D6A4F" } },
  { name: "Slate", colors: { primary: "#334155", secondary: "#F97316", accent: "#0EA5E9" } },
];

const FONT_OPTIONS = [
  { label: "Sans Serif", value: "sans-serif" },
  { label: "Serif", value: "serif" },
];

const STYLE_OPTIONS: Array<{ label: string; value: SiteTheme["style"] }> = [
  { label: "Modern", value: "modern" },
  { label: "Classic", value: "classic" },
  { label: "Rustic", value: "rustic" },
  { label: "Bold", value: "bold" },
];

export function ThemeCustomizer({ theme, onUpdateColors, onUpdateTheme, onReset }: Props) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Theme
        </span>
        <svg className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-3">
          {/* Color Presets */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Color Palette</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {PRESET_PALETTES.map((palette) => (
                <button
                  key={palette.name}
                  onClick={() => onUpdateColors(palette.colors)}
                  className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors"
                >
                  <div className="flex gap-0.5">
                    {Object.values(palette.colors).map((color, i) => (
                      <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-500">{palette.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Custom Colors</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {(["primary", "secondary", "accent"] as const).map((key) => (
                <div key={key} className="flex flex-col items-center gap-1">
                  <input
                    type="color"
                    value={theme.colors[key]}
                    onChange={(e) => onUpdateColors({ [key]: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                  />
                  <span className="text-[10px] text-gray-500 capitalize">{key}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Font</label>
            <div className="flex gap-2 mt-2">
              {FONT_OPTIONS.map((font) => (
                <button
                  key={font.value}
                  onClick={() => onUpdateTheme({ fontFamily: font.value })}
                  className={`flex-1 px-3 py-1.5 text-xs rounded-md border transition-colors ${
                    theme.fontFamily === font.value
                      ? "border-forest-green bg-forest-green/5 text-forest-green"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Style</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {STYLE_OPTIONS.map((style) => (
                <button
                  key={style.value}
                  onClick={() => {
                    const radiusMap: Record<string, string> = {
                      modern: "0.75rem", classic: "0.375rem", rustic: "0.375rem", bold: "1rem",
                    };
                    onUpdateTheme({ style: style.value, borderRadius: radiusMap[style.value] });
                  }}
                  className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                    theme.style === style.value
                      ? "border-forest-green bg-forest-green/5 text-forest-green"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={onReset}
            className="w-full px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            Reset to Default
          </button>
        </div>
      )}
    </div>
  );
}

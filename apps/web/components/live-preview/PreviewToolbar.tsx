"use client";

import React from "react";

export type DeviceView = "desktop" | "tablet" | "mobile";

interface Props {
  deviceView: DeviceView;
  onDeviceChange: (view: DeviceView) => void;
  template: string;
  status: string;
}

export function PreviewToolbar({ deviceView, onDeviceChange, template, status }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {template.replace("-", " ")}
        </span>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
          status === "generating" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            status === "generating" ? "bg-amber-500 animate-pulse" : "bg-green-500"
          }`} />
          {status === "generating" ? "Building..." : "Preview Ready"}
        </span>
      </div>
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
        {(["desktop", "tablet", "mobile"] as DeviceView[]).map((view) => (
          <button
            key={view}
            onClick={() => onDeviceChange(view)}
            className={`p-1.5 rounded-md transition-colors ${
              deviceView === view ? "bg-white shadow-sm text-forest-green" : "text-gray-400 hover:text-gray-600"
            }`}
            title={view}
          >
            {view === "desktop" && (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            )}
            {view === "tablet" && (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            )}
            {view === "mobile" && (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

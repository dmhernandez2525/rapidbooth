import React from "react";
import type { GeneratedContent, SiteTheme } from "../SiteRenderer";

interface Props {
  content: GeneratedContent;
  theme: SiteTheme;
}

export function BookingSection({ content, theme }: Props) {
  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  return (
    <section
      className="w-full py-16 px-6"
      style={{ backgroundColor: `${theme.colors.accent}08` }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: theme.colors.primary, fontFamily: "var(--site-font)" }}
        >
          Book an Appointment
        </h2>
        <p className="mb-8 opacity-80" style={{ color: "var(--site-text)" }}>
          Choose a convenient time and we&apos;ll take care of the rest.
        </p>
        <div
          className="bg-white p-6 shadow-sm"
          style={{ borderRadius: "var(--site-radius)" }}
        >
          <div className="mb-6">
            <p className="text-sm font-medium mb-3" style={{ color: "var(--site-text)" }}>Select a day:</p>
            <div className="flex justify-center gap-2">
              {days.map((day, i) => (
                <div
                  key={day}
                  className="w-12 h-12 flex items-center justify-center text-sm font-medium cursor-pointer transition-colors"
                  style={{
                    borderRadius: "var(--site-radius)",
                    backgroundColor: i === 1 ? theme.colors.primary : `${theme.colors.primary}10`,
                    color: i === 1 ? "white" : theme.colors.text,
                  }}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-3" style={{ color: "var(--site-text)" }}>Available times:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {timeSlots.map((slot, i) => (
                <div
                  key={slot}
                  className="px-3 py-2 text-xs font-medium cursor-pointer transition-colors"
                  style={{
                    borderRadius: "var(--site-radius)",
                    border: `1px solid ${i === 2 ? theme.colors.primary : theme.colors.primary + "30"}`,
                    backgroundColor: i === 2 ? `${theme.colors.primary}10` : "transparent",
                    color: theme.colors.text,
                  }}
                >
                  {slot}
                </div>
              ))}
            </div>
          </div>
          <button
            className="mt-6 px-8 py-3 text-white font-semibold text-sm"
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: "var(--site-radius)",
            }}
          >
            {content.ctaButtonText}
          </button>
        </div>
      </div>
    </section>
  );
}

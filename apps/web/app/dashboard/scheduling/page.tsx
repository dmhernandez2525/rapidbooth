"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Booking {
  id: string;
  siteId: string;
  businessName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  date: string;
  startTime: string;
  endTime: string;
  service?: string;
  status: "pending" | "confirmed" | "canceled" | "completed";
  confirmationCode: string;
}

interface AvailableSlot {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const DEMO_BOOKINGS: Booking[] = [
  { id: "bk_001", siteId: "site_summit", businessName: "Summit Plumbing & HVAC", customerName: "Alice Johnson", customerEmail: "alice@example.com", customerPhone: "(303) 555-1234", date: "2026-01-27", startTime: "09:00", endTime: "10:00", service: "Plumbing Repair", status: "confirmed", confirmationCode: "AB3K9X" },
  { id: "bk_002", siteId: "site_summit", businessName: "Summit Plumbing & HVAC", customerName: "Bob Williams", customerEmail: "bob@example.com", date: "2026-01-27", startTime: "10:15", endTime: "11:15", service: "HVAC Maintenance", status: "confirmed", confirmationCode: "CD7M2Y" },
  { id: "bk_003", siteId: "site_summit", businessName: "Summit Plumbing & HVAC", customerName: "Carol Davis", customerEmail: "carol@example.com", date: "2026-01-28", startTime: "14:00", endTime: "15:00", service: "Emergency Repair", status: "pending", confirmationCode: "EF5N8W" },
  { id: "bk_004", siteId: "site_dental", businessName: "Clearview Family Dental", customerName: "David Lee", customerEmail: "david@example.com", customerPhone: "(555) 999-0000", date: "2026-01-27", startTime: "09:00", endTime: "09:30", service: "Cleaning", status: "confirmed", confirmationCode: "GH1P4V" },
  { id: "bk_005", siteId: "site_dental", businessName: "Clearview Family Dental", customerName: "Emma Wilson", customerEmail: "emma@example.com", date: "2026-01-28", startTime: "10:00", endTime: "10:30", service: "Consultation", status: "confirmed", confirmationCode: "JK9Q6T" },
];

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
  canceled: "bg-red-50 text-red-600",
  completed: "bg-gray-100 text-gray-600",
};

function getWeekDates(start: Date): string[] {
  const dates: string[] = [];
  const d = new Date(start);
  d.setDate(d.getDate() - d.getDay() + 1); // Start from Monday
  for (let i = 0; i < 7; i++) {
    dates.push(d.toISOString().split("T")[0]);
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

export default function SchedulingPage() {
  const [bookings, setBookings] = useState<Booking[]>(DEMO_BOOKINGS);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });
  const [siteFilter, setSiteFilter] = useState("all");
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [weekStart, setWeekStart] = useState(() => new Date());

  const weekDates = getWeekDates(weekStart);
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const loadBookings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/scheduling/bookings`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings);
      }
    } catch { /* use demo data */ }
  }, []);

  const loadSlots = useCallback(async (siteId: string, date: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/scheduling/slots/${siteId}/${date}`);
      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots);
        return;
      }
    } catch { /* fallback */ }

    // Demo slots
    const demoSlots: AvailableSlot[] = [];
    const dayOfWeek = new Date(date + "T12:00:00").getDay();
    if (dayOfWeek === 0) { setSlots([]); return; } // Sunday closed

    const start = dayOfWeek === 6 ? 10 : 9;
    const end = dayOfWeek === 6 ? 14 : 17;
    for (let h = start; h < end; h++) {
      const startTime = `${h.toString().padStart(2, "0")}:00`;
      const endTime = `${(h + 1).toString().padStart(2, "0")}:00`;
      const isBooked = bookings.some((b) => b.date === date && b.startTime === startTime && b.status !== "canceled");
      demoSlots.push({ date, startTime, endTime, available: !isBooked });
    }
    setSlots(demoSlots);
  }, [bookings]);

  useEffect(() => { loadBookings(); }, [loadBookings]);
  useEffect(() => { loadSlots("site_summit", selectedDate); }, [selectedDate, loadSlots]);

  const filteredBookings = bookings.filter((b) => {
    if (siteFilter !== "all" && b.siteId !== siteFilter) return false;
    return true;
  });

  const todayBookings = filteredBookings.filter((b) => b.date === selectedDate);
  const upcomingBookings = filteredBookings
    .filter((b) => b.date >= new Date().toISOString().split("T")[0] && b.status !== "canceled")
    .slice(0, 10);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-slate-blue">Scheduling</h1>
            <p className="text-sm text-gray-500 mt-1">Manage appointments and availability</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green/20 outline-none"
            >
              <option value="all">All Sites</option>
              <option value="site_summit">Summit Plumbing</option>
              <option value="site_dental">Clearview Dental</option>
            </select>
            <Link href="/dashboard" className="text-sm text-forest-green hover:underline hidden sm:inline">
              ← Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Week View */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate() - 7); setWeekStart(d); }}
                  className="p-1.5 rounded hover:bg-gray-100"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm font-medium text-gray-700">
                  {new Date(weekDates[0]).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {new Date(weekDates[6]).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <button
                  onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate() + 7); setWeekStart(d); }}
                  className="p-1.5 rounded hover:bg-gray-100"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {weekDates.map((date, i) => {
                  const dayBookings = bookings.filter((b) => b.date === date && b.status !== "canceled");
                  const isSelected = date === selectedDate;
                  const isToday = date === new Date().toISOString().split("T")[0];
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`flex flex-col items-center py-3 rounded-lg transition-colors ${
                        isSelected ? "bg-forest-green text-white" : isToday ? "bg-harvest-gold/20" : "hover:bg-gray-50"
                      }`}
                    >
                      <span className={`text-[10px] font-medium ${isSelected ? "text-white/80" : "text-gray-400"}`}>{dayNames[i]}</span>
                      <span className={`text-sm font-semibold ${isSelected ? "" : "text-gray-700"}`}>{new Date(date + "T12:00:00").getDate()}</span>
                      {dayBookings.length > 0 && (
                        <span className={`mt-1 w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-forest-green"}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Available Slots — {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </h3>
              {slots.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">No availability for this day</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {slots.map((slot) => (
                    <div
                      key={slot.startTime}
                      className={`px-2 py-2 rounded-lg text-center text-xs font-medium ${
                        slot.available
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-400 line-through"
                      }`}
                    >
                      {slot.startTime}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Today's Bookings */}
            {todayBookings.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Bookings on {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </h3>
                <div className="space-y-2">
                  {todayBookings.map((booking) => (
                    <div key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <p className="text-xs font-bold text-gray-700">{booking.startTime}</p>
                          <p className="text-[10px] text-gray-400">{booking.endTime}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{booking.customerName}</p>
                          <p className="text-xs text-gray-500">{booking.service || "General"} · {booking.businessName}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${STATUS_STYLES[booking.status]}`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Upcoming */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Upcoming Appointments</h3>
              <div className="space-y-3">
                {upcomingBookings.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No upcoming bookings</p>
                ) : (
                  upcomingBookings.map((booking) => (
                    <div key={booking.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="w-10 h-10 rounded-lg bg-forest-green/10 flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-forest-green">
                          {new Date(booking.date + "T12:00:00").toLocaleDateString("en-US", { day: "numeric" })}
                        </span>
                        <span className="text-[8px] text-forest-green/70">
                          {new Date(booking.date + "T12:00:00").toLocaleDateString("en-US", { month: "short" })}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{booking.customerName}</p>
                        <p className="text-[10px] text-gray-500">{booking.startTime} - {booking.endTime}</p>
                        <p className="text-[10px] text-gray-400">{booking.service || "General"}</p>
                      </div>
                      <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded-full flex-shrink-0 ${STATUS_STYLES[booking.status]}`}>
                        {booking.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">This Week</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-forest-green">
                    {bookings.filter((b) => weekDates.includes(b.date) && b.status !== "canceled").length}
                  </p>
                  <p className="text-[10px] text-gray-500">Bookings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">
                    {bookings.filter((b) => weekDates.includes(b.date) && b.status === "pending").length}
                  </p>
                  <p className="text-[10px] text-gray-500">Pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

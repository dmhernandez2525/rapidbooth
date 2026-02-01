"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { GeneratedSite } from "@/components/site-preview";
import {
  DEMO_SITES,
  DEMO_METRICS,
  DEMO_PIPELINE,
  DEMO_REVENUE,
  DEMO_SESSIONS,
  DEMO_BOOKINGS,
  DEMO_REVIEWS,
  DEMO_BILLING,
  type DemoMetrics,
  type PipelineStage,
  type RevenueDataPoint,
  type DemoSession,
  type DemoBooking,
  type DemoReview,
  type DemoBillingInfo,
} from "./demo-data";

interface DemoContextType {
  // Demo mode state
  isDemoMode: boolean;

  // Sites
  sites: Record<string, GeneratedSite>;
  activeSiteId: string;
  setActiveSiteId: (id: string) => void;
  getActiveSite: () => GeneratedSite | null;

  // Dashboard data
  metrics: DemoMetrics;
  pipeline: PipelineStage[];
  revenue: RevenueDataPoint[];
  sessions: DemoSession[];

  // Scheduling data
  bookings: DemoBooking[];
  addBooking: (booking: Omit<DemoBooking, "id" | "confirmationCode">) => void;
  updateBookingStatus: (bookingId: string, status: DemoBooking["status"]) => void;

  // Reviews data
  reviews: DemoReview[];
  replyToReview: (reviewId: string, replyText: string) => void;

  // Billing data
  billing: DemoBillingInfo;

  // Demo user info
  demoUser: {
    name: string;
    email: string;
    company: string;
    avatar: string;
  };
}

const DemoContext = createContext<DemoContextType | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  // Sites state
  const [sites] = useState<Record<string, GeneratedSite>>(DEMO_SITES);
  const [activeSiteId, setActiveSiteId] = useState<string>("demo_home_services");

  // Dashboard data
  const [metrics] = useState<DemoMetrics>(DEMO_METRICS);
  const [pipeline] = useState<PipelineStage[]>(DEMO_PIPELINE);
  const [revenue] = useState<RevenueDataPoint[]>(DEMO_REVENUE);
  const [sessions] = useState<DemoSession[]>(DEMO_SESSIONS);

  // Scheduling data
  const [bookings, setBookings] = useState<DemoBooking[]>(DEMO_BOOKINGS);

  // Reviews data
  const [reviews, setReviews] = useState<DemoReview[]>(DEMO_REVIEWS);

  // Billing data
  const [billing] = useState<DemoBillingInfo>(DEMO_BILLING);

  // Demo user
  const demoUser = useMemo(() => ({
    name: "Demo User",
    email: "demo@rapidbooth.com",
    company: "Demo Company",
    avatar: "DU",
  }), []);

  // Site helpers
  const getActiveSite = useCallback(() => {
    return sites[activeSiteId] || null;
  }, [sites, activeSiteId]);

  // Booking helpers
  const addBooking = useCallback((booking: Omit<DemoBooking, "id" | "confirmationCode">) => {
    const newBooking: DemoBooking = {
      ...booking,
      id: `bk_demo_${Date.now()}`,
      confirmationCode: generateConfirmationCode(),
    };
    setBookings((prev) => [...prev, newBooking]);
  }, []);

  const updateBookingStatus = useCallback((bookingId: string, status: DemoBooking["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  }, []);

  // Review helpers
  const replyToReview = useCallback((reviewId: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, replied: true, replyText } : r
      )
    );
  }, []);

  const contextValue = useMemo(
    () => ({
      isDemoMode: true,
      sites,
      activeSiteId,
      setActiveSiteId,
      getActiveSite,
      metrics,
      pipeline,
      revenue,
      sessions,
      bookings,
      addBooking,
      updateBookingStatus,
      reviews,
      replyToReview,
      billing,
      demoUser,
    }),
    [
      sites,
      activeSiteId,
      getActiveSite,
      metrics,
      pipeline,
      revenue,
      sessions,
      bookings,
      addBooking,
      updateBookingStatus,
      reviews,
      replyToReview,
      billing,
      demoUser,
    ]
  );

  return (
    <DemoContext.Provider value={contextValue}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return context;
}

// Helper function to generate confirmation codes
function generateConfirmationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

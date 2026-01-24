"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Review {
  id: string;
  siteId: string;
  platform: "google" | "yelp" | "facebook";
  author: string;
  rating: number;
  text: string;
  date: string;
  response?: string;
  responseDate?: string;
  status: "published" | "hidden" | "flagged";
  helpful: number;
  verified: boolean;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  platformBreakdown: Record<string, { count: number; avgRating: number }>;
  ratingDistribution: Record<number, number>;
  monthlyTrend: Array<{ month: string; count: number; avgRating: number }>;
  responseRate: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const PLATFORM_ICONS: Record<string, { label: string; color: string; bg: string }> = {
  google: { label: "Google", color: "text-blue-600", bg: "bg-blue-50" },
  yelp: { label: "Yelp", color: "text-red-600", bg: "bg-red-50" },
  facebook: { label: "Facebook", color: "text-indigo-600", bg: "bg-indigo-50" },
};

const STATUS_STYLES: Record<string, string> = {
  published: "bg-green-50 text-green-700",
  hidden: "bg-gray-100 text-gray-500",
  flagged: "bg-red-50 text-red-600",
};

const DEMO_REVIEWS: Review[] = [
  { id: "rev_summit_001", siteId: "site_summit", platform: "google", author: "Sarah M.", rating: 5, text: "Best plumbing service in Denver! They fixed our water heater same day. Professional, courteous, and fair pricing. Highly recommend Summit Plumbing.", date: "2025-12-15", response: "Thank you Sarah! We're glad we could help with your water heater.", responseDate: "2025-12-16", status: "published", helpful: 12, verified: true },
  { id: "rev_summit_002", siteId: "site_summit", platform: "google", author: "Mike R.", rating: 5, text: "Called for an emergency pipe burst at 2am and they were here within 30 minutes. Incredible response time and quality work.", date: "2025-12-10", response: "We're always here for emergencies, Mike!", responseDate: "2025-12-11", status: "published", helpful: 8, verified: true },
  { id: "rev_summit_003", siteId: "site_summit", platform: "yelp", author: "Jennifer K.", rating: 4, text: "Good service overall. They installed our new furnace efficiently. Only reason for 4 stars is the initial scheduling took a few days.", date: "2025-11-28", status: "published", helpful: 5, verified: true },
  { id: "rev_summit_004", siteId: "site_summit", platform: "google", author: "Tom H.", rating: 5, text: "Used Summit for both plumbing and HVAC. Their technicians are knowledgeable and explain everything clearly. No surprise charges.", date: "2025-11-20", response: "Thanks Tom! Transparency is important to us.", responseDate: "2025-11-21", status: "published", helpful: 6, verified: true },
  { id: "rev_summit_005", siteId: "site_summit", platform: "yelp", author: "Lisa P.", rating: 3, text: "Decent work but took longer than quoted. The final result was good but communication during the job could be better.", date: "2025-11-15", status: "published", helpful: 2, verified: true },
  { id: "rev_summit_006", siteId: "site_summit", platform: "google", author: "David W.", rating: 5, text: "Annual HVAC maintenance. Always reliable, always thorough. They catch issues before they become problems.", date: "2025-11-08", status: "published", helpful: 4, verified: true },
  { id: "rev_summit_007", siteId: "site_summit", platform: "google", author: "Rachel S.", rating: 5, text: "Replaced all our bathroom fixtures. Work was immaculate and they cleaned up perfectly.", date: "2025-10-25", status: "published", helpful: 7, verified: true },
  { id: "rev_summit_008", siteId: "site_summit", platform: "yelp", author: "Carlos G.", rating: 4, text: "Solid work on our kitchen sink replacement. Fair pricing and good warranty.", date: "2025-10-18", status: "published", helpful: 3, verified: true },
  { id: "rev_summit_009", siteId: "site_summit", platform: "google", author: "Nancy B.", rating: 2, text: "Showed up late and the repair didn't hold. Had to call back for a redo.", date: "2025-10-10", response: "We sincerely apologize, Nancy. We've addressed this with our team.", responseDate: "2025-10-11", status: "published", helpful: 1, verified: true },
  { id: "rev_summit_010", siteId: "site_summit", platform: "google", author: "Alex T.", rating: 5, text: "Installed a tankless water heater. Energy bills have dropped significantly. Great recommendation from their team.", date: "2025-10-01", status: "published", helpful: 9, verified: true },
  { id: "rev_dental_001", siteId: "site_dental", platform: "google", author: "Amanda C.", rating: 5, text: "Dr. Chen is amazing! My kids actually look forward to their dental visits. The office is modern and the staff is so friendly.", date: "2025-12-18", response: "Thank you Amanda! We love seeing your family.", responseDate: "2025-12-18", status: "published", helpful: 15, verified: true },
  { id: "rev_dental_002", siteId: "site_dental", platform: "google", author: "Robert J.", rating: 5, text: "Had a crown done here. Painless procedure, perfect fit on the first try. The digital imaging technology they use is impressive.", date: "2025-12-12", status: "published", helpful: 8, verified: true },
  { id: "rev_dental_003", siteId: "site_dental", platform: "yelp", author: "Maria G.", rating: 4, text: "Clean office, friendly staff, minimal wait time. Only wish they had more evening hours available.", date: "2025-12-05", status: "published", helpful: 4, verified: true },
  { id: "rev_dental_004", siteId: "site_dental", platform: "facebook", author: "Kevin M.", rating: 5, text: "Emergency tooth extraction was handled with such care. Dr. Chen explained every step and made sure I was comfortable.", date: "2025-11-22", response: "We hope you're healing well, Kevin!", responseDate: "2025-11-23", status: "published", helpful: 6, verified: true },
  { id: "rev_dental_005", siteId: "site_dental", platform: "google", author: "Susan P.", rating: 5, text: "Teeth whitening results exceeded my expectations. Three shades lighter!", date: "2025-11-15", status: "published", helpful: 11, verified: true },
];

const DEMO_STATS: ReviewStats = {
  totalReviews: 15,
  averageRating: 4.5,
  platformBreakdown: {
    google: { count: 11, avgRating: 4.6 },
    yelp: { count: 3, avgRating: 3.7 },
    facebook: { count: 1, avgRating: 5.0 },
  },
  ratingDistribution: { 1: 0, 2: 1, 3: 2, 4: 3, 5: 9 },
  monthlyTrend: [
    { month: "Aug 2025", count: 0, avgRating: 0 },
    { month: "Sep 2025", count: 1, avgRating: 5.0 },
    { month: "Oct 2025", count: 4, avgRating: 4.3 },
    { month: "Nov 2025", count: 5, avgRating: 4.4 },
    { month: "Dec 2025", count: 5, avgRating: 4.8 },
    { month: "Jan 2026", count: 0, avgRating: 0 },
  ],
  responseRate: 47,
};

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "w-5 h-5" : size === "md" ? "w-4 h-4" : "w-3 h-3";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClass} ${star <= rating ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(DEMO_REVIEWS);
  const [stats, setStats] = useState<ReviewStats>(DEMO_STATS);
  const [siteFilter, setSiteFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [tab, setTab] = useState<"reviews" | "analytics" | "requests">("reviews");
  const [requestEmails, setRequestEmails] = useState("");

  const loadReviews = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (siteFilter !== "all") params.set("siteId", siteFilter);
      if (platformFilter !== "all") params.set("platform", platformFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`${API_BASE}/api/reviews?${params.toString()}`);
      if (res.ok) {
        const data = await res.json() as { reviews: Review[] };
        setReviews(data.reviews);
      }
    } catch { /* use demo data */ }
  }, [siteFilter, platformFilter, statusFilter]);

  const loadStats = useCallback(async () => {
    try {
      const siteId = siteFilter !== "all" ? siteFilter : "site_summit";
      const res = await fetch(`${API_BASE}/api/reviews/stats/${siteId}`);
      if (res.ok) {
        const data = await res.json() as { stats: ReviewStats };
        setStats(data.stats);
      }
    } catch { /* use demo data */ }
  }, [siteFilter]);

  useEffect(() => { loadReviews(); }, [loadReviews]);
  useEffect(() => { loadStats(); }, [loadStats]);

  const handleRespond = async (reviewId: string) => {
    if (!responseText.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/reviews/${reviewId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: responseText }),
      });
      if (res.ok) {
        loadReviews();
      }
    } catch { /* fallback */ }

    // Optimistic update
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, response: responseText, responseDate: new Date().toISOString().split("T")[0] } : r
      )
    );
    setRespondingTo(null);
    setResponseText("");
  };

  const handleStatusChange = async (reviewId: string, newStatus: "published" | "hidden" | "flagged") => {
    try {
      await fetch(`${API_BASE}/api/reviews/${reviewId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch { /* ignore */ }
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r)));
  };

  const handleRequestReviews = async () => {
    const emails = requestEmails.split(/[,\n]/).map((e) => e.trim()).filter(Boolean);
    if (emails.length === 0) return;
    try {
      await fetch(`${API_BASE}/api/reviews/request/${siteFilter !== "all" ? siteFilter : "site_summit"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails }),
      });
    } catch { /* ignore */ }
    setRequestEmails("");
  };

  const filteredReviews = reviews.filter((r) => {
    if (siteFilter !== "all" && r.siteId !== siteFilter) return false;
    if (platformFilter !== "all" && r.platform !== platformFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    return true;
  });

  const maxTrend = Math.max(...stats.monthlyTrend.map((t) => t.count), 1);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif font-bold text-2xl text-slate-blue">Reviews</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and respond to customer reviews</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green/20 outline-none"
            >
              <option value="all">All Sites</option>
              <option value="site_summit">Summit Plumbing</option>
              <option value="site_dental">Clearview Dental</option>
            </select>
            <Link href="/dashboard" className="text-sm text-forest-green hover:underline">
              &larr; Dashboard
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 shadow-sm border border-gray-200 w-fit">
          {(["reviews", "analytics", "requests"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                tab === t ? "bg-forest-green text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "reviews" && (
          <>
            {/* Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                <p className="text-2xl font-bold text-forest-green">{stats.totalReviews}</p>
                <p className="text-[10px] text-gray-500 mt-1">Total Reviews</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                <p className="text-2xl font-bold text-amber-500">{stats.averageRating}</p>
                <p className="text-[10px] text-gray-500 mt-1">Average Rating</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.responseRate}%</p>
                <p className="text-[10px] text-gray-500 mt-1">Response Rate</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {Object.keys(stats.platformBreakdown).length}
                </p>
                <p className="text-[10px] text-gray-500 mt-1">Platforms</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4">
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green/20 outline-none"
              >
                <option value="all">All Platforms</option>
                <option value="google">Google</option>
                <option value="yelp">Yelp</option>
                <option value="facebook">Facebook</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green/20 outline-none"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="hidden">Hidden</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {filteredReviews.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <p className="text-sm text-gray-400">No reviews matching your filters</p>
                </div>
              ) : (
                filteredReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${PLATFORM_ICONS[review.platform].bg} ${PLATFORM_ICONS[review.platform].color}`}>
                          {review.platform[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900">{review.author}</p>
                            {review.verified && (
                              <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">Verified</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <StarRating rating={review.rating} />
                            <span className="text-[10px] text-gray-400">{review.date}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${PLATFORM_ICONS[review.platform].bg} ${PLATFORM_ICONS[review.platform].color}`}>
                              {PLATFORM_ICONS[review.platform].label}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[9px] font-medium rounded-full ${STATUS_STYLES[review.status]}`}>
                          {review.status}
                        </span>
                        <select
                          value={review.status}
                          onChange={(e) => handleStatusChange(review.id, e.target.value as "published" | "hidden" | "flagged")}
                          className="text-[10px] border border-gray-200 rounded px-1 py-0.5 outline-none"
                        >
                          <option value="published">Publish</option>
                          <option value="hidden">Hide</option>
                          <option value="flagged">Flag</option>
                        </select>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mt-2 leading-relaxed">{review.text}</p>

                    {review.helpful > 0 && (
                      <p className="text-[10px] text-gray-400 mt-1">{review.helpful} people found this helpful</p>
                    )}

                    {review.response && (
                      <div className="mt-3 ml-6 pl-3 border-l-2 border-forest-green/30">
                        <p className="text-[10px] font-medium text-forest-green">Business Response · {review.responseDate}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{review.response}</p>
                      </div>
                    )}

                    {!review.response && respondingTo !== review.id && (
                      <button
                        onClick={() => setRespondingTo(review.id)}
                        className="mt-2 text-xs text-forest-green hover:underline"
                      >
                        Respond
                      </button>
                    )}

                    {respondingTo === review.id && (
                      <div className="mt-3 ml-6">
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Write your response..."
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green/20 outline-none resize-none"
                          rows={3}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleRespond(review.id)}
                            className="px-3 py-1 text-xs bg-forest-green text-white rounded-lg hover:bg-forest-green/90"
                          >
                            Send Response
                          </button>
                          <button
                            onClick={() => { setRespondingTo(null); setResponseText(""); }}
                            className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {tab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rating Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Rating Distribution</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.ratingDistribution[rating] || 0;
                  const pct = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-600 w-3">{rating}</span>
                      <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <p className="text-3xl font-bold text-gray-900">{stats.averageRating}</p>
                <StarRating rating={Math.round(stats.averageRating)} size="md" />
                <p className="text-[10px] text-gray-400 mt-1">Based on {stats.totalReviews} reviews</p>
              </div>
            </div>

            {/* Platform Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Platform Breakdown</h3>
              <div className="space-y-4">
                {Object.entries(stats.platformBreakdown).map(([platform, data]) => (
                  <div key={platform} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${PLATFORM_ICONS[platform]?.bg || "bg-gray-100"}`}>
                        <span className={`text-xs font-bold ${PLATFORM_ICONS[platform]?.color || "text-gray-600"}`}>
                          {platform[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{PLATFORM_ICONS[platform]?.label || platform}</p>
                        <p className="text-[10px] text-gray-400">{data.count} reviews</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{data.avgRating}</p>
                      <StarRating rating={Math.round(data.avgRating)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Trend */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 lg:col-span-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Monthly Review Trend</h3>
              <div className="flex items-end gap-3 h-32">
                {stats.monthlyTrend.map((month) => (
                  <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] font-medium text-gray-500">
                      {month.count > 0 ? month.avgRating.toFixed(1) : "—"}
                    </span>
                    <div className="w-full flex justify-center">
                      <div
                        className="w-8 bg-forest-green/70 rounded-t transition-all"
                        style={{ height: `${month.count > 0 ? (month.count / maxTrend) * 80 : 4}px` }}
                      />
                    </div>
                    <span className="text-[9px] text-gray-400">{month.month.split(" ")[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Rate */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 lg:col-span-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Response Metrics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-forest-green">{stats.responseRate}%</p>
                  <p className="text-[10px] text-gray-500">Response Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {filteredReviews.filter((r) => r.response).length}
                  </p>
                  <p className="text-[10px] text-gray-500">Responded</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">
                    {filteredReviews.filter((r) => !r.response).length}
                  </p>
                  <p className="text-[10px] text-gray-500">Awaiting Response</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "requests" && (
          <div className="max-w-xl">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Request Reviews</h3>
              <p className="text-xs text-gray-500 mb-4">
                Send review request emails to recent customers. They&apos;ll receive a link to leave a review on their preferred platform.
              </p>
              <textarea
                value={requestEmails}
                onChange={(e) => setRequestEmails(e.target.value)}
                placeholder="Enter customer emails (one per line or comma-separated)"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green/20 outline-none resize-none"
                rows={5}
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-[10px] text-gray-400">
                  {requestEmails.split(/[,\n]/).filter((e) => e.trim()).length} email(s) entered
                </p>
                <button
                  onClick={handleRequestReviews}
                  disabled={!requestEmails.trim()}
                  className="px-4 py-1.5 text-xs bg-forest-green text-white rounded-lg hover:bg-forest-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Requests
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Widget Settings</h3>
              <p className="text-xs text-gray-500 mb-3">Configure how reviews appear on your generated site.</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Display Layout</label>
                  <div className="grid grid-cols-4 gap-2 mt-1">
                    {(["carousel", "grid", "list", "masonry"] as const).map((layout) => (
                      <button
                        key={layout}
                        className="px-2 py-1.5 text-[10px] font-medium border border-gray-200 rounded-lg hover:border-forest-green hover:text-forest-green transition-colors capitalize"
                      >
                        {layout}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Minimum Rating to Display</label>
                  <select className="mt-1 w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green/20 outline-none">
                    <option value="1">1+ Stars (Show All)</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="5">5 Stars Only</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-600">Auto-publish New Reviews</label>
                  <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-forest-green">
                    <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition translate-x-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

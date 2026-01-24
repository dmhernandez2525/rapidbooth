"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Subscription {
  id: string;
  clientId: string;
  businessName: string;
  plan: string;
  status: "active" | "past_due" | "canceled" | "trialing";
  amount: number;
  currency: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

interface Invoice {
  id: string;
  subscriptionId: string;
  businessName: string;
  amount: number;
  status: "succeeded" | "pending" | "failed";
  periodStart: string;
  periodEnd: string;
  paidAt?: string;
  createdAt: string;
}

interface BillingMetrics {
  mrr: number;
  totalRevenue: number;
  activeSubscriptions: number;
  churnRate: number;
  avgRevenuePerClient: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const DEMO_METRICS: BillingMetrics = {
  mrr: 9000,
  totalRevenue: 27000,
  activeSubscriptions: 3,
  churnRate: 0,
  avgRevenuePerClient: 3000,
};

const DEMO_SUBSCRIPTIONS: Subscription[] = [
  { id: "sub_001", clientId: "client_001", businessName: "Summit Plumbing & HVAC", plan: "starter", status: "active", amount: 3000, currency: "usd", currentPeriodStart: "2025-12-15T00:00:00Z", currentPeriodEnd: "2026-01-15T00:00:00Z", cancelAtPeriodEnd: false, createdAt: "2025-10-15T00:00:00Z" },
  { id: "sub_002", clientId: "client_002", businessName: "Bella Cucina", plan: "starter", status: "active", amount: 3000, currency: "usd", currentPeriodStart: "2025-12-20T00:00:00Z", currentPeriodEnd: "2026-01-20T00:00:00Z", cancelAtPeriodEnd: false, createdAt: "2025-10-20T00:00:00Z" },
  { id: "sub_003", clientId: "client_003", businessName: "Clearview Family Dental", plan: "starter", status: "active", amount: 3000, currency: "usd", currentPeriodStart: "2025-12-01T00:00:00Z", currentPeriodEnd: "2026-01-01T00:00:00Z", cancelAtPeriodEnd: false, createdAt: "2025-11-01T00:00:00Z" },
];

const DEMO_INVOICES: Invoice[] = [
  { id: "inv_001", subscriptionId: "sub_001", businessName: "Summit Plumbing & HVAC", amount: 3000, status: "succeeded", periodStart: "2025-12-15T00:00:00Z", periodEnd: "2026-01-15T00:00:00Z", paidAt: "2025-12-16T00:00:00Z", createdAt: "2025-12-15T00:00:00Z" },
  { id: "inv_002", subscriptionId: "sub_002", businessName: "Bella Cucina", amount: 3000, status: "succeeded", periodStart: "2025-12-20T00:00:00Z", periodEnd: "2026-01-20T00:00:00Z", paidAt: "2025-12-21T00:00:00Z", createdAt: "2025-12-20T00:00:00Z" },
  { id: "inv_003", subscriptionId: "sub_003", businessName: "Clearview Family Dental", amount: 3000, status: "succeeded", periodStart: "2025-12-01T00:00:00Z", periodEnd: "2026-01-01T00:00:00Z", paidAt: "2025-12-02T00:00:00Z", createdAt: "2025-12-01T00:00:00Z" },
  { id: "inv_004", subscriptionId: "sub_001", businessName: "Summit Plumbing & HVAC", amount: 3000, status: "succeeded", periodStart: "2025-11-15T00:00:00Z", periodEnd: "2025-12-15T00:00:00Z", paidAt: "2025-11-16T00:00:00Z", createdAt: "2025-11-15T00:00:00Z" },
  { id: "inv_005", subscriptionId: "sub_002", businessName: "Bella Cucina", amount: 3000, status: "succeeded", periodStart: "2025-11-20T00:00:00Z", periodEnd: "2025-12-20T00:00:00Z", paidAt: "2025-11-21T00:00:00Z", createdAt: "2025-11-20T00:00:00Z" },
];

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  trialing: "bg-blue-50 text-blue-700",
  past_due: "bg-red-50 text-red-700",
  canceled: "bg-gray-100 text-gray-500",
  succeeded: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-700",
};

export default function BillingPage() {
  const [metrics, setMetrics] = useState<BillingMetrics>(DEMO_METRICS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(DEMO_SUBSCRIPTIONS);
  const [allInvoices, setInvoices] = useState<Invoice[]>(DEMO_INVOICES);
  const [activeTab, setActiveTab] = useState<"subscriptions" | "invoices">("subscriptions");

  const loadData = useCallback(async () => {
    try {
      const [metricsRes, subsRes, invRes] = await Promise.all([
        fetch(`${API_BASE}/api/billing/metrics`),
        fetch(`${API_BASE}/api/billing/subscriptions`),
        fetch(`${API_BASE}/api/billing/invoices`),
      ]);
      if (metricsRes.ok) setMetrics(await metricsRes.json());
      if (subsRes.ok) { const d = await subsRes.json(); setSubscriptions(d.subscriptions); }
      if (invRes.ok) { const d = await invRes.json(); setInvoices(d.invoices); }
    } catch { /* use demo data */ }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const formatAmount = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif font-bold text-2xl text-slate-blue">Billing</h1>
            <p className="text-sm text-gray-500 mt-1">Subscription management and invoice history</p>
          </div>
          <Link href="/dashboard" className="text-sm text-forest-green hover:underline">
            ← Dashboard
          </Link>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Monthly Revenue</p>
            <p className="text-xl font-bold text-slate-blue">{formatAmount(metrics.mrr)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Total Collected</p>
            <p className="text-xl font-bold text-slate-blue">{formatAmount(metrics.totalRevenue)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Active Plans</p>
            <p className="text-xl font-bold text-forest-green">{metrics.activeSubscriptions}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Churn Rate</p>
            <p className="text-xl font-bold text-slate-blue">{metrics.churnRate}%</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("subscriptions")}
              className={`flex-1 sm:flex-none px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "subscriptions"
                  ? "text-forest-green border-b-2 border-forest-green"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Subscriptions ({subscriptions.length})
            </button>
            <button
              onClick={() => setActiveTab("invoices")}
              className={`flex-1 sm:flex-none px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "invoices"
                  ? "text-forest-green border-b-2 border-forest-green"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Invoices ({allInvoices.length})
            </button>
          </div>

          {activeTab === "subscriptions" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase">Business</th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase">Plan</th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase">Period</th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase">Since</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">{sub.businessName}</td>
                      <td className="px-6 py-3 text-xs text-gray-600 capitalize">{sub.plan}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full ${STATUS_STYLES[sub.status]}`}>
                          {sub.status}{sub.cancelAtPeriodEnd ? " (canceling)" : ""}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">{formatAmount(sub.amount)}/mo</td>
                      <td className="px-6 py-3 text-xs text-gray-500">
                        {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-xs text-gray-500">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "invoices" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase">Invoice</th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase">Business</th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase">Period</th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase">Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-xs font-mono text-gray-500">{inv.id.substring(0, 12)}...</td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">{inv.businessName}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{formatAmount(inv.amount)}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full ${STATUS_STYLES[inv.status]}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-xs text-gray-500">
                        {new Date(inv.periodStart).toLocaleDateString()} - {new Date(inv.periodEnd).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-xs text-gray-500">
                        {inv.paidAt ? new Date(inv.paidAt).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

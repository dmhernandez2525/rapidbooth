"use client";

import React, { useState, useEffect, useCallback } from "react";

interface RepMetrics {
  totalSessions: number;
  completedSessions: number;
  conversionRate: number;
  totalRevenue: number;
  activeClients: number;
  avgSessionDuration: number;
  sitesDeployed: number;
  thisMonthSessions: number;
  thisMonthRevenue: number;
}

interface PipelineStage {
  stage: string;
  count: number;
  revenue: number;
}

interface RevenueDataPoint {
  month: string;
  revenue: number;
  clients: number;
}

interface DashboardSession {
  id: string;
  businessName: string;
  status: "active" | "completed" | "abandoned";
  currentPhase: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  clientStatus: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const DEMO_METRICS: RepMetrics = {
  totalSessions: 8,
  completedSessions: 5,
  conversionRate: 38,
  totalRevenue: 90,
  activeClients: 3,
  avgSessionDuration: 28,
  sitesDeployed: 3,
  thisMonthSessions: 3,
  thisMonthRevenue: 0,
};

const DEMO_PIPELINE: PipelineStage[] = [
  { stage: "lead", count: 2, revenue: 0 },
  { stage: "prospect", count: 2, revenue: 0 },
  { stage: "active", count: 3, revenue: 90 },
  { stage: "churned", count: 1, revenue: 0 },
];

const DEMO_REVENUE: RevenueDataPoint[] = [
  { month: "Sep", revenue: 30, clients: 1 },
  { month: "Oct", revenue: 60, clients: 2 },
  { month: "Nov", revenue: 90, clients: 3 },
  { month: "Dec", revenue: 90, clients: 3 },
  { month: "Jan", revenue: 90, clients: 3 },
];

const DEMO_SESSIONS: DashboardSession[] = [
  { id: "ses_007", businessName: "Mitchell Law Group", status: "active", currentPhase: "discovery", startedAt: "2025-12-22T10:00:00Z", clientStatus: "lead" },
  { id: "ses_006", businessName: "Oak & Vine Wine Bar", status: "abandoned", currentPhase: "audit", startedAt: "2025-12-20T16:00:00Z", duration: 8, clientStatus: "lead" },
  { id: "ses_005", businessName: "Coastal Hair Studio", status: "active", currentPhase: "design", startedAt: "2025-12-19T15:00:00Z", clientStatus: "prospect" },
  { id: "ses_004", businessName: "Green Thumb Landscaping", status: "completed", currentPhase: "close", startedAt: "2025-12-10T11:00:00Z", completedAt: "2025-12-10T11:30:00Z", duration: 30, clientStatus: "prospect" },
  { id: "ses_003", businessName: "Clearview Family Dental", status: "completed", currentPhase: "close", startedAt: "2025-11-01T09:00:00Z", completedAt: "2025-11-01T09:22:00Z", duration: 22, clientStatus: "active" },
  { id: "ses_002", businessName: "Bella Cucina", status: "completed", currentPhase: "close", startedAt: "2025-10-20T14:00:00Z", completedAt: "2025-10-20T14:35:00Z", duration: 35, clientStatus: "active" },
  { id: "ses_001", businessName: "Summit Plumbing & HVAC", status: "completed", currentPhase: "close", startedAt: "2025-10-15T10:00:00Z", completedAt: "2025-10-15T10:28:00Z", duration: 28, clientStatus: "active" },
  { id: "ses_008", businessName: "Precision Auto Care", status: "completed", currentPhase: "close", startedAt: "2025-09-01T13:00:00Z", completedAt: "2025-09-01T13:25:00Z", duration: 25, clientStatus: "churned" },
];

const STAGE_LABELS: Record<string, string> = {
  lead: "Leads",
  prospect: "Prospects",
  active: "Active Clients",
  churned: "Churned",
};

const STAGE_COLORS: Record<string, string> = {
  lead: "bg-blue-100 text-blue-700",
  prospect: "bg-amber-100 text-amber-700",
  active: "bg-green-100 text-green-700",
  churned: "bg-gray-100 text-gray-500",
};

const STATUS_BADGES: Record<string, string> = {
  active: "bg-blue-50 text-blue-700",
  completed: "bg-green-50 text-green-700",
  abandoned: "bg-red-50 text-red-600",
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<RepMetrics>(DEMO_METRICS);
  const [pipeline, setPipeline] = useState<PipelineStage[]>(DEMO_PIPELINE);
  const [revenue, setRevenue] = useState<RevenueDataPoint[]>(DEMO_REVENUE);
  const [sessions, setSessions] = useState<DashboardSession[]>(DEMO_SESSIONS);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [metricsRes, pipelineRes, revenueRes, sessionsRes] = await Promise.all([
        fetch(`${API_BASE}/api/dashboard/metrics`),
        fetch(`${API_BASE}/api/dashboard/pipeline`),
        fetch(`${API_BASE}/api/dashboard/revenue`),
        fetch(`${API_BASE}/api/dashboard/sessions`),
      ]);

      if (metricsRes.ok) setMetrics(await metricsRes.json());
      if (pipelineRes.ok) {
        const data = await pipelineRes.json();
        setPipeline(data.pipeline);
      }
      if (revenueRes.ok) {
        const data = await revenueRes.json();
        setRevenue(data.history);
      }
      if (sessionsRes.ok) {
        const data = await sessionsRes.json();
        setSessions(data.sessions);
      }
    } catch {
      // Use demo data
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredSessions = sessions.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (searchQuery && !s.businessName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const maxRevenue = Math.max(...revenue.map((r) => r.revenue), 1);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-slate-blue">Rep Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Session tracking, client pipeline, and performance metrics</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <MetricCard label="Active Clients" value={metrics.activeClients} icon="users" color="green" />
          <MetricCard label="Monthly Revenue" value={`$${metrics.totalRevenue}`} icon="dollar" color="blue" />
          <MetricCard label="Conversion Rate" value={`${metrics.conversionRate}%`} icon="chart" color="amber" />
          <MetricCard label="Avg Session" value={`${metrics.avgSessionDuration}m`} icon="clock" color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pipeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Client Pipeline</h2>
            <div className="space-y-3">
              {pipeline.map((stage) => {
                const totalClients = pipeline.reduce((sum, s) => sum + s.count, 0);
                const pct = totalClients > 0 ? (stage.count / totalClients) * 100 : 0;
                return (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STAGE_COLORS[stage.stage] || ""}`}>
                        {STAGE_LABELS[stage.stage] || stage.stage}
                      </span>
                      <span className="text-xs text-gray-500">{stage.count}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          stage.stage === "active" ? "bg-green-400" : stage.stage === "prospect" ? "bg-amber-400" : stage.stage === "lead" ? "bg-blue-400" : "bg-gray-300"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Monthly Revenue</h2>
            <div className="flex items-end gap-3 h-40">
              {revenue.map((point) => (
                <div key={point.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-500">${point.revenue}</span>
                  <div
                    className="w-full bg-forest-green/80 rounded-t transition-all"
                    style={{ height: `${(point.revenue / maxRevenue) * 100}%`, minHeight: "4px" }}
                  />
                  <span className="text-[10px] text-gray-400">{point.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-6 border-t border-gray-100 pt-3">
              <div>
                <p className="text-xs text-gray-500">Total Revenue</p>
                <p className="text-lg font-bold text-slate-blue">${revenue.reduce((sum, r) => sum + r.revenue, 0)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Current MRR</p>
                <p className="text-lg font-bold text-forest-green">${metrics.totalRevenue}/mo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-sm font-semibold text-gray-700">Sessions</h2>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green/20 focus:border-forest-green outline-none w-44"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-green/20 focus:border-forest-green outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="abandoned">Abandoned</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Business</th>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Phase</th>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Pipeline</th>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <span className="text-sm font-medium text-gray-900">{session.businessName}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full ${STATUS_BADGES[session.status] || ""}`}>
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-xs text-gray-600 capitalize">{session.currentPhase}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full ${STAGE_COLORS[session.clientStatus] || ""}`}>
                        {session.clientStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-xs text-gray-500">
                        {session.duration ? `${session.duration}m` : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-xs text-gray-500">
                        {new Date(session.startedAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredSessions.length === 0 && (
            <div className="px-6 py-8 text-center text-sm text-gray-400">No sessions match your filters.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  const colorMap: Record<string, string> = {
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          {icon === "users" && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          {icon === "dollar" && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          {icon === "chart" && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
          {icon === "clock" && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-bold text-slate-blue">{value}</p>
        </div>
      </div>
    </div>
  );
}

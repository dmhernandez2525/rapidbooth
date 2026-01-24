"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

type DeploymentStatus = "queued" | "building" | "provisioning_ssl" | "configuring_dns" | "deploying" | "live" | "stopped" | "failed";

interface BuildLogEntry {
  timestamp: string;
  message: string;
  level: "info" | "success" | "warning" | "error";
}

interface Deployment {
  id: string;
  siteId: string;
  status: DeploymentStatus;
  subdomain: string;
  customDomain?: string;
  url: string;
  sslProvisioned: boolean;
  dnsConfigured: boolean;
  buildLog: BuildLogEntry[];
  createdAt: string;
  updatedAt: string;
  deployedAt?: string;
  stoppedAt?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const STATUS_STEPS: Array<{ status: DeploymentStatus; label: string }> = [
  { status: "queued", label: "Queued" },
  { status: "building", label: "Building" },
  { status: "provisioning_ssl", label: "SSL Certificate" },
  { status: "configuring_dns", label: "DNS Configuration" },
  { status: "deploying", label: "Deploying" },
  { status: "live", label: "Live" },
];

const STATUS_ORDER: DeploymentStatus[] = ["queued", "building", "provisioning_ssl", "configuring_dns", "deploying", "live"];

function getStepState(currentStatus: DeploymentStatus, stepStatus: DeploymentStatus): "done" | "active" | "pending" {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const stepIndex = STATUS_ORDER.indexOf(stepStatus);
  if (stepIndex < currentIndex) return "done";
  if (stepIndex === currentIndex) return "active";
  return "pending";
}

// Demo mode: simulate deployment without API
function simulateDeployment(businessName: string): { getState: () => Deployment } {
  const subdomain = businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").substring(0, 32) || "my-site";
  const deployment: Deployment = {
    id: `deploy_${Date.now()}`,
    siteId: "demo_site",
    status: "queued",
    subdomain,
    url: `https://${subdomain}.rapidbooth.com`,
    sslProvisioned: false,
    dnsConfigured: false,
    buildLog: [{ timestamp: new Date().toISOString(), message: `Deployment queued for ${subdomain}.rapidbooth.com`, level: "info" }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const steps = [
    { status: "building" as DeploymentStatus, message: "Building site assets...", delay: 800 },
    { status: "building" as DeploymentStatus, message: "Optimizing images and CSS...", delay: 600 },
    { status: "building" as DeploymentStatus, message: "Generating static HTML pages...", delay: 500 },
    { status: "building" as DeploymentStatus, message: "Build complete. 11 pages generated.", delay: 300 },
    { status: "provisioning_ssl" as DeploymentStatus, message: "Requesting SSL certificate...", delay: 700 },
    { status: "provisioning_ssl" as DeploymentStatus, message: `SSL certificate issued for ${subdomain}.rapidbooth.com`, delay: 400 },
    { status: "configuring_dns" as DeploymentStatus, message: "Configuring DNS records...", delay: 600 },
    { status: "configuring_dns" as DeploymentStatus, message: "DNS propagation verified.", delay: 400 },
    { status: "deploying" as DeploymentStatus, message: "Uploading assets to CDN...", delay: 500 },
    { status: "deploying" as DeploymentStatus, message: "Configuring edge routing...", delay: 300 },
    { status: "live" as DeploymentStatus, message: `Site is live at https://${subdomain}.rapidbooth.com`, delay: 200 },
  ];

  let stepIndex = 0;
  function advanceStep() {
    if (stepIndex >= steps.length) return;
    const step = steps[stepIndex];
    deployment.status = step.status;
    deployment.buildLog.push({ timestamp: new Date().toISOString(), message: step.message, level: step.status === "live" ? "success" : "info" });
    deployment.updatedAt = new Date().toISOString();
    if (step.message.includes("issued")) deployment.sslProvisioned = true;
    if (step.message.includes("propagation")) deployment.dnsConfigured = true;
    if (step.status === "live") deployment.deployedAt = new Date().toISOString();
    stepIndex++;
    if (stepIndex < steps.length) {
      setTimeout(advanceStep, steps[stepIndex]?.delay || 500);
    }
  }
  setTimeout(advanceStep, steps[0].delay);

  return { getState: () => ({ ...deployment, buildLog: [...deployment.buildLog] }) };
}

export default function DeployPage() {
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [businessName, setBusinessName] = useState("Summit Plumbing");
  const [isDeploying, setIsDeploying] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const logEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const simRef = useRef<{ getState: () => Deployment } | null>(null);

  const scrollLogToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollLogToBottom();
  }, [deployment?.buildLog.length]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const pollDeployment = useCallback((deployId: string, useApi: boolean) => {
    pollRef.current = setInterval(async () => {
      if (useApi) {
        try {
          const res = await fetch(`${API_BASE}/api/deployments/id/${deployId}`);
          if (res.ok) {
            const data = await res.json();
            setDeployment(data.deployment);
            if (data.deployment.status === "live" || data.deployment.status === "failed" || data.deployment.status === "stopped") {
              if (pollRef.current) clearInterval(pollRef.current);
            }
          }
        } catch {
          // Ignore polling errors
        }
      } else if (simRef.current) {
        const state = simRef.current.getState();
        setDeployment(state);
        if (state.status === "live" || state.status === "failed" || state.status === "stopped") {
          if (pollRef.current) clearInterval(pollRef.current);
        }
      }
    }, 500);
  }, []);

  const startDeployment = async () => {
    setIsDeploying(true);

    try {
      // Try API first
      const res = await fetch(`${API_BASE}/api/deployments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: "demo_site", subdomain: businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-") }),
      });

      if (res.ok) {
        const data = await res.json();
        setDeployment(data.deployment);
        pollDeployment(data.deployment.id, true);
        setIsDeploying(false);
        return;
      }
    } catch {
      // Fallback to simulation
    }

    const sim = simulateDeployment(businessName);
    simRef.current = sim;
    setDeployment(sim.getState());
    pollDeployment("sim", false);
    setIsDeploying(false);
  };

  // Pre-deploy screen
  if (!deployment) {
    return (
      <div className="pt-24 sm:pt-32 min-h-screen bg-gradient-to-b from-cream to-white">
        <div className="max-w-lg mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-forest-green/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <h1 className="font-serif font-bold text-3xl text-slate-blue mb-3">
              Deploy Your Site
            </h1>
            <p className="text-slate-blue-500">
              One click to go live with SSL, CDN, and a free subdomain.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-forest-green/20 focus:border-forest-green outline-none"
                placeholder="Your Business Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subdomain</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm bg-gray-50 text-gray-600"
                />
                <span className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg bg-gray-100 text-sm text-gray-500">
                  .rapidbooth.com
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom Domain (optional)</label>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-forest-green/20 focus:border-forest-green outline-none"
                placeholder="www.yourbusiness.com"
              />
            </div>
            <button
              onClick={startDeployment}
              disabled={isDeploying || !businessName.trim()}
              className="w-full mt-4 px-6 py-3 bg-forest-green text-white font-semibold rounded-lg hover:bg-forest-green-800 transition-colors disabled:opacity-50"
            >
              {isDeploying ? "Deploying..." : "Deploy Now"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link href="/demo/builder" className="text-sm text-forest-green hover:underline">
              ← Back to builder
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Deployment status screen
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif font-bold text-2xl text-slate-blue">Deployment</h1>
            <p className="text-sm text-gray-500 mt-1">{deployment.subdomain}.rapidbooth.com</p>
          </div>
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            deployment.status === "live"
              ? "bg-green-50 text-green-700"
              : deployment.status === "failed"
              ? "bg-red-50 text-red-700"
              : deployment.status === "stopped"
              ? "bg-gray-100 text-gray-600"
              : "bg-blue-50 text-blue-700"
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              deployment.status === "live"
                ? "bg-green-500"
                : deployment.status === "failed"
                ? "bg-red-500"
                : deployment.status === "stopped"
                ? "bg-gray-400"
                : "bg-blue-500 animate-pulse"
            }`} />
            {deployment.status === "live" ? "Live" : deployment.status === "provisioning_ssl" ? "Provisioning SSL" : deployment.status === "configuring_dns" ? "Configuring DNS" : deployment.status.charAt(0).toUpperCase() + deployment.status.slice(1)}
          </span>
        </div>

        {/* Pipeline Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Deployment Pipeline</h2>
          <div className="flex items-center gap-2">
            {STATUS_STEPS.map((step, i) => {
              const state = getStepState(deployment.status, step.status);
              return (
                <React.Fragment key={step.status}>
                  <div className="flex flex-col items-center gap-1.5 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      state === "done"
                        ? "bg-green-100"
                        : state === "active"
                        ? "bg-blue-100"
                        : "bg-gray-100"
                    }`}>
                      {state === "done" ? (
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : state === "active" ? (
                        <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-gray-300" />
                      )}
                    </div>
                    <span className={`text-[10px] font-medium text-center ${
                      state === "done"
                        ? "text-green-700"
                        : state === "active"
                        ? "text-blue-700"
                        : "text-gray-400"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 -mt-5 ${
                      getStepState(deployment.status, STATUS_STEPS[i + 1].status) !== "pending"
                        ? "bg-green-300"
                        : "bg-gray-200"
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Build Log */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">Build Log</h2>
              <span className="text-xs text-gray-400">{deployment.buildLog.length} entries</span>
            </div>
            <div className="max-h-80 overflow-y-auto p-4 bg-gray-900 font-mono text-xs">
              {deployment.buildLog.map((entry, i) => (
                <div key={i} className="flex gap-3 py-1">
                  <span className="text-gray-500 whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={
                    entry.level === "success"
                      ? "text-green-400"
                      : entry.level === "warning"
                      ? "text-yellow-400"
                      : entry.level === "error"
                      ? "text-red-400"
                      : "text-gray-300"
                  }>
                    {entry.message}
                  </span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>

          {/* Details Panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
              <h2 className="text-sm font-semibold text-gray-700">Site Details</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">URL</span>
                  <a href={deployment.url} target="_blank" rel="noopener noreferrer" className="text-xs text-forest-green hover:underline font-medium truncate ml-2">
                    {deployment.url.replace("https://", "")}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">SSL</span>
                  <span className={`text-xs font-medium ${deployment.sslProvisioned ? "text-green-600" : "text-gray-400"}`}>
                    {deployment.sslProvisioned ? "Provisioned" : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">DNS</span>
                  <span className={`text-xs font-medium ${deployment.dnsConfigured ? "text-green-600" : "text-gray-400"}`}>
                    {deployment.dnsConfigured ? "Configured" : "Pending"}
                  </span>
                </div>
                {deployment.customDomain && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Custom Domain</span>
                    <span className="text-xs font-medium text-gray-700">{deployment.customDomain}</span>
                  </div>
                )}
                {deployment.deployedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Deployed</span>
                    <span className="text-xs text-gray-700">{new Date(deployment.deployedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {deployment.status === "live" && (
              <div className="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
                <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-semibold text-green-800">Your site is live!</p>
                <a
                  href={deployment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs text-green-700 hover:underline"
                >
                  Visit {deployment.url.replace("https://", "")} →
                </a>
              </div>
            )}

            {deployment.status === "live" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="text-xs font-semibold text-gray-700 mb-2">Custom Domain Setup</h3>
                <p className="text-[10px] text-gray-500 mb-2">Point a CNAME record to:</p>
                <code className="block bg-gray-50 px-2 py-1 rounded text-[10px] text-gray-700 break-all">
                  {deployment.subdomain}.rapidbooth.com
                </code>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/demo/builder" className="text-sm text-forest-green hover:underline">
            ← Back to builder
          </Link>
        </div>
      </div>
    </div>
  );
}

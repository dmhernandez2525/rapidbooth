import crypto from "crypto";
import { getSite } from "./siteGenerator";

const MAX_DEPLOYMENTS = 200;
const DEPLOYMENT_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export type DeploymentStatus = "queued" | "building" | "provisioning_ssl" | "configuring_dns" | "deploying" | "live" | "stopped" | "failed";

export interface Deployment {
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

export interface BuildLogEntry {
  timestamp: string;
  message: string;
  level: "info" | "success" | "warning" | "error";
}

export interface DeploymentRequest {
  siteId: string;
  subdomain?: string;
  customDomain?: string;
}

const deployments = new Map<string, Deployment>();
const siteToDeployment = new Map<string, string>();

function evictExpiredDeployments(): void {
  const now = Date.now();
  for (const [id, deployment] of deployments) {
    if (now - new Date(deployment.createdAt).getTime() > DEPLOYMENT_TTL_MS) {
      deployments.delete(id);
      siteToDeployment.delete(deployment.siteId);
    }
  }
}

function generateId(): string {
  return `deploy_${crypto.randomUUID()}`;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 32);
}

function addLogEntry(deployment: Deployment, message: string, level: BuildLogEntry["level"] = "info"): void {
  deployment.buildLog.push({
    timestamp: new Date().toISOString(),
    message,
    level,
  });
  deployment.updatedAt = new Date().toISOString();
}

async function simulateDeploymentPipeline(deploymentId: string): Promise<void> {
  const deployment = deployments.get(deploymentId);
  if (!deployment) return;

  const steps: Array<{ status: DeploymentStatus; message: string; delay: number }> = [
    { status: "building", message: "Building site assets...", delay: 800 },
    { status: "building", message: "Optimizing images and CSS...", delay: 600 },
    { status: "building", message: "Generating static HTML pages...", delay: 500 },
    { status: "building", message: "Build complete. 11 pages generated.", delay: 300 },
    { status: "provisioning_ssl", message: "Requesting SSL certificate...", delay: 700 },
    { status: "provisioning_ssl", message: "SSL certificate issued for " + deployment.subdomain + ".rapidbooth.com", delay: 400 },
    { status: "configuring_dns", message: "Configuring DNS records...", delay: 600 },
    { status: "configuring_dns", message: "DNS propagation verified.", delay: 400 },
    { status: "deploying", message: "Uploading assets to CDN...", delay: 500 },
    { status: "deploying", message: "Configuring edge routing...", delay: 300 },
    { status: "live", message: "Site is live at " + deployment.url, delay: 200 },
  ];

  for (const step of steps) {
    await new Promise((resolve) => setTimeout(resolve, step.delay));

    const current = deployments.get(deploymentId);
    if (!current || current.status === "stopped" || current.status === "failed") return;

    current.status = step.status;
    addLogEntry(current, step.message, step.status === "live" ? "success" : "info");

    if (step.status === "provisioning_ssl" && step.message.includes("issued")) {
      current.sslProvisioned = true;
    }
    if (step.status === "configuring_dns" && step.message.includes("verified")) {
      current.dnsConfigured = true;
    }
    if (step.status === "live") {
      current.deployedAt = new Date().toISOString();
    }
  }
}

export async function createDeployment(request: DeploymentRequest): Promise<Deployment> {
  evictExpiredDeployments();

  if (deployments.size >= MAX_DEPLOYMENTS) {
    throw new Error("Maximum deployments reached. Please try again later.");
  }

  const site = getSite(request.siteId);

  let subdomain = request.subdomain;
  if (!subdomain) {
    if (site) {
      subdomain = slugify(site.content.businessName);
    } else {
      subdomain = `site-${Date.now().toString(36)}`;
    }
  }

  const existingId = siteToDeployment.get(request.siteId);
  if (existingId) {
    const existing = deployments.get(existingId);
    if (existing && existing.status === "live") {
      throw new Error("Site is already deployed. Stop the existing deployment first.");
    }
  }

  const deployment: Deployment = {
    id: generateId(),
    siteId: request.siteId,
    status: "queued",
    subdomain,
    customDomain: request.customDomain,
    url: `https://${subdomain}.rapidbooth.com`,
    sslProvisioned: false,
    dnsConfigured: false,
    buildLog: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  addLogEntry(deployment, `Deployment queued for ${subdomain}.rapidbooth.com`);
  deployments.set(deployment.id, deployment);
  siteToDeployment.set(request.siteId, deployment.id);

  simulateDeploymentPipeline(deployment.id).catch((err) => {
    const d = deployments.get(deployment.id);
    if (d) {
      d.status = "failed";
      addLogEntry(d, `Deployment failed: ${err instanceof Error ? err.message : "Unknown error"}`, "error");
    }
  });

  return deployment;
}

export function getDeployment(deploymentId: string): Deployment | undefined {
  return deployments.get(deploymentId);
}

export function getDeploymentBySite(siteId: string): Deployment | undefined {
  const deployId = siteToDeployment.get(siteId);
  if (!deployId) return undefined;
  return deployments.get(deployId);
}

export function getAllDeployments(): Deployment[] {
  return Array.from(deployments.values());
}

export function stopDeployment(deploymentId: string): Deployment {
  const deployment = deployments.get(deploymentId);
  if (!deployment) throw new Error("Deployment not found");
  if (deployment.status !== "live") throw new Error("Can only stop live deployments");

  deployment.status = "stopped";
  deployment.stoppedAt = new Date().toISOString();
  addLogEntry(deployment, "Deployment stopped by user", "warning");

  return deployment;
}

export function redeploy(deploymentId: string): Deployment {
  const deployment = deployments.get(deploymentId);
  if (!deployment) throw new Error("Deployment not found");
  if (deployment.status !== "stopped") throw new Error("Can only redeploy stopped deployments");

  deployment.status = "queued";
  deployment.stoppedAt = undefined;
  addLogEntry(deployment, "Redeployment initiated");

  simulateDeploymentPipeline(deploymentId).catch((err) => {
    const d = deployments.get(deploymentId);
    if (d) {
      d.status = "failed";
      addLogEntry(d, `Redeployment failed: ${err instanceof Error ? err.message : "Unknown error"}`, "error");
    }
  });

  return deployment;
}

export function updateCustomDomain(deploymentId: string, customDomain: string): Deployment {
  const deployment = deployments.get(deploymentId);
  if (!deployment) throw new Error("Deployment not found");

  deployment.customDomain = customDomain;
  addLogEntry(deployment, `Custom domain set to ${customDomain}. Configure a CNAME record pointing to ${deployment.subdomain}.rapidbooth.com`);

  return deployment;
}

export function getDeploymentStats(): { total: number; live: number; stopped: number; building: number } {
  const all = Array.from(deployments.values());
  return {
    total: all.length,
    live: all.filter((d) => d.status === "live").length,
    stopped: all.filter((d) => d.status === "stopped").length,
    building: all.filter((d) => !["live", "stopped", "failed"].includes(d.status)).length,
  };
}

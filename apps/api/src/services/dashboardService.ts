export type ClientStatus = "lead" | "prospect" | "active" | "churned";

export interface ClientRecord {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  status: ClientStatus;
  sessionId?: string;
  siteId?: string;
  deploymentId?: string;
  monthlyRevenue: number;
  createdAt: string;
  updatedAt: string;
  lastContactAt: string;
  notes?: string;
}

export interface RepMetrics {
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

export interface PipelineStage {
  stage: ClientStatus;
  count: number;
  revenue: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  clients: number;
}

export interface DashboardSession {
  id: string;
  businessName: string;
  status: "active" | "completed" | "abandoned";
  currentPhase: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  clientStatus: ClientStatus;
}

const clients = new Map<string, ClientRecord>();
const sessions: DashboardSession[] = [];

function generateId(): string {
  return `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Seed demo data
function seedDemoData(): void {
  if (clients.size > 0) return;

  const demoClients: Omit<ClientRecord, "id">[] = [
    { businessName: "Summit Plumbing & HVAC", contactName: "John Davis", email: "john@summitphvac.com", phone: "(303) 555-0187", status: "active", monthlyRevenue: 30, createdAt: "2025-10-15T10:00:00Z", updatedAt: "2025-12-01T10:00:00Z", lastContactAt: "2025-12-15T10:00:00Z" },
    { businessName: "Bella Cucina", contactName: "Maria Rossi", email: "maria@bellacucina.com", phone: "(555) 234-5678", status: "active", monthlyRevenue: 30, createdAt: "2025-10-20T10:00:00Z", updatedAt: "2025-11-20T10:00:00Z", lastContactAt: "2025-12-10T10:00:00Z" },
    { businessName: "Clearview Family Dental", contactName: "Dr. Emily Chen", email: "emily@clearviewdental.com", phone: "(555) 789-0123", status: "active", monthlyRevenue: 30, createdAt: "2025-11-01T10:00:00Z", updatedAt: "2025-12-05T10:00:00Z", lastContactAt: "2025-12-20T10:00:00Z" },
    { businessName: "Green Thumb Landscaping", contactName: "Robert Martinez", email: "rob@greenthumb.com", status: "prospect", monthlyRevenue: 0, createdAt: "2025-12-10T10:00:00Z", updatedAt: "2025-12-18T10:00:00Z", lastContactAt: "2025-12-18T10:00:00Z" },
    { businessName: "Coastal Hair Studio", contactName: "Jessica Wong", email: "jess@coastalhair.com", phone: "(555) 456-7890", status: "prospect", monthlyRevenue: 0, createdAt: "2025-12-12T10:00:00Z", updatedAt: "2025-12-19T10:00:00Z", lastContactAt: "2025-12-19T10:00:00Z" },
    { businessName: "Oak & Vine Wine Bar", contactName: "Thomas Brown", email: "tom@oakandvine.com", status: "lead", monthlyRevenue: 0, createdAt: "2025-12-20T10:00:00Z", updatedAt: "2025-12-20T10:00:00Z", lastContactAt: "2025-12-20T10:00:00Z" },
    { businessName: "Mitchell Law Group", contactName: "Sarah Mitchell", email: "sarah@mitchelllaw.com", status: "lead", monthlyRevenue: 0, createdAt: "2025-12-22T10:00:00Z", updatedAt: "2025-12-22T10:00:00Z", lastContactAt: "2025-12-22T10:00:00Z" },
    { businessName: "Precision Auto Care", contactName: "Mike Johnson", email: "mike@precisionauto.com", status: "churned", monthlyRevenue: 0, createdAt: "2025-09-01T10:00:00Z", updatedAt: "2025-11-15T10:00:00Z", lastContactAt: "2025-11-15T10:00:00Z", notes: "Cancelled after 2 months - moved to competitor" },
  ];

  demoClients.forEach((client) => {
    const id = generateId();
    clients.set(id, { ...client, id });
  });

  const demoSessions: DashboardSession[] = [
    { id: "ses_001", businessName: "Summit Plumbing & HVAC", status: "completed", currentPhase: "close", startedAt: "2025-10-15T10:00:00Z", completedAt: "2025-10-15T10:28:00Z", duration: 28, clientStatus: "active" },
    { id: "ses_002", businessName: "Bella Cucina", status: "completed", currentPhase: "close", startedAt: "2025-10-20T14:00:00Z", completedAt: "2025-10-20T14:35:00Z", duration: 35, clientStatus: "active" },
    { id: "ses_003", businessName: "Clearview Family Dental", status: "completed", currentPhase: "close", startedAt: "2025-11-01T09:00:00Z", completedAt: "2025-11-01T09:22:00Z", duration: 22, clientStatus: "active" },
    { id: "ses_004", businessName: "Green Thumb Landscaping", status: "completed", currentPhase: "close", startedAt: "2025-12-10T11:00:00Z", completedAt: "2025-12-10T11:30:00Z", duration: 30, clientStatus: "prospect" },
    { id: "ses_005", businessName: "Coastal Hair Studio", status: "active", currentPhase: "design", startedAt: "2025-12-19T15:00:00Z", clientStatus: "prospect" },
    { id: "ses_006", businessName: "Oak & Vine Wine Bar", status: "abandoned", currentPhase: "audit", startedAt: "2025-12-20T16:00:00Z", duration: 8, clientStatus: "lead" },
    { id: "ses_007", businessName: "Mitchell Law Group", status: "active", currentPhase: "discovery", startedAt: "2025-12-22T10:00:00Z", clientStatus: "lead" },
    { id: "ses_008", businessName: "Precision Auto Care", status: "completed", currentPhase: "close", startedAt: "2025-09-01T13:00:00Z", completedAt: "2025-09-01T13:25:00Z", duration: 25, clientStatus: "churned" },
  ];

  sessions.push(...demoSessions);
}

seedDemoData();

export function getRepMetrics(): RepMetrics {
  const allClients = Array.from(clients.values());
  const active = allClients.filter((c) => c.status === "active");
  const completedSessions = sessions.filter((s) => s.status === "completed");
  const thisMonth = sessions.filter((s) => {
    const d = new Date(s.startedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  return {
    totalSessions: sessions.length,
    completedSessions: completedSessions.length,
    conversionRate: sessions.length > 0 ? Math.round((active.length / sessions.length) * 100) : 0,
    totalRevenue: active.reduce((sum, c) => sum + c.monthlyRevenue, 0),
    activeClients: active.length,
    avgSessionDuration: completedSessions.length > 0
      ? Math.round(completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / completedSessions.length)
      : 0,
    sitesDeployed: active.length,
    thisMonthSessions: thisMonth.length,
    thisMonthRevenue: active.filter((c) => {
      const d = new Date(c.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).reduce((sum, c) => sum + c.monthlyRevenue, 0),
  };
}

export function getPipeline(): PipelineStage[] {
  const allClients = Array.from(clients.values());
  const stages: ClientStatus[] = ["lead", "prospect", "active", "churned"];

  return stages.map((stage) => {
    const stageClients = allClients.filter((c) => c.status === stage);
    return {
      stage,
      count: stageClients.length,
      revenue: stageClients.reduce((sum, c) => sum + c.monthlyRevenue, 0),
    };
  });
}

export function getRevenueHistory(): RevenueDataPoint[] {
  return [
    { month: "Sep 2025", revenue: 30, clients: 1 },
    { month: "Oct 2025", revenue: 60, clients: 2 },
    { month: "Nov 2025", revenue: 90, clients: 3 },
    { month: "Dec 2025", revenue: 90, clients: 3 },
    { month: "Jan 2026", revenue: 90, clients: 3 },
  ];
}

export function getDashboardSessions(
  filter?: { status?: string; search?: string }
): DashboardSession[] {
  let result = [...sessions];

  if (filter?.status && filter.status !== "all") {
    result = result.filter((s) => s.status === filter.status);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    result = result.filter((s) => s.businessName.toLowerCase().includes(q));
  }

  return result.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

export function getClients(filter?: { status?: string; search?: string }): ClientRecord[] {
  let result = Array.from(clients.values());

  if (filter?.status && filter.status !== "all") {
    result = result.filter((c) => c.status === filter.status);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    result = result.filter((c) =>
      c.businessName.toLowerCase().includes(q) || c.contactName.toLowerCase().includes(q)
    );
  }

  return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function updateClientStatus(clientId: string, status: ClientStatus): ClientRecord {
  const client = clients.get(clientId);
  if (!client) throw new Error("Client not found");
  client.status = status;
  client.updatedAt = new Date().toISOString();
  return client;
}

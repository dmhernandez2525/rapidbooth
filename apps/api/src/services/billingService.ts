import crypto from "crypto";

export type SubscriptionStatus = "active" | "past_due" | "canceled" | "trialing";
export type PaymentStatus = "succeeded" | "pending" | "failed";

export interface Subscription {
  id: string;
  clientId: string;
  businessName: string;
  plan: "starter";
  status: SubscriptionStatus;
  amount: number;
  currency: "usd";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  canceledAt?: string;
  trialEnd?: string;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  businessName: string;
  amount: number;
  currency: "usd";
  status: PaymentStatus;
  periodStart: string;
  periodEnd: string;
  paidAt?: string;
  createdAt: string;
  invoiceUrl: string;
}

export interface PaymentMethod {
  id: string;
  type: "card";
  card: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  isDefault: boolean;
  createdAt: string;
}

export interface BillingMetrics {
  mrr: number;
  totalRevenue: number;
  activeSubscriptions: number;
  churnRate: number;
  avgRevenuePerClient: number;
}

export interface CreateSubscriptionRequest {
  clientId: string;
  businessName: string;
  paymentMethodId?: string;
  trialDays?: number;
}

const subscriptions = new Map<string, Subscription>();
const invoices: Invoice[] = [];
const paymentMethods = new Map<string, PaymentMethod[]>();

function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  const targetMonth = result.getMonth() + months;
  result.setMonth(targetMonth);
  // Clamp day to avoid overflow (e.g., Jan 31 + 1 month = Feb 28, not Mar 3)
  if (result.getMonth() !== ((targetMonth % 12) + 12) % 12) {
    result.setDate(0); // Set to last day of previous month
  }
  return result;
}

// Seed demo data
function seedBillingData(): void {
  if (subscriptions.size > 0) return;

  const demoSubs: Array<Omit<Subscription, "id">> = [
    {
      clientId: "client_001",
      businessName: "Summit Plumbing & HVAC",
      plan: "starter",
      status: "active",
      amount: 3000,
      currency: "usd",
      currentPeriodStart: "2025-12-15T00:00:00Z",
      currentPeriodEnd: "2026-01-15T00:00:00Z",
      cancelAtPeriodEnd: false,
      createdAt: "2025-10-15T00:00:00Z",
    },
    {
      clientId: "client_002",
      businessName: "Bella Cucina",
      plan: "starter",
      status: "active",
      amount: 3000,
      currency: "usd",
      currentPeriodStart: "2025-12-20T00:00:00Z",
      currentPeriodEnd: "2026-01-20T00:00:00Z",
      cancelAtPeriodEnd: false,
      createdAt: "2025-10-20T00:00:00Z",
    },
    {
      clientId: "client_003",
      businessName: "Clearview Family Dental",
      plan: "starter",
      status: "active",
      amount: 3000,
      currency: "usd",
      currentPeriodStart: "2025-12-01T00:00:00Z",
      currentPeriodEnd: "2026-01-01T00:00:00Z",
      cancelAtPeriodEnd: false,
      createdAt: "2025-11-01T00:00:00Z",
    },
  ];

  demoSubs.forEach((sub) => {
    const id = generateId("sub");
    subscriptions.set(id, { ...sub, id });
  });

  // Generate invoices for each subscription
  subscriptions.forEach((sub) => {
    const startDate = new Date(sub.createdAt);
    const now = new Date();
    let periodStart = new Date(startDate);

    while (periodStart < now) {
      const periodEnd = addMonths(periodStart, 1);
      invoices.push({
        id: generateId("inv"),
        subscriptionId: sub.id,
        businessName: sub.businessName,
        amount: sub.amount,
        currency: "usd",
        status: "succeeded",
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString(),
        paidAt: new Date(periodStart.getTime() + 86400000).toISOString(),
        createdAt: periodStart.toISOString(),
        invoiceUrl: `#invoice-${sub.id}-${periodStart.getMonth()}`,
      });
      periodStart = periodEnd;
    }
  });

  // Add payment methods
  paymentMethods.set("client_001", [{
    id: generateId("pm"),
    type: "card",
    card: { brand: "visa", last4: "4242", expMonth: 12, expYear: 2027 },
    isDefault: true,
    createdAt: "2025-10-15T00:00:00Z",
  }]);
  paymentMethods.set("client_002", [{
    id: generateId("pm"),
    type: "card",
    card: { brand: "mastercard", last4: "5555", expMonth: 8, expYear: 2026 },
    isDefault: true,
    createdAt: "2025-10-20T00:00:00Z",
  }]);
  paymentMethods.set("client_003", [{
    id: generateId("pm"),
    type: "card",
    card: { brand: "visa", last4: "1234", expMonth: 3, expYear: 2028 },
    isDefault: true,
    createdAt: "2025-11-01T00:00:00Z",
  }]);
}

seedBillingData();

export function createSubscription(request: CreateSubscriptionRequest): Subscription {
  // Check for existing active subscription for this client
  const existing = Array.from(subscriptions.values()).find(
    (s) => s.clientId === request.clientId && (s.status === "active" || s.status === "trialing")
  );
  if (existing) {
    throw new Error("Client already has an active subscription");
  }

  const now = new Date();
  const trialEnd = request.trialDays
    ? new Date(now.getTime() + request.trialDays * 86400000)
    : undefined;

  const subscription: Subscription = {
    id: generateId("sub"),
    clientId: request.clientId,
    businessName: request.businessName,
    plan: "starter",
    status: trialEnd ? "trialing" : "active",
    amount: 3000, // $30.00
    currency: "usd",
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: addMonths(now, 1).toISOString(),
    cancelAtPeriodEnd: false,
    createdAt: now.toISOString(),
    trialEnd: trialEnd?.toISOString(),
  };

  subscriptions.set(subscription.id, subscription);

  // Create first invoice
  invoices.push({
    id: generateId("inv"),
    subscriptionId: subscription.id,
    businessName: request.businessName,
    amount: subscription.amount,
    currency: "usd",
    status: trialEnd ? "pending" : "succeeded",
    periodStart: subscription.currentPeriodStart,
    periodEnd: subscription.currentPeriodEnd,
    paidAt: trialEnd ? undefined : now.toISOString(),
    createdAt: now.toISOString(),
    invoiceUrl: `#invoice-${subscription.id}`,
  });

  return subscription;
}

export function getSubscription(subscriptionId: string): Subscription | undefined {
  return subscriptions.get(subscriptionId);
}

export function getSubscriptionByClient(clientId: string): Subscription | undefined {
  return Array.from(subscriptions.values()).find((s) => s.clientId === clientId);
}

export function getAllSubscriptions(): Subscription[] {
  return Array.from(subscriptions.values());
}

export function cancelSubscription(subscriptionId: string, immediate: boolean = false): Subscription {
  const sub = subscriptions.get(subscriptionId);
  if (!sub) throw new Error("Subscription not found");

  if (immediate) {
    sub.status = "canceled";
    sub.canceledAt = new Date().toISOString();
  } else {
    sub.cancelAtPeriodEnd = true;
  }

  return sub;
}

export function reactivateSubscription(subscriptionId: string): Subscription {
  const sub = subscriptions.get(subscriptionId);
  if (!sub) throw new Error("Subscription not found");
  if (sub.status === "canceled") throw new Error("Cannot reactivate a canceled subscription");

  sub.cancelAtPeriodEnd = false;
  return sub;
}

export function getInvoices(subscriptionId?: string): Invoice[] {
  if (subscriptionId) {
    return invoices.filter((i) => i.subscriptionId === subscriptionId);
  }
  return [...invoices].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getPaymentMethods(clientId: string): PaymentMethod[] {
  return paymentMethods.get(clientId) || [];
}

export function getBillingMetrics(): BillingMetrics {
  const active = Array.from(subscriptions.values()).filter((s) => s.status === "active" || s.status === "trialing");
  const mrr = active.reduce((sum, s) => sum + s.amount, 0);
  const totalRevenue = invoices.filter((i) => i.status === "succeeded").reduce((sum, i) => sum + i.amount, 0);
  const all = Array.from(subscriptions.values());
  const canceled = all.filter((s) => s.status === "canceled");

  return {
    mrr,
    totalRevenue,
    activeSubscriptions: active.length,
    churnRate: all.length > 0 ? Math.round((canceled.length / all.length) * 100) : 0,
    avgRevenuePerClient: active.length > 0 ? Math.round(mrr / active.length) : 0,
  };
}

// Simulated webhook handler
export function handleWebhookEvent(event: { type: string; data: Record<string, unknown> }): { handled: boolean } {
  switch (event.type) {
    case "invoice.payment_succeeded":
      // In real implementation, update invoice status
      return { handled: true };
    case "invoice.payment_failed":
      // In real implementation, update subscription to past_due
      return { handled: true };
    case "customer.subscription.deleted":
      // In real implementation, mark subscription canceled
      return { handled: true };
    default:
      return { handled: false };
  }
}

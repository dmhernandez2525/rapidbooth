import { Router, Request, Response } from "express";
import {
  createSubscription,
  getSubscription,
  getAllSubscriptions,
  cancelSubscription,
  reactivateSubscription,
  getInvoices,
  getPaymentMethods,
  getBillingMetrics,
  handleWebhookEvent,
} from "../services/billingService";

const router = Router();

// Create a subscription
router.post("/subscriptions", (req: Request, res: Response) => {
  try {
    const { clientId, businessName, paymentMethodId, trialDays } = req.body;

    if (!clientId || !businessName) {
      res.status(400).json({ error: "clientId and businessName are required" });
      return;
    }

    const subscription = createSubscription({ clientId, businessName, paymentMethodId, trialDays });
    res.status(201).json({ subscription });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create subscription";
    res.status(400).json({ error: message });
  }
});

// Get subscription by ID
router.get("/subscriptions/:id", (req: Request, res: Response) => {
  try {
    const subscription = getSubscription(req.params.id);
    if (!subscription) {
      res.status(404).json({ error: "Subscription not found" });
      return;
    }
    res.json({ subscription });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get subscription";
    res.status(500).json({ error: message });
  }
});

// List all subscriptions
router.get("/subscriptions", (_req: Request, res: Response) => {
  try {
    const subscriptionsList = getAllSubscriptions();
    res.json({ subscriptions: subscriptionsList, total: subscriptionsList.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list subscriptions";
    res.status(500).json({ error: message });
  }
});

// Cancel subscription
router.post("/subscriptions/:id/cancel", (req: Request, res: Response) => {
  try {
    const { immediate } = req.body;
    const subscription = cancelSubscription(req.params.id, immediate === true);
    res.json({ subscription });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to cancel subscription";
    res.status(400).json({ error: message });
  }
});

// Reactivate subscription
router.post("/subscriptions/:id/reactivate", (req: Request, res: Response) => {
  try {
    const subscription = reactivateSubscription(req.params.id);
    res.json({ subscription });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reactivate subscription";
    res.status(400).json({ error: message });
  }
});

// List invoices
router.get("/invoices", (req: Request, res: Response) => {
  try {
    const { subscriptionId } = req.query;
    const invoicesList = getInvoices(subscriptionId as string | undefined);
    res.json({ invoices: invoicesList, total: invoicesList.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list invoices";
    res.status(500).json({ error: message });
  }
});

// Get payment methods for a client
router.get("/payment-methods/:clientId", (req: Request, res: Response) => {
  try {
    const methods = getPaymentMethods(req.params.clientId);
    res.json({ paymentMethods: methods });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get payment methods";
    res.status(500).json({ error: message });
  }
});

// Billing metrics
router.get("/metrics", (_req: Request, res: Response) => {
  try {
    const metrics = getBillingMetrics();
    res.json(metrics);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get billing metrics";
    res.status(500).json({ error: message });
  }
});

// Webhook endpoint (simulated)
router.post("/webhooks", (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;
    const result = handleWebhookEvent({ type, data });
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    res.status(500).json({ error: message });
  }
});

export default router;

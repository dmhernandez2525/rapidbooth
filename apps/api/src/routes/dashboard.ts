import { Router, Request, Response } from "express";
import {
  getRepMetrics,
  getPipeline,
  getRevenueHistory,
  getDashboardSessions,
  getClients,
  updateClientStatus,
} from "../services/dashboardService";
import type { ClientStatus } from "../services/dashboardService";

const router = Router();

// Get dashboard overview metrics
router.get("/metrics", (_req: Request, res: Response) => {
  try {
    const metrics = getRepMetrics();
    res.json(metrics);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get metrics";
    res.status(500).json({ error: message });
  }
});

// Get client pipeline
router.get("/pipeline", (_req: Request, res: Response) => {
  try {
    const pipeline = getPipeline();
    res.json({ pipeline });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get pipeline";
    res.status(500).json({ error: message });
  }
});

// Get revenue history
router.get("/revenue", (_req: Request, res: Response) => {
  try {
    const history = getRevenueHistory();
    res.json({ history });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get revenue history";
    res.status(500).json({ error: message });
  }
});

// List sessions with optional filtering
router.get("/sessions", (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const sessionsList = getDashboardSessions({
      status: status as string | undefined,
      search: search as string | undefined,
    });
    res.json({ sessions: sessionsList, total: sessionsList.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list sessions";
    res.status(500).json({ error: message });
  }
});

// List clients with optional filtering
router.get("/clients", (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const clientsList = getClients({
      status: status as string | undefined,
      search: search as string | undefined,
    });
    res.json({ clients: clientsList, total: clientsList.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list clients";
    res.status(500).json({ error: message });
  }
});

// Update client status
router.patch("/clients/:clientId/status", (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: "status is required" });
      return;
    }
    const client = updateClientStatus(req.params.clientId, status as ClientStatus);
    res.json({ client });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update client";
    res.status(400).json({ error: message });
  }
});

export default router;

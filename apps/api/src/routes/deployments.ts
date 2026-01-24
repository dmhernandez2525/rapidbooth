import { Router, Request, Response } from "express";
import {
  createDeployment,
  getDeployment,
  getDeploymentBySite,
  getAllDeployments,
  stopDeployment,
  redeploy,
  updateCustomDomain,
  getDeploymentStats,
} from "../services/deploymentService";

const router = Router();

// Deploy a generated site
router.post("/", async (req: Request, res: Response) => {
  try {
    const { siteId, subdomain, customDomain } = req.body;

    if (!siteId || typeof siteId !== "string") {
      res.status(400).json({ error: "siteId is required and must be a string" });
      return;
    }

    if (subdomain !== undefined && (typeof subdomain !== "string" || !/^[a-z0-9-]+$/.test(subdomain) || subdomain.length > 32)) {
      res.status(400).json({ error: "subdomain must be lowercase alphanumeric with hyphens, max 32 chars" });
      return;
    }

    if (customDomain !== undefined && (typeof customDomain !== "string" || customDomain.length > 253)) {
      res.status(400).json({ error: "customDomain must be a valid domain string" });
      return;
    }

    const deployment = await createDeployment({ siteId, subdomain, customDomain });
    res.status(201).json({ deployment });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create deployment";
    const status = message.includes("Maximum") ? 429 : 400;
    res.status(status).json({ error: message });
  }
});

// Get deployment by ID
router.get("/id/:deploymentId", (req: Request, res: Response) => {
  try {
    const deployment = getDeployment(req.params.deploymentId);
    if (!deployment) {
      res.status(404).json({ error: "Deployment not found" });
      return;
    }
    res.json({ deployment });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get deployment";
    res.status(500).json({ error: message });
  }
});

// Get deployment by site ID
router.get("/site/:siteId", (req: Request, res: Response) => {
  try {
    const deployment = getDeploymentBySite(req.params.siteId);
    if (!deployment) {
      res.status(404).json({ error: "No deployment found for this site" });
      return;
    }
    res.json({ deployment });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get deployment";
    res.status(500).json({ error: message });
  }
});

// List all deployments
router.get("/", (_req: Request, res: Response) => {
  try {
    const deploymentsList = getAllDeployments();
    const stats = getDeploymentStats();
    res.json({ deployments: deploymentsList, stats });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list deployments";
    res.status(500).json({ error: message });
  }
});

// Stop a deployment
router.post("/:deploymentId/stop", (req: Request, res: Response) => {
  try {
    const deployment = stopDeployment(req.params.deploymentId);
    res.json({ deployment });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to stop deployment";
    res.status(400).json({ error: message });
  }
});

// Redeploy a stopped deployment
router.post("/:deploymentId/redeploy", (req: Request, res: Response) => {
  try {
    const deployment = redeploy(req.params.deploymentId);
    res.json({ deployment });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to redeploy";
    res.status(400).json({ error: message });
  }
});

// Update custom domain
router.patch("/:deploymentId/domain", (req: Request, res: Response) => {
  try {
    const { customDomain } = req.body;
    if (!customDomain || typeof customDomain !== "string" || customDomain.length > 253) {
      res.status(400).json({ error: "customDomain is required and must be a valid domain string" });
      return;
    }
    const deployment = updateCustomDomain(req.params.deploymentId, customDomain);
    res.json({ deployment });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update domain";
    res.status(400).json({ error: message });
  }
});

// Get deployment stats
router.get("/stats", (_req: Request, res: Response) => {
  try {
    const stats = getDeploymentStats();
    res.json(stats);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get stats";
    res.status(500).json({ error: message });
  }
});

export default router;

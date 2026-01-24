import { Router, Request, Response } from "express";
import { generateSite, getSite, getAllSites } from "../services/siteGenerator";
import { getSession } from "../services/intakeEngine";

const router = Router();

// Generate a site from intake session data
router.post("/generate", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      res.status(400).json({ error: "sessionId is required" });
      return;
    }

    const session = getSession(sessionId);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    const site = await generateSite(sessionId, session.extractedData);

    res.status(201).json({ site });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate site";
    res.status(500).json({ error: message });
  }
});

// Generate site from direct business data (without session)
router.post("/generate-direct", async (req: Request, res: Response) => {
  try {
    const { businessData } = req.body;

    if (!businessData) {
      res.status(400).json({ error: "businessData is required" });
      return;
    }

    const site = await generateSite("direct", businessData);
    res.status(201).json({ site });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate site";
    res.status(500).json({ error: message });
  }
});

// Get a specific site
router.get("/:siteId", (req: Request, res: Response) => {
  try {
    const site = getSite(req.params.siteId);
    if (!site) {
      res.status(404).json({ error: "Site not found" });
      return;
    }
    res.json({ site });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get site";
    res.status(500).json({ error: message });
  }
});

// List all generated sites
router.get("/", (_req: Request, res: Response) => {
  try {
    const allSites = getAllSites();
    res.json({ sites: allSites, total: allSites.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list sites";
    res.status(500).json({ error: message });
  }
});

export default router;

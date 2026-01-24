import { Router, Request, Response } from "express";
import {
  createSession,
  getSession,
  getAllSessions,
  processMessage,
  getInitialGreeting,
} from "../services/intakeEngine";
import { strictLimiter } from "../middleware/rateLimiter";

const router = Router();

// Start a new intake session
router.post("/start", (req: Request, res: Response) => {
  try {
    const { repId } = req.body;

    if (repId !== undefined && (typeof repId !== "string" || repId.length > 100)) {
      res.status(400).json({ error: "repId must be a string under 100 characters" });
      return;
    }

    const session = createSession(repId);
    const greeting = getInitialGreeting(session);

    res.status(201).json({
      session,
      greeting,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to start session";
    const status = message.includes("Maximum") ? 429 : 500;
    res.status(status).json({ error: message });
  }
});

// Send a message in an active session
router.post("/message", strictLimiter, async (req: Request, res: Response) => {
  try {
    const { sessionId, content } = req.body;

    if (!sessionId || !content) {
      res.status(400).json({
        error: "sessionId and content are required",
      });
      return;
    }

    if (typeof content !== "string" || content.trim().length === 0) {
      res.status(400).json({
        error: "content must be a non-empty string",
      });
      return;
    }

    if (content.length > 5000) {
      res.status(400).json({
        error: "content must be under 5000 characters",
      });
      return;
    }

    const result = await processMessage(sessionId, content.trim());

    res.json({
      message: result.response,
      session: result.session,
      phaseTransition: result.phaseTransition || null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process message";
    const status = message.includes("not found") ? 404 : 500;
    res.status(status).json({ error: message });
  }
});

// List all sessions (for dashboard) - must be before /:sessionId
router.get("/", (_req: Request, res: Response) => {
  try {
    const sessions = getAllSessions();
    res.json({ sessions, total: sessions.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list sessions";
    res.status(500).json({ error: message });
  }
});

// Get session state
router.get("/:sessionId", (req: Request, res: Response) => {
  try {
    const session = getSession(req.params.sessionId);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }
    res.json({ session });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get session";
    res.status(500).json({ error: message });
  }
});

export default router;

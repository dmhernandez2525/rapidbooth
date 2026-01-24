import { Router, Request, Response } from "express";
import {
  getReviewConfig,
  updateReviewConfig,
  getReviews,
  getReview,
  respondToReview,
  updateReviewStatus,
  getReviewStats,
  requestReviews,
} from "../services/reviewService";

const router = Router();

// Get review config for a site
router.get("/config/:siteId", (req: Request, res: Response) => {
  try {
    const config = getReviewConfig(req.params.siteId);
    if (!config) {
      res.status(404).json({ error: "No review configuration found" });
      return;
    }
    res.json({ config });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get config";
    res.status(500).json({ error: message });
  }
});

// Update review config
router.put("/config/:siteId", (req: Request, res: Response) => {
  try {
    const config = updateReviewConfig(req.params.siteId, req.body);
    res.json({ config });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update config";
    res.status(400).json({ error: message });
  }
});

// List reviews with optional filters
router.get("/", (req: Request, res: Response) => {
  try {
    const { siteId, platform, status, minRating, maxRating } = req.query;
    const reviewList = getReviews(
      siteId as string | undefined,
      platform as string | undefined,
      status as string | undefined,
      minRating ? parseInt(minRating as string) : undefined,
      maxRating ? parseInt(maxRating as string) : undefined
    );
    res.json({ reviews: reviewList, total: reviewList.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list reviews";
    res.status(500).json({ error: message });
  }
});

// Get a specific review
router.get("/:reviewId", (req: Request, res: Response) => {
  try {
    const review = getReview(req.params.reviewId);
    if (!review) {
      res.status(404).json({ error: "Review not found" });
      return;
    }
    res.json({ review });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get review";
    res.status(500).json({ error: message });
  }
});

// Respond to a review
router.post("/:reviewId/respond", (req: Request, res: Response) => {
  try {
    const { response: responseText } = req.body;
    if (!responseText) {
      res.status(400).json({ error: "response text is required" });
      return;
    }
    const review = respondToReview(req.params.reviewId, responseText);
    res.json({ review });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to respond to review";
    res.status(400).json({ error: message });
  }
});

// Update review status (publish/hide/flag)
router.patch("/:reviewId/status", (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status || !["published", "hidden", "flagged"].includes(status)) {
      res.status(400).json({ error: "Valid status (published, hidden, flagged) is required" });
      return;
    }
    const review = updateReviewStatus(req.params.reviewId, status);
    res.json({ review });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update status";
    res.status(400).json({ error: message });
  }
});

// Get review stats for a site
router.get("/stats/:siteId", (req: Request, res: Response) => {
  try {
    const stats = getReviewStats(req.params.siteId);
    res.json({ stats });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get stats";
    res.status(500).json({ error: message });
  }
});

// Send review request emails
router.post("/request/:siteId", (req: Request, res: Response) => {
  try {
    const { emails } = req.body;
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      res.status(400).json({ error: "emails array is required" });
      return;
    }
    const result = requestReviews(req.params.siteId, emails);
    res.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send review requests";
    res.status(400).json({ error: message });
  }
});

export default router;

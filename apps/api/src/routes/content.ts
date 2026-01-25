import { Router } from "express";
import type { ContentBlockType } from "@rapidbooth/shared";
import { generalLimiter, strictLimiter } from "../middleware/rateLimiter";
import {
  getDraft,
  updateDraft,
  addBlock,
  updateBlock,
  deleteBlock,
  reorderBlocks,
  publishDraft,
  getVersionHistory,
  getVersion,
  getPublishedVersion,
  rollbackToVersion,
  uploadImage,
  getImages,
  deleteImage,
} from "../services/contentService";

const router = Router();

// Apply general rate limiting to all routes
router.use(generalLimiter);

const VALID_BLOCK_TYPES: ContentBlockType[] = [
  "hero", "text", "image", "gallery", "services",
  "testimonials", "contact", "cta", "divider", "spacer"
];

// Get draft for a site
router.get("/draft/:siteId", (req, res) => {
  try {
    const draft = getDraft(req.params.siteId);
    if (!draft) {
      res.status(404).json({ error: "Site not found" });
      return;
    }
    res.json({ draft });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Internal error" });
  }
});

// Update draft (blocks, SEO, or theme)
router.put("/draft/:siteId", (req, res) => {
  try {
    const { blocks, seo, theme } = req.body;
    const draft = updateDraft(req.params.siteId, { blocks, seo, theme });
    res.json({ draft });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Invalid request" });
  }
});

// Add a new block
router.post("/draft/:siteId/blocks", (req, res) => {
  try {
    const { type, content, afterBlockId } = req.body;

    if (!type || typeof type !== "string") {
      res.status(400).json({ error: "Block type is required" });
      return;
    }

    if (!VALID_BLOCK_TYPES.includes(type as ContentBlockType)) {
      res.status(400).json({ error: `Invalid block type: ${type}` });
      return;
    }

    if (!content || typeof content !== "object") {
      res.status(400).json({ error: "Block content is required" });
      return;
    }

    const block = addBlock(
      req.params.siteId,
      type as ContentBlockType,
      content as Record<string, unknown>,
      afterBlockId
    );
    res.status(201).json({ block });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Invalid request" });
  }
});

// Update a specific block
router.patch("/draft/:siteId/blocks/:blockId", (req, res) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== "object") {
      res.status(400).json({ error: "Block content is required" });
      return;
    }

    const block = updateBlock(
      req.params.siteId,
      req.params.blockId,
      content as Record<string, unknown>
    );
    res.json({ block });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Invalid request" });
  }
});

// Delete a block
router.delete("/draft/:siteId/blocks/:blockId", (req, res) => {
  try {
    deleteBlock(req.params.siteId, req.params.blockId);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Invalid request" });
  }
});

// Reorder blocks
router.post("/draft/:siteId/reorder", (req, res) => {
  try {
    const { blockIds } = req.body;

    if (!Array.isArray(blockIds)) {
      res.status(400).json({ error: "blockIds must be an array" });
      return;
    }

    if (!blockIds.every((id) => typeof id === "string")) {
      res.status(400).json({ error: "All blockIds must be strings" });
      return;
    }

    reorderBlocks(req.params.siteId, blockIds);
    const draft = getDraft(req.params.siteId);
    res.json({ draft });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Invalid request" });
  }
});

// Publish draft - apply strict rate limiting
router.post("/draft/:siteId/publish", strictLimiter, (req, res) => {
  try {
    const version = publishDraft(req.params.siteId);
    res.json({ version });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Invalid request" });
  }
});

// Get version history
router.get("/versions/:siteId", (req, res) => {
  try {
    const history = getVersionHistory(req.params.siteId);
    res.json({ versions: history });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Internal error" });
  }
});

// Get published version
router.get("/versions/:siteId/published", (req, res) => {
  try {
    const version = getPublishedVersion(req.params.siteId);
    if (!version) {
      res.status(404).json({ error: "No published version found" });
      return;
    }
    res.json({ version });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Internal error" });
  }
});

// Get specific version
router.get("/versions/:siteId/:versionId", (req, res) => {
  try {
    const version = getVersion(req.params.siteId, req.params.versionId);
    if (!version) {
      res.status(404).json({ error: "Version not found" });
      return;
    }
    res.json({ version });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Internal error" });
  }
});

// Rollback to a previous version
router.post("/versions/:siteId/:versionId/rollback", strictLimiter, (req, res) => {
  try {
    const version = rollbackToVersion(req.params.siteId, req.params.versionId);
    res.json({ version });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Invalid request" });
  }
});

// Image management

// Upload image (simulated - accepts metadata only)
router.post("/images/:siteId", strictLimiter, (req, res) => {
  try {
    const { filename, size, width, height } = req.body;

    if (!filename || typeof filename !== "string") {
      res.status(400).json({ error: "Filename is required" });
      return;
    }

    if (filename.length > 200) {
      res.status(400).json({ error: "Filename too long" });
      return;
    }

    if (typeof size !== "number" || size <= 0 || size > 10 * 1024 * 1024) {
      res.status(400).json({ error: "Invalid file size (max 10MB)" });
      return;
    }

    if (typeof width !== "number" || width <= 0 || width > 10000) {
      res.status(400).json({ error: "Invalid image width" });
      return;
    }

    if (typeof height !== "number" || height <= 0 || height > 10000) {
      res.status(400).json({ error: "Invalid image height" });
      return;
    }

    const image = uploadImage(req.params.siteId, filename, size, width, height);
    res.status(201).json({ image });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Invalid request" });
  }
});

// Get images for a site
router.get("/images/:siteId", (req, res) => {
  try {
    const siteImages = getImages(req.params.siteId);
    res.json({ images: siteImages });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Internal error" });
  }
});

// Delete an image
router.delete("/images/:siteId/:imageId", (req, res) => {
  try {
    deleteImage(req.params.imageId);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Invalid request" });
  }
});

export default router;

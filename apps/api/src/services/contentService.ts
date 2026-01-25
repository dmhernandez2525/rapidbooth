import crypto from "crypto";
import type {
  ContentBlock,
  ContentBlockType,
  SiteVersion,
  SiteContentDraft,
  SEOSettings,
  ColorScheme,
  UploadedImage,
} from "@rapidbooth/shared";
import { getSite } from "./siteGenerator";

const MAX_VERSIONS = 100;
const MAX_DRAFTS = 500;
const MAX_IMAGES = 2000;
const VERSION_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// In-memory storage
const versions = new Map<string, SiteVersion[]>();
const drafts = new Map<string, SiteContentDraft>();
const images = new Map<string, UploadedImage>();

function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

function evictExpiredVersions(): void {
  const now = Date.now();
  for (const [siteId, siteVersions] of versions) {
    const filtered = siteVersions.filter((v) => {
      const age = now - new Date(v.createdAt).getTime();
      return age < VERSION_TTL_MS;
    });
    if (filtered.length === 0) {
      versions.delete(siteId);
    } else {
      versions.set(siteId, filtered);
    }
  }
}

function evictExpiredDrafts(): void {
  const now = Date.now();
  for (const [siteId, draft] of drafts) {
    const age = now - new Date(draft.lastSaved).getTime();
    if (age > DRAFT_TTL_MS) {
      drafts.delete(siteId);
    }
  }
}

// Validation functions
const VALID_BLOCK_TYPES: ContentBlockType[] = [
  "hero", "text", "image", "gallery", "services",
  "testimonials", "contact", "cta", "divider", "spacer"
];

function validateBlockType(type: string): type is ContentBlockType {
  return VALID_BLOCK_TYPES.includes(type as ContentBlockType);
}

function validateBlock(block: unknown): block is ContentBlock {
  if (!block || typeof block !== "object") return false;
  const b = block as Record<string, unknown>;
  return (
    typeof b.id === "string" &&
    typeof b.type === "string" &&
    validateBlockType(b.type) &&
    typeof b.order === "number" &&
    b.content !== null &&
    typeof b.content === "object"
  );
}

function validateSEO(seo: unknown): seo is SEOSettings {
  if (!seo || typeof seo !== "object") return false;
  const s = seo as Record<string, unknown>;
  return (
    typeof s.title === "string" &&
    s.title.length <= 200 &&
    typeof s.description === "string" &&
    s.description.length <= 500 &&
    Array.isArray(s.keywords) &&
    s.keywords.every((k) => typeof k === "string")
  );
}

function validateColorScheme(colors: unknown): colors is ColorScheme {
  if (!colors || typeof colors !== "object") return false;
  const c = colors as Record<string, unknown>;
  const hexRegex = /^#[0-9A-Fa-f]{3,8}$/;
  return (
    typeof c.primary === "string" && hexRegex.test(c.primary) &&
    typeof c.secondary === "string" && hexRegex.test(c.secondary) &&
    typeof c.accent === "string" && hexRegex.test(c.accent) &&
    typeof c.background === "string" && hexRegex.test(c.background) &&
    typeof c.text === "string" && hexRegex.test(c.text)
  );
}

// Convert a generated site to initial content blocks
export function siteToBlocks(siteId: string): ContentBlock[] | null {
  const site = getSite(siteId);
  if (!site) return null;

  const blocks: ContentBlock[] = [];
  let order = 0;

  // Hero block
  blocks.push({
    id: generateId("blk"),
    type: "hero",
    order: order++,
    content: {
      title: site.content.heroTitle,
      subtitle: site.content.heroSubtitle,
      buttonText: site.content.ctaText,
      buttonLink: "#contact",
    },
  });

  // About/Text block
  blocks.push({
    id: generateId("blk"),
    type: "text",
    order: order++,
    content: {
      heading: "About Us",
      body: site.content.aboutText,
      alignment: "left",
    },
  });

  // Services block
  if (site.content.services.length > 0) {
    blocks.push({
      id: generateId("blk"),
      type: "services",
      order: order++,
      content: {
        heading: "Our Services",
        services: site.content.services,
      },
    });
  }

  // Testimonials block
  if (site.content.testimonials.length > 0) {
    blocks.push({
      id: generateId("blk"),
      type: "testimonials",
      order: order++,
      content: {
        heading: "What Our Customers Say",
        testimonials: site.content.testimonials,
      },
    });
  }

  // Contact block
  blocks.push({
    id: generateId("blk"),
    type: "contact",
    order: order++,
    content: {
      heading: "Contact Us",
      showForm: true,
      showMap: true,
      showPhone: true,
      showEmail: true,
      showAddress: true,
    },
  });

  // CTA block
  blocks.push({
    id: generateId("blk"),
    type: "cta",
    order: order++,
    content: {
      heading: "Ready to Get Started?",
      subheading: site.content.ctaText,
      buttonText: "Contact Us Today",
      buttonLink: "#contact",
    },
  });

  return blocks;
}

// Get or create a draft for a site
export function getDraft(siteId: string): SiteContentDraft | null {
  evictExpiredDrafts();

  let draft = drafts.get(siteId);
  if (draft) return draft;

  // Create draft from existing published version or from generated site
  const siteVersions = versions.get(siteId);
  const published = siteVersions?.find((v) => v.status === "published");

  if (published) {
    draft = {
      siteId,
      blocks: JSON.parse(JSON.stringify(published.blocks)),
      seo: JSON.parse(JSON.stringify(published.seo)),
      theme: JSON.parse(JSON.stringify(published.theme)),
      lastSaved: new Date().toISOString(),
      hasUnsavedChanges: false,
    };
  } else {
    // Try to create from generated site
    const blocks = siteToBlocks(siteId);
    const site = getSite(siteId);

    if (!blocks || !site) return null;

    draft = {
      siteId,
      blocks,
      seo: {
        title: `${site.content.businessName} - ${site.content.tagline || ""}`.trim(),
        description: site.content.aboutText.slice(0, 160),
        keywords: [],
      },
      theme: {
        colors: site.theme.colors,
        fontFamily: site.theme.fontFamily,
      },
      lastSaved: new Date().toISOString(),
      hasUnsavedChanges: false,
    };
  }

  if (drafts.size >= MAX_DRAFTS) {
    evictExpiredDrafts();
    if (drafts.size >= MAX_DRAFTS) {
      // Remove oldest draft
      let oldest: string | null = null;
      let oldestTime = Date.now();
      for (const [id, d] of drafts) {
        const time = new Date(d.lastSaved).getTime();
        if (time < oldestTime) {
          oldest = id;
          oldestTime = time;
        }
      }
      if (oldest) drafts.delete(oldest);
    }
  }

  drafts.set(siteId, draft);
  return draft;
}

// Update a draft
export function updateDraft(
  siteId: string,
  updates: {
    blocks?: ContentBlock[];
    seo?: SEOSettings;
    theme?: { colors: ColorScheme; fontFamily?: string };
  }
): SiteContentDraft {
  let draft = getDraft(siteId);

  if (!draft) {
    throw new Error(`Site not found: ${siteId}`);
  }

  // Validate blocks if provided
  if (updates.blocks) {
    if (!Array.isArray(updates.blocks)) {
      throw new Error("Blocks must be an array");
    }
    if (updates.blocks.length > 50) {
      throw new Error("Maximum 50 blocks allowed");
    }
    for (const block of updates.blocks) {
      if (!validateBlock(block)) {
        throw new Error(`Invalid block: ${JSON.stringify(block)}`);
      }
    }
    draft.blocks = updates.blocks;
  }

  // Validate SEO if provided
  if (updates.seo) {
    if (!validateSEO(updates.seo)) {
      throw new Error("Invalid SEO settings");
    }
    draft.seo = updates.seo;
  }

  // Validate theme if provided
  if (updates.theme) {
    if (!validateColorScheme(updates.theme.colors)) {
      throw new Error("Invalid color scheme");
    }
    draft.theme = updates.theme;
  }

  draft.lastSaved = new Date().toISOString();
  draft.hasUnsavedChanges = true;
  drafts.set(siteId, draft);

  return draft;
}

// Add a block to a draft
export function addBlock(
  siteId: string,
  type: ContentBlockType,
  content: Record<string, unknown>,
  afterBlockId?: string
): ContentBlock {
  const draft = getDraft(siteId);
  if (!draft) {
    throw new Error(`Site not found: ${siteId}`);
  }

  if (draft.blocks.length >= 50) {
    throw new Error("Maximum 50 blocks allowed");
  }

  let order: number;
  if (afterBlockId) {
    const afterIndex = draft.blocks.findIndex((b) => b.id === afterBlockId);
    if (afterIndex === -1) {
      order = draft.blocks.length;
    } else {
      order = afterIndex + 1;
      // Shift subsequent blocks
      for (let i = order; i < draft.blocks.length; i++) {
        draft.blocks[i].order = i + 1;
      }
    }
  } else {
    order = draft.blocks.length;
  }

  const block: ContentBlock = {
    id: generateId("blk"),
    type,
    content,
    order,
  };

  draft.blocks.splice(order, 0, block);

  // Reindex orders
  draft.blocks.forEach((b, i) => { b.order = i; });

  draft.lastSaved = new Date().toISOString();
  draft.hasUnsavedChanges = true;
  drafts.set(siteId, draft);

  return block;
}

// Update a specific block
export function updateBlock(
  siteId: string,
  blockId: string,
  content: Record<string, unknown>
): ContentBlock {
  const draft = getDraft(siteId);
  if (!draft) {
    throw new Error(`Site not found: ${siteId}`);
  }

  const block = draft.blocks.find((b) => b.id === blockId);
  if (!block) {
    throw new Error(`Block not found: ${blockId}`);
  }

  block.content = { ...block.content, ...content };
  draft.lastSaved = new Date().toISOString();
  draft.hasUnsavedChanges = true;
  drafts.set(siteId, draft);

  return block;
}

// Delete a block
export function deleteBlock(siteId: string, blockId: string): void {
  const draft = getDraft(siteId);
  if (!draft) {
    throw new Error(`Site not found: ${siteId}`);
  }

  const index = draft.blocks.findIndex((b) => b.id === blockId);
  if (index === -1) {
    throw new Error(`Block not found: ${blockId}`);
  }

  draft.blocks.splice(index, 1);

  // Reindex orders
  draft.blocks.forEach((b, i) => { b.order = i; });

  draft.lastSaved = new Date().toISOString();
  draft.hasUnsavedChanges = true;
  drafts.set(siteId, draft);
}

// Reorder blocks
export function reorderBlocks(siteId: string, blockIds: string[]): void {
  const draft = getDraft(siteId);
  if (!draft) {
    throw new Error(`Site not found: ${siteId}`);
  }

  const blockMap = new Map(draft.blocks.map((b) => [b.id, b]));
  const reordered: ContentBlock[] = [];

  for (const id of blockIds) {
    const block = blockMap.get(id);
    if (!block) {
      throw new Error(`Block not found: ${id}`);
    }
    block.order = reordered.length;
    reordered.push(block);
  }

  if (reordered.length !== draft.blocks.length) {
    throw new Error("Block IDs do not match existing blocks");
  }

  draft.blocks = reordered;
  draft.lastSaved = new Date().toISOString();
  draft.hasUnsavedChanges = true;
  drafts.set(siteId, draft);
}

// Publish a draft as a new version
export function publishDraft(siteId: string): SiteVersion {
  evictExpiredVersions();

  const draft = getDraft(siteId);
  if (!draft) {
    throw new Error(`Site not found: ${siteId}`);
  }

  const siteVersions = versions.get(siteId) || [];
  const latestVersion = siteVersions.reduce((max, v) => Math.max(max, v.version), 0);

  // Unpublish previous version
  for (const v of siteVersions) {
    if (v.status === "published") {
      v.status = "draft";
    }
  }

  const newVersion: SiteVersion = {
    id: generateId("ver"),
    siteId,
    version: latestVersion + 1,
    blocks: JSON.parse(JSON.stringify(draft.blocks)),
    seo: JSON.parse(JSON.stringify(draft.seo)),
    theme: JSON.parse(JSON.stringify(draft.theme)),
    status: "published",
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  };

  // Enforce max versions limit
  if (siteVersions.length >= MAX_VERSIONS) {
    // Remove oldest non-published version
    const oldestIndex = siteVersions.findIndex((v) => v.status !== "published");
    if (oldestIndex !== -1) {
      siteVersions.splice(oldestIndex, 1);
    }
  }

  siteVersions.push(newVersion);
  versions.set(siteId, siteVersions);

  draft.hasUnsavedChanges = false;
  drafts.set(siteId, draft);

  return newVersion;
}

// Get version history for a site
export function getVersionHistory(siteId: string): SiteVersion[] {
  return versions.get(siteId) || [];
}

// Get a specific version
export function getVersion(siteId: string, versionId: string): SiteVersion | null {
  const siteVersions = versions.get(siteId);
  if (!siteVersions) return null;
  return siteVersions.find((v) => v.id === versionId) || null;
}

// Get published version
export function getPublishedVersion(siteId: string): SiteVersion | null {
  const siteVersions = versions.get(siteId);
  if (!siteVersions) return null;
  return siteVersions.find((v) => v.status === "published") || null;
}

// Rollback to a previous version
export function rollbackToVersion(siteId: string, versionId: string): SiteVersion {
  const siteVersions = versions.get(siteId);
  if (!siteVersions) {
    throw new Error(`Site not found: ${siteId}`);
  }

  const targetVersion = siteVersions.find((v) => v.id === versionId);
  if (!targetVersion) {
    throw new Error(`Version not found: ${versionId}`);
  }

  // Create a new version based on the target
  const latestVersion = siteVersions.reduce((max, v) => Math.max(max, v.version), 0);

  // Unpublish current
  for (const v of siteVersions) {
    if (v.status === "published") {
      v.status = "draft";
    }
  }

  const newVersion: SiteVersion = {
    id: generateId("ver"),
    siteId,
    version: latestVersion + 1,
    blocks: JSON.parse(JSON.stringify(targetVersion.blocks)),
    seo: JSON.parse(JSON.stringify(targetVersion.seo)),
    theme: JSON.parse(JSON.stringify(targetVersion.theme)),
    status: "published",
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  };

  siteVersions.push(newVersion);
  versions.set(siteId, siteVersions);

  // Update draft to match
  const draft = drafts.get(siteId);
  if (draft) {
    draft.blocks = JSON.parse(JSON.stringify(newVersion.blocks));
    draft.seo = JSON.parse(JSON.stringify(newVersion.seo));
    draft.theme = JSON.parse(JSON.stringify(newVersion.theme));
    draft.hasUnsavedChanges = false;
    draft.lastSaved = new Date().toISOString();
    drafts.set(siteId, draft);
  }

  return newVersion;
}

// Image management (simulated - would use S3/Cloudinary in production)
export function uploadImage(
  siteId: string,
  filename: string,
  size: number,
  width: number,
  height: number
): UploadedImage {
  if (images.size >= MAX_IMAGES) {
    // Remove oldest image
    let oldest: string | null = null;
    let oldestTime = Date.now();
    for (const [id, img] of images) {
      const time = new Date(img.uploadedAt).getTime();
      if (time < oldestTime) {
        oldest = id;
        oldestTime = time;
      }
    }
    if (oldest) images.delete(oldest);
  }

  // Sanitize filename
  const sanitizedFilename = filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 100);

  const image: UploadedImage = {
    id: generateId("img"),
    siteId,
    filename: sanitizedFilename,
    url: `https://images.rapidbooth.com/${siteId}/${sanitizedFilename}`, // Simulated URL
    size,
    width,
    height,
    uploadedAt: new Date().toISOString(),
  };

  images.set(image.id, image);
  return image;
}

export function getImages(siteId: string): UploadedImage[] {
  return Array.from(images.values()).filter((img) => img.siteId === siteId);
}

export function deleteImage(imageId: string): void {
  if (!images.has(imageId)) {
    throw new Error(`Image not found: ${imageId}`);
  }
  images.delete(imageId);
}

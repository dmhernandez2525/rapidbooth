"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// Types
interface ContentBlock {
  id: string;
  type: string;
  content: Record<string, unknown>;
  order: number;
}

interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

interface SiteContentDraft {
  siteId: string;
  blocks: ContentBlock[];
  seo: SEOSettings;
  theme: {
    colors: ColorScheme;
    fontFamily?: string;
  };
  lastSaved: string;
  hasUnsavedChanges: boolean;
}

interface SiteVersion {
  id: string;
  siteId: string;
  version: number;
  status: "draft" | "published";
  createdAt: string;
  publishedAt?: string;
}

// Demo data
const DEMO_DRAFT: SiteContentDraft = {
  siteId: "site_summit",
  blocks: [
    {
      id: "blk_1",
      type: "hero",
      order: 0,
      content: {
        title: "Summit Plumbing & Heating",
        subtitle: "Professional plumbing services for your home and business",
        buttonText: "Get a Free Quote",
        buttonLink: "#contact",
      },
    },
    {
      id: "blk_2",
      type: "text",
      order: 1,
      content: {
        heading: "About Us",
        body: "With over 20 years of experience, Summit Plumbing & Heating has been serving the local community with reliable, professional plumbing services. Our team of licensed plumbers is committed to providing top-quality workmanship and exceptional customer service.",
        alignment: "left",
      },
    },
    {
      id: "blk_3",
      type: "services",
      order: 2,
      content: {
        heading: "Our Services",
        services: [
          { name: "Emergency Repairs", description: "24/7 emergency plumbing services" },
          { name: "Water Heater Installation", description: "Expert water heater installation and repair" },
          { name: "Drain Cleaning", description: "Professional drain cleaning and unclogging" },
          { name: "Pipe Repair", description: "Leak detection and pipe repair" },
        ],
      },
    },
    {
      id: "blk_4",
      type: "testimonials",
      order: 3,
      content: {
        heading: "What Our Customers Say",
        testimonials: [
          { name: "John D.", text: "Excellent service! They fixed our water heater same day.", rating: 5 },
          { name: "Sarah M.", text: "Very professional and fair pricing. Highly recommend!", rating: 5 },
        ],
      },
    },
    {
      id: "blk_5",
      type: "contact",
      order: 4,
      content: {
        heading: "Contact Us",
        showForm: true,
        showMap: true,
        showPhone: true,
        showEmail: true,
        showAddress: true,
      },
    },
  ],
  seo: {
    title: "Summit Plumbing & Heating - Professional Plumbing Services",
    description: "Professional plumbing services for your home and business. 24/7 emergency repairs, water heater installation, and more.",
    keywords: ["plumbing", "heating", "water heater", "drain cleaning", "emergency plumber"],
  },
  theme: {
    colors: {
      primary: "#2563eb",
      secondary: "#1e40af",
      accent: "#3b82f6",
      background: "#ffffff",
      text: "#1f2937",
    },
  },
  lastSaved: new Date().toISOString(),
  hasUnsavedChanges: false,
};

const BLOCK_TYPES = [
  { type: "hero", label: "Hero Section", icon: "🏠" },
  { type: "text", label: "Text Block", icon: "📝" },
  { type: "image", label: "Image", icon: "🖼️" },
  { type: "gallery", label: "Image Gallery", icon: "🎨" },
  { type: "services", label: "Services", icon: "🔧" },
  { type: "testimonials", label: "Testimonials", icon: "⭐" },
  { type: "contact", label: "Contact", icon: "📞" },
  { type: "cta", label: "Call to Action", icon: "🎯" },
  { type: "divider", label: "Divider", icon: "➖" },
  { type: "spacer", label: "Spacer", icon: "⬜" },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `https://${process.env.NEXT_PUBLIC_API_URL}`
  : "http://localhost:4000";

export default function EditorPage() {
  const [draft, setDraft] = useState<SiteContentDraft>(DEMO_DRAFT);
  const [versions, setVersions] = useState<SiteVersion[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"blocks" | "seo" | "theme" | "history">("blocks");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);

  const siteId = "site_summit"; // Would come from URL params in production

  // Load draft
  const loadDraft = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/content/draft/${siteId}`);
      if (res.ok) {
        const data = await res.json();
        setDraft(data.draft);
      }
    } catch {
      // Use demo data
    }
  }, [siteId]);

  // Load version history
  const loadVersions = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/content/versions/${siteId}`);
      if (res.ok) {
        const data = await res.json();
        setVersions(data.versions || []);
      }
    } catch {
      // Ignore
    }
  }, [siteId]);

  useEffect(() => {
    loadDraft();
    loadVersions();
  }, [loadDraft, loadVersions]);

  // Save draft
  const saveDraft = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/content/draft/${siteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blocks: draft.blocks,
          seo: draft.seo,
          theme: draft.theme,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setDraft(data.draft);
      }
    } catch {
      // Mark as saved locally
      setDraft((prev) => ({ ...prev, hasUnsavedChanges: false, lastSaved: new Date().toISOString() }));
    }
    setIsSaving(false);
  };

  // Publish
  const publish = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch(`${API_BASE}/api/content/draft/${siteId}/publish`, {
        method: "POST",
      });
      if (res.ok) {
        await loadVersions();
        setDraft((prev) => ({ ...prev, hasUnsavedChanges: false }));
      }
    } catch {
      // Ignore
    }
    setIsPublishing(false);
  };

  // Add block
  const addBlock = (type: string) => {
    const newBlock: ContentBlock = {
      id: `blk_${Date.now()}`,
      type,
      order: draft.blocks.length,
      content: getDefaultContent(type),
    };
    setDraft((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
      hasUnsavedChanges: true,
    }));
    setShowAddBlock(false);
    setSelectedBlock(newBlock.id);
  };

  // Delete block
  const deleteBlock = (blockId: string) => {
    setDraft((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.id !== blockId).map((b, i) => ({ ...b, order: i })),
      hasUnsavedChanges: true,
    }));
    if (selectedBlock === blockId) {
      setSelectedBlock(null);
    }
  };

  // Move block
  const moveBlock = (blockId: string, direction: "up" | "down") => {
    const index = draft.blocks.findIndex((b) => b.id === blockId);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === draft.blocks.length - 1) return;

    const newBlocks = [...draft.blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    newBlocks.forEach((b, i) => { b.order = i; });

    setDraft((prev) => ({ ...prev, blocks: newBlocks, hasUnsavedChanges: true }));
  };

  // Update block content
  const updateBlockContent = (blockId: string, content: Record<string, unknown>) => {
    setDraft((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) =>
        b.id === blockId ? { ...b, content: { ...b.content, ...content } } : b
      ),
      hasUnsavedChanges: true,
    }));
  };

  // Update SEO
  const updateSEO = (updates: Partial<SEOSettings>) => {
    setDraft((prev) => ({
      ...prev,
      seo: { ...prev.seo, ...updates },
      hasUnsavedChanges: true,
    }));
  };

  // Update theme
  const updateTheme = (colorKey: keyof ColorScheme, value: string) => {
    setDraft((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        colors: { ...prev.theme.colors, [colorKey]: value },
      },
      hasUnsavedChanges: true,
    }));
  };

  // Rollback
  const rollback = async (versionId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/content/versions/${siteId}/${versionId}/rollback`, {
        method: "POST",
      });
      if (res.ok) {
        await loadDraft();
        await loadVersions();
      }
    } catch {
      // Ignore
    }
  };

  // Drag and drop handlers
  const handleDragStart = (blockId: string) => {
    setDraggedBlock(blockId);
  };

  const handleDragOver = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    if (!draggedBlock || draggedBlock === targetBlockId) return;
  };

  const handleDrop = (targetBlockId: string) => {
    if (!draggedBlock || draggedBlock === targetBlockId) return;

    const draggedIndex = draft.blocks.findIndex((b) => b.id === draggedBlock);
    const targetIndex = draft.blocks.findIndex((b) => b.id === targetBlockId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newBlocks = [...draft.blocks];
    const [removed] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(targetIndex, 0, removed);
    newBlocks.forEach((b, i) => { b.order = i; });

    setDraft((prev) => ({ ...prev, blocks: newBlocks, hasUnsavedChanges: true }));
    setDraggedBlock(null);
  };

  const selectedBlockData = draft.blocks.find((b) => b.id === selectedBlock);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-16 sm:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 flex-shrink-0 hidden sm:inline">
              ← Back
            </Link>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Content Editor</h1>
            {draft.hasUnsavedChanges && (
              <span className="text-xs sm:text-sm text-amber-600 flex-shrink-0">• Unsaved</span>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">
              Last saved: {new Date(draft.lastSaved).toLocaleTimeString()}
            </span>
            <button
              onClick={saveDraft}
              disabled={isSaving || !draft.hasUnsavedChanges}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={publish}
              disabled={isPublishing}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Main Editor Area */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="bg-white rounded-t-lg border border-b-0 border-gray-200">
              <nav className="flex overflow-x-auto">
                {(["blocks", "seo", "theme", "history"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 sm:px-6 py-3 text-sm font-medium capitalize whitespace-nowrap ${
                      activeTab === tab
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-lg border border-gray-200 p-4 sm:p-6 min-h-[400px] sm:min-h-[600px]">
              {activeTab === "blocks" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Page Blocks</h2>
                    <button
                      onClick={() => setShowAddBlock(!showAddBlock)}
                      className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      + Add Block
                    </button>
                  </div>

                  {showAddBlock && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-3">Select a block type to add:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {BLOCK_TYPES.map((bt) => (
                          <button
                            key={bt.type}
                            onClick={() => addBlock(bt.type)}
                            className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                          >
                            <span className="text-2xl mb-1">{bt.icon}</span>
                            <span className="text-xs text-gray-600">{bt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {draft.blocks.map((block) => (
                      <div
                        key={block.id}
                        draggable
                        onDragStart={() => handleDragStart(block.id)}
                        onDragOver={(e) => handleDragOver(e, block.id)}
                        onDrop={() => handleDrop(block.id)}
                        onClick={() => setSelectedBlock(block.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedBlock === block.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        } ${draggedBlock === block.id ? "opacity-50" : ""}`}
                      >
                        <span className="text-gray-400 cursor-grab">⋮⋮</span>
                        <span className="text-xl">
                          {BLOCK_TYPES.find((t) => t.type === block.type)?.icon || "📦"}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 capitalize">{block.type}</p>
                          <p className="text-sm text-gray-500 truncate">
                            {getBlockPreview(block)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "up"); }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            disabled={block.order === 0}
                          >
                            ↑
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "down"); }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            disabled={block.order === draft.blocks.length - 1}
                          >
                            ↓
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
                            className="p-1 text-red-400 hover:text-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "seo" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-medium text-gray-900">SEO Settings</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Page Title
                    </label>
                    <input
                      type="text"
                      value={draft.seo.title}
                      onChange={(e) => updateSEO({ title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength={60}
                    />
                    <p className="text-xs text-gray-500 mt-1">{draft.seo.title.length}/60 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      value={draft.seo.description}
                      onChange={(e) => updateSEO({ description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 mt-1">{draft.seo.description.length}/160 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={draft.seo.keywords.join(", ")}
                      onChange={(e) => updateSEO({ keywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Open Graph Title (optional)
                    </label>
                    <input
                      type="text"
                      value={draft.seo.ogTitle || ""}
                      onChange={(e) => updateSEO({ ogTitle: e.target.value || undefined })}
                      placeholder="Defaults to page title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Open Graph Description (optional)
                    </label>
                    <textarea
                      value={draft.seo.ogDescription || ""}
                      onChange={(e) => updateSEO({ ogDescription: e.target.value || undefined })}
                      placeholder="Defaults to meta description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                    />
                  </div>
                </div>
              )}

              {activeTab === "theme" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-medium text-gray-900">Theme Settings</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(Object.keys(draft.theme.colors) as Array<keyof ColorScheme>).map((colorKey) => (
                      <div key={colorKey}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          {colorKey} Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={draft.theme.colors[colorKey]}
                            onChange={(e) => updateTheme(colorKey, e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={draft.theme.colors[colorKey]}
                            onChange={(e) => updateTheme(colorKey, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                            pattern="^#[0-9A-Fa-f]{6}$"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: draft.theme.colors.background }}>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: draft.theme.colors.text }}>
                      Theme Preview
                    </h3>
                    <p className="mb-4" style={{ color: draft.theme.colors.text }}>
                      This is how your text will look on your site.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="px-4 py-2 rounded-lg text-white"
                        style={{ backgroundColor: draft.theme.colors.primary }}
                      >
                        Primary Button
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg text-white"
                        style={{ backgroundColor: draft.theme.colors.secondary }}
                      >
                        Secondary
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg text-white"
                        style={{ backgroundColor: draft.theme.colors.accent }}
                      >
                        Accent
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-900">Version History</h2>
                  {versions.length === 0 ? (
                    <p className="text-gray-500">No versions published yet. Publish your first version to enable version history.</p>
                  ) : (
                    <div className="space-y-2">
                      {versions.slice().reverse().map((v) => (
                        <div
                          key={v.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              Version {v.version}
                              {v.status === "published" && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                                  Published
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(v.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {v.status !== "published" && (
                            <button
                              onClick={() => rollback(v.id)}
                              className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Restore
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Block Editor Sidebar */}
          {selectedBlockData && activeTab === "blocks" && (
            <div className="w-full lg:w-80 bg-white rounded-lg border border-gray-200 p-4 h-fit lg:sticky lg:top-36">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 capitalize">
                  Edit {selectedBlockData.type}
                </h3>
                <button
                  onClick={() => setSelectedBlock(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <BlockEditor
                block={selectedBlockData}
                onUpdate={(content) => updateBlockContent(selectedBlockData.id, content)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Block Editor Component
function BlockEditor({
  block,
  onUpdate,
}: {
  block: ContentBlock;
  onUpdate: (content: Record<string, unknown>) => void;
}) {
  const content = block.content as Record<string, unknown>;

  switch (block.type) {
    case "hero":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <textarea
              value={(content.subtitle as string) || ""}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              value={(content.buttonText as string) || ""}
              onChange={(e) => onUpdate({ buttonText: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
            <input
              type="text"
              value={(content.buttonLink as string) || ""}
              onChange={(e) => onUpdate({ buttonLink: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      );

    case "text":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
            <input
              type="text"
              value={(content.heading as string) || ""}
              onChange={(e) => onUpdate({ heading: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body Text</label>
            <textarea
              value={(content.body as string) || ""}
              onChange={(e) => onUpdate({ body: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
            <select
              value={(content.alignment as string) || "left"}
              onChange={(e) => onUpdate({ alignment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      );

    case "cta":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
            <input
              type="text"
              value={(content.heading as string) || ""}
              onChange={(e) => onUpdate({ heading: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subheading</label>
            <input
              type="text"
              value={(content.subheading as string) || ""}
              onChange={(e) => onUpdate({ subheading: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              value={(content.buttonText as string) || ""}
              onChange={(e) => onUpdate({ buttonText: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
            <input
              type="text"
              value={(content.buttonLink as string) || ""}
              onChange={(e) => onUpdate({ buttonLink: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      );

    case "contact":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
            <input
              type="text"
              value={(content.heading as string) || ""}
              onChange={(e) => onUpdate({ heading: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showForm as boolean) || false}
                onChange={(e) => onUpdate({ showForm: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Show Contact Form</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showMap as boolean) || false}
                onChange={(e) => onUpdate({ showMap: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Show Map</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showPhone as boolean) || false}
                onChange={(e) => onUpdate({ showPhone: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Show Phone Number</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showEmail as boolean) || false}
                onChange={(e) => onUpdate({ showEmail: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Show Email</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(content.showAddress as boolean) || false}
                onChange={(e) => onUpdate({ showAddress: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Show Address</span>
            </label>
          </div>
        </div>
      );

    case "services":
      return (
        <ServicesBlockEditor
          content={content}
          onUpdate={onUpdate}
        />
      );

    case "testimonials":
      return (
        <TestimonialsBlockEditor
          content={content}
          onUpdate={onUpdate}
        />
      );

    case "image":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              value={(content.src as string) || ""}
              onChange={(e) => onUpdate({ src: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
            <input
              type="text"
              value={(content.alt as string) || ""}
              onChange={(e) => onUpdate({ alt: e.target.value })}
              placeholder="Describe the image for accessibility"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caption (optional)</label>
            <input
              type="text"
              value={(content.caption as string) || ""}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
            <select
              value={(content.width as string) || "medium"}
              onChange={(e) => onUpdate({ width: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="small">Small (25%)</option>
              <option value="medium">Medium (50%)</option>
              <option value="large">Large (75%)</option>
              <option value="full">Full Width</option>
            </select>
          </div>
        </div>
      );

    case "gallery":
      return (
        <GalleryBlockEditor
          content={content}
          onUpdate={onUpdate}
        />
      );

    case "divider":
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            A horizontal line to separate sections of content.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
            <select
              value={(content.style as string) || "solid"}
              onChange={(e) => onUpdate({ style: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="solid">Solid Line</option>
              <option value="dashed">Dashed Line</option>
              <option value="dotted">Dotted Line</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
            <select
              value={(content.width as string) || "full"}
              onChange={(e) => onUpdate({ width: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="small">Short (25%)</option>
              <option value="medium">Medium (50%)</option>
              <option value="large">Wide (75%)</option>
              <option value="full">Full Width</option>
            </select>
          </div>
        </div>
      );

    case "spacer":
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Add vertical space between sections.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height: {(content.height as number) || 48}px
            </label>
            <input
              type="range"
              min="16"
              max="200"
              step="8"
              value={(content.height as number) || 48}
              onChange={(e) => onUpdate({ height: parseInt(e.target.value, 10) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>16px</span>
              <span>200px</span>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="text-sm text-gray-500">
          <p>Block type: {block.type}</p>
        </div>
      );
  }
}

// Services Block Editor
function ServicesBlockEditor({
  content,
  onUpdate,
}: {
  content: Record<string, unknown>;
  onUpdate: (content: Record<string, unknown>) => void;
}) {
  const services = (content.services as Array<{ name: string; description: string }>) || [];

  const addService = () => {
    onUpdate({
      services: [...services, { name: "", description: "" }],
    });
  };

  const updateService = (index: number, field: "name" | "description", value: string) => {
    const updated = services.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    onUpdate({ services: updated });
  };

  const removeService = (index: number) => {
    onUpdate({ services: services.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
        <input
          type="text"
          value={(content.heading as string) || ""}
          onChange={(e) => onUpdate({ heading: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Services</label>
          <button
            onClick={addService}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Service
          </button>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {services.map((service, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-500">Service {index + 1}</span>
                <button
                  onClick={() => removeService(index)}
                  className="text-red-500 hover:text-red-600 text-xs"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                value={service.name}
                onChange={(e) => updateService(index, "name", e.target.value)}
                placeholder="Service name"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2 focus:ring-1 focus:ring-blue-500"
              />
              <textarea
                value={service.description}
                onChange={(e) => updateService(index, "description", e.target.value)}
                placeholder="Description"
                rows={2}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}
          {services.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No services added. Click &quot;+ Add Service&quot; to add one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Testimonials Block Editor
function TestimonialsBlockEditor({
  content,
  onUpdate,
}: {
  content: Record<string, unknown>;
  onUpdate: (content: Record<string, unknown>) => void;
}) {
  const testimonials = (content.testimonials as Array<{ name: string; text: string; rating: number }>) || [];

  const addTestimonial = () => {
    onUpdate({
      testimonials: [...testimonials, { name: "", text: "", rating: 5 }],
    });
  };

  const updateTestimonial = (index: number, field: string, value: string | number) => {
    const updated = testimonials.map((t, i) =>
      i === index ? { ...t, [field]: value } : t
    );
    onUpdate({ testimonials: updated });
  };

  const removeTestimonial = (index: number) => {
    onUpdate({ testimonials: testimonials.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Section Heading</label>
        <input
          type="text"
          value={(content.heading as string) || ""}
          onChange={(e) => onUpdate({ heading: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Testimonials</label>
          <button
            onClick={addTestimonial}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Testimonial
          </button>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-500">Testimonial {index + 1}</span>
                <button
                  onClick={() => removeTestimonial(index)}
                  className="text-red-500 hover:text-red-600 text-xs"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                value={testimonial.name}
                onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                placeholder="Customer name"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2 focus:ring-1 focus:ring-blue-500"
              />
              <textarea
                value={testimonial.text}
                onChange={(e) => updateTestimonial(index, "text", e.target.value)}
                placeholder="Testimonial text"
                rows={2}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2 focus:ring-1 focus:ring-blue-500"
              />
              <div>
                <label className="text-xs text-gray-600">Rating</label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => updateTestimonial(index, "rating", star)}
                      className={`text-lg ${star <= testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {testimonials.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No testimonials added. Click &quot;+ Add Testimonial&quot; to add one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Gallery Block Editor
function GalleryBlockEditor({
  content,
  onUpdate,
}: {
  content: Record<string, unknown>;
  onUpdate: (content: Record<string, unknown>) => void;
}) {
  const images = (content.images as Array<{ src: string; alt: string; caption?: string }>) || [];

  const addImage = () => {
    onUpdate({
      images: [...images, { src: "", alt: "", caption: "" }],
    });
  };

  const updateImage = (index: number, field: string, value: string) => {
    const updated = images.map((img, i) =>
      i === index ? { ...img, [field]: value } : img
    );
    onUpdate({ images: updated });
  };

  const removeImage = (index: number) => {
    onUpdate({ images: images.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
        <select
          value={(content.columns as number) || 3}
          onChange={(e) => onUpdate({ columns: parseInt(e.target.value, 10) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value={2}>2 Columns</option>
          <option value={3}>3 Columns</option>
          <option value={4}>4 Columns</option>
        </select>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Images</label>
          <button
            onClick={addImage}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Image
          </button>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {images.map((image, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-500">Image {index + 1}</span>
                <button
                  onClick={() => removeImage(index)}
                  className="text-red-500 hover:text-red-600 text-xs"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                value={image.src}
                onChange={(e) => updateImage(index, "src", e.target.value)}
                placeholder="Image URL"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2 focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                value={image.alt}
                onChange={(e) => updateImage(index, "alt", e.target.value)}
                placeholder="Alt text"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2 focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                value={image.caption || ""}
                onChange={(e) => updateImage(index, "caption", e.target.value)}
                placeholder="Caption (optional)"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}
          {images.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No images added. Click &quot;+ Add Image&quot; to add one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getDefaultContent(type: string): Record<string, unknown> {
  switch (type) {
    case "hero":
      return { title: "Your Headline Here", subtitle: "Your subheadline", buttonText: "Learn More", buttonLink: "#" };
    case "text":
      return { heading: "", body: "Enter your text here...", alignment: "left" };
    case "image":
      return { src: "", alt: "", caption: "", width: "medium" };
    case "gallery":
      return { images: [], columns: 3 };
    case "services":
      return { heading: "Our Services", services: [] };
    case "testimonials":
      return { heading: "Testimonials", testimonials: [] };
    case "contact":
      return { heading: "Contact Us", showForm: true, showMap: false, showPhone: true, showEmail: true, showAddress: true };
    case "cta":
      return { heading: "Ready to Get Started?", subheading: "", buttonText: "Contact Us", buttonLink: "#contact" };
    case "divider":
      return {};
    case "spacer":
      return { height: 48 };
    default:
      return {};
  }
}

function getBlockPreview(block: ContentBlock): string {
  const content = block.content as Record<string, unknown>;
  switch (block.type) {
    case "hero":
      return (content.title as string) || "Hero section";
    case "text":
      return (content.heading as string) || (content.body as string)?.slice(0, 50) || "Text block";
    case "services":
      return (content.heading as string) || "Services section";
    case "testimonials":
      return (content.heading as string) || "Testimonials section";
    case "contact":
      return (content.heading as string) || "Contact section";
    case "cta":
      return (content.heading as string) || "Call to action";
    case "image":
      return (content.alt as string) || "Image";
    case "gallery":
      return `Gallery (${((content.images as unknown[]) || []).length} images)`;
    case "divider":
      return "Divider line";
    case "spacer":
      return `Spacer (${content.height || 48}px)`;
    default:
      return block.type;
  }
}

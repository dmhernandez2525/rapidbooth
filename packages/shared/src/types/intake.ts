export type IntakePhase =
  | "discovery"
  | "audit"
  | "features"
  | "design"
  | "content"
  | "close";

export interface IntakePhaseConfig {
  id: IntakePhase;
  label: string;
  description: string;
  estimatedMinutes: number;
}

export interface IntakeMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  phase: IntakePhase;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface IntakeSession {
  id: string;
  status: "active" | "completed" | "abandoned";
  currentPhase: IntakePhase;
  phaseProgress: Record<IntakePhase, PhaseProgress>;
  messages: IntakeMessage[];
  extractedData: ExtractedBusinessData;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface PhaseProgress {
  status: "pending" | "active" | "completed";
  startedAt?: string;
  completedAt?: string;
}

export interface ExtractedBusinessData {
  businessName?: string;
  businessType?: string;
  industry?: string;
  description?: string;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  socialMedia?: string[];
  targetCustomers?: string;
  uniqueValue?: string;
  biggestChallenge?: string;
  desiredPages?: string[];
  needsEcommerce?: boolean;
  needsScheduling?: boolean;
  needsBlog?: boolean;
  needsMenu?: boolean;
  specialIntegrations?: string[];
  brandColors?: string[];
  brandVibe?: string;
  hasLogo?: boolean;
  referenceWebsites?: string[];
  hasPhotos?: boolean;
  hasCopywriting?: boolean;
  desiredDomain?: string;
  maintenancePlan?: string;
}

export interface IntakeStartRequest {
  repId?: string;
  businessName?: string;
}

export interface IntakeMessageRequest {
  sessionId: string;
  content: string;
}

export interface IntakeSessionResponse {
  session: IntakeSession;
}

export interface IntakeMessageResponse {
  message: IntakeMessage;
  session: IntakeSession;
  phaseTransition?: {
    from: IntakePhase;
    to: IntakePhase;
  };
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  services: ServiceItem[];
  testimonials: TestimonialItem[];
  ctaText: string;
}

export interface ServiceItem {
  name: string;
  description: string;
  icon?: string;
}

export interface TestimonialItem {
  name: string;
  text: string;
  rating: number;
  business?: string;
}

export interface GeneratedSiteConfig {
  template: string;
  colorScheme: ColorScheme;
  content: SiteContent;
  deploymentUrl?: string;
}

export const INTAKE_PHASES: IntakePhaseConfig[] = [
  {
    id: "discovery",
    label: "Business Discovery",
    description: "Understanding your business, customers, and what makes you unique",
    estimatedMinutes: 5,
  },
  {
    id: "audit",
    label: "Digital Presence",
    description: "Reviewing your current online presence and how customers find you",
    estimatedMinutes: 3,
  },
  {
    id: "features",
    label: "Feature Selection",
    description: "Choosing the pages and features your website needs",
    estimatedMinutes: 7,
  },
  {
    id: "design",
    label: "Brand & Design",
    description: "Defining colors, style, and the visual feel of your website",
    estimatedMinutes: 5,
  },
  {
    id: "content",
    label: "Content & Assets",
    description: "Gathering photos, text, and materials for your website",
    estimatedMinutes: 5,
  },
  {
    id: "close",
    label: "Review & Launch",
    description: "Finalizing details and getting ready to build your site",
    estimatedMinutes: 5,
  },
];

export const PHASE_ORDER: IntakePhase[] = [
  "discovery",
  "audit",
  "features",
  "design",
  "content",
  "close",
];

// Content Editor Types

export type ContentBlockType =
  | "hero"
  | "text"
  | "image"
  | "gallery"
  | "services"
  | "testimonials"
  | "contact"
  | "cta"
  | "divider"
  | "spacer";

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  content: Record<string, unknown>;
  order: number;
}

export interface HeroBlockContent {
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
}

export interface TextBlockContent {
  heading?: string;
  body: string;
  alignment: "left" | "center" | "right";
}

export interface ImageBlockContent {
  src: string;
  alt: string;
  caption?: string;
  width?: "small" | "medium" | "large" | "full";
}

export interface GalleryBlockContent {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  columns: 2 | 3 | 4;
}

export interface ServicesBlockContent {
  heading: string;
  services: ServiceItem[];
}

export interface TestimonialsBlockContent {
  heading: string;
  testimonials: TestimonialItem[];
}

export interface ContactBlockContent {
  heading: string;
  showForm: boolean;
  showMap: boolean;
  showPhone: boolean;
  showEmail: boolean;
  showAddress: boolean;
}

export interface CtaBlockContent {
  heading: string;
  subheading?: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor?: string;
}

export interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface SiteVersion {
  id: string;
  siteId: string;
  version: number;
  blocks: ContentBlock[];
  seo: SEOSettings;
  theme: {
    colors: ColorScheme;
    fontFamily?: string;
  };
  status: "draft" | "published";
  createdAt: string;
  publishedAt?: string;
  createdBy?: string;
}

export interface SiteContentDraft {
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

export interface UploadedImage {
  id: string;
  siteId: string;
  filename: string;
  url: string;
  size: number;
  width: number;
  height: number;
  uploadedAt: string;
}

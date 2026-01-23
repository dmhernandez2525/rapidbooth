import { BusinessCategory } from "./business";

export interface IntakeSession {
  id: string;
  businessId?: string;
  status: IntakeStatus;
  currentStep: IntakeStep;
  responses: IntakeResponse[];
  generatedSite?: GeneratedSiteConfig;
  createdAt: Date;
  updatedAt: Date;
}

export type IntakeStatus =
  | "in-progress"
  | "completed"
  | "generating"
  | "deployed"
  | "error";

export type IntakeStep =
  | "greeting"
  | "business-name"
  | "industry"
  | "services"
  | "branding"
  | "content"
  | "review"
  | "generating"
  | "complete";

export interface IntakeResponse {
  step: IntakeStep;
  question: string;
  answer: string;
  timestamp: Date;
}

export interface GeneratedSiteConfig {
  template: string;
  colorScheme: ColorScheme;
  content: SiteContent;
  deploymentUrl?: string;
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

export interface ConversationMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface IntakeFormData {
  businessName: string;
  category: BusinessCategory;
  description: string;
  services: string[];
  targetAudience: string;
  preferredColors?: string[];
  existingWebsite?: string;
  contactEmail: string;
  contactPhone?: string;
}

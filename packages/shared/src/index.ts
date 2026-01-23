export * from "./types";

export const APP_NAME = "RapidBooth";
export const APP_TAGLINE = "Fresh Sites, Harvested in 30 Minutes.";

export const PRICING = {
  monthly: 30,
  currency: "USD",
  plan: "Professional",
} as const;

export const BRAND_COLORS = {
  forestGreen: "#1B4332",
  harvestGold: "#EEB422",
  slateBlue: "#2B2D42",
  cream: "#F8F9FA",
} as const;

export const API_VERSION = "v1";
export const API_PREFIX = `/api/${API_VERSION}`;

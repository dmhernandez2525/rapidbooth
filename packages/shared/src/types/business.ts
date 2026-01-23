export interface BusinessInfo {
  id: string;
  name: string;
  industry: string;
  description: string;
  address?: Address;
  phone?: string;
  email?: string;
  website?: string;
  hours?: BusinessHours;
  socialMedia?: SocialMedia;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface BusinessHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  closed?: boolean;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  yelp?: string;
  google?: string;
}

export interface ServiceOffering {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price?: number;
  duration?: number;
  category?: string;
}

export type BusinessCategory =
  | "restaurant"
  | "retail"
  | "salon"
  | "fitness"
  | "healthcare"
  | "professional-services"
  | "home-services"
  | "automotive"
  | "other";

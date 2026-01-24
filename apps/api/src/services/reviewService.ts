interface Review {
  id: string;
  siteId: string;
  platform: "google" | "yelp" | "facebook";
  author: string;
  rating: number;
  text: string;
  date: string;
  response?: string;
  responseDate?: string;
  status: "published" | "hidden" | "flagged";
  helpful: number;
  verified: boolean;
}

interface ReviewConfig {
  siteId: string;
  businessName: string;
  platforms: {
    google?: { placeId: string; connected: boolean };
    yelp?: { businessId: string; connected: boolean };
    facebook?: { pageId: string; connected: boolean };
  };
  autoPublish: boolean;
  minimumRating: number;
  notifyOnNew: boolean;
  widgetLayout: "carousel" | "grid" | "list" | "masonry";
}

interface ReviewStats {
  siteId: string;
  totalReviews: number;
  averageRating: number;
  platformBreakdown: Record<string, { count: number; avgRating: number }>;
  ratingDistribution: Record<number, number>;
  monthlyTrend: Array<{ month: string; count: number; avgRating: number }>;
  responseRate: number;
}

const reviewConfigs: Map<string, ReviewConfig> = new Map();
const reviews: Map<string, Review> = new Map();

function seedDemoData(): void {
  // Config for Summit Plumbing
  reviewConfigs.set("site_summit", {
    siteId: "site_summit",
    businessName: "Summit Plumbing & HVAC",
    platforms: {
      google: { placeId: "ChIJ_summit_plumbing", connected: true },
      yelp: { businessId: "summit-plumbing-hvac-denver", connected: true },
      facebook: { pageId: "SummitPlumbingHVAC", connected: false },
    },
    autoPublish: true,
    minimumRating: 3,
    notifyOnNew: true,
    widgetLayout: "carousel",
  });

  // Config for Clearview Dental
  reviewConfigs.set("site_dental", {
    siteId: "site_dental",
    businessName: "Clearview Family Dental",
    platforms: {
      google: { placeId: "ChIJ_clearview_dental", connected: true },
      yelp: { businessId: "clearview-family-dental", connected: true },
      facebook: { pageId: "ClearviewDental", connected: true },
    },
    autoPublish: true,
    minimumRating: 4,
    notifyOnNew: true,
    widgetLayout: "grid",
  });

  // Demo reviews for Summit Plumbing
  const summitReviews: Omit<Review, "id">[] = [
    { siteId: "site_summit", platform: "google", author: "Sarah M.", rating: 5, text: "Best plumbing service in Denver! They fixed our water heater same day. Professional, courteous, and fair pricing. Highly recommend Summit Plumbing.", date: "2025-12-15", response: "Thank you Sarah! We're glad we could help with your water heater. We appreciate your business!", responseDate: "2025-12-16", status: "published", helpful: 12, verified: true },
    { siteId: "site_summit", platform: "google", author: "Mike R.", rating: 5, text: "Called for an emergency pipe burst at 2am and they were here within 30 minutes. Incredible response time and quality work. Saved us from major water damage.", date: "2025-12-10", response: "We're always here for emergencies, Mike. Glad we could prevent further damage to your home!", responseDate: "2025-12-11", status: "published", helpful: 8, verified: true },
    { siteId: "site_summit", platform: "yelp", author: "Jennifer K.", rating: 4, text: "Good service overall. They installed our new furnace efficiently. Only reason for 4 stars is the initial scheduling took a few days, but once they arrived the work was excellent.", date: "2025-11-28", status: "published", helpful: 5, verified: true },
    { siteId: "site_summit", platform: "google", author: "Tom H.", rating: 5, text: "Used Summit for both plumbing and HVAC. Their technicians are knowledgeable and explain everything clearly. No surprise charges. A+ experience.", date: "2025-11-20", response: "Thanks Tom! Transparency is important to us. We look forward to helping you again!", responseDate: "2025-11-21", status: "published", helpful: 6, verified: true },
    { siteId: "site_summit", platform: "yelp", author: "Lisa P.", rating: 3, text: "Decent work but took longer than quoted. The final result was good but communication during the job could be better.", date: "2025-11-15", status: "published", helpful: 2, verified: true },
    { siteId: "site_summit", platform: "google", author: "David W.", rating: 5, text: "Annual HVAC maintenance. Always reliable, always thorough. They catch issues before they become problems. Been using them for 3 years.", date: "2025-11-08", status: "published", helpful: 4, verified: true },
    { siteId: "site_summit", platform: "google", author: "Rachel S.", rating: 5, text: "Replaced all our bathroom fixtures. Work was immaculate and they cleaned up perfectly. You'd never know they were here (except for the beautiful new fixtures!).", date: "2025-10-25", status: "published", helpful: 7, verified: true },
    { siteId: "site_summit", platform: "yelp", author: "Carlos G.", rating: 4, text: "Solid work on our kitchen sink replacement. Fair pricing and good warranty. Would use again.", date: "2025-10-18", status: "published", helpful: 3, verified: true },
    { siteId: "site_summit", platform: "google", author: "Nancy B.", rating: 2, text: "Showed up late and the repair didn't hold. Had to call back for a redo.", date: "2025-10-10", response: "We sincerely apologize for the inconvenience, Nancy. We've addressed this with our team and are glad we could make it right on the follow-up visit.", responseDate: "2025-10-11", status: "published", helpful: 1, verified: true },
    { siteId: "site_summit", platform: "google", author: "Alex T.", rating: 5, text: "Installed a tankless water heater. Energy bills have dropped significantly. Great recommendation from their team on the right unit for our home size.", date: "2025-10-01", status: "published", helpful: 9, verified: true },
    { siteId: "site_summit", platform: "yelp", author: "Patricia F.", rating: 5, text: "Quick drain unclogging. In and out in under an hour. Very reasonable price.", date: "2025-09-20", status: "published", helpful: 3, verified: true },
    { siteId: "site_summit", platform: "google", author: "James L.", rating: 4, text: "Good AC repair service. Technician was knowledgeable but the appointment window was too broad. Fixed the issue on the first try though.", date: "2025-09-12", status: "published", helpful: 2, verified: true },
  ];

  summitReviews.forEach((r, i) => {
    const id = `rev_summit_${(i + 1).toString().padStart(3, "0")}`;
    reviews.set(id, { ...r, id });
  });

  // Demo reviews for Clearview Dental
  const dentalReviews: Omit<Review, "id">[] = [
    { siteId: "site_dental", platform: "google", author: "Amanda C.", rating: 5, text: "Dr. Chen is amazing! My kids actually look forward to their dental visits. The office is modern and the staff is so friendly. Best family dentist we've had.", date: "2025-12-18", response: "Thank you Amanda! We love seeing your family. It's our mission to make dental visits fun for kids!", responseDate: "2025-12-18", status: "published", helpful: 15, verified: true },
    { siteId: "site_dental", platform: "google", author: "Robert J.", rating: 5, text: "Had a crown done here. Painless procedure, perfect fit on the first try. The digital imaging technology they use is impressive.", date: "2025-12-12", status: "published", helpful: 8, verified: true },
    { siteId: "site_dental", platform: "yelp", author: "Maria G.", rating: 4, text: "Clean office, friendly staff, minimal wait time. Only wish they had more evening hours available. Otherwise great experience for my cleaning.", date: "2025-12-05", status: "published", helpful: 4, verified: true },
    { siteId: "site_dental", platform: "facebook", author: "Kevin M.", rating: 5, text: "Emergency tooth extraction was handled with such care. Dr. Chen explained every step and made sure I was comfortable. Follow-up care instructions were thorough.", date: "2025-11-22", response: "We hope you're healing well, Kevin! Don't hesitate to call if you have any concerns.", responseDate: "2025-11-23", status: "published", helpful: 6, verified: true },
    { siteId: "site_dental", platform: "google", author: "Susan P.", rating: 5, text: "Teeth whitening results exceeded my expectations. Three shades lighter! The take-home kit they provided is a nice bonus for maintenance.", date: "2025-11-15", status: "published", helpful: 11, verified: true },
    { siteId: "site_dental", platform: "yelp", author: "Brian T.", rating: 3, text: "Good dentistry but the billing department made errors twice on my insurance claim. Had to follow up multiple times. The actual dental work was fine.", date: "2025-11-08", status: "published", helpful: 3, verified: true },
    { siteId: "site_dental", platform: "google", author: "Diana W.", rating: 5, text: "Invisalign journey has been smooth thanks to Clearview. Monthly check-ins are quick and they're always happy to answer questions between visits.", date: "2025-10-30", status: "published", helpful: 7, verified: true },
    { siteId: "site_dental", platform: "facebook", author: "Eric N.", rating: 4, text: "Reliable preventive care. They caught a cavity early that another dentist missed. Appreciate their thoroughness.", date: "2025-10-20", status: "published", helpful: 5, verified: true },
    { siteId: "site_dental", platform: "google", author: "Laura H.", rating: 5, text: "Had severe dental anxiety before coming here. The sedation options and gentle approach have completely changed my feelings about going to the dentist.", date: "2025-10-12", response: "Laura, we're so proud of your progress! Overcoming dental anxiety is a big deal and you're doing great.", responseDate: "2025-10-13", status: "published", helpful: 14, verified: true },
    { siteId: "site_dental", platform: "google", author: "Frank R.", rating: 5, text: "Whole family comes here. From grandma's dentures to the kids' sealants, they handle every age group with expertise.", date: "2025-09-28", status: "published", helpful: 9, verified: true },
  ];

  dentalReviews.forEach((r, i) => {
    const id = `rev_dental_${(i + 1).toString().padStart(3, "0")}`;
    reviews.set(id, { ...r, id });
  });
}

seedDemoData();

export function getReviewConfig(siteId: string): ReviewConfig | undefined {
  return reviewConfigs.get(siteId);
}

export function updateReviewConfig(siteId: string, updates: Partial<ReviewConfig>): ReviewConfig {
  const existing = reviewConfigs.get(siteId);
  if (!existing) {
    const config: ReviewConfig = {
      siteId,
      businessName: updates.businessName || "My Business",
      platforms: updates.platforms || {},
      autoPublish: updates.autoPublish ?? true,
      minimumRating: updates.minimumRating ?? 3,
      notifyOnNew: updates.notifyOnNew ?? true,
      widgetLayout: updates.widgetLayout || "carousel",
    };
    reviewConfigs.set(siteId, config);
    return config;
  }
  const updated = { ...existing, ...updates, siteId };
  reviewConfigs.set(siteId, updated);
  return updated;
}

export function getReviews(
  siteId?: string,
  platform?: string,
  status?: string,
  minRating?: number,
  maxRating?: number
): Review[] {
  let result = Array.from(reviews.values());
  if (siteId) result = result.filter((r) => r.siteId === siteId);
  if (platform) result = result.filter((r) => r.platform === platform);
  if (status) result = result.filter((r) => r.status === status);
  if (minRating !== undefined) result = result.filter((r) => r.rating >= minRating);
  if (maxRating !== undefined) result = result.filter((r) => r.rating <= maxRating);
  result.sort((a, b) => b.date.localeCompare(a.date));
  return result;
}

export function getReview(reviewId: string): Review | undefined {
  return reviews.get(reviewId);
}

export function respondToReview(reviewId: string, responseText: string): Review {
  const review = reviews.get(reviewId);
  if (!review) throw new Error("Review not found");
  review.response = responseText;
  review.responseDate = new Date().toISOString().split("T")[0];
  reviews.set(reviewId, review);
  return review;
}

export function updateReviewStatus(reviewId: string, newStatus: "published" | "hidden" | "flagged"): Review {
  const review = reviews.get(reviewId);
  if (!review) throw new Error("Review not found");
  review.status = newStatus;
  reviews.set(reviewId, review);
  return review;
}

export function getReviewStats(siteId: string): ReviewStats {
  const siteReviews = Array.from(reviews.values()).filter((r) => r.siteId === siteId);

  const totalReviews = siteReviews.length;
  const averageRating = totalReviews > 0
    ? Math.round((siteReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
    : 0;

  const platformBreakdown: Record<string, { count: number; avgRating: number }> = {};
  const platforms = ["google", "yelp", "facebook"];
  platforms.forEach((p) => {
    const platformReviews = siteReviews.filter((r) => r.platform === p);
    if (platformReviews.length > 0) {
      platformBreakdown[p] = {
        count: platformReviews.length,
        avgRating: Math.round((platformReviews.reduce((sum, r) => sum + r.rating, 0) / platformReviews.length) * 10) / 10,
      };
    }
  });

  const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  siteReviews.forEach((r) => {
    ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1;
  });

  // Monthly trend (last 6 months)
  const monthlyTrend: Array<{ month: string; count: number; avgRating: number }> = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthStr = d.toISOString().slice(0, 7); // YYYY-MM
    const monthReviews = siteReviews.filter((r) => r.date.startsWith(monthStr));
    monthlyTrend.push({
      month: d.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      count: monthReviews.length,
      avgRating: monthReviews.length > 0
        ? Math.round((monthReviews.reduce((sum, r) => sum + r.rating, 0) / monthReviews.length) * 10) / 10
        : 0,
    });
  }

  const reviewsWithResponse = siteReviews.filter((r) => r.response);
  const responseRate = totalReviews > 0 ? Math.round((reviewsWithResponse.length / totalReviews) * 100) : 0;

  return {
    siteId,
    totalReviews,
    averageRating,
    platformBreakdown,
    ratingDistribution,
    monthlyTrend,
    responseRate,
  };
}

export function requestReviews(siteId: string, customerEmails: string[]): { sent: number; skipped: number } {
  // Simulates sending review request emails
  const config = reviewConfigs.get(siteId);
  if (!config) throw new Error("Site not configured for reviews");

  // In production, this would send actual emails with review links
  const sent = customerEmails.filter((e) => e.includes("@")).length;
  const skipped = customerEmails.length - sent;

  return { sent, skipped };
}

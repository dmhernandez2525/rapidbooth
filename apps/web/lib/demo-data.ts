import type { GeneratedSite } from "@/components/site-preview";

// Demo sites showcasing different business types
export const DEMO_SITES: Record<string, GeneratedSite> = {
  "home-services": {
    id: "demo_home_services",
    sessionId: "demo",
    template: "home-services",
    components: [
      { id: "nav", type: "navbar", order: 0, props: {} },
      { id: "hero", type: "hero", order: 1, props: {} },
      { id: "about", type: "about", order: 2, props: {} },
      { id: "services", type: "services", order: 3, props: {} },
      { id: "gallery", type: "gallery", order: 4, props: {} },
      { id: "testimonials", type: "testimonials", order: 5, props: {} },
      { id: "booking", type: "booking", order: 6, props: {} },
      { id: "contact", type: "contact", order: 7, props: {} },
      { id: "footer", type: "footer", order: 99, props: {} },
    ],
    theme: {
      colors: {
        primary: "#1E40AF",
        secondary: "#F59E0B",
        accent: "#10B981",
        background: "#F8FAFC",
        text: "#1E293B",
      },
      fontFamily: "sans-serif",
      borderRadius: "0.75rem",
      style: "modern",
    },
    content: {
      businessName: "Summit Plumbing & HVAC",
      tagline: "Your comfort is our craft",
      heroTitle: "Professional Plumbing & HVAC in Denver",
      heroSubtitle:
        "Summit Plumbing & HVAC delivers reliable, high-quality home services. Licensed, insured, and committed to keeping your home comfortable year-round.",
      aboutTitle: "Why Denver Trusts Summit",
      aboutText:
        "At Summit Plumbing & HVAC, we've been serving the Denver metro area for over 15 years. Our team of certified professionals handles everything from routine maintenance to emergency repairs with the same attention to detail.\nWe believe in transparent pricing, on-time arrivals, and treating your home like it's our own. That's why we're consistently rated 5 stars across Google and Yelp.",
      services: [
        {
          name: "Plumbing Repairs",
          description: "From leaky faucets to burst pipes, we handle it all",
          price: "From $89",
        },
        {
          name: "HVAC Installation",
          description: "New systems installed with manufacturer warranty",
          price: "Free Estimate",
        },
        {
          name: "Emergency Service",
          description: "24/7 availability for urgent plumbing & heating issues",
          price: "Call Now",
        },
        {
          name: "Maintenance Plans",
          description: "Annual tune-ups to prevent costly breakdowns",
          price: "$29/month",
        },
      ],
      testimonials: [
        {
          name: "Sarah M.",
          text: "Summit fixed our furnace on a freezing Saturday night. Professional, fast, and fairly priced. Can't recommend enough!",
          rating: 5,
        },
        {
          name: "James T.",
          text: "Best plumber in Denver. They've handled three jobs for us now and every time it's been top-notch quality.",
          rating: 5,
        },
        {
          name: "Maria L.",
          text: "Their maintenance plan has saved us from two potential emergencies already. Worth every penny!",
          rating: 5,
        },
      ],
      contactInfo: {
        phone: "(303) 555-0187",
        email: "service@summitphvac.com",
        address: "2847 Elm Street, Denver, CO 80205",
        hours: "Mon-Sat: 7AM-7PM | Emergency: 24/7",
      },
      ctaText: "Ready for reliable home service? Get a free estimate today.",
      ctaButtonText: "Book Now",
      footerText: "\u00A9 2025 Summit Plumbing & HVAC. All rights reserved.",
    },
    status: "ready",
    createdAt: new Date().toISOString(),
  },
  restaurant: {
    id: "demo_restaurant",
    sessionId: "demo",
    template: "restaurant",
    components: [
      { id: "nav", type: "navbar", order: 0, props: {} },
      { id: "hero", type: "hero", order: 1, props: {} },
      { id: "about", type: "about", order: 2, props: {} },
      { id: "services", type: "menu", order: 3, props: {} },
      { id: "testimonials", type: "testimonials", order: 4, props: {} },
      { id: "contact", type: "contact", order: 5, props: {} },
      { id: "footer", type: "footer", order: 99, props: {} },
    ],
    theme: {
      colors: {
        primary: "#991B1B",
        secondary: "#D97706",
        accent: "#065F46",
        background: "#FFFBEB",
        text: "#1C1917",
      },
      fontFamily: "serif",
      borderRadius: "0.375rem",
      style: "rustic",
    },
    content: {
      businessName: "Bella Cucina",
      tagline: "Authentic Italian, made with love",
      heroTitle: "Welcome to Bella Cucina",
      heroSubtitle:
        "Experience authentic Italian cuisine in the heart of downtown. Fresh pasta, wood-fired pizzas, and a warm atmosphere that feels like family.",
      aboutTitle: "Our Story",
      aboutText:
        "Bella Cucina was born from a simple dream: to bring the flavors of Nonna's kitchen to our community. Every dish is crafted with imported ingredients, traditional recipes, and a passion for hospitality.\nSince opening in 2018, we've become a neighborhood favorite for date nights, family celebrations, and anyone craving a true taste of Italy.",
      services: [
        {
          name: "Wood-Fired Pizza",
          description: "Neapolitan-style with San Marzano tomatoes",
          price: "$16-22",
        },
        {
          name: "Fresh Pasta",
          description: "Made daily with imported semolina flour",
          price: "$18-28",
        },
        {
          name: "Antipasti & Salads",
          description: "Seasonal starters with local produce",
          price: "$12-16",
        },
        {
          name: "Desserts",
          description: "Housemade tiramisu, panna cotta, and more",
          price: "$10-14",
        },
      ],
      testimonials: [
        {
          name: "David R.",
          text: "The best Italian food outside of Italy itself. The carbonara is absolutely perfect.",
          rating: 5,
        },
        {
          name: "Jennifer K.",
          text: "We come here every anniversary. The atmosphere, the food, the service - everything is wonderful.",
          rating: 5,
        },
        {
          name: "Mike S.",
          text: "Their wood-fired margherita is hands down the best pizza in the city. Don't skip the tiramisu!",
          rating: 5,
        },
      ],
      contactInfo: {
        phone: "(555) 234-5678",
        email: "ciao@bellacucina.com",
        address: "142 Main Street, Downtown",
        hours: "Tue-Sun: 5PM-10PM | Closed Monday",
      },
      ctaText: "Join us for an unforgettable dining experience.",
      ctaButtonText: "Reserve a Table",
      footerText: "\u00A9 2025 Bella Cucina. All rights reserved.",
    },
    status: "ready",
    createdAt: new Date().toISOString(),
  },
  professional: {
    id: "demo_professional",
    sessionId: "demo",
    template: "professional",
    components: [
      { id: "nav", type: "navbar", order: 0, props: {} },
      { id: "hero", type: "hero", order: 1, props: {} },
      { id: "about", type: "about", order: 2, props: {} },
      { id: "services", type: "services", order: 3, props: {} },
      { id: "testimonials", type: "testimonials", order: 4, props: {} },
      { id: "booking", type: "booking", order: 5, props: {} },
      { id: "contact", type: "contact", order: 6, props: {} },
      { id: "footer", type: "footer", order: 99, props: {} },
    ],
    theme: {
      colors: {
        primary: "#1E3A5F",
        secondary: "#0D9488",
        accent: "#6366F1",
        background: "#F8FAFC",
        text: "#1E293B",
      },
      fontFamily: "sans-serif",
      borderRadius: "0.75rem",
      style: "modern",
    },
    content: {
      businessName: "Clearview Family Dental",
      tagline: "Healthy smiles for the whole family",
      heroTitle: "Your Family Deserves the Best Dental Care",
      heroSubtitle:
        "At Clearview Family Dental, we combine modern technology with a gentle touch. From routine cleanings to cosmetic dentistry, your smile is in expert hands.",
      aboutTitle: "About Our Practice",
      aboutText:
        "Dr. Emily Chen and her team have been providing comprehensive dental care to families in Clearview for over a decade. We believe everyone deserves a healthy, confident smile.\nOur state-of-the-art office features digital X-rays, same-day crowns, and sedation options for anxious patients. We accept most insurance plans and offer flexible payment options.",
      services: [
        {
          name: "General Dentistry",
          description: "Cleanings, fillings, and preventive care for all ages",
          price: "Insurance accepted",
        },
        {
          name: "Cosmetic Dentistry",
          description: "Whitening, veneers, and smile makeovers",
          price: "Free Consultation",
        },
        {
          name: "Orthodontics",
          description: "Invisalign and traditional braces for teens and adults",
          price: "From $3,500",
        },
        {
          name: "Emergency Care",
          description: "Same-day appointments for dental emergencies",
          price: "Call for availability",
        },
      ],
      testimonials: [
        {
          name: "Rachel P.",
          text: "Dr. Chen is amazing with kids. My daughter actually looks forward to her dental visits now!",
          rating: 5,
        },
        {
          name: "Tom H.",
          text: "Got my Invisalign here and couldn't be happier with the results. Professional team from start to finish.",
          rating: 5,
        },
        {
          name: "Lisa W.",
          text: "Best dental office I've ever been to. They really take the time to explain everything and make you feel comfortable.",
          rating: 5,
        },
      ],
      contactInfo: {
        phone: "(555) 789-0123",
        email: "smile@clearviewdental.com",
        address: "500 Oak Avenue, Suite 200, Clearview",
        hours: "Mon-Fri: 8AM-5PM | Sat: 9AM-2PM",
      },
      ctaText: "Ready for a healthier smile? Schedule your visit today.",
      ctaButtonText: "Book Appointment",
      footerText: "\u00A9 2025 Clearview Family Dental. All rights reserved.",
    },
    status: "ready",
    createdAt: new Date().toISOString(),
  },
  retail: {
    id: "demo_retail",
    sessionId: "demo",
    template: "retail",
    components: [
      { id: "nav", type: "navbar", order: 0, props: {} },
      { id: "hero", type: "hero", order: 1, props: {} },
      { id: "about", type: "about", order: 2, props: {} },
      { id: "services", type: "services", order: 3, props: {} },
      { id: "gallery", type: "gallery", order: 4, props: {} },
      { id: "testimonials", type: "testimonials", order: 5, props: {} },
      { id: "contact", type: "contact", order: 6, props: {} },
      { id: "footer", type: "footer", order: 99, props: {} },
    ],
    theme: {
      colors: {
        primary: "#7C3AED",
        secondary: "#EC4899",
        accent: "#06B6D4",
        background: "#FAFAFA",
        text: "#18181B",
      },
      fontFamily: "sans-serif",
      borderRadius: "1rem",
      style: "bold",
    },
    content: {
      businessName: "Coastal Hair Studio",
      tagline: "Where style meets the sea",
      heroTitle: "Discover Your Perfect Look",
      heroSubtitle:
        "At Coastal Hair Studio, we believe great hair is an art form. Our talented stylists create personalized looks that enhance your natural beauty.",
      aboutTitle: "About Coastal Hair Studio",
      aboutText:
        "Founded in 2019, Coastal Hair Studio has quickly become the go-to salon for those seeking exceptional hair care in a relaxed, beachy atmosphere.\nOur stylists are trained in the latest techniques and use only premium, eco-friendly products. Whether you're after a subtle refresh or a bold transformation, we've got you covered.",
      services: [
        {
          name: "Haircuts & Styling",
          description: "Expert cuts for all hair types and lengths",
          price: "From $45",
        },
        {
          name: "Color Services",
          description: "Balayage, highlights, full color, and more",
          price: "From $85",
        },
        {
          name: "Treatments",
          description: "Deep conditioning, keratin, and restorative care",
          price: "From $60",
        },
        {
          name: "Bridal & Special Events",
          description: "Stunning styles for your big day",
          price: "Custom quote",
        },
      ],
      testimonials: [
        {
          name: "Ashley B.",
          text: "Finally found my forever salon! The stylists here really listen and always nail exactly what I'm looking for.",
          rating: 5,
        },
        {
          name: "Nicole M.",
          text: "My balayage has never looked better. The vibe is so relaxing too - it's like a mini vacation every visit.",
          rating: 5,
        },
        {
          name: "Carla J.",
          text: "They did my wedding hair and it was absolutely perfect. Stayed all night through dancing and everything!",
          rating: 5,
        },
      ],
      contactInfo: {
        phone: "(555) 456-7890",
        email: "hello@coastalhairstudio.com",
        address: "789 Ocean Drive, Suite 102",
        hours: "Tue-Sat: 9AM-7PM | Sun: 10AM-5PM",
      },
      ctaText: "Ready for a fresh look? Book your appointment today.",
      ctaButtonText: "Book Now",
      footerText: "\u00A9 2025 Coastal Hair Studio. All rights reserved.",
    },
    status: "ready",
    createdAt: new Date().toISOString(),
  },
};

// Demo dashboard metrics
export interface DemoMetrics {
  totalSessions: number;
  completedSessions: number;
  conversionRate: number;
  totalRevenue: number;
  activeClients: number;
  avgSessionDuration: number;
  sitesDeployed: number;
  thisMonthSessions: number;
  thisMonthRevenue: number;
}

export const DEMO_METRICS: DemoMetrics = {
  totalSessions: 127,
  completedSessions: 89,
  conversionRate: 70,
  totalRevenue: 2670,
  activeClients: 42,
  avgSessionDuration: 26,
  sitesDeployed: 38,
  thisMonthSessions: 24,
  thisMonthRevenue: 720,
};

// Demo pipeline stages
export interface PipelineStage {
  stage: string;
  count: number;
  revenue: number;
}

export const DEMO_PIPELINE: PipelineStage[] = [
  { stage: "lead", count: 18, revenue: 0 },
  { stage: "prospect", count: 12, revenue: 0 },
  { stage: "active", count: 42, revenue: 2670 },
  { stage: "churned", count: 5, revenue: 0 },
];

// Demo revenue history
export interface RevenueDataPoint {
  month: string;
  revenue: number;
  clients: number;
}

export const DEMO_REVENUE: RevenueDataPoint[] = [
  { month: "Aug", revenue: 1200, clients: 28 },
  { month: "Sep", revenue: 1560, clients: 32 },
  { month: "Oct", revenue: 1890, clients: 35 },
  { month: "Nov", revenue: 2280, clients: 38 },
  { month: "Dec", revenue: 2490, clients: 40 },
  { month: "Jan", revenue: 2670, clients: 42 },
];

// Demo sessions
export interface DemoSession {
  id: string;
  businessName: string;
  status: "active" | "completed" | "abandoned";
  currentPhase: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  clientStatus: string;
  template?: string;
}

export const DEMO_SESSIONS: DemoSession[] = [
  {
    id: "ses_demo_001",
    businessName: "Mitchell Law Group",
    status: "active",
    currentPhase: "discovery",
    startedAt: "2026-01-31T10:00:00Z",
    clientStatus: "lead",
  },
  {
    id: "ses_demo_002",
    businessName: "Oak & Vine Wine Bar",
    status: "abandoned",
    currentPhase: "audit",
    startedAt: "2026-01-29T16:00:00Z",
    duration: 8,
    clientStatus: "lead",
  },
  {
    id: "ses_demo_003",
    businessName: "Coastal Hair Studio",
    status: "completed",
    currentPhase: "close",
    startedAt: "2026-01-28T15:00:00Z",
    completedAt: "2026-01-28T15:32:00Z",
    duration: 32,
    clientStatus: "active",
    template: "retail",
  },
  {
    id: "ses_demo_004",
    businessName: "Green Thumb Landscaping",
    status: "completed",
    currentPhase: "close",
    startedAt: "2026-01-27T11:00:00Z",
    completedAt: "2026-01-27T11:28:00Z",
    duration: 28,
    clientStatus: "prospect",
    template: "home-services",
  },
  {
    id: "ses_demo_005",
    businessName: "Clearview Family Dental",
    status: "completed",
    currentPhase: "close",
    startedAt: "2026-01-25T09:00:00Z",
    completedAt: "2026-01-25T09:24:00Z",
    duration: 24,
    clientStatus: "active",
    template: "professional",
  },
  {
    id: "ses_demo_006",
    businessName: "Bella Cucina",
    status: "completed",
    currentPhase: "close",
    startedAt: "2026-01-22T14:00:00Z",
    completedAt: "2026-01-22T14:31:00Z",
    duration: 31,
    clientStatus: "active",
    template: "restaurant",
  },
  {
    id: "ses_demo_007",
    businessName: "Summit Plumbing & HVAC",
    status: "completed",
    currentPhase: "close",
    startedAt: "2026-01-20T10:00:00Z",
    completedAt: "2026-01-20T10:26:00Z",
    duration: 26,
    clientStatus: "active",
    template: "home-services",
  },
  {
    id: "ses_demo_008",
    businessName: "Precision Auto Care",
    status: "completed",
    currentPhase: "close",
    startedAt: "2026-01-18T13:00:00Z",
    completedAt: "2026-01-18T13:29:00Z",
    duration: 29,
    clientStatus: "active",
    template: "home-services",
  },
];

// Demo bookings for scheduling
export interface DemoBooking {
  id: string;
  siteId: string;
  businessName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  date: string;
  startTime: string;
  endTime: string;
  service?: string;
  status: "pending" | "confirmed" | "canceled" | "completed";
  confirmationCode: string;
}

export const DEMO_BOOKINGS: DemoBooking[] = [
  {
    id: "bk_demo_001",
    siteId: "demo_home_services",
    businessName: "Summit Plumbing & HVAC",
    customerName: "Alice Johnson",
    customerEmail: "alice@example.com",
    customerPhone: "(303) 555-1234",
    date: "2026-02-03",
    startTime: "09:00",
    endTime: "10:00",
    service: "Plumbing Repair",
    status: "confirmed",
    confirmationCode: "AB3K9X",
  },
  {
    id: "bk_demo_002",
    siteId: "demo_home_services",
    businessName: "Summit Plumbing & HVAC",
    customerName: "Bob Williams",
    customerEmail: "bob@example.com",
    date: "2026-02-03",
    startTime: "10:15",
    endTime: "11:15",
    service: "HVAC Maintenance",
    status: "confirmed",
    confirmationCode: "CD7M2Y",
  },
  {
    id: "bk_demo_003",
    siteId: "demo_home_services",
    businessName: "Summit Plumbing & HVAC",
    customerName: "Carol Davis",
    customerEmail: "carol@example.com",
    date: "2026-02-04",
    startTime: "14:00",
    endTime: "15:00",
    service: "Emergency Repair",
    status: "pending",
    confirmationCode: "EF5N8W",
  },
  {
    id: "bk_demo_004",
    siteId: "demo_professional",
    businessName: "Clearview Family Dental",
    customerName: "David Lee",
    customerEmail: "david@example.com",
    customerPhone: "(555) 999-0000",
    date: "2026-02-03",
    startTime: "09:00",
    endTime: "09:30",
    service: "Cleaning",
    status: "confirmed",
    confirmationCode: "GH1P4V",
  },
  {
    id: "bk_demo_005",
    siteId: "demo_professional",
    businessName: "Clearview Family Dental",
    customerName: "Emma Wilson",
    customerEmail: "emma@example.com",
    date: "2026-02-04",
    startTime: "10:00",
    endTime: "10:30",
    service: "Consultation",
    status: "confirmed",
    confirmationCode: "JK9Q6T",
  },
  {
    id: "bk_demo_006",
    siteId: "demo_retail",
    businessName: "Coastal Hair Studio",
    customerName: "Sophia Martinez",
    customerEmail: "sophia@example.com",
    date: "2026-02-03",
    startTime: "11:00",
    endTime: "12:30",
    service: "Color Services",
    status: "confirmed",
    confirmationCode: "LM8R3S",
  },
  {
    id: "bk_demo_007",
    siteId: "demo_retail",
    businessName: "Coastal Hair Studio",
    customerName: "Olivia Brown",
    customerEmail: "olivia@example.com",
    date: "2026-02-05",
    startTime: "14:00",
    endTime: "15:00",
    service: "Haircut & Styling",
    status: "pending",
    confirmationCode: "NP2T5U",
  },
];

// Demo reviews
export interface DemoReview {
  id: string;
  siteId: string;
  businessName: string;
  platform: "google" | "yelp" | "facebook";
  reviewerName: string;
  rating: number;
  text: string;
  date: string;
  replied: boolean;
  replyText?: string;
}

export const DEMO_REVIEWS: DemoReview[] = [
  {
    id: "rev_demo_001",
    siteId: "demo_home_services",
    businessName: "Summit Plumbing & HVAC",
    platform: "google",
    reviewerName: "Michael T.",
    rating: 5,
    text: "Called them for an emergency leak at 10pm and they were here within 45 minutes. Fixed the problem quickly and fairly priced. Highly recommend!",
    date: "2026-01-30",
    replied: true,
    replyText:
      "Thank you so much Michael! We're glad we could help. Don't hesitate to reach out if you need anything in the future.",
  },
  {
    id: "rev_demo_002",
    siteId: "demo_home_services",
    businessName: "Summit Plumbing & HVAC",
    platform: "yelp",
    reviewerName: "Jessica R.",
    rating: 5,
    text: "Best HVAC service I've ever used. They installed a new AC unit and the whole process was smooth from quote to completion. Very professional team.",
    date: "2026-01-28",
    replied: false,
  },
  {
    id: "rev_demo_003",
    siteId: "demo_professional",
    businessName: "Clearview Family Dental",
    platform: "google",
    reviewerName: "Amanda K.",
    rating: 5,
    text: "Dr. Chen and her team are wonderful! They made my anxious daughter feel so comfortable. We've finally found our family dentist!",
    date: "2026-01-29",
    replied: true,
    replyText:
      "Thank you Amanda! We love working with families and are so happy your daughter had a positive experience. See you at the next visit!",
  },
  {
    id: "rev_demo_004",
    siteId: "demo_restaurant",
    businessName: "Bella Cucina",
    platform: "yelp",
    reviewerName: "Chris D.",
    rating: 5,
    text: "The homemade pasta is incredible. We tried the truffle ravioli and it was the best I've had outside of Italy. Romantic atmosphere too.",
    date: "2026-01-27",
    replied: true,
    replyText:
      "Grazie mille Chris! We're thrilled you enjoyed the truffle ravioli - it's one of our favorites too. Can't wait to welcome you back!",
  },
  {
    id: "rev_demo_005",
    siteId: "demo_restaurant",
    businessName: "Bella Cucina",
    platform: "google",
    reviewerName: "Patricia L.",
    rating: 4,
    text: "Great food and service. Only giving 4 stars because it was a bit noisy on a Saturday night, but the pizza made up for it!",
    date: "2026-01-25",
    replied: false,
  },
  {
    id: "rev_demo_006",
    siteId: "demo_retail",
    businessName: "Coastal Hair Studio",
    platform: "facebook",
    reviewerName: "Megan H.",
    rating: 5,
    text: "Been going to Coastal for 2 years now and they never disappoint. My balayage always turns out perfect. Love the relaxed vibe!",
    date: "2026-01-26",
    replied: true,
    replyText:
      "You're the best Megan! We always look forward to seeing you. Thanks for being such a loyal client!",
  },
];

// Demo content blocks for editor
export interface DemoContentBlock {
  id: string;
  type: string;
  content: Record<string, unknown>;
  order: number;
}

export const DEMO_CONTENT_BLOCKS: DemoContentBlock[] = [
  {
    id: "blk_demo_1",
    type: "hero",
    order: 0,
    content: {
      title: "Summit Plumbing & HVAC",
      subtitle: "Professional plumbing services for your home and business",
      buttonText: "Get a Free Quote",
      buttonLink: "#contact",
    },
  },
  {
    id: "blk_demo_2",
    type: "text",
    order: 1,
    content: {
      heading: "About Us",
      body: "With over 20 years of experience, Summit Plumbing & HVAC has been serving the local community with reliable, professional plumbing services. Our team of licensed plumbers is committed to providing top-quality workmanship and exceptional customer service.",
      alignment: "left",
    },
  },
  {
    id: "blk_demo_3",
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
    id: "blk_demo_4",
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
    id: "blk_demo_5",
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
];

// Demo billing data
export interface DemoBillingInfo {
  plan: string;
  price: number;
  billingCycle: "monthly" | "annual";
  nextBillingDate: string;
  paymentMethod: {
    type: "card";
    last4: string;
    brand: string;
    expMonth: number;
    expYear: number;
  };
  invoices: Array<{
    id: string;
    date: string;
    amount: number;
    status: "paid" | "pending";
  }>;
}

export const DEMO_BILLING: DemoBillingInfo = {
  plan: "Professional",
  price: 30,
  billingCycle: "monthly",
  nextBillingDate: "2026-02-15",
  paymentMethod: {
    type: "card",
    last4: "4242",
    brand: "Visa",
    expMonth: 12,
    expYear: 2027,
  },
  invoices: [
    { id: "inv_demo_001", date: "2026-01-15", amount: 30, status: "paid" },
    { id: "inv_demo_002", date: "2025-12-15", amount: 30, status: "paid" },
    { id: "inv_demo_003", date: "2025-11-15", amount: 30, status: "paid" },
    { id: "inv_demo_004", date: "2025-10-15", amount: 30, status: "paid" },
    { id: "inv_demo_005", date: "2025-09-15", amount: 30, status: "paid" },
  ],
};

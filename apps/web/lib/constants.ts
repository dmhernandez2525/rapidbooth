export const SITE_CONFIG = {
  name: "RapidBooth",
  tagline: "Fresh Sites, Harvested in 30 Minutes.",
  description:
    "AI-powered website generation for small businesses. Get a professional, fully-functional website through a simple conversation. No coding, no templates, no hassle.",
  url: "https://rapidbooth.com",
  email: "hello@rapidbooth.com",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/demo", label: "Try Demo" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const FEATURES = [
  {
    title: "AI Website Generation",
    description:
      "Our AI crafts a unique, professional website tailored to your business in under 30 minutes. No templates, no cookie-cutter designs.",
    icon: "sparkles",
  },
  {
    title: "Conversational Intake",
    description:
      "Tell us about your business through a natural conversation. No forms to fill, no jargon to decode. Just talk, and we build.",
    icon: "chat",
  },
  {
    title: "Live Preview",
    description:
      "Watch your website come to life in real-time as you answer questions. See changes instantly and guide the AI to your vision.",
    icon: "eye",
  },
  {
    title: "Instant Deployment",
    description:
      "Your site goes live the moment you approve it. Custom domain, SSL certificate, and hosting all included. Zero technical setup.",
    icon: "rocket",
  },
  {
    title: "Content Ownership",
    description:
      "You own every pixel. Export your site anytime, take it anywhere. No vendor lock-in, no strings attached.",
    icon: "shield",
  },
  {
    title: "Built-in Scheduling",
    description:
      "Appointment booking integrated directly into your site. Customers book, you confirm. Syncs with Google Calendar.",
    icon: "calendar",
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Meet",
    description:
      "Start a conversation with our AI. Tell us your business name, what you do, and who you serve. Takes about 5 minutes.",
    icon: "handshake",
  },
  {
    step: 2,
    title: "Talk",
    description:
      "Our AI asks smart follow-up questions to understand your brand, services, and style. Watch your site build in real-time.",
    icon: "message",
  },
  {
    step: 3,
    title: "Launch",
    description:
      "Review your site, make any tweaks, and hit publish. Your professional website is live and ready for customers.",
    icon: "launch",
  },
] as const;

export const TESTIMONIALS = [
  {
    name: "Maria Rodriguez",
    business: "Flores Bakery",
    text: "I spent months putting off building a website because I thought it would be complicated. RapidBooth had me live in 20 minutes. My customers love it.",
    rating: 5,
  },
  {
    name: "James Chen",
    business: "Chen's Auto Repair",
    text: "The scheduling feature alone is worth it. Customers book appointments right from my site instead of calling. Saves me an hour every day.",
    rating: 5,
  },
  {
    name: "Sarah Mitchell",
    business: "Mitchell Fitness Studio",
    text: "I was skeptical about AI-generated sites, but this looks better than what I paid a freelancer $3,000 for last year. And I can update it myself.",
    rating: 5,
  },
] as const;

export const COMPARISON_DATA = {
  features: [
    "Setup Time",
    "Monthly Cost",
    "AI-Generated Content",
    "Custom Domain",
    "Appointment Scheduling",
    "Review Aggregation",
    "No Code Required",
    "Content Ownership",
    "SEO Optimized",
    "Mobile Responsive",
  ],
  competitors: [
    {
      name: "RapidBooth",
      highlight: true,
      values: [
        "30 minutes",
        "$30/mo",
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
    },
    {
      name: "bolt.new",
      highlight: false,
      values: [
        "1-2 hours",
        "Free-$20/mo",
        true,
        false,
        false,
        false,
        false,
        true,
        false,
        true,
      ],
    },
    {
      name: "Wix",
      highlight: false,
      values: [
        "4-8 hours",
        "$17-159/mo",
        false,
        true,
        true,
        false,
        true,
        false,
        true,
        true,
      ],
    },
    {
      name: "Thryv",
      highlight: false,
      values: [
        "1-2 weeks",
        "$199-499/mo",
        false,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
      ],
    },
    {
      name: "Durable",
      highlight: false,
      values: [
        "30 seconds",
        "$15-25/mo",
        true,
        true,
        false,
        false,
        true,
        false,
        true,
        true,
      ],
    },
  ],
} as const;

export const PRICING_FEATURES = [
  "AI-generated professional website",
  "Custom domain included",
  "SSL certificate",
  "Mobile-responsive design",
  "Appointment scheduling",
  "Review aggregation",
  "Content self-service editor",
  "SEO optimization",
  "Analytics dashboard",
  "Email support",
  "Monthly performance reports",
  "99.9% uptime guarantee",
] as const;

export const FAQ_ITEMS = [
  {
    question: "How does the 30-minute website generation work?",
    answer:
      "Our AI guides you through a conversational intake process, asking about your business, services, and preferences. As you answer, it generates your website in real-time. Most businesses complete the process in 15-30 minutes.",
  },
  {
    question: "Can I edit my website after it's generated?",
    answer:
      "Absolutely. Our content self-service editor lets you update text, images, and layout without any coding knowledge. Changes publish instantly.",
  },
  {
    question: "What happens if I cancel my subscription?",
    answer:
      "You own your content. Before cancellation, you can export your entire website including all assets. We provide a 30-day grace period to download everything.",
  },
  {
    question: "Do I need a domain name?",
    answer:
      "A custom domain is included in your subscription. If you already own a domain, we can connect it to your RapidBooth site. We also provide a free subdomain (yourbusiness.rapidbooth.com) immediately.",
  },
  {
    question: "Is there a contract or commitment?",
    answer:
      "No long-term contracts. RapidBooth is month-to-month. Cancel anytime with no penalties or hidden fees.",
  },
  {
    question: "How does appointment scheduling work?",
    answer:
      "Customers can book appointments directly from your website. You set your availability, and the system handles confirmations and reminders. It syncs with Google Calendar and sends email notifications.",
  },
] as const;

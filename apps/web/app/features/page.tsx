import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore RapidBooth's full feature set: AI website generation, conversational intake, live preview, instant deployment, scheduling, reviews, and more.",
};

const DETAILED_FEATURES = [
  {
    category: "Generation",
    features: [
      {
        title: "AI Website Generation",
        description:
          "Our AI analyzes your business type, industry, and preferences to generate a unique, professional website. Not a template fill-in — a custom-crafted site tailored to your brand.",
        details: [
          "Industry-specific layouts (restaurants, home services, retail, professional services)",
          "AI-generated copy that matches your brand voice",
          "Optimized for conversions with strategic CTA placement",
          "Responsive design that looks great on all devices",
        ],
      },
      {
        title: "Conversational Intake",
        description:
          "Forget complicated forms. Just have a conversation with our AI about your business, and watch your website take shape in real-time.",
        details: [
          "Natural language processing understands context and nuance",
          "Smart follow-up questions based on your industry",
          "Background research on competitors and market positioning",
          "Voice input support for hands-free operation",
        ],
      },
      {
        title: "Live Preview",
        description:
          "See your website build in real-time as you answer questions. Make adjustments on the fly and get instant visual feedback.",
        details: [
          "Real-time rendering as content is generated",
          "Mobile and desktop preview toggle",
          "Color and font customization controls",
          "Interactive component rearrangement",
        ],
      },
    ],
  },
  {
    category: "Deployment",
    features: [
      {
        title: "Instant Deployment",
        description:
          "Your site goes live the moment you approve it. Custom subdomains provided free, or connect your own domain with automated SSL.",
        details: [
          "One-click publish to production",
          "Free subdomain (yourbusiness.rapidbooth.com)",
          "Custom domain support with DNS configuration",
          "Automatic SSL certificate provisioning",
        ],
      },
      {
        title: "Content Ownership",
        description:
          "You own every piece of content on your site. Export anytime, take it anywhere. No perpetual licenses, no lock-in.",
        details: [
          "Full HTML/CSS export available anytime",
          "No proprietary formats or vendor lock-in",
          "30-day archive after cancellation",
          "Domain transfers supported at no cost",
        ],
      },
    ],
  },
  {
    category: "Business Tools",
    features: [
      {
        title: "Appointment Scheduling",
        description:
          "Built-in calendar that lets customers book directly from your website. Set your availability, manage bookings, and reduce no-shows.",
        details: [
          "Customizable booking widget on your site",
          "Google Calendar sync",
          "Automated email confirmations and reminders",
          "Buffer time and break management",
        ],
      },
      {
        title: "Review Aggregation",
        description:
          "Display your best reviews from Google, Yelp, and Facebook directly on your website. Build trust with social proof.",
        details: [
          "Auto-sync reviews from major platforms",
          "Customizable display widget",
          "Rating analytics and trends",
          "Review response management",
        ],
      },
      {
        title: "Content Self-Service Editor",
        description:
          "Update your website anytime without coding. Our intuitive editor makes it easy to change text, swap images, and add new sections.",
        details: [
          "WYSIWYG drag-and-drop editing",
          "Image upload and gallery management",
          "SEO settings for each page",
          "Publish/draft workflow with version history",
        ],
      },
    ],
  },
  {
    category: "Performance",
    features: [
      {
        title: "SEO Optimization",
        description:
          "Every site is built with search engine optimization in mind. Meta tags, structured data, and sitemaps are configured automatically.",
        details: [
          "Auto-generated meta titles and descriptions",
          "Schema markup for local business",
          "XML sitemap generation",
          "Core Web Vitals optimization",
        ],
      },
      {
        title: "Analytics Dashboard",
        description:
          "Understand how your website is performing with built-in analytics. Track visitors, page views, and conversion metrics.",
        details: [
          "Real-time visitor tracking",
          "Page performance metrics",
          "Traffic source breakdown",
          "Monthly performance reports",
        ],
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="pt-24 sm:pt-32">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-cream to-white">
        <div className="container-narrow text-center">
          <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-slate-blue mb-6">
            Everything You Need to{" "}
            <span className="text-forest-green">Succeed Online</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-blue-500 max-w-3xl mx-auto">
            From AI-powered generation to built-in business tools, RapidBooth
            gives you a complete online presence without the complexity.
          </p>
        </div>
      </section>

      {/* Feature Categories */}
      {DETAILED_FEATURES.map((category) => (
        <section
          key={category.category}
          className="section-padding even:bg-cream odd:bg-white"
        >
          <div className="container-narrow">
            <div className="mb-12">
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-slate-blue mb-2">
                {category.category}
              </h2>
              <div className="w-16 h-1 bg-harvest-gold rounded-full" />
            </div>

            <div className="space-y-12">
              {category.features.map((feature) => (
                <div
                  key={feature.title}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
                >
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-slate-blue mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-blue-500 leading-relaxed text-lg">
                      {feature.description}
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-forest-green flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-slate-blue-600">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="section-padding bg-forest-green">
        <div className="container-narrow text-center">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-white mb-4">
            Ready to See These Features in Action?
          </h2>
          <p className="text-forest-green-200 text-lg mb-8 max-w-2xl mx-auto">
            Start a conversation with our AI and watch your website come to
            life in under 30 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" href="/demo">
              Start Building Today
            </Button>
            <Button variant="secondary" size="lg" href="/demo/preview">
              View Sample Sites
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

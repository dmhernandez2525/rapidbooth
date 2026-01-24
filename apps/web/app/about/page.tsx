import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about RapidBooth's mission to make professional websites accessible to every small business through AI-powered conversational generation.",
};

const VALUES = [
  {
    title: "Ownership First",
    description:
      "Your website, your content, your data. We believe businesses should own their online presence completely, with the freedom to export and move anytime.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Radical Simplicity",
    description:
      "Technology should serve people, not the other way around. We strip away complexity so business owners can focus on what matters: their customers.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "Transparent Pricing",
    description:
      "No hidden fees, no token anxiety, no surprise charges. One flat price that includes everything. What you see is what you pay.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Local Focus",
    description:
      "We are built for the small businesses that power local communities. The bakery on the corner, the plumber down the street, the fitness studio in the plaza.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
];

const STATS = [
  { value: "30", unit: "min", label: "Average build time" },
  { value: "500+", unit: "", label: "Businesses launched" },
  { value: "99.9%", unit: "", label: "Uptime guarantee" },
  { value: "$30", unit: "/mo", label: "All-inclusive price" },
];

export default function AboutPage() {
  return (
    <div className="pt-24 sm:pt-32">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-cream to-white">
        <div className="container-narrow">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-slate-blue mb-6">
              Building the Future of{" "}
              <span className="text-forest-green">Small Business</span> Websites
            </h1>
            <p className="text-lg sm:text-xl text-slate-blue-500 leading-relaxed">
              We believe every business deserves a professional online presence,
              regardless of technical expertise or budget. RapidBooth makes that
              possible through AI-powered conversational website generation.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-slate-blue mb-8">
              Our Story
            </h2>
            <div className="space-y-6 text-slate-blue-600 leading-relaxed text-lg">
              <p>
                RapidBooth was born from a simple observation: the businesses that
                need websites the most are the ones least equipped to build them.
                Small business owners are experts at their craft — cooking,
                plumbing, fitness training, baking — not at web development.
              </p>
              <p>
                Traditional website builders still require hours of learning and
                configuration. AI generators get you 70% of the way there before
                hitting a wall. And agencies charge thousands for what should be
                a straightforward process.
              </p>
              <p>
                We asked: what if building a website was as simple as having a
                conversation about your business? What if an AI could understand
                your needs, research your market, and generate a production-ready
                site — all in the time it takes to have a coffee?
              </p>
              <p>
                That question became RapidBooth. A platform where the pitch IS the
                product. Where 30 minutes of conversation produces a live, professional
                website. Where business owners retain full ownership of their content
                with no lock-in contracts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-forest-green">
        <div className="container-narrow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-harvest-gold">
                  {stat.value}
                  <span className="text-xl">{stat.unit}</span>
                </div>
                <div className="text-sm text-forest-green-200 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-cream">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-slate-blue mb-4">
              What We Stand For
            </h2>
            <p className="text-lg text-slate-blue-500 max-w-2xl mx-auto">
              Our values guide every decision we make, from product design to
              pricing to customer support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((value) => (
              <div key={value.title} className="card">
                <div className="w-12 h-12 rounded-xl bg-forest-green/10 flex items-center justify-center text-forest-green mb-4">
                  {value.icon}
                </div>
                <h3 className="font-serif font-bold text-xl text-slate-blue mb-2">
                  {value.title}
                </h3>
                <p className="text-slate-blue-500 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Market */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-slate-blue mb-8">
              Who We Serve
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Home service providers",
                "Restaurants and cafes",
                "Fitness studios",
                "Retail shops",
                "Professional services",
                "Farmers market vendors",
                "Salons and spas",
                "Auto repair shops",
              ].map((business) => (
                <div key={business} className="flex items-center gap-3 p-4 rounded-xl bg-cream">
                  <div className="w-2 h-2 rounded-full bg-harvest-gold flex-shrink-0" />
                  <span className="text-slate-blue-600 font-medium">{business}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-forest-green">
        <div className="container-narrow text-center">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-white mb-4">
            Ready to Join Us?
          </h2>
          <p className="text-forest-green-200 text-lg mb-8 max-w-2xl mx-auto">
            Start a conversation and see what AI-powered website generation can
            do for your business.
          </p>
          <Button variant="primary" size="lg" href="/contact">
            Start Building Today
          </Button>
        </div>
      </section>
    </div>
  );
}

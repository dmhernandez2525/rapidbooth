import React from "react";
import { HOW_IT_WORKS } from "@/lib/constants";

function StepIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    handshake: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    message: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    launch: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
  };

  return <>{icons[icon] || icons.message}</>;
}

export function HowItWorks() {
  return (
    <section className="section-padding bg-white" id="how-it-works">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-blue mb-4">
            Three Steps to Your <span className="text-forest-green">New Website</span>
          </h2>
          <p className="text-lg text-slate-blue-500 max-w-2xl mx-auto">
            No technical skills required. Our AI handles the complexity while you
            focus on what you know best: your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-forest-green/20 via-harvest-gold/40 to-forest-green/20" />

          {HOW_IT_WORKS.map((step) => (
            <div key={step.step} className="relative text-center group">
              {/* Step number */}
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-forest-green text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold">{step.step}</span>
                <div className="absolute -inset-2 rounded-full border-2 border-forest-green/20 group-hover:border-harvest-gold/40 transition-colors duration-300" />
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-4 text-harvest-gold">
                <StepIcon icon={step.icon} />
              </div>

              {/* Content */}
              <h3 className="font-serif font-bold text-2xl text-slate-blue mb-3">
                {step.title}
              </h3>
              <p className="text-slate-blue-500 leading-relaxed max-w-sm mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { COMPARISON_DATA } from "@/lib/constants";

export function ComparisonTable() {
  return (
    <section className="section-padding bg-white" id="comparison">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-blue mb-4">
            See How We <span className="text-forest-green">Compare</span>
          </h2>
          <p className="text-lg text-slate-blue-500 max-w-2xl mx-auto">
            RapidBooth gives you more features, less complexity, and total
            ownership at a fraction of the cost.
          </p>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[700px] px-4 sm:px-0">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-slate-blue-400 uppercase tracking-wider">
                    Feature
                  </th>
                  {COMPARISON_DATA.competitors.map((competitor) => (
                    <th
                      key={competitor.name}
                      className={`text-center py-4 px-3 text-sm font-semibold ${
                        competitor.highlight
                          ? "text-forest-green bg-forest-green/5 rounded-t-xl"
                          : "text-slate-blue-600"
                      }`}
                    >
                      {competitor.name}
                      {competitor.highlight && (
                        <div className="text-xs font-normal text-forest-green-600 mt-0.5">
                          Recommended
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_DATA.features.map((feature, rowIndex) => (
                  <tr
                    key={feature}
                    className={rowIndex % 2 === 0 ? "bg-cream-100/50" : ""}
                  >
                    <td className="py-3.5 px-4 text-sm text-slate-blue-600 font-medium">
                      {feature}
                    </td>
                    {COMPARISON_DATA.competitors.map((competitor) => {
                      const value = competitor.values[rowIndex];
                      return (
                        <td
                          key={`${competitor.name}-${feature}`}
                          className={`text-center py-3.5 px-3 ${
                            competitor.highlight ? "bg-forest-green/5" : ""
                          }`}
                        >
                          {typeof value === "boolean" ? (
                            value ? (
                              <svg
                                className={`w-5 h-5 mx-auto ${
                                  competitor.highlight
                                    ? "text-forest-green"
                                    : "text-green-500"
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-5 h-5 mx-auto text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            )
                          ) : (
                            <span
                              className={`text-sm font-medium ${
                                competitor.highlight
                                  ? "text-forest-green"
                                  : "text-slate-blue-600"
                              }`}
                            >
                              {value}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ownership callout */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-forest-green/5 to-harvest-gold/5 border border-forest-green/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-forest-green/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-blue mb-1">
                Your Content, Your Ownership
              </h3>
              <p className="text-slate-blue-500 text-sm">
                Unlike competitors with perpetual licenses and content deletion on
                cancellation, RapidBooth guarantees full content ownership. Export
                your site anytime, cancel anytime, no strings attached.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

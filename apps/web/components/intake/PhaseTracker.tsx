import React from "react";

interface PhaseProgress {
  status: "pending" | "active" | "completed";
  startedAt?: string;
  completedAt?: string;
}

interface PhaseTrackerProps {
  currentPhase: string;
  phaseProgress: Record<string, PhaseProgress>;
}

const PHASES = [
  { id: "discovery", label: "Discovery", shortLabel: "1" },
  { id: "audit", label: "Presence", shortLabel: "2" },
  { id: "features", label: "Features", shortLabel: "3" },
  { id: "design", label: "Design", shortLabel: "4" },
  { id: "content", label: "Content", shortLabel: "5" },
  { id: "close", label: "Launch", shortLabel: "6" },
];

export function PhaseTracker({ currentPhase, phaseProgress }: PhaseTrackerProps) {
  return (
    <div className="bg-white border-b border-cream-200 px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          {PHASES.map((phase, index) => {
            const progress = phaseProgress[phase.id];
            const isActive = progress?.status === "active";
            const isCompleted = progress?.status === "completed";
            const isPending = progress?.status === "pending";

            return (
              <React.Fragment key={phase.id}>
                {/* Phase indicator */}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isCompleted
                        ? "bg-forest-green text-white"
                        : isActive
                        ? "bg-harvest-gold text-forest-green-900 ring-2 ring-harvest-gold/30 ring-offset-2"
                        : "bg-cream-200 text-slate-blue-400"
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      phase.shortLabel
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${
                      isActive
                        ? "text-forest-green"
                        : isCompleted
                        ? "text-forest-green-600"
                        : "text-slate-blue-300"
                    }`}
                  >
                    {phase.label}
                  </span>
                </div>

                {/* Connector line */}
                {index < PHASES.length - 1 && (
                  <div className="flex-1 mx-1 sm:mx-2">
                    <div
                      className={`h-0.5 rounded-full transition-colors duration-300 ${
                        isCompleted ? "bg-forest-green" : "bg-cream-200"
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

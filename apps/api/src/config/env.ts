export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "4000", 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  DATABASE_URL: process.env.DATABASE_URL || "",
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || "",
  API_VERSION: "v1",
} as const;

export function validateEnv(): void {
  const warnings: string[] = [];

  if (!env.ANTHROPIC_API_KEY) {
    warnings.push("ANTHROPIC_API_KEY not set - intake engine will use simulated responses");
  }

  if (!env.DATABASE_URL) {
    warnings.push("DATABASE_URL not set - using in-memory storage");
  }

  if (warnings.length > 0) {
    for (const warning of warnings) {
      console.warn("[env] " + warning);
    }
  }
}

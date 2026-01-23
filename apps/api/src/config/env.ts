export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "4000", 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  DATABASE_URL: process.env.DATABASE_URL || "",
  API_VERSION: "v1",
} as const;

export function validateEnv(): void {
  const required: string[] = [];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    const missingList = missing.join(", ");
    console.warn("Warning: Missing environment variables: " + missingList);
  }
}

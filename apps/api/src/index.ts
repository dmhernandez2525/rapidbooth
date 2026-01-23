import express from "express";
import helmet from "helmet";
import { env, validateEnv } from "./config/env";
import { corsMiddleware } from "./middleware/cors";
import { generalLimiter } from "./middleware/rateLimiter";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import routes from "./routes";

validateEnv();

const app = express();

// Security middleware
app.use(helmet());
app.use(corsMiddleware);
app.use(generalLimiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(
    "RapidBooth API running on port " + env.PORT + " in " + env.NODE_ENV + " mode"
  );
});

export default app;

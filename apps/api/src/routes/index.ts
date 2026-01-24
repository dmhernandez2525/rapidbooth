import { Router } from "express";
import healthRouter from "./health";
import intakeRouter from "./intake";
import sitesRouter from "./sites";
import deploymentsRouter from "./deployments";
import dashboardRouter from "./dashboard";
import billingRouter from "./billing";
import schedulingRouter from "./scheduling";

const router = Router();

router.use(healthRouter);
router.use("/intake", intakeRouter);
router.use("/sites", sitesRouter);
router.use("/deployments", deploymentsRouter);
router.use("/dashboard", dashboardRouter);
router.use("/billing", billingRouter);
router.use("/scheduling", schedulingRouter);

router.get("/", (_req, res) => {
  res.json({
    service: "RapidBooth API",
    version: "0.2.0",
    endpoints: {
      health: "/api/health",
      intake: {
        start: "POST /api/intake/start",
        message: "POST /api/intake/message",
        session: "GET /api/intake/:sessionId",
        list: "GET /api/intake",
      },
      sites: {
        generate: "POST /api/sites/generate",
        generateDirect: "POST /api/sites/generate-direct",
        get: "GET /api/sites/:siteId",
        list: "GET /api/sites",
      },
      deployments: {
        deploy: "POST /api/deployments",
        get: "GET /api/deployments/id/:deploymentId",
        getBySite: "GET /api/deployments/site/:siteId",
        list: "GET /api/deployments",
        stop: "POST /api/deployments/:id/stop",
        redeploy: "POST /api/deployments/:id/redeploy",
        domain: "PATCH /api/deployments/:id/domain",
        stats: "GET /api/deployments/stats",
      },
    },
  });
});

export default router;

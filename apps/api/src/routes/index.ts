import { Router } from "express";
import healthRouter from "./health";
import intakeRouter from "./intake";
import sitesRouter from "./sites";
import deploymentsRouter from "./deployments";
import dashboardRouter from "./dashboard";
import billingRouter from "./billing";
import schedulingRouter from "./scheduling";
import reviewsRouter from "./reviews";

const router = Router();

router.use(healthRouter);
router.use("/intake", intakeRouter);
router.use("/sites", sitesRouter);
router.use("/deployments", deploymentsRouter);
router.use("/dashboard", dashboardRouter);
router.use("/billing", billingRouter);
router.use("/scheduling", schedulingRouter);
router.use("/reviews", reviewsRouter);

router.get("/", (_req, res) => {
  res.json({
    service: "RapidBooth API",
    version: "0.2.0",
    endpoints: {
      health: "GET /api/health",
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
      dashboard: {
        metrics: "GET /api/dashboard/metrics",
        pipeline: "GET /api/dashboard/pipeline",
        revenue: "GET /api/dashboard/revenue",
        sessions: "GET /api/dashboard/sessions",
        clients: "GET /api/dashboard/clients",
        updateStatus: "PATCH /api/dashboard/clients/:id/status",
      },
      billing: {
        createSubscription: "POST /api/billing/subscriptions",
        listSubscriptions: "GET /api/billing/subscriptions",
        getSubscription: "GET /api/billing/subscriptions/:id",
        cancel: "POST /api/billing/subscriptions/:id/cancel",
        reactivate: "POST /api/billing/subscriptions/:id/reactivate",
        invoices: "GET /api/billing/invoices",
        paymentMethods: "GET /api/billing/payment-methods/:clientId",
        metrics: "GET /api/billing/metrics",
        webhooks: "POST /api/billing/webhooks",
      },
      scheduling: {
        availability: "GET /api/scheduling/availability/:siteId",
        updateAvailability: "PUT /api/scheduling/availability/:siteId",
        slots: "GET /api/scheduling/slots/:siteId/:date",
        createBooking: "POST /api/scheduling/bookings",
        listBookings: "GET /api/scheduling/bookings",
        getBooking: "GET /api/scheduling/bookings/:id",
        confirmByCode: "GET /api/scheduling/bookings/confirm/:code",
        confirm: "POST /api/scheduling/bookings/:id/confirm",
        cancel: "POST /api/scheduling/bookings/:id/cancel",
      },
      reviews: {
        config: "GET /api/reviews/config/:siteId",
        updateConfig: "PUT /api/reviews/config/:siteId",
        list: "GET /api/reviews",
        get: "GET /api/reviews/:reviewId",
        stats: "GET /api/reviews/stats/:siteId",
        respond: "POST /api/reviews/:reviewId/respond",
        updateStatus: "PATCH /api/reviews/:reviewId/status",
        requestReviews: "POST /api/reviews/request/:siteId",
      },
    },
  });
});

export default router;

import { Router } from "express";
import healthRouter from "./health";
import intakeRouter from "./intake";

const router = Router();

router.use(healthRouter);
router.use("/intake", intakeRouter);

router.get("/", (_req, res) => {
  res.json({
    service: "RapidBooth API",
    version: "0.1.0",
    endpoints: {
      health: "/api/health",
      intake: {
        start: "POST /api/intake/start",
        message: "POST /api/intake/message",
        session: "GET /api/intake/:sessionId",
        list: "GET /api/intake",
      },
    },
  });
});

export default router;

import { Router } from "express";
import healthRouter from "./health";

const router = Router();

router.use(healthRouter);

router.get("/", (_req, res) => {
  res.json({
    service: "RapidBooth API",
    version: "0.1.0",
    documentation: "/api/docs",
  });
});

export default router;

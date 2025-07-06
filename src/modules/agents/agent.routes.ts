import { Router } from "express";
import { agentController } from "./agent.controller";

const router = Router();

router.post("/register", agentController.register);
router.post("'/heartbeat", agentController.heartbeat);
router.get("/jobs/pull", agentController.pullJobs);
router.post("/job/:jobId/logs", agentController.jobLogs);
router.post("/job/:jobId/result", agentController.jobResult);
router.post("/shutdown", agentController.shutdown);

export const agentRoutes = router;

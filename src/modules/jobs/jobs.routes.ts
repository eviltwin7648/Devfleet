import { Router } from "express";
import { jobController } from "./jobs.controller";

const router = Router();

router.post("/create", jobController.createJob);
router.get("/list", jobController.listJobs);
router.get("/get/:jobId", jobController.getJob);
router.put("/update/:jobId", jobController.updateJob);
router.delete("/delete/:jobId", jobController.deleteJob);



export const jobRoutes = router;
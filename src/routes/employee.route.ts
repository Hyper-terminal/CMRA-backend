import express from "express";
import { createWorker, getAllWorkers } from "../controllers/worker.controller";
import { requireSignin } from "../middlewares";
import { getTotalSalary } from "../controllers/employee.controller";

const router = express.Router();

router.post("/create", requireSignin as any, createWorker as any);
router.get("/", requireSignin as any, getAllWorkers as any);
router.get("/totalSalary", requireSignin as any, getTotalSalary as any);

export default router;

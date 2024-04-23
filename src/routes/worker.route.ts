import express from "express";
import {
  createWorker,
  getAllWorkers,
  getTotalSalary,
} from "../controllers/worker.controller";
import { requireSignin } from "../middlewares";

const router = express.Router();

router.post("/create", createWorker as any);
router.get("/", requireSignin as any, getAllWorkers as any);
router.get("/totalSalary", requireSignin as any, getTotalSalary as any);

export default router;

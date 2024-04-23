import express from "express";
import {
  createWorker,
  getAllWorkers,
  getTotalSalary,
  getWorkerById,
  updateWorker,
} from "../controllers/worker.controller";
import { requireSignin } from "../middlewares";

const router = express.Router();

router.post("/create", createWorker as any);
router.get("/", requireSignin as any, getAllWorkers as any);
router.get("/details", requireSignin as any, getWorkerById as any);
router.get("/totalSalary", requireSignin as any, getTotalSalary as any);
router.patch("/update", requireSignin as any, updateWorker as any);

export default router;

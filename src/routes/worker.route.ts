import express from "express";
import {
  assignTaskToWorker,
  createWorker,
  getAllWorkers,
  getTotalSalary,
  getWorkerById,
  getWorkerTasks,
  updateWorker,
} from "../controllers/worker.controller";
import { requireSignin } from "../middlewares";

const router = express.Router();

// get calls
router.post("/create", requireSignin, createWorker);
router.get("/", requireSignin, getAllWorkers);
router.get("/details", requireSignin, getWorkerById);
router.get("/totalSalary", requireSignin, getTotalSalary);
router.get("/tasks", requireSignin, getWorkerTasks);

// patch calls
router.patch("/update", requireSignin, updateWorker);
router.patch("/assign-task", requireSignin, assignTaskToWorker);

export default router;

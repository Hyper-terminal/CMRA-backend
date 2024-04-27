import express from "express";
import {
  createWorker,
  getAllWorkers,
  getTotalSalary,
  getWorkerById,
  getWorkerTasks,
  updateWorker,
} from "../controllers/worker.controller";
import { requireSignin } from "../middlewares";

const router = express.Router();

router.post("/create", requireSignin, createWorker);
router.get("/", requireSignin, getAllWorkers);
router.get("/details", requireSignin, getWorkerById);
router.get("/totalSalary", requireSignin, getTotalSalary);
router.patch("/update", requireSignin, updateWorker);
router.get("/tasks", requireSignin, getWorkerTasks);


export default router;

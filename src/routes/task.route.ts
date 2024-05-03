import express from "express";
import {
  createTask,
  getAllTasks,
  startTask,
} from "../controllers/task.controller";
import { requireSignin } from "../middlewares";

const router = express.Router();

router.post("/create", requireSignin, createTask);
router.get("/", requireSignin, getAllTasks);
router.patch("/start-task", requireSignin, startTask);

export default router;

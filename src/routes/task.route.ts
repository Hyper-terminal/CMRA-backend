import express from "express";
import { createTask, getAllTasks } from "../controllers/task.controller";
import { requireSignin } from "../middlewares";

const router = express.Router();

router.post("/create", createTask as any);
router.get("/", requireSignin as any, getAllTasks as any);

export default router;

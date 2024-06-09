import express from "express";
import {
  createTask,
  generateOtp,
  getAllTasks,
  startTask,
  verifyOtp,
  getTaskById,
} from "../controllers/task.controller";
import { requireSignin } from "../middlewares";

const router = express.Router();

router.post("/create", requireSignin, createTask);
router.get("/", requireSignin, getAllTasks);
router.get("/:id", requireSignin, getTaskById);
router.patch("/start-task", requireSignin, startTask);
router.patch("/generate-otp", requireSignin, generateOtp);
router.patch("/verify-otp", requireSignin, verifyOtp);

export default router;

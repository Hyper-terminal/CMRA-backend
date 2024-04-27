import express from "express";
import { createTask, getAllTasks } from "../controllers/task.controller";
import { requireSignin } from "../middlewares";

const router = express.Router();

router.post("/create", requireSignin , createTask );
router.get("/", requireSignin , getAllTasks);

export default router;

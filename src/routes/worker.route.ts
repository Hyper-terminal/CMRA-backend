import express from "express";
import { createWorker, getAllWorkers } from "../controllers/worker.controller";
import { requireSignin } from "../middlewares";

const router = express.Router();

router.post("/create", requireSignin as any, createWorker as any);
router.get("/", requireSignin as any, getAllWorkers as any);

export default router;

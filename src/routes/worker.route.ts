import express from "express";
import { createWorker } from "../controllers/worker.controller";
import { requireSignin } from "../middlewares";

const router = express.Router();

router.post("/create", requireSignin as any, createWorker as any);

export default router;

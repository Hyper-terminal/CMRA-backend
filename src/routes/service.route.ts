import express from "express";
import {
  getAllService,
  getTotalSalary,
} from "../controllers/service.controller";
import { requireSignin } from "../middlewares";

const router = express.Router();

router.get("/", requireSignin as any, getAllService as any);

router.get("/totalSalary", requireSignin as any, getTotalSalary as any);

export default router;

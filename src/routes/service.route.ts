import express from "express";
import {
  getAllService,
  getTotalSalary,
} from "../controllers/service.controller";
import { requireSignin } from "../middlewares";

const router = express.Router();

router.get("/", requireSignin, getAllService);

router.get("/totalSalary", requireSignin, getTotalSalary);

export default router;

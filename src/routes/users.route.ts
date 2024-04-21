import express from "express";

import {
  createEmployee,
  getAllEmployees,
} from "../controllers/user.controller";
import { requireSignin } from "../middlewares";

const router = express.Router();

router.post("/create", requireSignin as any, createEmployee as any);
router.get("/", requireSignin as any, getAllEmployees as any);

export default router;

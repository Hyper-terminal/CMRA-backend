import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  getTotalSalary,
  updateEmployee,
} from "../controllers/employee.controller";
import { requireSignin } from "../middlewares";

const router = express.Router();

router.post("/create", requireSignin as any, createEmployee as any);
router.get("/", requireSignin as any, getAllEmployees as any);
router.get("/details", getEmployeeById as any);
router.get("/totalSalary", requireSignin as any, getTotalSalary as any);
router.patch("/update", requireSignin as any, updateEmployee as any);

export default router;

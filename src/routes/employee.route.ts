import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  getEmployeeTasks,
  getTotalSalary,
  updateEmployee,
} from "../controllers/employee.controller";
import { requireSignin } from "../middlewares";

const router = express.Router();

router.post("/create", requireSignin, createEmployee);
router.get("/", requireSignin, getAllEmployees);
router.get("/details", getEmployeeById);
router.get("/totalSalary", requireSignin, getTotalSalary);
router.patch("/update", requireSignin, updateEmployee);
router.get("/tasks", requireSignin, getEmployeeTasks);

export default router;

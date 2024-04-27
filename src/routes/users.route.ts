import express from "express";

import {
  createEmployee,
  getAllEmployees,
} from "../controllers/user.controller";
import { requireSignin } from "../middlewares";

const router = express.Router();

router.post("/create", requireSignin , createEmployee );
router.get("/", requireSignin , getAllEmployees );

export default router;

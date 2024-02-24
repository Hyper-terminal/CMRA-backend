import express from "express";
import { signin, signout, signup } from "../controllers/auth.controller";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/signout").get(signout);

export default router;

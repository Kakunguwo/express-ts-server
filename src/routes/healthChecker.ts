import { Router } from "express";
import { healthChecker } from "../controllers/healthChecker";

const router = Router();

router.route("/").get(healthChecker)

export default router;
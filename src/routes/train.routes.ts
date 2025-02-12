import { Router } from "express";
import { addTrains, getSeatAvailability } from "../controllers/train.controller.js";
import { authorize } from "../middlewares/auth.js";

const router: Router = Router();

router.post("/", authorize(["ADMIN"]), addTrains);
router.get("/", authorize(["ADMIN", "NORMAL_USER"]), getSeatAvailability);

export default router;

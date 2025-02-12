import { Router } from "express";
import { bookTrain, getBookingDetails } from "../controllers/booking.controller.js";
import { authorize } from "../middlewares/auth.js";

const router: Router = Router();

router.post("/:id", authorize(["ADMIN", "NORMAL_USER"]), bookTrain);
router.get("/:id", authorize(["ADMIN", "NORMAL_USER"]), getBookingDetails);

export default router;

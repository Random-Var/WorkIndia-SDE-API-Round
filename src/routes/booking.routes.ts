import { Router } from "express";
import { bookSeat, getBookingDetails } from "../controllers/booking.controller.js";
import { authorize } from "../middlewares/auth.js";

const router: Router = Router();

router.post("/:trainId", authorize(["ADMIN", "NORMAL_USER"]), bookSeat);
router.get("/:trainId", authorize(["ADMIN", "NORMAL_USER"]), getBookingDetails);

export default router;

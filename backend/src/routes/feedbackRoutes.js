import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { submitFeedback, checkFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/", protectRoute, submitFeedback);
router.get("/check/:sessionid", protectRoute, checkFeedback);

export default router;
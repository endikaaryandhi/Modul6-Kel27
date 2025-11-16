import express from "express";
import { ThresholdsController } from "../controllers/thresholdsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; 

const router = express.Router();
router.get("/", ThresholdsController.list);
router.get("/latest", ThresholdsController.latest);

router.post("/", authMiddleware, ThresholdsController.create);

export default router;
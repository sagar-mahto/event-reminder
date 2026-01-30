import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addEvent,
  getEvents,
  deleteEvent,
  updateEvent,
} from "../controllers/eventController.js";

const router = express.Router();

// Protect all routes below
router.use(authMiddleware);

router.post("/", addEvent);
router.get("/", getEvents);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;

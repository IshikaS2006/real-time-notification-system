import express from "express";
import { getNotifications, unreadNotifications, markAsRead } from "../controllers/notification.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.use(verifyJWT);

//GET /notifications
router.get("/", getNotifications);
// GET /notifications/unread
router.get("/unread", unreadNotifications);
// PATCH /notifications/:id/read
router.patch("/:id/read", markAsRead);

export default router;
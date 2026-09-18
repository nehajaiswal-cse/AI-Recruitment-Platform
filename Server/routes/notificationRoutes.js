import express from "express";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);

router.patch("/:id/read", authMiddleware, markNotificationAsRead);

router.patch("/read-all", authMiddleware, markAllNotificationsAsRead);

router.delete("/:id", authMiddleware, deleteNotification);

export default router;
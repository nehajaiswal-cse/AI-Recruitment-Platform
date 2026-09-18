import Notification from "../models/notification.js";

export const createNotification = async ({
  recipientId,
  type,
  title,
  message,
  link = "",
}) => {
  try {
    const notification = await Notification.create({
      recipientId,
      type,
      title,
      message,
      link,
    });

    return notification;
  } catch (error) {
    console.error("Create notification error:", error);
    return null;
  }
};
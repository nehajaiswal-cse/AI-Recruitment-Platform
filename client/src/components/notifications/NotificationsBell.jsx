import { useEffect, useState } from "react";

import {
  Badge,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../api/notificationApi";

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      console.log("Fetched notifications:", data);

      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Notification fetch error:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRead = async (notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id);

        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notification._id
              ? { ...item, isRead: true }
              : item
          )
        );

        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      console.error("Mark notification error:", error);
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Mark all error:", error);
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ color: "white" }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsNoneRoundedIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 500,
            bgcolor: "#0b1628",
            color: "white",
            border: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontWeight={700}>
            Notifications
          </Typography>

          {unreadCount > 0 && (
            <IconButton
              size="small"
              onClick={handleMarkAll}
              sx={{ color: "#67e8f9" }}
            >
              <DoneAllRoundedIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Divider />

        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification._id}
              onClick={() => handleRead(notification)}
              sx={{
                py: 1.5,
                alignItems: "flex-start",
                whiteSpace: "normal",
                bgcolor: notification.isRead
                  ? "transparent"
                  : "rgba(99,102,241,0.10)",
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  fontWeight={700}
                >
                  {notification.title}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {notification.message}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
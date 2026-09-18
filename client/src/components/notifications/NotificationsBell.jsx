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

import { useTheme } from "@mui/material/styles";

import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../api/notificationApi";

const NotificationBell = () => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const isDark = theme.palette.mode === "dark";

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
      {/* ================================================= */}
      {/* NOTIFICATION BUTTON */}
      {/* ================================================= */}

      <IconButton
        onClick={handleOpen}
        sx={{
          color: theme.palette.text.primary,

          "&:hover": {
            bgcolor: isDark
              ? "rgba(255,255,255,0.06)"
              : "rgba(15,23,42,0.06)",
          },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          max={99}
        >
          <NotificationsNoneRoundedIcon />
        </Badge>
      </IconButton>

      {/* ================================================= */}
      {/* NOTIFICATION MENU */}
      {/* ================================================= */}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,

            width: {
              xs: 320,
              sm: 380,
            },

            maxHeight: 500,

            bgcolor: theme.palette.background.paper,

            color: theme.palette.text.primary,

            border: `1px solid ${theme.palette.divider}`,

            borderRadius: "14px",

            backgroundImage: "none",

            boxShadow: isDark
              ? "0 20px 50px rgba(0,0,0,0.35)"
              : "0 20px 50px rgba(15,23,42,0.15)",

            overflow: "hidden",
          },
        }}
      >

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <Box
          sx={{
            px: 2,
            py: 1.5,

            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            bgcolor: theme.palette.background.paper,
          }}
        >
          <Typography
            fontWeight={700}
            sx={{
              color: theme.palette.text.primary,
            }}
          >
            Notifications
          </Typography>

          {unreadCount > 0 && (
            <IconButton
              size="small"
              onClick={handleMarkAll}
              sx={{
                color: theme.palette.primary.main,

                "&:hover": {
                  bgcolor: isDark
                    ? "rgba(59,130,246,0.10)"
                    : "rgba(59,130,246,0.08)",
                },
              }}
            >
              <DoneAllRoundedIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Divider
          sx={{
            borderColor: theme.palette.divider,
          }}
        />

        {/* ================================================= */}
        {/* EMPTY STATE */}
        {/* ================================================= */}

        {notifications.length === 0 ? (
          <Box
            sx={{
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography
              color="text.secondary"
              sx={{
                color: theme.palette.text.secondary,
              }}
            >
              No notifications yet
            </Typography>
          </Box>
        ) : (

          /* ================================================= */
          /* NOTIFICATION LIST */
          /* ================================================= */

          notifications.map((notification) => (
            <MenuItem
              key={notification._id}
              onClick={() => handleRead(notification)}
              sx={{
                py: 1.5,

                px: 2,

                alignItems: "flex-start",

                whiteSpace: "normal",

                borderBottom: `1px solid ${theme.palette.divider}`,

                bgcolor: notification.isRead
                  ? "transparent"
                  : isDark
                    ? "rgba(99,102,241,0.10)"
                    : "rgba(99,102,241,0.07)",

                transition: "background-color 0.2s ease",

                "&:hover": {
                  bgcolor: notification.isRead
                    ? isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(15,23,42,0.04)"
                    : isDark
                      ? "rgba(99,102,241,0.16)"
                      : "rgba(99,102,241,0.12)",
                },

                "&:last-child": {
                  borderBottom: "none",
                },
              }}
            >
              <Box sx={{ width: "100%" }}>

                {/* TITLE */}

                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{
                    color: theme.palette.text.primary,
                    mb: 0.4,
                  }}
                >
                  {notification.title}
                </Typography>

                {/* MESSAGE */}

                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1.5,
                  }}
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
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

export const SIDEBAR_WIDTH = 216;

export default function Sidebar({
  items = [],
  active = "dashboard",
  onNavigate,
  mobileOpen = false,
  onMobileClose,
}) {
  const navList = (onItemClick) => (
    <List sx={{ px: 1.5, py: 1 }}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;

        return (
          <ListItemButton
            key={item.id}
            selected={isActive}
            onClick={() => {
              onNavigate?.(item.id);
              onItemClick?.();
            }}
            sx={{
              borderRadius: 2,
              mb: 0.5,

              color: isActive
                ? "text.primary"
                : "text.secondary",

              "&.Mui-selected": {
                bgcolor: "rgba(59, 130, 246, 0.14)",

                "&:hover": {
                  bgcolor: "rgba(59, 130, 246, 0.18)",
                },
              },

              "&:hover": {
                bgcolor: "rgba(148, 163, 184, 0.08)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 36,
                color: isActive
                  ? "primary.main"
                  : "text.secondary",
              }}
            >
              <Icon fontSize="small" />
            </ListItemIcon>

            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
              }}
            />
          </ListItemButton>
        );
      })}
    </List>
  );

  return (
    <>
      {/* Desktop */}

      <Box
        component="nav"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,

          bgcolor: "background.default",

          borderRight: "1px solid",
          borderColor: "divider",

          position: "sticky",
          top: 72,

          height: "calc(100vh - 72px)",

          display: {
            xs: "none",
            md: "block",
          },
        }}
      >
        {navList()}
      </Box>

      {/* Mobile / Tablet */}

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },

          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH,

            bgcolor: "background.default",

            boxSizing: "border-box",

            borderRight: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <Box sx={{ height: 72 }} />

        {navList(onMobileClose)}
      </Drawer>
    </>
  );
}









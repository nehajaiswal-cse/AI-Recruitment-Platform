
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  useTheme,
} from "@mui/material";

import WorkIcon from "@mui/icons-material/Work";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import GroupsIcon from "@mui/icons-material/Groups";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const iconMap = {
  work: WorkIcon,
  assignment: AssignmentIcon,
  playlist_add_check: PlaylistAddCheckIcon,
  groups: GroupsIcon,
  workspace_premium: WorkspacePremiumIcon,
};

function StatCard({ stat }) {
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  const Icon = iconMap[stat.icon];

  return (
    <Card
      sx={{
        height: "100%",
        bgcolor: "background.paper",
        borderColor: "divider",

        transition:
          "transform 0.2s ease, box-shadow 0.2s ease",

        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: isDark
            ? "0 8px 24px rgba(0,0,0,0.35)"
            : "0 8px 24px rgba(0,0,0,0.08)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Stat Information */}
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 0.5,
              }}
            >
              {stat.label}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: stat.color,
              }}
            >
              {stat.value}
            </Typography>
          </Box>

          {/* Icon */}
          <Avatar
            sx={{
              bgcolor: isDark
                ? `${stat.color}25`
                : `${stat.color}15`,

              color: stat.color,

              width: 48,
              height: 48,
            }}
          >
            {Icon && <Icon />}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function StatCards({ stats }) {
  return (
    <Box
      sx={{
        display: "grid",

        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "repeat(5, 1fr)",
        },

        gap: 2,
      }}
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          stat={stat}
        />
      ))}
    </Box>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Typography, CircularProgress } from "@mui/material";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { getAiInterviewHistory } from "../../../api/aiInterviewApi";  

const AIInterviewHistoryList = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getAiInterviewHistory();
        setHistory(data.interviews || []);
      } catch (err) {
        setError("Failed to load AI interview history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={24} sx={{ color: "#a78bfa" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography sx={{ color: "#f87171", fontSize: 14, py: 2 }}>
        {error}
      </Typography>
    );
  }

  const completedOnly = history.filter((h) => h.status === "completed");

  if (completedOnly.length === 0) {
    return (
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: "#0e1a2b",
          border: "1px solid #24334a",
          textAlign: "center",
        }}
      >
        <Typography sx={{ color: "#94a3b8", fontSize: 14 }}>
          No AI interview history yet. Complete your first Pro AI interview to
          see it here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {completedOnly.map((item) => (
        <Box
          key={item._id}
          onClick={() =>
            navigate(`/applicant/interviews/feedback/${item._id}`)
          }
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: "#0e1a2b",
            border: "1px solid #24334a",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "border-color 0.2s",
            "&:hover": { borderColor: "#6366f1" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "#312e81",
                color: "#a78bfa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SmartToyRoundedIcon sx={{ fontSize: 20 }} />
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                {item.role} • {item.type}
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: 12 }}>
                {new Date(item.updatedAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 16,
                color:
                  (item.evaluation?.overallScore ?? 0) >= 70
                    ? "#4ade80"
                    : "#fbbf24",
              }}
            >
              {item.evaluation?.overallScore ?? "--"}%
            </Typography>
            <ChevronRightRoundedIcon sx={{ color: "#64748b" }} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default AIInterviewHistoryList;
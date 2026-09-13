import { useState } from "react";


import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { copilotApi } from "../../api/analyticsApi";

const quickActions = [
  {
    label: "Summarize",
    prompt:
      "Give me a concise recruiter-friendly summary of this candidate.",
  },
  {
    label: "Why good fit?",
    prompt:
      "Why is this candidate a good fit for this job? Compare their skills with the job requirements.",
  },
  {
    label: "Skill gap",
    prompt:
      "What are the candidate's main skill gaps for this job?",
  },
  {
    label: "Interview questions",
    prompt:
      "Generate 5 technical interview questions based on this candidate's skills and the job requirements.",
  },
  {
    label: "Concerns",
    prompt:
      "What areas should the recruiter investigate during the interview?",
  },
];

function CandidateCopilot({ applicationId }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askCopilot = async (customQuestion = null) => {
    const finalQuestion =
      customQuestion || question.trim();

    if (!finalQuestion || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: finalQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
        console.log("Copilot applicationId:", applicationId);
    console.log("Copilot question:", finalQuestion);

      const response = await copilotApi(
        applicationId,
        {
          message: finalQuestion,
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            response.data?.reply ||
            "No response received from AI.",
        },
      ]);
    } catch (error) {
      console.error(
        "COPILOT ERROR:",
        error.response?.data || error.message
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error.response?.data?.message ||
            "Unable to connect to AI Copilot.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: "#0b1425",
        border: "1px solid #1e293b",
        borderRadius: 2,
        p: 2.5,
        mb: 2,
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <AutoAwesomeRoundedIcon
              sx={{
                fontSize: 18,
                color: "#8b5cf6",
              }}
            />

            AI Candidate Copilot
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              color: "#64748b",
              mt: 0.5,
            }}
          >
            Get AI-powered insights about this candidate
          </Typography>
        </Box>
      </Box>

      <Divider
        sx={{
          borderColor: "#1e293b",
          mb: 2,
        }}
      />

      {/* QUICK ACTIONS */}
      <Typography
        sx={{
          fontSize: 12,
          color: "#8c97ab",
          mb: 1,
        }}
      >
        Quick actions
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
        sx={{ mb: 2 }}
      >
        {quickActions.map((action) => (
          <Button
            key={action.label}
            size="small"
            disabled={loading}
            onClick={() =>
              askCopilot(action.prompt)
            }
            sx={{
              textTransform: "none",
              color: "#cbd5e1",
              border: "1px solid #263249",
              bgcolor: "#060d1e",
              borderRadius: 1.5,
              fontSize: 11.5,
              "&:hover": {
                bgcolor: "#172236",
                borderColor: "#6366f1",
              },
            }}
          >
            {action.label}
          </Button>
        ))}
      </Stack>

      {/* CHAT AREA */}
      {messages.length > 0 && (
        <Box
          sx={{
            maxHeight: 350,
            overflowY: "auto",
            mb: 2,
            pr: 0.5,
          }}
        >
          <Stack spacing={1.5}>
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.role === "user"
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                <Box
                  sx={{
                    maxWidth: "90%",
                    px: 1.5,
                    py: 1.2,
                    borderRadius: 2,
                    bgcolor:
                      message.role === "user"
                        ? "#3730a3"
                        : "#111c2d",
                    border:
                      message.role === "assistant"
                        ? "1px solid #1e293b"
                        : "none",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      lineHeight: 1.6,
                      color: "#e2e8f0",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {message.content}
                  </Typography>
                </Box>
              </Box>
            ))}

            {loading && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1,
                }}
              >
                <CircularProgress size={16} />

                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#64748b",
                  }}
                >
                  Copilot is analyzing...
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      )}

      {/* INPUT */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          size="small"
          value={question}
          disabled={loading}
          placeholder="Ask about this candidate..."
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey
            ) {
              e.preventDefault();
              askCopilot();
            }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "#060d1e",
              color: "#fff",
              borderRadius: 1.5,
              fontSize: 13,
            },

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#263249",
            },

            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#6366f1",
              },
          }}
        />

        <Button
          variant="contained"
          disabled={
            loading || !question.trim()
          }
          onClick={() => askCopilot()}
          sx={{
            minWidth: 46,
            borderRadius: 1.5,
            bgcolor: "#6366f1",
            "&:hover": {
              bgcolor: "#4f46e5",
            },
          }}
        >
          {loading ? (
            <CircularProgress
              size={18}
              color="inherit"
            />
          ) : (
            <SendRoundedIcon
              sx={{ fontSize: 18 }}
            />
          )}
        </Button>
      </Box>
    </Card>
  );
}

export default CandidateCopilot;
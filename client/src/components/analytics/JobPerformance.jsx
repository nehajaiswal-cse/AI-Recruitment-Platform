
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

export default function JobPerformance({ data }) {
  return (
    <Card
      sx={{
        bgcolor: "background.paper",
        borderColor: "divider",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            mb: 0.5,
            color: "text.primary",
            fontWeight: 600,
          }}
        >
          Job Performance
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Applications and hiring progress by job posting
        </Typography>

        {/* Table */}
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            {/* Table Header */}
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    fontWeight: 600,
                    color: "text.secondary",
                    fontSize: 13,
                    borderBottom: 1,
                    borderColor: "divider",
                  },
                }}
              >
                <TableCell>Job Title</TableCell>

                <TableCell align="right">
                  Applications
                </TableCell>

                <TableCell align="right">
                  Shortlist
                </TableCell>

                <TableCell align="right">
                  Interview
                </TableCell>

                <TableCell align="right">
                  Hired
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={row.job}
                  sx={{
                    "&:last-child td": {
                      borderBottom: 0,
                    },

                    "& td": {
                      fontSize: 14,
                      py: 1.5,
                      borderBottom: 1,
                      borderColor: "divider",
                      color: "text.primary",
                    },

                    transition: "background-color 0.15s",

                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  {/* Job */}
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.primary !important",
                    }}
                  >
                    {row.job}
                  </TableCell>

                  {/* Applications */}
                  <TableCell align="right">
                    {row.applications}
                  </TableCell>

                  {/* Shortlist */}
                  <TableCell align="right">
                    {row.shortlist}
                  </TableCell>

                  {/* Interview */}
                  <TableCell align="right">
                    {row.interview}
                  </TableCell>

                  {/* Hired */}
                  <TableCell align="right">
                    <Chip
                      label={row.hired}
                      size="small"
                      sx={{
                        bgcolor:
                          row.hired >= 3
                            ? "rgba(16, 185, 129, 0.15)"
                            : row.hired >= 1
                              ? "rgba(245, 158, 11, 0.15)"
                              : "rgba(239, 68, 68, 0.15)",

                        color:
                          row.hired >= 3
                            ? "success.main"
                            : row.hired >= 1
                              ? "warning.main"
                              : "error.main",

                        fontWeight: 600,

                        minWidth: 36,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
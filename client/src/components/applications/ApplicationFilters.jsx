import {
  Box,
  TextField,
  MenuItem,
} from "@mui/material";

import useApplications from "../../hooks/useApplications";

const ApplicationFilters = () => {
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
  } = useApplications();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        my: 3,
      }}
    >
      <TextField
        fullWidth
        placeholder="Search applications..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <TextField
        select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="Applied">Applied</MenuItem>
        <MenuItem value="Under Review">
          Under Review
        </MenuItem>
        <MenuItem value="Shortlisted">
          Shortlisted
        </MenuItem>
        <MenuItem value="Rejected">Rejected</MenuItem>
      </TextField>
    </Box>
  );
};

export default ApplicationFilters;
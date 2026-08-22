import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import useApplications from "../../hooks/useApplications";

const ApplicationTable = () => {
  const { filteredApplications } = useApplications();

  const navigate = useNavigate();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Job</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Applied Date</TableCell>
            <TableCell>Match Score</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredApplications.map((application) => (
            <TableRow key={application.id}>
              <TableCell>
                {application.jobTitle}
              </TableCell>

              <TableCell>
                {application.company}
              </TableCell>

              <TableCell>
                {application.location}
              </TableCell>

              <TableCell>
                {application.appliedDate}
              </TableCell>

              <TableCell>
                {application.matchScore}%
              </TableCell>

              <TableCell>
                <Chip
                  label={application.status}
                  size="small"
                />
              </TableCell>

              <TableCell>
                <Button
                  onClick={() =>
                    navigate(
                      `/applicant/applications/${application.id}`
                    )
                  }
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ApplicationTable;
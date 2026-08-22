import { Card, CardContent, Grid, Typography } from "@mui/material";
import useApplications from "../../hooks/useApplications";

const ApplicationStats = () => {
  const { applications } = useApplications();

  const total = applications.length;

  const applied = applications.filter(
    (app) => app.status === "Applied"
  ).length;

  const underReview = applications.filter(
    (app) => app.status === "Under Review"
  ).length;

  const shortlisted = applications.filter(
    (app) => app.status === "Shortlisted"
  ).length;

  const rejected = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

  const stats = [
    { label: "Total Applications", value: total },
    { label: "Applied", value: applied },
    { label: "Under Review", value: underReview },
    { label: "Shortlisted", value: shortlisted },
    { label: "Rejected", value: rejected },
  ];

  return (
    <Grid container spacing={2}>
      {stats.map((stat) => (
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={stat.label}>
          <Card>
            <CardContent>
              <Typography variant="body2">
                {stat.label}
              </Typography>

              <Typography variant="h4">
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ApplicationStats;
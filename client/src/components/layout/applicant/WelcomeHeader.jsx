import { Box, Typography, Button } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

function Greeting() {
  const isMobile = false; // replace with your actual mobile logic

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleAdd = () => {
    console.log('Add Application clicked');
  };

  return (
    <Box
      sx={{
        mb: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, mb: 0.5 }}
        >
          {getGreeting()}, Advita
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: 'text.secondary' }}
        >
          Track your applications and discover your next opportunity.
        </Typography>
      </Box>

      {!isMobile && (
        <Button
          variant="contained"
          startIcon={<AddOutlinedIcon />}
          onClick={handleAdd}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            px: 2.5,
            py: 1.25,
            borderRadius: 2.5,
          }}
        >
          Add Application
        </Button>
      )}
    </Box>
  );
}

export default Greeting;
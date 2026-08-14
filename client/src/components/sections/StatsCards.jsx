import Box from '@mui/material/Box'

import StatsCard from '../dashboard/StatsCard'

const StatsCards = () => {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        p: {
          xs: 2,
          sm: 2.5,
          md: 3,
        },

        display: 'grid',

        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr 1fr',
          lg: 'repeat(4, 1fr)',
        },

        gap: 2,
      }}
    >
      <StatsCard
        title="Total Jobs"
        value="24"
        icon="💼"
        description="5 active jobs"
      />

      <StatsCard
        title="Applications"
        value="281"
        icon="📄"
        description="12 new this week"
      />

      <StatsCard
        title="Interviews"
        value="18"
        icon="📅"
        description="4 scheduled today"
      />

      <StatsCard
        title="Selected"
        value="6"
        icon="🎯"
        description="This month"
      />
    </Box>
  )
}

export default StatsCards
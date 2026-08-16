import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const StatsCard = ({
  title,
  value,
  icon,
  description,
}) => {
  return (
    <Box
      sx={{
        bgcolor: 'background.surface',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        boxShadow: 1,
        p: 3,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',

        minWidth: 0,

        transition: 'all 0.2s ease',

        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            color: 'text.primary',
            fontWeight: 700,
            mt: 1,
          }}
        >
          {value}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mt: 0.5,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: 2,

          bgcolor: 'action.hover',

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          fontSize: '1.8rem',

          flexShrink: 0,
          ml: 2,
        }}
      >
        {icon}
      </Box>
    </Box>
  )
}

export default StatsCard
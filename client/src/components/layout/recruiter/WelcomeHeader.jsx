import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function WelcomeHeader({ recruiterName }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <span role="img" aria-label="">
          👋
        </span>
        Hi {recruiterName}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
        Welcome to your dashboard
      </Typography>
    </Box>
  )
}

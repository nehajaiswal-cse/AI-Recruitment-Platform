
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const Logo = () => {
  return (
    <Link
      to="/recruiter"
      style={{
        textDecoration: 'none',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: { xs: 0.5, sm: 1 },
        }}
      >
        {/* Logo Icon */}
        <Box
          sx={{
            width: { xs: 38, sm: 42 },
            height: { xs: 38, sm: 42 },
            borderRadius: 3,
            background:
              'linear-gradient(135deg, #3b82f6, #9333ea)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              color: '#fff',
              fontSize: { xs: '1.4rem', sm: '1.6rem' },
              fontWeight: 700,
            }}
          >
            T
          </Typography>
        </Box>

        {/* Logo Text */}
        <Box>
          <Typography
            sx={{
              color: 'text.primary',
              fontSize: { xs: '1.5rem', sm: '1.8rem' },
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            Talvyn
          </Typography>

          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.55rem', sm: '0.7rem' },
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              mt: 0.4,
              whiteSpace: 'nowrap',
            }}
          >
            Talent + Vision + AI
          </Typography>
        </Box>
      </Box>
    </Link>
  )
}

export default Logo
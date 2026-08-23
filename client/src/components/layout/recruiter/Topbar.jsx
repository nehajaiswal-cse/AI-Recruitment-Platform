import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { brandGradient } from '../../../theme.js'

export default function RTopbar() {
  return (
  <Box
  sx={{
    display: 'flex',
    flexDirection: {
      xs: 'column',
      sm: 'row',
    },
    alignItems: 'stretch',
    gap: 2,

    px: {
      xs: 2,
      sm: 3,
      md: 4,
    },

    pt: {
      xs: 2,
      sm: 2,
      md: 2,
    },

    pb: 2,

    bgcolor: 'background.surface',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
    position: 'relative',
    zIndex: 1,

    mb: 3,
  }}
>
      <TextField
        placeholder="Search Candidates"
        fullWidth
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            </InputAdornment>
          ),
          sx: {
            bgcolor: 'background.paper',
            borderRadius: 2,
            height: 44,
          },
        }}
      />

      <Button
        variant="contained"
        startIcon={<AddRoundedIcon />}
        sx={{
          background: brandGradient,
          whiteSpace: 'nowrap',
          px: 2.5,
          height: 44,
          width: { xs: '100%', sm: 'auto' },
          flexShrink: 0,
          '&:hover': { background: brandGradient, opacity: 0.92 },
        }}
      >
        Create Job
      </Button>
    </Box>
  )
}
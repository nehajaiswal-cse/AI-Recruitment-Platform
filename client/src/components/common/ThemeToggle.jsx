import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'

import { useThemeMode } from '../../context/useThemeMode.js'

const ThemeToggle = () => {
  const { mode, toggleMode } = useThemeMode()

  const isDark = mode === 'dark'

  return (
    <Tooltip
      title={isDark ? 'Light mode' : 'Dark mode'}
      arrow
    >
      <IconButton
        onClick={toggleMode}
        aria-label="Toggle theme"
        sx={{
          display: 'inline-flex',
          width: 42,
          height: 42,
          color: 'text.primary',
          flexShrink: 0,

          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        {isDark ? (
          <LightModeRoundedIcon />
        ) : (
          <DarkModeRoundedIcon />
        )}
      </IconButton>
    </Tooltip>
  )
}

export default ThemeToggle




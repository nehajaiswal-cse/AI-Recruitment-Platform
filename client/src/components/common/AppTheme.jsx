import { ThemeProvider, CssBaseline } from '@mui/material'

import { useThemeMode } from '../../context/useThemeMode.js'
import { getTheme } from '../../theme.js'

const AppTheme = ({ children }) => {
  const { mode } = useThemeMode()

  const theme = getTheme(mode)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default AppTheme
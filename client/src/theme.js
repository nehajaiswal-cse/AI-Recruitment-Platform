import { createTheme } from '@mui/material/styles'

// Brand gradient stays constant across both modes.
export const brandGradient = 'linear-gradient(135deg, #3b82f6, #9333ea)'

const modePalettes = {
  dark: {
    mode: 'dark',
    background: {
      default: '#0f172a', // page canvas / navbar / sidebar
      paper: '#1e293b', // cards / panels
      surface:"#314057"
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
    divider: 'rgba(148, 163, 184, 0.14)',
  },
  light: {
    mode: 'light',
    background: {
      default: '#f8fafc', // page canvas / navbar / sidebar
      paper: '#f2f6fa', // cards / panels
      surface:"#ffffff"
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    divider: 'rgba(15, 23, 42, 0.08)',
  },
}

export function getTheme(mode = 'dark') {
  const modePalette = modePalettes[mode] ?? modePalettes.dark

  return createTheme({

    palette: {
      ...modePalette,
      primary: { main: '#3b82f6' },
      secondary: { main: '#9333ea' },
      success: { main: '#10b981' },
      warning: { main: '#f59e0b' },
      error: { main: '#ef4444' },
      info: { main: '#3b82f6' },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h6: { fontWeight: 600 },
      subtitle2: { color: modePalette.text.secondary },
    },
    components: {
      // MuiPaper: {
      //   styleOverrides: {
      //     root: {
      //       backgroundImage: 'none',
      //       border: `1px solid ${modePalette.divider}`,
      //     },
      //   },
      // },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: modePalette.divider,
          },
        },
      },

      MuiCssBaseline: {
        styleOverrides: {
          html: {
            minHeight: '100%',
          },

          body: {
            minHeight: '100%',
            margin: 0,
            backgroundColor: modePalette.background.default,
            color: modePalette.text.primary,
          },

          '#root': {
            minHeight: '100vh',
            backgroundColor: modePalette.background.default,
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${modePalette.divider}`,
          },
        },
      },

      
    }
  })
}

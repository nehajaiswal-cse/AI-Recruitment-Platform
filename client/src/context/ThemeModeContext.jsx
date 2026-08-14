
import { createContext, useEffect, useMemo, useState } from 'react'

const ThemeModeContext = createContext({
  mode: 'dark',
  toggleMode: () => {},
})

const STORAGE_KEY = 'talvyn-theme-mode'

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    return window.localStorage.getItem(STORAGE_KEY) ?? 'dark'
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () =>
        setMode((m) => (m === 'dark' ? 'light' : 'dark')),
    }),
    [mode],
  )

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  )
}

export { ThemeModeContext }
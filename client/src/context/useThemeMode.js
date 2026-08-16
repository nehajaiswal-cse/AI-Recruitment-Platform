import { useContext } from 'react'
import { ThemeModeContext } from './ThemeModeContext'

export function useThemeMode() {
  return useContext(ThemeModeContext)
}
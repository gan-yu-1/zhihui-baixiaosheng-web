'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

// 主题值保留旧名称，避免浏览器中已保存的选择失效；对外展示已改为 Trianon 手账。
export type UITheme = 'classic' | 'pastel'

interface ThemeContextValue {
  theme: UITheme
  toggleTheme: () => void
}

const THEME_STORAGE_KEY = 'zhihui-baixiaosheng.ui-theme.v1'
const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<UITheme>('classic')

  useEffect(() => {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'pastel' || saved === 'classic') { setTheme(saved) }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    toggleTheme: () => setTheme(current => current === 'classic' ? 'pastel' : 'classic'),
  }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useUITheme() {
  const context = useContext(ThemeContext)
  if (!context) { throw new Error('useUITheme 必须在 ThemeProvider 内使用') }
  return context
}

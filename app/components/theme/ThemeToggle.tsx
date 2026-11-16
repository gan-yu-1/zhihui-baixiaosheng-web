'use client'

import { BookOpenIcon } from '@heroicons/react/24/outline'
import { useUITheme } from './theme-context'

function WineGlassIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M6.5 3.5h11l-.9 6a4.6 4.6 0 0 1-9.2 0l-.9-6Z" />
      <path d="M12 13.9V20" />
      <path d="M8.5 20h7" />
    </svg>
  )
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useUITheme()
  const isPastel = theme === 'pastel'
  const targetLabel = isPastel ? '经典酒红问答' : 'Trianon 手账展示'
  const toggleLabel = isPastel ? `切换到${targetLabel}` : `切换到 ${targetLabel}`

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={toggleLabel}
      title={toggleLabel}
      className="theme-egg-toggle"
    >
      {isPastel
        ? <WineGlassIcon />
        : <BookOpenIcon className="h-5 w-5" aria-hidden="true" />}
    </button>
  )
}

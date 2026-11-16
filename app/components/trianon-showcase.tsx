'use client'

import { useEffect, useRef, useState } from 'react'
import ThemeToggle from '@/app/components/theme/ThemeToggle'

const TRIANON_URL = '/trianon/index.html#empty'
const CANVAS_WIDTH = 1440
const CANVAS_HEIGHT = 900

function getStageScale(width: number, height: number) {
  const gutter = width < 640 ? 8 : 24
  const widthRatio = (width - gutter * 2) / CANVAS_WIDTH
  const heightRatio = (height - gutter * 2) / CANVAS_HEIGHT

  return Math.max(0.1, Math.min(widthRatio, heightRatio))
}

function getViewportScale() {
  if (typeof window === 'undefined') { return 1 }

  return getStageScale(window.innerWidth, window.innerHeight)
}

export default function TrianonShowcase() {
  const stageRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(getViewportScale)
  const [isCompact, setIsCompact] = useState(() => getViewportScale() < 0.85)

  useEffect(() => {
    const update = () => {
      const stage = stageRef.current
      const width = stage?.clientWidth || window.innerWidth
      const height = stage?.clientHeight || window.innerHeight
      const nextScale = getStageScale(width, height)

      setScale(nextScale)
      setIsCompact(nextScale < 0.85)
    }

    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return (
    <div
      ref={stageRef}
      className="trianon-stage relative h-[100dvh] w-full overflow-hidden bg-[var(--ui-page)]"
      data-view="trianon"
    >
      <div
        className="absolute left-1/2 top-1/2 h-[900px] w-[1440px]"
        style={{
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <iframe
          src={TRIANON_URL}
          title="Trianon 手账界面演示（郑大百晓生，校园回答仅作示例）"
          aria-describedby="trianon-demo-note"
          className="block h-full w-full border-0 bg-transparent"
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-wrap items-end justify-between gap-2 p-3 pb-20 pr-16 sm:p-4 sm:pb-20 sm:pr-20">
        <p
          id="trianon-demo-note"
          className={isCompact ? 'max-w-full rounded-full border border-white/50 bg-[#2C3A57]/85 px-3 py-1.5 text-xs leading-5 text-[#FBF9F4] shadow-sm backdrop-blur-sm sm:text-sm' : 'sr-only'}
        >
          Trianon 手账界面演示 · 校园回答仅作示例
        </p>
        {isCompact && (
          <a
            href={TRIANON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto inline-flex min-h-11 items-center rounded-full border border-white/70 bg-[#FBF9F4] px-4 text-sm font-medium text-[#24305A] shadow-sm transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24305A]"
          >
            在新标签打开手账展示
          </a>
        )}
      </div>

      <ThemeToggle />
    </div>
  )
}

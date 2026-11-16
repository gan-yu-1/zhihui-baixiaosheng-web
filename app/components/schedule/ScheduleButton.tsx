'use client'

import { CalendarDaysIcon } from '@heroicons/react/24/outline'

interface ScheduleButtonProps {
  count: number
  onClick: () => void
}

export default function ScheduleButton({ count, onClick }: ScheduleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="schedule-trigger inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#7A202C] bg-[#7A202C] px-3 text-sm font-medium text-[#FFFDFC] transition-colors duration-200 hover:bg-[#641923] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A202C] active:bg-[#52141D] sm:px-4"
      aria-label={`定时任务，当前 ${count} 项`}
    >
      <CalendarDaysIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span>定时任务</span>
      {count > 0 && (
        <span className="min-w-5 rounded-full bg-[#FFFDFC] px-1.5 py-0.5 text-center text-xs font-semibold leading-4 text-[#7A202C]" aria-hidden="true">
          {count}
        </span>
      )}
    </button>
  )
}

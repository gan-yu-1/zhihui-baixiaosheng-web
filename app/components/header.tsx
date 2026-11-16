'use client'

import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { Bars3Icon, BookOpenIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import ScheduleButton from '@/app/components/schedule/ScheduleButton'
import ScheduleDialog from '@/app/components/schedule/ScheduleDialog'
import ThemeToggle from '@/app/components/theme/ThemeToggle'
import { localScheduleRepository } from '@/app/components/schedule/schedule-storage'
import type { ScheduleTask } from '@/app/components/schedule/types'
import { IS_DEMO } from '@/config'

export interface IHeaderProps {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
}

const Header: FC<IHeaderProps> = ({ title, isMobile, onShowSideBar, onCreateNewChat }) => {
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [taskCount, setTaskCount] = useState(0)

  useEffect(() => {
    void localScheduleRepository.list()
      .then(tasks => setTaskCount(tasks.length))
      .catch(() => setTaskCount(0))
  }, [])

  const handleTasksChange = (tasks: ScheduleTask[]) => setTaskCount(tasks.length)

  return (
    <>
      <header className="app-header flex h-16 shrink-0 items-center justify-between gap-2 border-b border-[#E8E1E3] bg-[#FFFDFC] px-3 sm:px-5 pc:h-[72px] pc:px-7">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {isMobile && onShowSideBar && (
            <button
              type="button"
              onClick={onShowSideBar}
              className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#655A5E] transition-colors hover:bg-[#F5F0F1] hover:text-[#7A202C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A202C]"
              aria-label="打开会话列表"
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          )}
          <div className="app-brand-mark hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7A202C] text-[#FFFDFC] shadow-sm sm:flex" aria-hidden="true">
            <BookOpenIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="header-title truncate text-base font-semibold tracking-wide text-[#342B2E]">{title}</div>
            <div className="header-subtitle hidden text-xs leading-5 text-[#756A6E] sm:block">校园政策与生活服务智能助手</div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-2 text-xs text-[#6D6266] lg:inline-flex">
            <span className={`h-1.5 w-1.5 rounded-full ${IS_DEMO ? 'bg-[#A66B22]' : 'bg-[#36724C]'}`} aria-hidden="true" />
            {IS_DEMO ? '演示模式' : 'Dify 已连接'}
          </span>
          <ThemeToggle />
          <ScheduleButton count={taskCount} onClick={() => setScheduleOpen(true)} />
          {onCreateNewChat && (
            <button
              type="button"
              onClick={onCreateNewChat}
              className="hidden h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-[#DCD4D6] text-[#62575B] transition-colors hover:border-[#BFAFB4] hover:bg-[#F7F2F3] hover:text-[#7A202C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A202C] sm:inline-flex pc:hidden"
              aria-label="新建对话"
            >
              <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
      </header>
      <ScheduleDialog open={scheduleOpen} onClose={() => setScheduleOpen(false)} onTasksChange={handleTasksChange} />
    </>
  )
}

export default React.memo(Header)

'use client'

import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ChatBubbleOvalLeftEllipsisIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon } from '@heroicons/react/24/solid'
import type { ConversationItem } from '@/types/app'

const MAX_CONVERSATION_LENGTH = 20

export interface ISidebarProps {
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  list: ConversationItem[]
}

const Sidebar: FC<ISidebarProps> = ({ copyRight, currentId, onCurrentIdChange, list }) => {
  const { t } = useTranslation()
  return (
    <aside aria-label="历史会话" className="app-sidebar flex h-[100dvh] w-[min(84vw,280px)] shrink-0 flex-col overflow-y-auto border-r border-[#E8E1E3] bg-[#FFFDFC] tablet:h-[calc(100dvh_-_4rem)] tablet:w-[224px] pc:h-[calc(100dvh_-_4.5rem)] pc:w-[248px]">
      <div className="shrink-0 p-4 pb-2 pt-5">
        <button
          type="button"
          onClick={() => onCurrentIdChange('-1')}
          className="sidebar-new-chat inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#CDBFC3] bg-[#FFFDFC] px-4 text-sm font-medium text-[#7A202C] transition-colors hover:border-[#7A202C] hover:bg-[#F9F2F3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A202C] active:bg-[#F1E5E7]"
        >
          <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
          {t('app.chat.newChat')}
        </button>
      </div>

      <div className="px-5 pb-2 pt-4 text-xs font-medium tracking-wide text-[#7A6F73]">最近咨询</div>
      <nav className="flex-1 space-y-1 px-3 pb-4" aria-label="选择历史会话">
        {list.map((item) => {
          const isCurrent = item.id === currentId
          const ItemIcon = isCurrent ? ChatBubbleOvalLeftEllipsisSolidIcon : ChatBubbleOvalLeftEllipsisIcon
          return (
            <button
              type="button"
              onClick={() => onCurrentIdChange(item.id)}
              key={item.id}
              aria-current={isCurrent ? 'page' : undefined}
              className={`sidebar-item group flex min-h-11 w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#7A202C] ${isCurrent ? 'bg-[#F4E9EB] font-medium text-[#6F1D28]' : 'text-[#5E5357] hover:bg-[#F6F2F3]'}`}
            >
              <ItemIcon className={`mr-3 h-5 w-5 shrink-0 ${isCurrent ? 'text-[#7A202C]' : 'text-[#8A7D82] group-hover:text-[#7A202C]'}`} aria-hidden="true" />
              <span className="truncate">{item.name}</span>
            </button>
          )
        })}
        {list.length >= MAX_CONVERSATION_LENGTH && <p className="px-3 py-2 text-xs text-[#756A6E]">最多显示最近 20 个会话</p>}
      </nav>

      <div className="sidebar-footer shrink-0 border-t border-[#EEE8EA] px-5 py-4">
        <p className="text-xs leading-5 text-[#756A6E]">校园政策 · 办事指引 · 生活服务</p>
        <p className="mt-2 text-xs text-[#756A6E]">© {copyRight} {(new Date()).getFullYear()}</p>
      </div>
    </aside>
  )
}

export default React.memo(Sidebar)

'use client'

import { ArrowRightIcon, BookOpenIcon, BuildingLibraryIcon, MapIcon } from '@heroicons/react/24/outline'
import { IS_DEMO } from '@/config'

const topics = [
  { icon: BookOpenIcon, title: '政策查询', description: '奖助、教务与校园制度' },
  { icon: MapIcon, title: '办事指引', description: '梳理流程与材料准备' },
  { icon: BuildingLibraryIcon, title: '校园生活', description: '汇集常用服务信息' },
]

export default function CampusWelcome({ onStartChat }: { onStartChat: () => void }) {
  return (
    <section aria-label="郑大百晓生校园助手" className="relative overflow-hidden px-5 pb-10 pt-12 sm:px-10 sm:pb-14 sm:pt-16">
      <div className="mx-auto max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#DDC9CD] bg-[#FBF6F7] px-3 py-1.5 text-xs font-medium text-[#6F1D28]">
          <span className={`h-1.5 w-1.5 rounded-full ${IS_DEMO ? 'bg-[#A66B22]' : 'bg-[#36724C]'}`} aria-hidden="true" />
          {IS_DEMO ? '前端界面演示' : 'Dify 校园智能体'}
        </div>
        <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.2] tracking-[-0.035em] text-[#30272A] sm:text-5xl">
          校园大小事，<br /><span className="text-[#7A202C]">问百晓生。</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-[#675B60] sm:text-lg sm:leading-8">
          面向校园政策与生活服务的智能问答入口。<br className="hidden sm:block" />把复杂的信息，变成清晰的下一步。
        </p>
        <button
          type="button"
          onClick={onStartChat}
          className="mt-8 inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-xl bg-[#7A202C] px-6 text-base font-medium text-[#FFFDFC] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#641923] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7A202C] active:translate-y-0 active:bg-[#52141D]"
        >
          开始咨询
          <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="mt-12 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {topics.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-center gap-4 border-t border-[#DCCFD2] pt-5 sm:block">
              <Icon className="h-6 w-6 shrink-0 text-[#7A202C]" aria-hidden="true" />
              <div>
                <h2 className="font-medium text-[#3D3337] sm:mt-4">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-[#6C6166]">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-start gap-3 rounded-xl bg-[#F5F1F2] px-4 py-3 text-sm leading-6 text-[#675B60]">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A7B82]" aria-hidden="true" />
          <p>{IS_DEMO ? '当前为界面演示，校园回答仅作示例，不作为校园政策依据。配置 Dify API Key 后启用真实问答。' : '智能体回答仅供参考，具体政策与办理要求请以学校官方发布为准。'}</p>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import type { FormEvent, MouseEvent } from 'react'
import {
  CalendarDaysIcon,
  ClockIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { localScheduleRepository } from './schedule-storage'
import type { ScheduleRepository, ScheduleRecurrence, ScheduleTask } from './types'
import { RECURRENCE_LABELS } from './types'

interface ScheduleDialogProps {
  open: boolean
  onClose: () => void
  onTasksChange: (tasks: ScheduleTask[]) => void
  repository?: ScheduleRepository
}

interface FormErrors {
  name?: string
  runAt?: string
}

const fieldClassName = 'mt-2 min-h-11 w-full rounded-lg border border-[#D9D4D5] bg-[#FFFDFC] px-3 text-base text-[#292326] outline-none transition-colors placeholder:text-[#81777C] hover:border-[#A79DA1] focus:border-[#7A202C] focus:ring-2 focus:ring-[#7A202C]/15'

function toLocalInputValue(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 16)
}

function defaultRunAt() {
  const date = new Date()
  date.setSeconds(0, 0)
  date.setHours(date.getHours() + 1)
  return toLocalInputValue(date)
}

function formatRunAt(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value))
}

export default function ScheduleDialog({ open, onClose, onTasksChange, repository = localScheduleRepository }: ScheduleDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const [tasks, setTasks] = useState<ScheduleTask[]>([])
  const [editing, setEditing] = useState<ScheduleTask | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [runAt, setRunAt] = useState(defaultRunAt)
  const [recurrence, setRecurrence] = useState<ScheduleRecurrence>('none')
  const [errors, setErrors] = useState<FormErrors>({})
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [operationError, setOperationError] = useState('')

  const refresh = async () => {
    try {
      const nextTasks = await repository.list()
      setTasks(nextTasks)
      onTasksChange(nextTasks)
      setOperationError('')
    }
    catch {
      setOperationError('浏览器未能保存任务，请检查是否允许本地存储。')
    }
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) { return }
    if (open && !dialog.open) {
      setShowForm(false)
      setEditing(null)
      setNotice('')
      setOperationError('')
      dialog.showModal()
      void refresh()
    }
    if (!open && dialog.open) { dialog.close() }
  }, [open])

  const resetForm = () => {
    setEditing(null)
    setName('')
    setRunAt(defaultRunAt())
    setRecurrence('none')
    setErrors({})
    setOperationError('')
  }

  const openCreateForm = () => {
    resetForm()
    setNotice('')
    setShowForm(true)
    window.setTimeout(() => nameRef.current?.focus(), 0)
  }

  const openEditForm = (task: ScheduleTask) => {
    setEditing(task)
    setName(task.name)
    setRunAt(task.runAt)
    setRecurrence(task.recurrence)
    setErrors({})
    setNotice('')
    setOperationError('')
    setShowForm(true)
    window.setTimeout(() => nameRef.current?.focus(), 0)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: FormErrors = {}
    if (!name.trim()) { nextErrors.name = '请输入任务名称' }
    else if (name.trim().length > 60) { nextErrors.name = '任务名称不能超过 60 个字符' }
    const timestamp = new Date(runAt).getTime()
    if (!runAt || Number.isNaN(timestamp)) { nextErrors.runAt = '请选择有效的执行时间' }
    else if (timestamp <= Date.now()) { nextErrors.runAt = '执行时间需要晚于当前时间' }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) { return }

    try {
      const input = { name: name.trim(), runAt, recurrence, enabled: editing?.enabled ?? true }
      if (editing) { await repository.update(editing.id, input) }
      else { await repository.create(input) }
      await refresh()
      setShowForm(false)
      resetForm()
      setNotice(editing ? '任务修改已保存到本机' : '任务已保存到本机')
    }
    catch {
      setOperationError('保存失败，请检查浏览器本地存储权限后重试。')
    }
  }

  const handleToggle = async (task: ScheduleTask) => {
    setPendingId(task.id)
    setNotice('')
    try {
      await repository.setEnabled(task.id, !task.enabled)
      await refresh()
    }
    catch {
      setOperationError('状态更新失败，请重试。')
    }
    finally {
      setPendingId(null)
    }
  }

  const handleDelete = async (task: ScheduleTask) => {
    setPendingId(task.id)
    setDeleteCandidateId(null)
    setNotice('')
    try {
      await repository.remove(task.id)
      await refresh()
      setNotice('任务已删除')
    }
    catch {
      setOperationError('删除失败，请重试。')
    }
    finally {
      setPendingId(null)
    }
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target !== event.currentTarget) { return }
    const rect = event.currentTarget.getBoundingClientRect()
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom
    if (!inside) { onClose() }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="schedule-dialog-title"
      className="schedule-dialog m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-2xl border border-[#E8E2E3] bg-[#FFFDFC] p-0 text-[#292326] shadow-2xl backdrop:bg-[#251C1F]/45"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClose={() => {
        if (open) { onClose() }
      }}
      onClick={handleBackdropClick}
    >
      <div className="p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="schedule-dialog-title" className="text-xl font-semibold tracking-tight">定时任务</h2>
              <span className="rounded-full bg-[#F4E9EB] px-2.5 py-1 text-xs font-medium text-[#6F1D28]">本地原型</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#6C6166]">安排政策提醒、信息整理等后续自动化工作。</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#6C6166] transition-colors hover:bg-[#F4EFF0] hover:text-[#7A202C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A202C]"
            aria-label="关闭定时任务"
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-[#E6D8A9] bg-[#FFFAE9] px-4 py-3 text-sm leading-6 text-[#68551C]" role="note">
          当前仅保存任务配置，不会自动执行或离线推送。接入 Dify Workflow 与服务端调度后，才能实现真正的定时运行。
        </div>

        {operationError && <p className="mt-4 rounded-lg bg-[#FCEEEF] px-4 py-3 text-sm text-[#8A2634]" role="alert">{operationError}</p>}
        {notice && <p className="mt-4 rounded-lg bg-[#EDF5EF] px-4 py-3 text-sm text-[#285D3C]" role="status">{notice}</p>}

        {showForm
          ? (
            <form onSubmit={handleSubmit} className="mt-6" noValidate>
              <h3 className="text-base font-semibold">{editing ? '编辑任务' : '新建任务'}</h3>
              <div className="mt-4">
                <label htmlFor="schedule-name" className="text-sm font-medium">任务名称</label>
                <input
                  ref={nameRef}
                  id="schedule-name"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  className={fieldClassName}
                  placeholder="例如：每日汇总奖助学金通知"
                  maxLength={61}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'schedule-name-error' : undefined}
                />
                {errors.name && <p id="schedule-name-error" className="mt-1.5 text-sm text-[#8A2634]" role="alert">{errors.name}</p>}
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="schedule-time" className="text-sm font-medium">首次执行时间</label>
                  <input
                    id="schedule-time"
                    type="datetime-local"
                    value={runAt}
                    onChange={event => setRunAt(event.target.value)}
                    className={fieldClassName}
                    aria-invalid={Boolean(errors.runAt)}
                    aria-describedby={errors.runAt ? 'schedule-time-error' : undefined}
                  />
                  {errors.runAt && <p id="schedule-time-error" className="mt-1.5 text-sm text-[#8A2634]" role="alert">{errors.runAt}</p>}
                </div>
                <div>
                  <label htmlFor="schedule-recurrence" className="text-sm font-medium">重复周期</label>
                  <select id="schedule-recurrence" value={recurrence} onChange={event => setRecurrence(event.target.value as ScheduleRecurrence)} className={fieldClassName}>
                    {Object.entries(RECURRENCE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => { setShowForm(false); resetForm() }} className="min-h-11 cursor-pointer rounded-lg border border-[#D9D4D5] px-5 text-sm font-medium transition-colors hover:bg-[#F5F1F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A202C]">返回列表</button>
                <button type="submit" className="min-h-11 cursor-pointer rounded-lg bg-[#7A202C] px-5 text-sm font-medium text-[#FFFDFC] transition-colors hover:bg-[#641923] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A202C] active:bg-[#52141D]">保存任务</button>
              </div>
            </form>
          )
          : (
            <div className="mt-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-medium text-[#6C6166]">已保存 {tasks.length} 项</h3>
                <button type="button" onClick={openCreateForm} className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg border border-[#CFC4C7] px-3 text-sm font-medium text-[#7A202C] transition-colors hover:border-[#7A202C] hover:bg-[#F8F1F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A202C]">
                  <PlusIcon className="h-4 w-4" aria-hidden="true" />新建任务
                </button>
              </div>

              {tasks.length === 0
                ? (
                  <div className="mt-4 rounded-xl border border-dashed border-[#D8CDD0] px-5 py-9 text-center">
                    <CalendarDaysIcon className="mx-auto h-8 w-8 text-[#8B7077]" aria-hidden="true" />
                    <p className="mt-3 font-medium">还没有定时任务</p>
                    <p className="mt-1 text-sm leading-6 text-[#6C6166]">点击“新建任务”，先保存一项计划配置。</p>
                  </div>
                )
                : (
                  <ul className="mt-4 space-y-3">
                    {tasks.map(task => (
                      <li key={task.id} className="rounded-xl border border-[#E5DEE0] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="break-words font-medium leading-6">{task.name}</p>
                            <p className="mt-2 flex items-start gap-1.5 text-sm leading-5 text-[#6C6166]">
                              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                              <span>{formatRunAt(task.runAt)} · {RECURRENCE_LABELS[task.recurrence]}</span>
                            </p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${task.enabled ? 'bg-[#EDF5EF] text-[#285D3C]' : 'bg-[#F0ECEE] text-[#62575C]'}`}>
                            {task.enabled ? '已启用' : '已停用'}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-[#EEE8EA] pt-2">
                          <button type="button" disabled={pendingId === task.id} onClick={() => void handleToggle(task)} className="min-h-11 cursor-pointer rounded-lg px-3 text-sm font-medium text-[#7A202C] transition-colors hover:bg-[#F6EFF0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7A202C] disabled:cursor-wait disabled:opacity-50">
                            {task.enabled ? '停用' : '启用'}
                          </button>
                          <button type="button" disabled={pendingId === task.id} onClick={() => openEditForm(task)} className="inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-lg px-3 text-sm text-[#574D51] transition-colors hover:bg-[#F5F1F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7A202C] disabled:opacity-50">
                            <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />编辑
                          </button>
                          <button type="button" disabled={pendingId === task.id} onClick={() => { setDeleteCandidateId(task.id); setNotice(''); setOperationError('') }} className="inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-lg px-3 text-sm text-[#8A2634] transition-colors hover:bg-[#FCEEEF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7A202C] disabled:opacity-50">
                            <TrashIcon className="h-4 w-4" aria-hidden="true" />删除
                          </button>
                        </div>
                        {deleteCandidateId === task.id && (
                          <div className="mt-3 rounded-lg bg-[#FCEEEF] p-3 text-sm" role="alert">
                            <p className="text-[#8A2634]">确定删除“{task.name}”吗？此操作无法撤销。</p>
                            <div className="mt-2 flex justify-end gap-2">
                              <button type="button" onClick={() => setDeleteCandidateId(null)} className="min-h-11 cursor-pointer rounded-lg border border-[#D9D4D5] px-4 font-medium transition-colors hover:bg-[#FFFDFC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7A202C]">取消</button>
                              <button type="button" onClick={() => void handleDelete(task)} className="min-h-11 cursor-pointer rounded-lg bg-[#8A2634] px-4 font-medium text-[#FFFDFC] transition-colors hover:bg-[#6F1D28] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7A202C]">确认删除</button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          )}
      </div>
    </dialog>
  )
}

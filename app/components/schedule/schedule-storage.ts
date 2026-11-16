import type { ScheduleRepository, ScheduleTask } from './types'

const STORAGE_KEY = 'zhihui-baixiaosheng.schedules.v1'

function isScheduleTask(value: unknown): value is ScheduleTask {
  if (!value || typeof value !== 'object') { return false }
  const task = value as Partial<ScheduleTask>
  return typeof task.id === 'string'
    && typeof task.name === 'string'
    && typeof task.runAt === 'string'
    && !Number.isNaN(new Date(task.runAt).getTime())
    && ['none', 'daily', 'weekly', 'monthly'].includes(task.recurrence || '')
    && typeof task.enabled === 'boolean'
    && typeof task.createdAt === 'string'
    && typeof task.updatedAt === 'string'
}

function readTasks(): ScheduleTask[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(value) ? value.filter(isScheduleTask) : []
  }
  catch {
    return []
  }
}

function writeTasks(tasks: ScheduleTask[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function createId() {
  return globalThis.crypto?.randomUUID?.() || `schedule-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/**
 * Browser-only adapter. Replace this repository with a Dify Workflow/API adapter
 * without changing the dialog or its form model when server scheduling is ready.
 */
export const localScheduleRepository: ScheduleRepository = {
  async list() {
    return readTasks().sort((a, b) => a.runAt.localeCompare(b.runAt))
  },

  async create(input) {
    const now = new Date().toISOString()
    const task: ScheduleTask = { ...input, id: createId(), createdAt: now, updatedAt: now }
    writeTasks([...readTasks(), task])
    return task
  },

  async update(id, input) {
    const tasks = readTasks()
    const index = tasks.findIndex(task => task.id === id)
    if (index < 0) { throw new Error('未找到这项定时任务') }
    const task = { ...tasks[index], ...input, updatedAt: new Date().toISOString() }
    tasks[index] = task
    writeTasks(tasks)
    return task
  },

  async setEnabled(id, enabled) {
    const task = readTasks().find(item => item.id === id)
    if (!task) { throw new Error('未找到这项定时任务') }
    return this.update(id, {
      name: task.name,
      runAt: task.runAt,
      recurrence: task.recurrence,
      enabled,
    })
  },

  async remove(id) {
    writeTasks(readTasks().filter(task => task.id !== id))
  },
}

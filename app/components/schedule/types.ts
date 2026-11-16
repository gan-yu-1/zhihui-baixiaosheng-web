export type ScheduleRecurrence = 'none' | 'daily' | 'weekly' | 'monthly'

export interface ScheduleTask {
  id: string
  name: string
  runAt: string
  recurrence: ScheduleRecurrence
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface ScheduleTaskInput {
  name: string
  runAt: string
  recurrence: ScheduleRecurrence
  enabled: boolean
}

export interface ScheduleRepository {
  list: () => Promise<ScheduleTask[]>
  create: (input: ScheduleTaskInput) => Promise<ScheduleTask>
  update: (id: string, input: ScheduleTaskInput) => Promise<ScheduleTask>
  setEnabled: (id: string, enabled: boolean) => Promise<ScheduleTask>
  remove: (id: string) => Promise<void>
}

export const RECURRENCE_LABELS: Record<ScheduleRecurrence, string> = {
  none: '仅一次',
  daily: '每天',
  weekly: '每周',
  monthly: '每月',
}

import type { AppInfo } from '@/types/app'
export const APP_ID = process.env.NEXT_PUBLIC_APP_ID?.trim() || ''
export const API_KEY = process.env.NEXT_PUBLIC_APP_KEY?.trim() || ''
export const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || ''
// The keyless local preview is explicit and never sends requests to Dify.
export const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  || (process.env.NEXT_PUBLIC_DEMO_MODE !== 'false' && !API_KEY)
export const APP_INFO: AppInfo = {
  title: '郑大百晓生',
  description: '郑州大学校园政策、办事指引与生活服务智能助手，让信息查找更清晰，让校园办事更简单。',
  copyright: '郑大百晓生项目组',
  privacy_policy: '',
  default_language: 'zh-Hans',
  disable_session_same_site: false, // set it to true if you want to embed the chatbot in an iframe
}

export const isShowPrompt = false
export const promptTemplate = 'I want you to act as a javascript console.'

export const API_PREFIX = '/api'

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48

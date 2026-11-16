import type { ChatItem, ConversationItem } from '@/types/app'

export const DEMO_CONVERSATION_ID = 'demo-campus-guide'

export const DEMO_SUGGESTIONS = [
  '如何查找奖助学金申请政策？',
  '校园办事流程可以从哪里了解？',
  '如何订阅校园政策更新？',
]

export function getDemoConversations(): ConversationItem[] {
  return [{
    id: DEMO_CONVERSATION_ID,
    name: '校园咨询界面示例',
    inputs: {},
    introduction: '你好，我是郑大百晓生。当前为界面演示，正式答复将在接入 Dify 后生成。',
    suggested_questions: DEMO_SUGGESTIONS,
  }]
}

const localDemoSessions = new Map<string, ChatItem[]>()

export function saveDemoChatList(conversationId: string, chatList: ChatItem[]) {
  localDemoSessions.set(conversationId, chatList)
}

export function getDemoChatList(conversationId: string): ChatItem[] {
  const localSession = localDemoSessions.get(conversationId)
  if (localSession) { return localSession }
  if (conversationId !== DEMO_CONVERSATION_ID) { return [] }
  return [
    {
      id: 'demo-opening',
      content: getDemoConversations()[0].introduction,
      isAnswer: true,
      feedbackDisabled: true,
      suggestedQuestions: DEMO_SUGGESTIONS,
    },
    {
      id: 'demo-question',
      content: '如何查找奖助学金申请政策？',
      isAnswer: false,
    },
    {
      id: 'demo-answer',
      content: '这是**前端界面演示**，校园回答仅作示例，不是校园政策的正式答复。\n\n接入 Dify 后，智能体将根据已配置的校园知识库和工作流回应此类问题，并提供相应的办事指引。',
      isAnswer: true,
      feedbackDisabled: true,
      suggestedQuestions: DEMO_SUGGESTIONS.slice(1),
    },
  ]
}

export async function createDemoReply(query: string): Promise<string> {
  await new Promise(resolve => window.setTimeout(resolve, 650))
  return `已收到你的问题：“${query}”。\n\n当前为**前端演示模式**，这条回复仅用于验证对话交互，不代表校园政策的正式答复。\n\n配置 Dify API Key 后，此处将调用已发布的智能体，返回真实的知识库检索与工作流结果。`
}

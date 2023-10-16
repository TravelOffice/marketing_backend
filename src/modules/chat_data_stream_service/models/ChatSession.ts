import { BaseDdbModel } from 'common-models';

export interface ChatSession extends BaseDdbModel {
  conversationId: string,
  assigneeId: string,
  startTime: number,
  endTime?: number,
  status: string, // OPEN ACTIVE CLOSED
  duration?: number,
  responseTime?: number,
  latestMessage?: string,
}

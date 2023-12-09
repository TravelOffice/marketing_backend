import { BaseDdbModel, ChatPlatform } from 'common-models';

// eslint-disable-next-line no-shadow
export enum ChatSessionStatus {
  OPEN = 'OPEN', // Waiting for a sale to reply
  ACTIVE = 'ACTIVE', // Sale is replying to the customer
  CLOSED = 'CLOSED', // Sale has closed the session
}

export interface ChatSession extends BaseDdbModel {
  code: string,
  conversationId: string,
  assigneeId: string,
  assigneeName: string,
  status: ChatSessionStatus,
  startTime: number,
  endTime?: number,
  responseTime?: number, // in seconds
  duration?: number, // in seconds
  platform: ChatPlatform
}

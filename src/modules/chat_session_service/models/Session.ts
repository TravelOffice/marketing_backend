import { BaseDdbModel } from 'common-models';

// eslint-disable-next-line no-shadow
export enum ChatSessionStatus {
  OPEN = 'OPEN', // Waiting for a sale to reply
  ACTIVE = 'ACTIVE', // Sale is replying to the customer
  CLOSED = 'CLOSED', // Sale has closed the session
}

export interface Session extends BaseDdbModel {
  code: string,
  conversationId: string,
  assigneeId: string,
  assigneeName: string,
  status: ChatSessionStatus,
  startTime: number,
  endTime: number,
  responseTime: number, // in seconds
  latestMessage: string,
  duration: number, // in seconds
}

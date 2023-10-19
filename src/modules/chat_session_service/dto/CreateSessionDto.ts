import { ChatSession } from '../models/ChatSession';

export type CreateSessionDto = Pick<ChatSession,
  'code' |
  'conversationId' |
  'startTime' |
  'assigneeId' |
  'assigneeName' |
  'status' |
  'createdAt' |
  'updatedAt'
>

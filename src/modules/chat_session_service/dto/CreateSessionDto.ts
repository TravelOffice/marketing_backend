import { Session } from '../models/Session';

export type CreateSessionDto = Pick<Session,
  'code' |
  'conversationId' |
  'startTime' |
  'assigneeId' |
  'assigneeName' |
  'status' |
  'createdAt' |
  'updatedAt'
>

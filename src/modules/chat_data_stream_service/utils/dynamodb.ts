import {
  CHAT_SESSION_INDEX,
  CONVERSATION_INDEX,
  TENANT_INDEX,
} from './constants';

export function isChatConversation(pk: string): boolean {
  const regex = new RegExp(`^${TENANT_INDEX}#.*#${CONVERSATION_INDEX}`);
  return regex.test(pk);
}

export function isChatSession(pk: string): boolean {
  const regex = new RegExp(`^${TENANT_INDEX}#.*#${CHAT_SESSION_INDEX}$`);
  return regex.test(pk);
}

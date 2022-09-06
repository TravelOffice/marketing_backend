import { saleAssignmentRepository } from 'auto-assign-utilities';
import { ChatPlatform } from 'common-models';
import AppSyncHandlerFactory from './handlers/AppSyncHandlerFactory';
import { AppSyncEvent, SendMessageMutationArgs } from './models';
import { chatPlatformRepository, rolePermissionRepository, userRepository } from './repositories';
import { VALIDATION_EVENTS } from './utils/constants';
import logger from './utils/logger';

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event: AppSyncEvent) => {
  const appSyncHandler = AppSyncHandlerFactory.get(event);
  const { field: eventField, tenant, username } = event;
  logger.log(JSON.stringify(event, null, 2));
  // Validate reading conversation message permissions
  const index = VALIDATION_EVENTS.indexOf(eventField);
  if (index >= 0) {
    const chatPlatform = Object.values(ChatPlatform)[index];
    const { conversationId, pageId } = event.arguments;
    const userAttributes = await userRepository.getUserAttributes(tenant, username);
    if (!userAttributes) throw new Error(`Your account [${username}] not existed!`);
    const { roles } = userAttributes;
    const assignee = await
    chatPlatformRepository.getConversationsAssignee(tenant, pageId, conversationId, chatPlatform);
    if (!await rolePermissionRepository.hasPermission(tenant, roles, 'view_all_conversations')
      && username !== assignee) {
      throw new Error('You do not have permission');
    }
  }

  const data = await appSyncHandler.handle(event);
  // Post-handle send message event
  // Send task token to StepFunctions to stop auto assignment process
  if (eventField === 'sendMessage') {
    logger.log('Start sending task token to StepFunctions to stop auto assignment process if needed');
    const { conversationId, chatPlatform, sender } = event.arguments as SendMessageMutationArgs;
    await saleAssignmentRepository.onSentMessageToCustomer(
      tenant,
      chatPlatform,
      sender,
      conversationId,
    );
  }
  logger.log(`Executed AWS AppSync event with arguments ${JSON.stringify(event.arguments, null, 2)}`);
  return data;
};

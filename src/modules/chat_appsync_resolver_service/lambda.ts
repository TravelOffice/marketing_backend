import { saleAssignmentRepository } from 'auto-assign-utilities';
import AppSyncHandlerFactory from './handlers/AppSyncHandlerFactory';
import { AppSyncEvent, SendMessageMutationArgs } from './models';
import logger from './utils/logger';

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event: AppSyncEvent) => {
  const appSyncHandler = AppSyncHandlerFactory.get(event);
  const { field: eventField, tenant } = event;
  const { chatPlatform, conversationId, recipient } = event.arguments as SendMessageMutationArgs;

  const data = await appSyncHandler.handle(event);
  // Post-handle send message event
  // Send task token to StepFunctions to stop auto assignment process
  if (eventField === 'sendMessage') {
    logger.log('Start sending task token to StepFunctions to stop auto assignment process if needed');
    await saleAssignmentRepository.onSentMessageToCustomer(
      tenant,
      chatPlatform,
      recipient,
      conversationId,
    );
  }
  logger.log(`Executed AWS AppSync event, returned data ${JSON.stringify(data, null, 2)}`);
  return data;
};

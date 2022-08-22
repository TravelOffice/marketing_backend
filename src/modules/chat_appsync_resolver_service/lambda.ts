import { saleAssignmentRepository } from 'auto-assign-utilities';
import AppSyncHandlerFactory from './handlers/AppSyncHandlerFactory';
import { AppSyncEvent, SendMessageMutationArgs } from './models';

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event: AppSyncEvent) => {
  const appSyncHandler = AppSyncHandlerFactory.get(event);
  const { field: eventField, tenant } = event;
  const { chatPlatform, conversationId, recipient } = event.arguments as SendMessageMutationArgs;

  const data = await appSyncHandler.handle(event);
  // Post-handle send message event
  // Send task token to StepFunctions to stop auto assignment process
  if (eventField === 'sendMessage') {
    await saleAssignmentRepository.onSentMessageToCustomer(
      tenant,
      chatPlatform,
      recipient,
      conversationId,
    );
  }
  return data;
};

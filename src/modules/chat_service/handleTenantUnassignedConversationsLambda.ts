import { saleAssignmentRepository } from 'auto-assign-utilities';
import { chatRepository } from './repositories';
import logger from './utils/logger';

export const handler = async (tenant: string) => {
  logger.log(`[handleTenantUnassignedConversationsLambda] Process for tenant ${tenant}`);
  try {
    const unassignConversations = await chatRepository.getUnassignedConversation(tenant);
    // Send to SQS message to process auto assignment
    await Promise.all(unassignConversations.map(
      async (conversation) => saleAssignmentRepository.notifyNewIncomingConversation(conversation),
    ));
  } catch (error: any) {
    logger.log(`[handleUnassignedConversationsLambda] Error ${error}`);
  }
};

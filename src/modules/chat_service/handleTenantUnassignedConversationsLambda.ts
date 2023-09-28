import { saleAssignmentRepository } from 'auto-assign-utilities';
import { chatRepository, pageRepository } from './repositories';
import logger from './utils/logger';

export const handler = async (tenant: string) => {
  logger.log(`[handleTenantUnassignedConversationsLambda] Process for tenant ${tenant}`);
  try {
    let unassignConversations = await chatRepository.getUnassignedConversations(tenant);

    // Get list of linked page
    const linkedPages = await pageRepository.list(tenant);
    const platforms = linkedPages.map((page) => page.platform);
    // Filter the unassign conversations by the linked page
    // Only send to SQS message for the linked page
    unassignConversations = unassignConversations.filter(
      (conversation) => platforms.includes(conversation.chatPlatform),
    );

    // Send to SQS message to process auto assignment
    await Promise.all(unassignConversations.map(
      async (conversation) => saleAssignmentRepository.notifyNewIncomingConversation(conversation),
    ));
  } catch (error: any) {
    logger.log(`[handleUnassignedConversationsLambda] Error ${error}`);
  }
};

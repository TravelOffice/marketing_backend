import { InvocationType, lambdaProvider } from 'core';
import { getEnv } from 'get-env';
import { chatRepository } from './repositories';
import logger from './utils/logger';

export const handler = async (event: any, context: any, callback: any) => {
  logger.log(`[handleUnassignedConversationsLambda] Received EventBridge event ${event}`);
  try {
    const tenants = await chatRepository.getListTenantHasUnassignedConversations();
    logger.log(`[handleUnassignedConversationsLambda] Invoke handle unassigned conversation for tenants:  ${JSON.stringify(tenants)}`);
    tenants.map((tenant) => {
      const invokeParams = {
        FunctionName: getEnv('TENANT_HANDLE_UNASSIGNED_CONVERSATION_SERVICE_NAME'),
        InvocationType: 'Event' as InvocationType, // Invoke the function asynchronously
        Payload: Buffer.from(JSON.stringify(tenant)),
      };
      return lambdaProvider.invokeFunction(invokeParams);
    });
  } catch (error: any) {
    logger.log(`[handleUnassignedConversationsLambda] Error ${error}`);
  } finally {
    callback(null, 'Finished');
  }
};

import AWS from 'aws';
import { getEnv } from 'get-env';
import { chatRepository } from './repositories';
import logger from './utils/logger';

const lambda = new AWS.Lambda();

export const handler = async (event: any, context: any, callback: any) => {
  logger.log(`[handleUnassignedConversationsLambda] Received EventBridge event ${event}`);
  try {
    const tenants = await chatRepository.getListTenantHasUnassignedConversations();
    logger.log(`[handleUnassignedConversationsLambda] Invoke handle unassigned conversation for tenants:  ${JSON.stringify(tenants)}`);
    tenants.map((tenant) => {
      const invokeParams: AWS.Lambda.Types.InvocationRequest = {
        FunctionName: getEnv('TENANT_HANDLE_UNASSIGNED_CONVERSATION_SERVICE_NAME'),
        InvocationType: 'Event', // Invoke the function asynchronously
        Payload: JSON.stringify(tenant),
      };
      return lambda.invoke(invokeParams).promise();
    });
  } catch (error: any) {
    logger.log(`[handleUnassignedConversationsLambda] Error ${error}`);
  } finally {
    callback(null, 'Finished');
  }
};

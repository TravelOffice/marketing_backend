import { getAwsSecretValue } from 'get-env';
import { NewConversationInfo } from '../models';
import { sqsProvider } from '../providers';
import { SQS_ID_DELIMITER } from '../utils/constants';
import logger from '../utils/logger';
import { SaleAssignmentRepository } from './interfaces/SaleAssignmentRepository';

export default class SaleAssignmentRepositoryImpl implements SaleAssignmentRepository {
  /**
   * Notify message to automation module that the system has received new conversation
   * System will trigger AWS StepFunctions to execute sale assignment process
   * @param conversationInfor New conversation information
   * including tenant, paltform, conversationid, pageid
   */
  notifyNewIncomingConversation = async (conversationInfor: NewConversationInfo) => {
    // Queue endpoint
    const queueUrl = await getAwsSecretValue('NEW_CONVERSATION_QUEUE_ENDPOINT');
    // Body data
    const queueMessageBody = JSON.stringify(conversationInfor);
    const messageAttributes: { [key: string]: any } = {};
    Object.entries(conversationInfor).forEach(([key, item]) => {
      messageAttributes[`${key}`] = {
        DataType: 'String',
        StringValue: item,
      };
    });
    const { pageId, chatPlatform } = conversationInfor;
    const sendMessageRequest = {
      /**
       * Queue endpoint
       */
      QueueUrl: queueUrl,
      /**
       * Message body json string
       */
      MessageBody: queueMessageBody,
      MessageAttributes: messageAttributes,
      /**
       * This parameter applies only to FIFO (first-in-first-out) queues.
       * The token used for deduplication of sent messages.
       */
      MessageDeduplicationId: conversationInfor.conversationId,
      /**
       * This parameter applies only to FIFO (first-in-first-out) queues.
       */
      MessageGroupId: `${pageId}${SQS_ID_DELIMITER}${chatPlatform}`,
    }
    const queueMessage = await sqsProvider.sendMessage(sendMessageRequest);
    logger.log(`A new SQS message has been pushed with data ${JSON.stringify(queueMessage, null, 4)}`);
  };

  /**
   * Delete message in queue when sale automation process started
   * The automation process is handled by AWS StepFunctions
   * @param receiptHandler Receipt handler of queue message to delete
   * @returns
   */
  onSaleAssignmentAutoProcessStarted = async (
    receiptHandler: string,
  ) => {
    const queueUrl = await getAwsSecretValue('NEW_CONVERSATION_QUEUE_ENDPOINT');
    await sqsProvider.deleteMessage(queueUrl, receiptHandler);
  }
}

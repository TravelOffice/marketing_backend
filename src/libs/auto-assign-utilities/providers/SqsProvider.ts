import AWS from 'aws';
import { getEnv } from 'get-env';
import logger from '../utils/logger';

export type SQSMesssage = AWS.SQS.Message;
export type SQSSendMessageRequest = AWS.SQS.SendMessageRequest;
export type SQSReceiveMessageResult = AWS.SQS.ReceiveMessageResult;

export default class SQSProvider {
  private sqs = new AWS.SQS({ region: getEnv('AWS_REGION') });

  /**
   * Send new message to SQS queue endpoint
   * @param sendMessageRequest Send message request parameters
   * @returns Message data
   */
  sendMessage = async (sendMessageRequest: SQSSendMessageRequest) => {
    // Send message
    const data = await this.sqs.sendMessage(sendMessageRequest).promise();

    logger.log(`Message ${data.MessageId} placed in the Queue: ${sendMessageRequest.QueueUrl}`);

    return data;
  }

  /**
   * Delete message from queue
   * @param queueUrl Queue endpoint
   * @param receiptHandler Receipt handler
   */
  deleteMessage = async (queueUrl: string, receiptHandler: string) => {
    const deleteParams: AWS.SQS.DeleteMessageRequest = {
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandler,
    };

    await this.sqs.deleteMessage(deleteParams).promise();
  }

  /**
   * Get messsages from SQS queue from given queue url
   * @param queueUrl SQS queue endpoint
   * @returns List of messages returned from queue
   */
  getMessages = async (queueUrl: string) => {
    const params = {
      AttributeNames: ['SentTimestamp'],
      MaxNumberOfMessages: 1,
      MessageAttributeNames: ['All'],
      QueueUrl: queueUrl,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 0
    };

    // Get messages
    let messages: SQSMesssage[] = [];
    try {
      // Receive messages from queue
      const data: SQSReceiveMessageResult = await this.sqs.receiveMessage(params).promise();

      // Delete received messages from queue
      await Promise.all(messages.map(async (message) => {
        const deleteParams: AWS.SQS.DeleteMessageRequest = {
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle || '',
        };

        await this.sqs.deleteMessage(deleteParams).promise();
      }));

      messages = data.Messages || [];
    } catch (error) {
      logger.log(`Get queue messages for queue ${queueUrl} error ${error}`);
    }

    logger.log(`Get queue messages for queue ${queueUrl}, data ${JSON.stringify(messages, null, 3)}`);
    return messages;
  }
}

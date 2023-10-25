import {
  DeleteMessageCommand,
  DeleteMessageRequest,
  Message,
  ReceiveMessageCommand,
  ReceiveMessageRequest,
  SendMessageCommand,
  SendMessageRequest,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { getEnv } from 'get-env';
import logger from '../utils/logger';

const client = new SQSClient({ region: getEnv('AWS_REGION') });

export default class SQSProvider {
  /**
   * Send new message to SQS queue endpoint
   * @param sendMessageRequest Send message request parameters
   * @returns Message data
   */
  sendMessage = async (sendMessageRequest: SendMessageRequest) => {
    // Send message
    const command = new SendMessageCommand(sendMessageRequest);
    const data = await client.send(command);

    logger.log(`Message ${data.MessageId} placed in the Queue: ${sendMessageRequest.QueueUrl}`);

    return data;
  };

  /**
   * Delete message from queue
   * @param queueUrl Queue endpoint
   * @param receiptHandler Receipt handler
   */
  deleteMessage = async (queueUrl: string, receiptHandler: string) => {
    const input: DeleteMessageRequest = {
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandler,
    };
    const command = new DeleteMessageCommand(input);
    await client.send(command);
  };

  /**
   * Get messages from SQS queue from given queue url
   * @param queueUrl SQS queue endpoint
   * @returns List of messages returned from queue
   */
  getMessages = async (queueUrl: string) => {
    const input: ReceiveMessageRequest = {
      AttributeNames: ['All'],
      MaxNumberOfMessages: 1,
      MessageAttributeNames: ['All'],
      QueueUrl: queueUrl,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 0,
    };

    // Get messages
    let messages: Message[] = [];
    try {
      // Receive messages from queue
      const data = await client.send(new ReceiveMessageCommand(input));

      // Delete received messages from queue
      await Promise.all(data.Messages!.map(async (message) => {
        const deleteMessageRequest: DeleteMessageRequest = {
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle || '',
        };
        await client.send(new DeleteMessageCommand(deleteMessageRequest));
      }));

      messages = data.Messages || [];
    } catch (error) {
      logger.log(`Get queue messages for queue ${queueUrl} error ${error}`);
    }

    logger.log(`Get queue messages for queue ${queueUrl}, data ${JSON.stringify(messages, null, 3)}`);
    return messages;
  };
}

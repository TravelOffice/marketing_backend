import { print } from 'graphql';
import { gql } from 'graphql-tag';

const receiveMessageGql = gql`
  mutation ReceivedMessageMutation($id: String!, $sender: String!, $recipient: String!, $customerId: String!, $timestamp: AWSTimestamp, $messageData: AWSJSON!, $chatPlatform: String!) {
    receivedMessage(id: $id, sender: $sender, recipient: $recipient, customerId: $customerId, timestamp: $timestamp, messageData: $messageData, chatPlatform: $chatPlatform) {
      data {
        id
        sender
        recipient
        customerId
        timestamp
        messageData
        chatPlatform
      }
      message
    }
  }
`;

export const receiveMessageQuery = print(receiveMessageGql);

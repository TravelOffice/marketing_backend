import { gql } from 'graphql-tag';
import { print } from 'graphql';

const receiveMessageGql = gql`
  mutation ReceivedMessageMutation($id: String!, $sender: String!, $recipient: String!, $customerId: String!, $timestamp: Int, $messageData: AWSJSON!) {
    receivedMessage(id: $id, sender: $sender, recipient: $recipient, customerId: $customerId, timestamp: $timestamp, messageData: $messageData) {
      data {
        id
        sender
        recipient
        customerId
        timestamp
        messageData
      }
      message
    }
  }
`;

export const receiveMessageQuery = print(receiveMessageGql);
import { print } from 'graphql';
import { gql } from 'graphql-tag';

const sendNotificationGql = gql`
  mutation SendNotificationMutation($type: String, $username: String, $tenant: String, $timestamp: AWSTimestamp!, $data: AWSJSON) {
    sendNotification(type: $type, username: $username, tenant: $tenant, timestamp: $timestamp, data: $data) {
      tenant
      username
      type
      timestamp
      data
    }
  }
`;

// eslint-disable-next-line import/prefer-default-export
export const sendNotificationMutation = print(sendNotificationGql);

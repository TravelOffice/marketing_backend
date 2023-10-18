import { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda';
import { dynamoProvider } from 'core';
import { DdbModelChangeType } from './models/dataSubscription/DdbModelChangeType';
import { sendUserNotificationUserCase, subscribeToTopicUseCase, unsubScribeFromTopicUseCase } from './useCases';
import {
  isFollowTourPost,
  isOrganization,
  isTourPost,
  isTourPostComment,
  isTourPostOffer,
  isTourPostRating,
} from './utils/dynamodb';
import logger from './utils/logger';
import { UserNotificationType } from './models/UserNotification';

/**
 * Get model change type from DynamoDB record
 * @param record DynamoDB record
 * @returns Model change type
 */
function getModelChangeType(record: DynamoDBRecord): DdbModelChangeType | undefined {
  // Extract data from record
  const { dynamodb, eventName } = record;
  if (!dynamodb || !dynamodb.Keys) {
    return undefined;
  }
  const marshalledKeys = dynamoProvider.unmarshall(dynamodb.Keys);
  const { pk, sk } = marshalledKeys;

  logger.log(`Data change type ${eventName} with keys pk: ${pk}, sk: ${sk}`);

  if (isOrganization(pk)) {
    return 'ORG';
  }
  if (isTourPost(pk)) {
    return 'POST';
  }
  if (isTourPostOffer(pk)) {
    return 'OFFER';
  }
  if (isTourPostRating(pk)) {
    return 'RATING';
  }
  if (isTourPostComment(pk)) {
    return 'COMMENT';
  }
  if (isFollowTourPost(sk)) {
    return 'FOLLOW';
  }

  return 'OTHER';
}

async function handleSubscribingChange(records: DynamoDBRecord[]): Promise<void> {
  const appType = 'MARKETPLACE';
  const promises: Promise<void>[] = [];

  records.forEach((record) => {
    if (!record.dynamodb?.NewImage) {
      return;
    }

    const modelChangeType = getModelChangeType(record);
    const newModelData = dynamoProvider.unmarshall(record.dynamodb?.NewImage);
    const { tourPostId, authorId, code } = newModelData;

    if (modelChangeType && ['POST', 'OFFER', 'COMMENT', 'FOLLOW'].includes(modelChangeType)) {
      if (record.eventName === 'INSERT') {
        // Notify when tour post is updated or has a new comment
        const topic = tourPostId ? `post_${tourPostId}` : `post_${code}`; // When create new POST, use code instead of tourPostId
        promises.push(subscribeToTopicUseCase.invoke(authorId, appType, `${topic}`));
        logger.log(`Subscribed to '${topic}' for user ${authorId}`);

        if (modelChangeType === 'POST') {
          // Notify when having a new offer or having one offer is canceled
          promises.push(subscribeToTopicUseCase.invoke(authorId, appType, `post_${code}-author`));
          logger.log(`Subscribed to 'post_${code}-author' for user ${authorId}`);
        } else if (modelChangeType === 'OFFER') {
          // Notify when an offer is accepted or rejected
          promises.push(subscribeToTopicUseCase.invoke(authorId, appType, `post_${tourPostId}-offer_${code}`));
          logger.log(`Subscribed to 'post_${tourPostId}-offer_${code}' for user ${authorId}`);
        }
      } else if (record.eventName === 'REMOVE' && modelChangeType === 'FOLLOW') {
        promises.push(unsubScribeFromTopicUseCase.invoke(authorId, appType, `post_${tourPostId}`));
        logger.log(`Unsubscribed from 'post_${tourPostId}' for user ${authorId}`);
      }
    }
  });

  await Promise.all(promises);
}

async function handleNotifications(records: DynamoDBRecord[]) {
  const promises: Promise<void>[] = [];

  records.forEach((record) => {
    if (!record.dynamodb?.NewImage) {
      return;
    }

    const modelChangeType = getModelChangeType(record);
    const newModelData = dynamoProvider.unmarshall(record.dynamodb?.NewImage);
    const { tourPostId, code } = newModelData;

    let topic = '';
    let title = '';
    let body = '';
    let href = '';
    let type = UserNotificationType.POST;

    if (modelChangeType && ['POST', 'OFFER', 'COMMENT'].includes(modelChangeType)) {
      if (record.eventName === 'INSERT') {
        if (modelChangeType === 'OFFER') {
          topic = `post_${tourPostId}-author`;
          type = UserNotificationType.OFFER;
          title = 'Yêu cầu ghép mới';
          body = 'Bài đăng của bạn nhận được một yêu cầu mới';
          href = `/posts/${tourPostId}?offer=${code}`;
        } else if (modelChangeType === 'COMMENT') {
          topic = `post_${tourPostId}`;
          type = UserNotificationType.COMMENT;
          title = 'Bình luận mới';
          body = 'Bài đăng của bạn có bình luận mới';
          href = `/posts/${tourPostId}?comment=${code}`;
        }
      } else if (record.eventName === 'MODIFY') {
        if (modelChangeType === 'POST') {
          topic = `post_${tourPostId}`;
          title = 'Cập nhật mới';
          body = 'Bài đăng có cập nhật mới';
          href = `/posts/${tourPostId}`;
        } else if (modelChangeType === 'OFFER') {
          type = UserNotificationType.OFFER;
          href = `/posts/${tourPostId}?offer=${code}`;
          const { offerStatus } = newModelData;
          if (offerStatus === 'ACCEPTED') {
            topic = `post_${tourPostId}-offer_${code}`;
            title = 'Ghép thành công';
            body = 'Yêu cầu của bạn đã được chấp nhận';
          } else if (offerStatus === 'REJECTED') {
            topic = `post_${tourPostId}-offer_${code}`;
            title = 'Từ chối ghép';
            body = 'Yêu cầu của bạn đã bị từ chối';
          } else if (offerStatus === 'CANCELED') {
            topic = `post_${tourPostId}-author`;
            title = 'Hủy yêu cầu';
            body = 'Có một yêu cầu ghép bị hủy';
          }
        }
      }

      logger.log(`Send notification to - topic: ${topic}, title: ${title}, body: ${body}, hef: ${href}`);

      if (topic !== '') {
        promises.push(sendUserNotificationUserCase.invoke(topic, 'MARKETPLACE', {
          notification: {
            title,
            body,
          },
          data: {
            type,
            read: 'unread',
            href,
          },
        }));
      }
    }
  });

  await Promise.all(promises);
}

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  try {
    const { Records: records } = event;
    logger.log(`Start handling DynamoDB Stream event records ${JSON.stringify(records, null, 5)}`);

    if (!records || records.length === 0) {
      logger.log('No DynamoDB records to handle');
      return;
    }

    // Start handling DynamoDB records to handle notifications
    // * Lambda handles maximum 100 (Batch size setup by Lambda trigger) records at a time
    // Number of records is large enough to reduce infrastructure cost and improve performance

    // 1. Handle subscribe/unsubscribe to FCM topic
    await handleSubscribingChange(records);

    // 2. Handle sending notifications
    await handleNotifications(records);
  } catch (error) {
    logger.log(`Error occurred when handling notifications ${error}`);
  }
};

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
import { marketplaceUserReposity, tourPostRepository } from './repositories';

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

async function handleSubscribingChange(record: DynamoDBRecord): Promise<void> {
  const appType = 'MARKETPLACE';
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
      await subscribeToTopicUseCase.invoke(authorId, appType, `${topic}`);
      logger.log(`Subscribed to '${topic}' for user ${authorId}`);

      if (modelChangeType === 'POST') {
        // Notify when having a new offer or having one offer is canceled
        await subscribeToTopicUseCase.invoke(authorId, appType, `post_${code}-author`);
        logger.log(`Subscribed to 'post_${code}-author' for user ${authorId}`);
      } else if (modelChangeType === 'OFFER') {
        // Notify when an offer is accepted or rejected
        await subscribeToTopicUseCase.invoke(authorId, appType, `post_${tourPostId}-offer_${code}`);
        logger.log(`Subscribed to 'post_${tourPostId}-offer_${code}' for user ${authorId}`);
      }
    } else if (record.eventName === 'REMOVE' && modelChangeType === 'FOLLOW') {
      await unsubScribeFromTopicUseCase.invoke(authorId, appType, `post_${tourPostId}`);
      logger.log(`Unsubscribed from 'post_${tourPostId}' for user ${authorId}`);
    }
  }
}

async function handleNotifications(record: DynamoDBRecord) {
  if (!record.dynamodb?.NewImage) {
    return;
  }

  const modelChangeType = getModelChangeType(record);
  const newModelData = dynamoProvider.unmarshall(record.dynamodb?.NewImage);
  const { tourPostId, code, authorId } = newModelData;

  let topic = '';
  let title = '';
  let body = '';
  let href = '';
  let type = UserNotificationType.POST;

  if (modelChangeType && ['POST', 'OFFER', 'COMMENT'].includes(modelChangeType)) {
    const tourPost = await tourPostRepository.getById(tourPostId);
    if (!tourPost) return;

    const author = await marketplaceUserReposity.getById(authorId);
    if (!author) return;

    let image = author.avatar;

    if (record.eventName === 'INSERT') {
      if (modelChangeType === 'OFFER') {
        // Have new offer for post
        const { commission, totalPax } = newModelData;
        topic = `post_${tourPostId}-author`;
        type = UserNotificationType.OFFER;
        title = `${author?.name} đã gửi yêu cầu ghép tour cho bài đăng ${tourPost.name}`;
        body = `Chiết khấu: ${commission}, Số khách: ${totalPax}`;
        href = `/posts/${tourPostId}?offer=${code}`;//
      } else if (modelChangeType === 'COMMENT') {
        // Have new comment in post
        const { description } = newModelData;
        topic = `post_${tourPostId}`;
        type = UserNotificationType.COMMENT;
        title = `${author?.name} đã bình luận về bài đăng "${tourPost.name}"`;
        body = `${author?.name}: ${description}`;
        href = `/posts/${tourPostId}?comment=${code}`;
      }
    } else if (record.eventName === 'MODIFY') {
      if (modelChangeType === 'POST') {
        // Post was updated
        topic = `post_${tourPostId}`;
        title = `${author?.name} đã cập nhật bài đăng ${tourPost.name}`;
        body = '';
        href = `/posts/${tourPostId}`;
      } else if (modelChangeType === 'OFFER') {
        // Offer is accepted, rejected, canceled or updated
        type = UserNotificationType.OFFER;
        href = `/posts/${tourPostId}?offer=${code}`;
        const { offerStatus } = newModelData;
        const authorOfPost = await marketplaceUserReposity.getById(tourPostId.authorId);
        if (offerStatus === 'ACCEPTED') {
          topic = `post_${tourPostId}-offer_${code}`;
          title = `${authorOfPost?.name} đã chấp nhận yêu cầu ghép cho bài đăng "${tourPost.name}"`;
          body = '';
          image = authorOfPost?.avatar;
        } else if (offerStatus === 'REJECTED') {
          const { rejectReason } = newModelData;
          topic = `post_${tourPostId}-offer_${code}`;
          title = `${authorOfPost?.name} đã từ chối yêu cầu ghép cho bài đăng "${tourPost.name}"`;
          body = `Lí do: ${rejectReason}`;
          image = authorOfPost?.avatar;
        } else if (offerStatus === 'CANCELED') {
          const { canceledReason } = newModelData;
          topic = `post_${tourPostId}-author`;
          title = `${author.name} đã hủy yêu cầu ghép cho bài đăng "${tourPost.name}"`;
          body = `Lí do: ${canceledReason}`;
        } else {
          topic = `post_${tourPostId}-offer_${code}`;
          title = `${authorOfPost?.name} đã cập nhật một yêu cầu ghép cho bài đăng "${tourPost.name}"`;
          body = '';
          image = authorOfPost?.avatar;
        }
      }
    }

    logger.log(`Send notification to - topic: ${topic}, title: ${title}, body: ${body}, hef: ${href}`);

    if (topic !== '') {
      await sendUserNotificationUserCase.invoke(topic, 'MARKETPLACE', {
        notification: {
          title,
          body,
        },
        data: {
          type,
          image,
          read: 'unread',
          href,
        },
      });
    }
  }
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
    // * Lambda handles one record at a time

    // 1. Handle sending notifications
    await handleNotifications(records[0]);

    // 2. Handle subscribe/unsubscribe to FCM topic
    await handleSubscribingChange(records[0]);
  } catch (error) {
    logger.log(`Error occurred when handling notifications ${error}`);
  }
};

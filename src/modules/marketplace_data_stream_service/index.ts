/**
 * This lambda function aims to handle the event from AWS DynamoDB Stream Trigger
 * Following features that this lambda function will handle:
 * - Handle TourPost related event and update statistical data for market place
 * - Handle TourPost related event and update statistical data for each organization
 * - Handle TourPost related event and update statistical data for each sale user
 * - Send notification to user when their post has any new activity such as:
 * + New comment on post thread
 * + Has new user bookmarked or followed on it
 * + Data changed
 * + New offer
 * + Offer approved / rejected / changed and so on
 * + Post expired
 * + And so on
 *
 * TODO: In the future, this lambda function will be splited into multiple lambda functions
 * to handle each specific task. For example, we will have a lambda function to handle:
 * - Handle historical data change on specific data model such as TourPost, Org, Offer
 * and update statistical data for market place
 * - Record new data change to system history table
 * - Make a notification on data changed
 */
import { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda';
import { dynamoProvider } from 'core';
import { Offer } from './models/Offer';
import { DdbModelChangeType } from './models/dataSubscription/DdbModelChangeType';
import { MarketplaceStatistic, MarketplaceStats } from './models/statistic/MarketplaceStatistic';
import { OrganizationsStatistic } from './models/statistic/OrganizationsStatistic';
import { TourPostsStatistic } from './models/statistic/TourPostsStatistic';
import { marketplaceStatisticRepository, organizationStatisticRepository, tourPostStatisticRepository } from './repositories';
import {
  MARKETPLACE_STATISTIC_INDEX,
  PADDING_ZERO_PREFIX_LENGTH,
  STATISTIC_INDEX,
  TOP_TOUR_POST_STATISTIC_INDEX,
} from './utils/constants';
import {
  isOrganization, isTourPost, isTourPostOffer, isTourPostRating,
} from './utils/dynamodb';
import logger from './utils/logger';
import { PostRating } from './models/PostRating';
import { TourPost } from './models/TourPost';
import { TopCommissionTourPost } from './models/statistic/TopCommissionTourPosts';
import { TourPostStatus } from './models/TourPostStatus';
import { padZeroToLeft } from './utils/number';

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
  } if (isTourPost(pk)) {
    return 'POST';
  } if (isTourPostOffer(pk)) {
    return 'OFFER';
  } if (isTourPostRating(pk)) {
    return 'RATING';
  }

  return 'OTHER';
}

/**
 * Handle marketplace statistic change
 * If there is any added data on specific models
 * this function will increase count number of that model
 * * Specific models are: Organization, TourPost, Offer
 *
 * @param records DynamoDB records
 */
async function handleMarketplaceStatisticChange(records: DynamoDBRecord[]): Promise<void> {
  // Get statistic data of the whole marketplace from database
  let marketplaceStatistic = await marketplaceStatisticRepository.getMarketplaceStatistic();
  if (marketplaceStatistic === undefined) {
    const now = Date.now();
    const newMarketplaceStatistic: MarketplaceStatistic = {
      totalOrganizations: 0,
      totalPosts: 0,
      totalOffers: 0,
      pk: STATISTIC_INDEX,
      sk: MARKETPLACE_STATISTIC_INDEX,
      createdAt: now,
      updatedAt: now,
    };
    marketplaceStatistic = await marketplaceStatisticRepository
      .createMarketplaceStatistic(newMarketplaceStatistic);
  } else {
    marketplaceStatistic.updatedAt = Date.now();
  }

  // Re-calculating statistic data of the whole marketplace
  const {
    totalOrganizations,
    totalPosts,
    totalOffers,
    updatedAt,
  } = marketplaceStatistic;
  const stats: MarketplaceStats = {
    totalOrganizations,
    totalPosts,
    totalOffers,
  };
  records.forEach((record) => {
    logger.log(`DynamoDB Record for handling marketplace statistic ${JSON.stringify(record, null, 5)}`);
    const modelChangeType = getModelChangeType(record);
    if (record.eventName === 'INSERT') {
      if (modelChangeType === 'ORG') {
        stats.totalOrganizations += 1;
      } else if (modelChangeType === 'POST') {
        stats.totalPosts += 1;
      } else if (modelChangeType === 'OFFER') {
        stats.totalOffers += 1;
      }
    }
  });

  // Update statistic data of the whole marketplace to database
  logger.log(`Updating new marketplace statistic data ${JSON.stringify(stats)}`);
  await marketplaceStatisticRepository.updateMarketplaceStatistic({ ...stats, updatedAt });
}

async function handleOrganizationsStatisticChange(records: DynamoDBRecord[]): Promise<void> {
  // Attribute to count number of posts, offers or success offer added for each organization
  const orgsChangedStats: OrganizationsStatistic = {};
  records.forEach(async (record) => {
    // New data expected to be added to database
    if (!record.dynamodb?.NewImage) {
      return;
    }

    const modelChangeType = getModelChangeType(record);
    // Expected data model should be TourPost or Offer
    if (modelChangeType !== 'POST' && modelChangeType !== 'OFFER') {
      return;
    }

    const newModelData = dynamoProvider.unmarshall(record.dynamodb?.NewImage) as TourPost & Offer;
    const organization = (newModelData.receivedOrg || newModelData.organization) as string;

    // Check whether organization is valid
    if (!organization) {
      return;
    }

    // Initialize statistic data for organization if it doesn't exist
    if (orgsChangedStats[organization] === undefined) {
      orgsChangedStats[organization] = {
        totalPosts: 0,
        totalOffers: 0,
        totalSuccessOffers: 0,
      };
    }

    // Handle new data added to database
    if (record.eventName === 'INSERT') {
      if (modelChangeType === 'POST') {
        // Handle inserted post for tenant
        orgsChangedStats[organization].totalPosts += 1;
      } else if (modelChangeType === 'OFFER') {
        // Handle insert offer for tenant
        orgsChangedStats[organization].totalOffers += 1;
      }
    } else if (record.eventName === 'MODIFY') { // Handle data changed on database
      // Check whether offer is changed to `ACCEPTED`
      if (modelChangeType === 'OFFER') {
        let previousOffer;
        if (record.dynamodb?.OldImage) {
          previousOffer = dynamoProvider.unmarshall(record.dynamodb?.OldImage) as Offer;
        }
        const offer = newModelData as Offer;
        if (previousOffer?.offerStatus !== offer.offerStatus && offer.offerStatus === 'ACCEPTED') {
          orgsChangedStats[organization].totalSuccessOffers += 1;
        }
      }
    }
  });

  if (Object.keys(orgsChangedStats).length === 0) {
    logger.log('No organization statistic changes needed to handle');
    return;
  }

  logger.log(`Organizations statistics changes needed to handle ${JSON.stringify(orgsChangedStats, null, 5)}`);
  await organizationStatisticRepository.batchUpdateOrganizationsStatistic(orgsChangedStats);
}

async function handleTourPostsStatisticChange(records: DynamoDBRecord[]): Promise<void> {
  // Attribute to count number of offers added for each post
  // as well as total rating of each post and number of users rated for each post
  const tourPostsChangedStats: TourPostsStatistic = {};
  records.forEach(async (record) => {
    // New data expected to be added to database
    if (!record.dynamodb?.NewImage) {
      return;
    }

    const modelChangeType = getModelChangeType(record);
    // Expected data model should be Rating or Offer
    if (
      modelChangeType !== 'RATING'
      && modelChangeType !== 'OFFER'
      && modelChangeType !== 'POST'
    ) {
      return;
    }

    const newModelData = dynamoProvider.unmarshall(record.dynamodb?.NewImage);
    const { tourPostId, linkedToTargetKeys } = newModelData;
    const linkedTargetId = `${linkedToTargetKeys?.pk}#${linkedToTargetKeys?.sk}`;
    const organization = (newModelData.receivedOrg || newModelData.organization) as string;

    // Initialize statistic data for tour post if it doesn't exist
    if (tourPostsChangedStats[tourPostId] === undefined) {
      tourPostsChangedStats[tourPostId] = {
        totalOffers: 0,
        totalRatings: 0,
        numberOfRatings: 0,
        organization,
      };
    }

    // Add lsi to query tour post that linked to target lead or tour template
    tourPostsChangedStats[tourPostId].lsi1 = linkedTargetId;

    // Handle new data added to database
    // * Rating data is not allowed to be changed, so there is no need to handle `MODIFY` event
    if (record.eventName === 'INSERT') {
      if (modelChangeType === 'POST') {
        tourPostsChangedStats[tourPostId].isNewPost = true;
      } else if (modelChangeType === 'OFFER') {
        // Handle inserted offer for post
        tourPostsChangedStats[tourPostId].totalOffers += 1;
      } else if (modelChangeType === 'RATING') {
        // Handle insert offer for tenant
        const rating = newModelData as PostRating;
        tourPostsChangedStats[tourPostId].totalRatings += rating.star;
        tourPostsChangedStats[tourPostId].numberOfRatings += 1;
      }
    }
  });

  if (Object.keys(tourPostsChangedStats).length === 0) {
    logger.log('No tour post statistic changes needed to handle');
    return;
  }

  logger.log(`Tour posts statistics changes needed to handle ${JSON.stringify(tourPostsChangedStats, null, 5)}`);
  await tourPostStatisticRepository.batchUpdateTourPostsStatistic(tourPostsChangedStats);
}

async function handleTopCommissionPosts(records: DynamoDBRecord[]): Promise<void> {
  const tourPostRecords = records.filter((record) => getModelChangeType(record) === 'POST');
  const uniqueTourPostRecords: DynamoDBRecord[] = [];
  // Remove duplicate tour post records with compraing pk, sk
  // and keep record item have sequence number is maximum
  type PkSkType = { pk: string, sk: string };
  tourPostRecords.forEach((record) => {
    // If record is not DynamoDB record, return
    if (!record.dynamodb || !record.dynamodb.Keys) { return; }
    const sequenceNumber = record.dynamodb.SequenceNumber as string;
    const { pk, sk } = dynamoProvider.unmarshall(record.dynamodb.Keys) as PkSkType;

    // Find the same DynamoDB item with maximum sequence number
    // Maximum sequence number means the latest item
    // Because maybe there are some duplicated records in DynamoDB Stream event
    const index = uniqueTourPostRecords.findIndex((item) => {
      if (!item.dynamodb || !item.dynamodb.Keys) { return false; }
      const itemSequenceNumber = item.dynamodb.SequenceNumber as string;
      const { pk: itemPk, sk: itemSk } = dynamoProvider.unmarshall(item.dynamodb.Keys) as PkSkType;
      return sequenceNumber > itemSequenceNumber && pk === itemPk && sk === itemSk;
    });

    if (index < 0) {
      uniqueTourPostRecords.push(record);
    } else {
      uniqueTourPostRecords[index] = record;
    }
  });

  logger.log(`Unique tour post records ${JSON.stringify(uniqueTourPostRecords, null, 5)}`);

  // Data comes from DynamoDB Stream event
  const streamedTourPostIds = uniqueTourPostRecords.map((record) => {
    const pksk = dynamoProvider.unmarshall(record.dynamodb?.Keys!) as { pk: string, sk: string };
    let tourPost;
    let shouldbeDeleted;
    if (record.eventName === 'REMOVE') {
      shouldbeDeleted = true;
    } else if (record.dynamodb?.NewImage) {
      tourPost = dynamoProvider.unmarshall(record.dynamodb?.NewImage!) as TourPost;
      // Only store IN_PROCESS tour post
      if (tourPost.status !== TourPostStatus.IN_PROCESS) { shouldbeDeleted = true; }
    }

    return {
      keys: pksk,
      commission: tourPost?.commission,
      shouldbeDeleted,
    };
  });

  logger.log(`Streamed tour post ids ${JSON.stringify(streamedTourPostIds, null, 5)}`);

  // Items to update
  const updatingItems = streamedTourPostIds
    .filter((item) => !item.shouldbeDeleted && item.commission !== undefined)
    .map((item) => {
      const { keys, commission } = item;
      return {
        pk: TOP_TOUR_POST_STATISTIC_INDEX,
        sk: `${keys.pk}#${keys.sk}`,
        keys,
        commission,
        // In order to sort by commission, we need to pad zero to left of commission
        // Also it should be string type
        lsi1: padZeroToLeft(commission!, PADDING_ZERO_PREFIX_LENGTH),
      } as TopCommissionTourPost;
    });

  // Items to delete
  const deletingItems = streamedTourPostIds
    .filter((item) => item.shouldbeDeleted)
    .map((item) => {
      const { keys } = item;
      return {
        pk: TOP_TOUR_POST_STATISTIC_INDEX,
        sk: `${keys.pk}#${keys.sk}`,
      };
    });

  await tourPostStatisticRepository.batchUpdateTopCommissionTourPosts(updatingItems);
  await tourPostStatisticRepository.batchDeleteTopCommissionTourPosts(deletingItems);
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

    // Start handling DynamoDB records to update statistic data
    // There are two kinds of statistic data:
    // - Statistic data of the whole marketplace - All of orgs, posts, offers.
    // - Statistic data of each organization - All of posts, offers made, success offers made
    // * Lambda handles maximum 100 (Batch size setup by Lambda trigger) records at a time
    // Number of records is large enough to reduce infrastructure cost and improve performance

    // 1. Handle statistic data of the whole marketplace
    await handleMarketplaceStatisticChange(records);

    // 2. Handle statistic data of each organization
    await handleOrganizationsStatisticChange(records);

    // 3. Handle statistic data of each tour post
    await handleTourPostsStatisticChange(records);

    // 4. Handle top Commission posts
    await handleTopCommissionPosts(records);
  } catch (error) {
    logger.log(`Error occurred when handling DynamoDB Stream event ${error}`);
  }
};

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
import { MARKETPLACE_STATISTIC_INDEX, STATISTIC_INDEX } from './utils/constants';
import {
  isOrganization, isTourPost, isTourPostOffer, isTourPostRating,
} from './utils/dynamodb';
import logger from './utils/logger';
import { PostRating } from './models/PostRating';

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
    logger.log(`DynamoDB Record for handling organization statistic ${JSON.stringify(record, null, 5)}`);
    // New data expected to be added to database
    if (!record.dynamodb?.NewImage) {
      logger.log('No new data to handle');
      return;
    }

    const modelChangeType = getModelChangeType(record);
    // Expected data model should be TourPost or Offer
    if (modelChangeType !== 'POST' && modelChangeType !== 'OFFER') {
      logger.log(`Target model is not needed to handle ${modelChangeType}`);
      return;
    }

    const newModelData = dynamoProvider.unmarshall(record.dynamodb?.NewImage);
    const organization = (newModelData.sentOrg || newModelData.organization) as string;

    // Check whether organization is valid
    if (!organization) {
      logger.log('No organization to handle');
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
        const offer = dynamoProvider.unmarshall(record.dynamodb?.NewImage) as Offer;
        if (previousOffer?.offerStatus !== offer.offerStatus && offer.offerStatus === 'ACCEPTED') {
          orgsChangedStats[organization].totalSuccessOffers += 1;
        }
      }
    }
  });
  await organizationStatisticRepository.batchUpdateOrganizationsStatistic(orgsChangedStats);
}

async function handleTourPostsStatisticChange(records: DynamoDBRecord[]): Promise<void> {
  // Attribute to count number of offers added for each post
  // as well as total rating of each post and number of users rated for each post
  const tourPostsChangedStats: TourPostsStatistic = {};
  records.forEach(async (record) => {
    logger.log(`DynamoDB Record for handling organization statistic ${JSON.stringify(record, null, 5)}`);

    // New data expected to be added to database
    if (!record.dynamodb?.NewImage) {
      logger.log('No new data to handle');
      return;
    }

    const modelChangeType = getModelChangeType(record);
    // Expected data model should be Rating or Offer
    if (modelChangeType !== 'RATING' && modelChangeType !== 'OFFER') {
      logger.log(`Target model is not needed to handle ${modelChangeType}`);
      return;
    }

    const newModelData = dynamoProvider.unmarshall(record.dynamodb?.NewImage);
    const { tourPostId } = newModelData;

    // Initialize statistic data for tour post if it doesn't exist
    if (tourPostsChangedStats[tourPostId] === undefined) {
      tourPostsChangedStats[tourPostId] = {
        totalOffers: 0,
        totalRatings: 0,
        numberOfRatings: 0,
      };
    }

    // Handle new data added to database
    // * Rating data is not allowed to be changed, so there is no need to handle `MODIFY` event
    if (record.eventName === 'INSERT') {
      if (modelChangeType === 'OFFER') {
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
  await tourPostStatisticRepository.batchUpdateTourPostsStatistic(tourPostsChangedStats);
}

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  logger.log('Start handling DynamoDB Stream event');
  const { Records: records } = event;
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
};

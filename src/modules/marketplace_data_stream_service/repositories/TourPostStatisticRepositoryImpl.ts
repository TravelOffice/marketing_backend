import { dynamoProvider, logger } from 'core';
import { BatchWriteItemInput, UpdateItemInput } from 'core/providers/dynamodb/DynamoProvider';
import { getAwsSecretValue } from 'get-env';
import { TourPostStats } from '../models/statistic/TourPostStatistic';
import { TourPostsStatistic } from '../models/statistic/TourPostsStatistic';
import { STATISTIC_INDEX, TOUR_POST_STATISTIC_INDEX } from '../utils/constants';
import { isTourPostStatisticChanged } from '../utils/statistic';
import { TourPostStatisticRepository } from './interfaces/TourPostStatisticRepository';
import { DeletingIndexes, TopCommissionTourPost, TopCommissionTourPosts } from '../models/statistic/TopCommissionTourPosts';

export default class TourPostStatisticRepositoryImpl
implements TourPostStatisticRepository {
  /**
   * Batch update TourPosts' statistic
   * Since DynamoDB doesn't support batch update, we have to update each item one by one in parallel
   *
   * @param postsChangedStats TourPosts' statistic changes
   * @returns Promise<void>
   */
  batchUpdateTourPostsStatistic = async (postsChangedStats: TourPostsStatistic) => {
    const statisticTable = await getAwsSecretValue('DYNAMO_STATISTIC_TABLE');
    const promises = Object.keys(postsChangedStats).map(async (tourPostId) => {
      const tourPostStatistic = postsChangedStats[tourPostId];
      // Check if there is any change in TourPost statistic
      if (!isTourPostStatisticChanged(tourPostStatistic)) {
        return;
      }
      // Build update item params and write to database
      const {
        updateExpression,
        expressionNames,
        expressionValues,
      } = this.buildUpdatePostsStatisticParams(tourPostStatistic);
      const params: UpdateItemInput = {
        TableName: statisticTable,
        Key: {
          pk: STATISTIC_INDEX,
          sk: `${TOUR_POST_STATISTIC_INDEX}#${tourPostId}`,
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionNames,
        ExpressionAttributeValues: expressionValues,
        ReturnValues: 'ALL_NEW',
      };
      await dynamoProvider.updateItemWithPrebuiltExpression(params);
    });
    await Promise.all(promises);
    logger.log(`Update TourPosts' statistic successfully with data changes by ${JSON.stringify(postsChangedStats)}`);
  };

  /**
   * Batch update top commission TourPosts
   * Since DynamoDB doesn't support batch update, we have to update each item one by one in parallel
   *
   * @param topCommissionTourPosts Top commission TourPosts
   * @returns Promise<void>
   */
  batchUpdateTopCommissionTourPosts = async (topCommissionTourPosts: TopCommissionTourPosts) => {
    // Check if there is any top commission TourPost to update
    if (!topCommissionTourPosts.length) {
      logger.log('No top commission TourPosts to update');
      return;
    }

    // Start updating top commission TourPosts
    const statisticTable = await getAwsSecretValue('DYNAMO_STATISTIC_TABLE');
    const promises = topCommissionTourPosts.map(async (topCommissionTourPost) => {
      const { pk, sk, ...data } = topCommissionTourPost;
      const {
        updateExpression,
        expressionNames,
        expressionValues,
      } = this.buildUpdateTopComPostParams(data);
      const params: UpdateItemInput = {
        TableName: statisticTable,
        Key: { pk, sk },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionNames,
        ExpressionAttributeValues: expressionValues,
        ReturnValues: 'ALL_NEW',
      };
      await dynamoProvider.updateItemWithPrebuiltExpression(params);
    });
    await Promise.all(promises);
    logger.log(`Update top Commission posts successfully with data changes by ${JSON.stringify(topCommissionTourPosts)}`);
  };

  /**
   * Batch delete top commission TourPosts
   * TourPost statistic will be deleted from statistic table
   * if it is deleted from original table
   * Original table is marketplace table
   *
   * @param deletingIndexes Deleting indexes
   * @returns Promise<void>
   */
  batchDeleteTopCommissionTourPosts = async (deletingIndexes: DeletingIndexes) => {
    // Check if there is any top commission TourPost to delete
    if (!deletingIndexes.length) {
      logger.log('No top commission TourPosts to delete');
      return;
    }

    // Start deleting top commission TourPosts
    const statisticTable = await getAwsSecretValue('DYNAMO_STATISTIC_TABLE');
    const input: BatchWriteItemInput = {
      RequestItems: {
        [statisticTable]: deletingIndexes.map((index) => ({
          DeleteRequest: {
            // `index` contains pk and sk values
            Key: index,
          },
        })),
      },
    };
    await dynamoProvider.batchWriteItem(input);
    logger.log(`Delete top commission posts successfully with indexes ${JSON.stringify(deletingIndexes)}`);
  };

  /**
   * Build update item params including expression, names and values
   *
   * @param postStatistic TourPost statistic
   * @returns Update item params
   * @private
   */
  private buildUpdatePostsStatisticParams = (postStatistic: TourPostStats) => {
    // TODO: Support more propertie types if needed
    // Currently, only number type is supported

    // Build update expression
    const dynamicSetExp = Object
      .keys(postStatistic)
      .map((key) => `#${key} = if_not_exists(#${key}, :defaultValue) + :${key}`)
      .join(', ');
    const updateExpression = `SET ${dynamicSetExp}, createdAt = if_not_exists(createdAt, :createdAt), updatedAt = :updatedAt`;

    // Build expression names and values
    const now = Date.now();
    const expressionNames: Record<string, string> = {};
    const expressionValues: Record<string, any> = {
      ':defaultValue': 0,
      ':createdAt': now,
      ':updatedAt': now,
    };
    Object.keys(postStatistic).forEach((property) => {
      expressionNames[`#${property}`] = property;
      expressionValues[`:${property}`] = postStatistic[property as keyof TourPostStats];
    });
    return { updateExpression, expressionNames, expressionValues };
  };

  private buildUpdateTopComPostParams = (topCommissionPost: Omit<TopCommissionTourPost, 'pk' | 'sk'>) => {
    // TODO: Support more propertie types if needed
    // Currently, only number type is supported

    // Build update expression
    const dynamicSetExp = Object
      .keys(topCommissionPost)
      .map((key) => `#${key} = :${key}`)
      .join(', ');
    const updateExpression = `SET ${dynamicSetExp}, createdAt = if_not_exists(createdAt, :createdAt), updatedAt = :updatedAt`;

    // Build expression names and values
    const now = Date.now();
    const expressionNames: Record<string, string> = {};
    const expressionValues: Record<string, any> = {
      ':createdAt': now,
      ':updatedAt': now,
    };
    Object.keys(topCommissionPost).forEach((property) => {
      expressionNames[`#${property}`] = property;
      expressionValues[`:${property}`] = topCommissionPost[
        property as keyof Omit<TopCommissionTourPost, 'pk' | 'sk'>
      ];
    });
    return { updateExpression, expressionNames, expressionValues };
  };
}

import { dynamoProvider, logger } from 'core';
import { UpdateItemInput } from 'core/providers/dynamodb/DynamoProvider';
import { getAwsSecretValue } from 'get-env';
import { TourPostStats } from '../models/statistic/TourPostStatistic';
import { TourPostsStatistic } from '../models/statistic/TourPostsStatistic';
import { STATISTIC_INDEX, TOUR_POST_STATISTIC_INDEX } from '../utils/constants';
import { isTourPostStatisticChanged } from '../utils/statistic';
import { TourPostStatisticRepository } from './interfaces/TourPostStatisticRepository';

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
      } = this.buildUpdateItemParams(tourPostStatistic);
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
   * Build update item params including expression, names and values
   * @param postStatistic TourPost statistic
   * @returns Update item params
   * @private
   */
  private buildUpdateItemParams = (postStatistic: TourPostStats) => {
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
}

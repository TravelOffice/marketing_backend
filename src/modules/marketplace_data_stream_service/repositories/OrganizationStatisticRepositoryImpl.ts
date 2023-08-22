import { dynamoProvider, logger } from 'core';
import { UpdateItemInput } from 'core/providers/dynamodb/DynamoProvider';
import { getAwsSecretValue } from 'get-env';
import { OrganizationStats } from '../models/statistic/OrganizationStatistic';
import { OrganizationsStatistic } from '../models/statistic/OrganizationsStatistic';
import { ORG_STATISTIC_INDEX, STATISTIC_INDEX } from '../utils/constants';
import { OrganizationStatisticRepository } from './interfaces/OrganizationStatisticRepository';
import { isOrgStatisticChanged } from '../utils/statistic';

export default class OrganizationStatisticRepositoryImpl
implements OrganizationStatisticRepository {
  /**
   * Batch update organizations' statistic
   * Since DynamoDB doesn't support batch update, we have to update each item one by one in parallel
   *
   * @param orgsChangedStats Organizations' statistic changes
   * @returns Promise<void>
   */
  batchUpdateOrganizationsStatistic = async (orgsChangedStats: OrganizationsStatistic) => {
    const statisticTable = await getAwsSecretValue('DYNAMO_STATISTIC_TABLE');
    const promises = Object.keys(orgsChangedStats).map(async (organization) => {
      const orgStatistic = orgsChangedStats[organization];
      // Check if there is any change in organization statistic
      if (!isOrgStatisticChanged(orgStatistic)) {
        return;
      }
      // Build update item params and write to database
      const {
        updateExpression,
        expressionNames,
        expressionValues,
      } = this.buildUpdateItemParams(orgStatistic);
      const params: UpdateItemInput = {
        TableName: statisticTable,
        Key: {
          pk: STATISTIC_INDEX,
          sk: `${ORG_STATISTIC_INDEX}#${organization}`,
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionNames,
        ExpressionAttributeValues: expressionValues,
        ReturnValues: 'ALL_NEW',
      };
      await dynamoProvider.updateItemWithPrebuiltExpression(params);
    });
    await Promise.all(promises);
    logger.log(`Update organizations' statistic successfully with data changes by ${JSON.stringify(orgsChangedStats)}`);
  };

  /**
   * Build update item params including expression, names and values
   * @param orgStatistic Organization statistic
   * @returns Update item params
   * @private
   */
  private buildUpdateItemParams = (orgStatistic: OrganizationStats) => {
    // TODO: Support more propertie types if needed
    // Currently, only number type is supported

    // Build update expression
    const dynamicSetExp = Object
      .keys(orgStatistic)
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
    Object.keys(orgStatistic).forEach((property) => {
      expressionNames[`#${property}`] = property;
      expressionValues[`:${property}`] = orgStatistic[property as keyof OrganizationStats];
    });
    return { updateExpression, expressionNames, expressionValues };
  };
}

import { dynamoProvider } from 'core';
import { getAwsSecretValue } from 'get-env';
import { TOP_TOUR_POST_STATISTIC_INDEX } from '../utils/constants';
import { TourPostStatisticRepository } from './interfaces/TourPostStatisticRepository';

export default class TourPostStatisticRepositoryImpl implements TourPostStatisticRepository {
  listTopCommissionTourPosts = async (limit?: number) => {
    const statisticTable = await getAwsSecretValue('DYNAMO_STATISTIC_TABLE');
    const params = {
      TableName: statisticTable,
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': TOP_TOUR_POST_STATISTIC_INDEX,
      },
    };
    const result = await dynamoProvider.queryPagination(params, { limit, sortDesc: true });
    return result?.data || [];
  };
}

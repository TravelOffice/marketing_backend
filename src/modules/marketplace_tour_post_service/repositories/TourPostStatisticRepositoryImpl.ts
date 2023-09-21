import { dynamoProvider } from 'core';
import { getAwsSecretValue } from 'get-env';
import { STATISTIC_INDEX, TOP_TOUR_POST_STATISTIC_INDEX } from '../utils/constants';
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
    const result = await dynamoProvider.queryPagination(params, { limit, sortType: 'DESC' });
    return result?.data || [];
  };

  getByLeadOrTourTemplateId = async (id: string) => {
    const statisticTable = await getAwsSecretValue('DYNAMO_STATISTIC_TABLE');
    const params = {
      TableName: statisticTable,
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk and lsi1 = :lsi1',
      ExpressionAttributeValues: {
        ':pk': STATISTIC_INDEX,
        ':lsi1': id,
      },
    };
    const [tourPostStatisticItem] = await dynamoProvider.query(params);
    return tourPostStatisticItem;
  };
}

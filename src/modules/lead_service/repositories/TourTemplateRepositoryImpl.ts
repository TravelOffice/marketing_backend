import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { TourTemplateRepository } from './interfaces/TourTemplateRepository';
import { TENANT_INDEX, TOUR_TEMPLATE_INDEX } from '../utils/constants';

export default class TourTemplateRepositoryImpl implements TourTemplateRepository {
  async getTourTemplate(tenantId: string, tourTemplateId: string) {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    return dynamoProvider.getItem(
      table,
      `${TENANT_INDEX}#${tenantId}#${TOUR_TEMPLATE_INDEX}`,
      tourTemplateId,
    );
  }
}

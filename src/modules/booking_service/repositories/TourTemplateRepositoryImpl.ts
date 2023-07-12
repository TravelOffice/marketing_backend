import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, helper } from 'core';
import { TourTemplate } from '../models/tour/TourTemplate';
import { TENANT_INDEX, TOUR_TEMPLATE_INDEX } from '../utils/constants';
import logger from '../utils/logger';
import { TourTemplateRepository } from './interfaces/TourTemplateRepository';

export default class TourTemplateRepositoryImpl
implements TourTemplateRepository {
  /**
   * Retrieves a tour template for a specific tenant and tour template ID.
   * @param tenantId The ID of the tenant.
   * @param tourTemplateId The ID of the tour template.
   * @returns The retrieved tour template with its assigned ID.
   */
  get = async (tenantId: string, tourTemplateId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${TOUR_TEMPLATE_INDEX}`;
    const sk = tourTemplateId;

    logger.log(
      `Retrieving TourTemplate for tenant ${tenantId} with tour template ID [${tourTemplateId}], pk [${pk}], sk [${sk}]`,
    );

    const tourTemplate = await dynamoProvider.getItem<TourTemplate>(table, pk, sk);
    if (!tourTemplate) throw new Error(`Tour Template [${tourTemplateId}] not found`);

    logger.log('TourTemplate retrieved:', tourTemplate);

    return helper.excludeDataFromObject(tourTemplate) as TourTemplate;
  };
}

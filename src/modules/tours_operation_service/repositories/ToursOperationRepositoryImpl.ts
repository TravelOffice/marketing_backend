import { dynamoProvider } from 'core';
import { getAwsSecretValue } from 'get-env';
import { TourPlanReturnedData } from '../api/TourPlanReturnedData';
import { DepartureTour } from '../models/tour/DepartureTour';
import { TourPlan } from '../models/tour/TourPlan';
import { DEPARTURE_TOUR_INDEX, TENANT_INDEX } from '../utils/constants';
import logger from '../utils/logger';
import { ToursOperationRepository } from './interfaces/ToursOperationRepository';
import { TourTracking } from '../models/tour/TourTracking';
import { TourTrackingReturnedData } from '../api/TourTrackingReturnedData';

export default class ToursOperationRepositoryImpl implements ToursOperationRepository {
  /**
   * Get plan for given departure tour
   *
   * @param tenantId Tenant id
   * @param departureTourId Departure tour id
   * @returns Return plan data including departureTourId as code, tourPlan
   */
  async getPlan(tenantId: string, departureTourId: string): Promise<TourPlanReturnedData> {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');

    logger.log(`Retrieving DepartureTour for tenant ${tenantId} with [${departureTourId}]`);

    const item = await dynamoProvider.getItem(
      table,
      `${TENANT_INDEX}#${tenantId}#${DEPARTURE_TOUR_INDEX}`,
      `${departureTourId}`,
    ) as DepartureTour;
    if (!item) throw new Error(`Departure tour [${departureTourId}] not found`);
    logger.log('DepartureTour retrieved:', item);

    const { code, tourPlan } = item;
    return {
      code,
      tourPlan,
    };
  }

  /**
   * Retrieves a departure tour by its ID and tenant from the DynamoDB table.
   *
   * @param tenant - The ID of the tenant.
   * @param id - The ID of the departure tour to retrieve.
   * @returns A Promise that resolves to the retrieved departure tour.
   */
  get = async (
    tenant: string,
    id: string,
  ) => dynamoProvider.getItem<DepartureTour>(
    await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
    `TENANT#${tenant}#DEPARTURE_TOUR`,
    id,
  );

  /**
   * Update plan for given departure tour id
   * All the create new, update, delete plan item actions are handling by client
   * Then, send plan data as array item to update directly to DepartureTour
   *
   * @param tenantId Tenant id
   * @param departureTourId Departure tour id
   * @param tourPlan Tour plan detail
   * @returns Return updated plan data including departureTourId as code, tourPlan
   */
  async updatePlan(
    tenantId: string,
    departureTourId: string,
    tourPlan: TourPlan,
  ): Promise<TourPlanReturnedData> {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const code = departureTourId;
    await dynamoProvider.updateItemWithSetExpression(
      table,
      `${TENANT_INDEX}#${tenantId}#${DEPARTURE_TOUR_INDEX}`,
      `${code}`,
      {
        code,
        tourPlan,
        updatedAt: Date.now(),
      },
    );
    return {
      code,
      tourPlan,
    };
  }

  /**
   * Update tour tracking for given departure tour id
   *
   * @param tenantId Tenant id
   * @param departureTourId Departure tour id
   * @param tourTracking Tour tracking detail
   * @returns Return updated tour tracking data including departureTourId as code, tour tracking
   */
  async updateTourTracking(
    tenantId: string,
    departureTourId: string,
    tourTracking: TourTracking,
  ): Promise<TourTrackingReturnedData> {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const code = departureTourId;
    await dynamoProvider.updateItemWithSetExpression(
      table,
      `${TENANT_INDEX}#${tenantId}#${DEPARTURE_TOUR_INDEX}`,
      `${code}`,
      {
        code,
        tourTracking,
        updatedAt: Date.now(),
      },
    );
    return {
      code,
      tourTracking,
    };
  }

  /**
   * Get tour tracking for given departure tour
   *
   * @param tenantId Tenant id
   * @param departureTourId Departure tour id
   * @returns Return tour tracking data including departureTourId as code, tour tracking
   */
  async getTourTracking(
    tenantId: string,
    departureTourId: string,
  ): Promise<TourTrackingReturnedData> {
    logger.log(`Retrieving DepartureTour for tenant ${tenantId} with [${departureTourId}]`);

    const item = await dynamoProvider.getItem(
      await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      `${TENANT_INDEX}#${tenantId}#${DEPARTURE_TOUR_INDEX}`,
      `${departureTourId}`,
    ) as DepartureTour;
    if (!item) throw new Error(`Departure tour [${departureTourId}] not found`);
    logger.log('DepartureTour retrieved:', item);

    const { code, tourTracking } = item;
    return {
      code,
      tourTracking,
    };
  }
}

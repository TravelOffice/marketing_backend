import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import {
  BOOKING_INDEX,
  DEPARTURE_TOUR_INDEX,
  DEPARTURE_TOUR_STATISTIC_INDEX,
  FILLING_RATIO_STATISTIC_INDEX,
  LEAD_INDEX,
  LOCATION_STATISTIC_INDEX,
  PROFICIENCY_STATISTIC_INDEX,
  PROFIT_STATISTIC_INDEX,
  REVENUE_STATISTIC_INDEX,
  TENANT_INDEX,
  TENANT_STATISTIC_INDEX,
  TOUR_TEMPLATE_STATISTIC_INDEX,
} from '../utils/constants';
import { FilteringDuration } from '../models/FilteringDuration';
import { TenantStatisticRepository } from './interfaces/TenantStatisticRepository';
import {
  FavouriteLocationStatistic,
  FavouriteTourStatistic,
  FillingRatioTourStatistic,
  ProficiencyTourStatistic,
  TenantProfitStatistic,
  TenantRevenueStatistic,
} from '../models/TenantStatistic';
import TourOperationStatus from '../models/TourOperationstatus';

export default class TenantStatisticRepositoryImpl implements TenantStatisticRepository {
  getTotalRevenue = async (tenant: string, filteringDuration?: FilteringDuration) => {
    const pk = `${TENANT_INDEX}#${tenant}`;
    const records = filteringDuration
      ? await this.queryStatisticWithDuration<TenantRevenueStatistic>(
        pk,
        REVENUE_STATISTIC_INDEX,
        filteringDuration,
      )
      : await this.queryStatisticAllTime<TenantRevenueStatistic>(pk, REVENUE_STATISTIC_INDEX);
    return records.reduce((a, b) => a + b.stAt.revenue, 0);
  };

  getTotalProfit = async (tenant: string, filteringDuration?: FilteringDuration) => {
    const pk = `${TENANT_INDEX}#${tenant}`;
    const records = filteringDuration
      ? await this.queryStatisticWithDuration<TenantProfitStatistic>(
        pk,
        PROFIT_STATISTIC_INDEX,
        filteringDuration,
      )
      : await this.queryStatisticAllTime<TenantProfitStatistic>(pk, PROFIT_STATISTIC_INDEX);
    return records.reduce((a, b) => a + b.stAt.profit, 0);
  };

  getTotalLead = async (
    tenant: string,
    filteringDuration?: FilteringDuration | undefined,
  ): Promise<number> => {
    const pk = `${TENANT_INDEX}#${tenant}#${LEAD_INDEX}`;
    const records = filteringDuration
      ? await this.queryStatisticWithDuration(pk, TENANT_STATISTIC_INDEX, filteringDuration)
      : await this.queryStatisticAllTime(pk, TENANT_STATISTIC_INDEX);
    return records.length;
  };

  getTotalBooking = async (
    tenant: string,
    filteringDuration?: FilteringDuration | undefined,
  ): Promise<number> => {
    const pk = `${TENANT_INDEX}#${tenant}#${BOOKING_INDEX}`;
    const records = filteringDuration
      ? await this.queryStatisticWithDuration(pk, TENANT_STATISTIC_INDEX, filteringDuration)
      : await this.queryStatisticAllTime(pk, TENANT_STATISTIC_INDEX);
    return records.length;
  };

  getProficiencyTours = async (
    tenant: string,
    filteringDuration: FilteringDuration,
  ): Promise<ProficiencyTourStatistic[]> => {
    const pk = `${TENANT_INDEX}#${tenant}#${DEPARTURE_TOUR_STATISTIC_INDEX}`;
    return this.queryStatisticWithDuration<ProficiencyTourStatistic>(
      pk,
      PROFICIENCY_STATISTIC_INDEX,
      filteringDuration,
    );
  };

  getFavouriteTours = async (
    tenant: string,
    filteringDuration: FilteringDuration,
  ): Promise<FavouriteTourStatistic[]> => {
    const pk = `${TENANT_INDEX}#${tenant}#${BOOKING_INDEX}`;
    return this.queryStatisticWithDuration<FavouriteTourStatistic>(
      pk,
      TOUR_TEMPLATE_STATISTIC_INDEX,
      filteringDuration,
    );
  };

  geFavouriteLocations = async (
    tenant: string,
    filteringDuration: FilteringDuration,
  ): Promise<FavouriteLocationStatistic[]> => {
    const pk = `${TENANT_INDEX}#${tenant}#${LEAD_INDEX}`;
    return this.queryStatisticWithDuration<FavouriteLocationStatistic>(
      pk,
      LOCATION_STATISTIC_INDEX,
      filteringDuration,
    );
  };

  getFillingRatioOfTours = async (
    tenant: string,
  ): Promise<FillingRatioTourStatistic[]> => {
    const pk = `${TENANT_INDEX}#${tenant}#${DEPARTURE_TOUR_INDEX}`;
    const filteringSk = `${FILLING_RATIO_STATISTIC_INDEX}#${TourOperationStatus.WAITING_FOR_OPERATION}#`;
    return this.queryStatisticAllTime<FillingRatioTourStatistic>(pk, filteringSk);
  };

  private async queryStatisticAllTime<T>(pk: string, filteringSk: string) {
    return dynamoProvider.query<T>({
      TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      IndexName: 'StatisticGSI',
      KeyConditionExpression: 'pk = :pk ADN begins_with(stSk, :sk)',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':sk': `${filteringSk}#`,
      },
    });
  }

  private async queryStatisticWithDuration<T>(
    pk: string,
    filteringSk: string,
    filteringDuration: FilteringDuration,
  ) {
    const { startTime, endTime } = filteringDuration;
    return dynamoProvider.query<T>({
      TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      IndexName: 'StatisticGSI',
      KeyConditionExpression: 'stPk = :pk AND stSk BETWEEN :start AND :end',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':start': `${filteringSk}#${startTime}`,
        ':end': `${filteringSk}#${endTime}`,
      },
    });
  }
}

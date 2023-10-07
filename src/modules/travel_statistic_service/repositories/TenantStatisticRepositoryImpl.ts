import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import {
  BOOKING_INDEX,
  DEPARTURE_TOUR_INDEX,
  LEAD_INDEX,
  LOCATION_INDEX,
  PROFICIENCY_INDEX,
  PROFIT_INDEX,
  REVENUE_INDEX,
  TENANT_INDEX,
} from '../utils/constants';
import { FilteringDuration } from '../models/FilteringDuration';
import { TenantStatisticRepository } from './interfaces/TenantStatisticRepository';
import {
  FavouriteLocationStatistic,
  FillingRatioTourStatistic,
  ProficiencyTourStatistic,
  TenantProfitStatistic,
  TenantRevenueStatistic,
} from '../models/TenantStatistic';

export default class TenantStatisticRepositoryImpl implements TenantStatisticRepository {
  getTotalRevenue = async (tenant: string, filteringDuration?: FilteringDuration) => {
    const pk = `${TENANT_INDEX}#${tenant}#${REVENUE_INDEX}`;
    const records = filteringDuration
      ? await this.queryStatisticWithDuration<TenantRevenueStatistic>(pk, filteringDuration)
      : await this.queryStatisticAllTime<TenantRevenueStatistic>(pk);
    return records.reduce((a, b) => a + b.stAt.revenue, 0);
  };

  getTotalProfit = async (tenant: string, filteringDuration?: FilteringDuration) => {
    const pk = `${TENANT_INDEX}#${tenant}#${PROFIT_INDEX}`;
    const records = filteringDuration
      ? await this.queryStatisticWithDuration<TenantProfitStatistic>(pk, filteringDuration)
      : await this.queryStatisticAllTime<TenantProfitStatistic>(pk);
    return records.reduce((a, b) => a + b.stAt.profit, 0);
  };

  getTotalLead = async (
    tenant: string,
    filteringDuration?: FilteringDuration | undefined,
  ): Promise<number> => {
    const pk = `${TENANT_INDEX}#${tenant}#${LEAD_INDEX}`;
    const records = filteringDuration
      ? await this.queryStatisticWithDuration(pk, filteringDuration)
      : await this.queryStatisticAllTime(pk);
    return records.length;
  };

  getTotalBooking = async (
    tenant: string,
    filteringDuration?: FilteringDuration | undefined,
  ): Promise<number> => {
    const pk = `${TENANT_INDEX}#${tenant}#${BOOKING_INDEX}`;
    const records = filteringDuration
      ? await this.queryStatisticWithDuration(pk, filteringDuration)
      : await this.queryStatisticAllTime(pk);
    return records.length;
  };

  getProficiencyTours = async (
    tenant: string,
    filteringDuration: FilteringDuration,
  ): Promise<ProficiencyTourStatistic[]> => {
    const pk = `${TENANT_INDEX}#${tenant}#${PROFICIENCY_INDEX}`;
    return this.queryStatisticWithDuration<ProficiencyTourStatistic>(pk, filteringDuration);
  };

  geFavouriteLocations = async (
    tenant: string,
    filteringDuration: FilteringDuration,
  ): Promise<FavouriteLocationStatistic[]> => {
    const pk = `${TENANT_INDEX}#${tenant}#${LOCATION_INDEX}`;
    return this.queryStatisticWithDuration<FavouriteLocationStatistic>(pk, filteringDuration);
  };

  getFillingRatioOfTours = async (
    tenant: string,
  ): Promise<FillingRatioTourStatistic[]> => {
    const pk = `${TENANT_INDEX}#${tenant}#${DEPARTURE_TOUR_INDEX}`;
    return this.queryStatisticAllTime<FillingRatioTourStatistic>(pk);
  };

  private async queryStatisticAllTime<T>(pk: string) {
    return dynamoProvider.query<T>({
      TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      IndexName: 'StatisticGSI',
      KeyConditionExpression: 'stPk = :pk',
      ExpressionAttributeValues: {
        ':pk': pk,
      },
    });
  }

  private async queryStatisticWithDuration<T>(
    pk: string,
    filteringDuration: FilteringDuration,
  ) {
    const { startTime, endTime } = filteringDuration;
    return dynamoProvider.query<T>({
      TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      IndexName: 'StatisticGSI',
      KeyConditionExpression: 'stPk = :pk AND stSk BETWEEN :start AND :end',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':start': startTime,
        ':end': endTime,
      },
    });
  }
}

import { dynamoProvider } from 'core';
import { DepartureTourStatistic } from '../../models/statistic/DepartureTourStatistic';
import { MetricName } from '../../models/statistic/analyzer';
import { DepartureTour } from '../../models/tour/DepartureTour';
import { RequiredDynamoDBRecord } from '../../types/dynamodb';
import { DEPARTURE_TOUR_STATISTIC_INDEX, TENANT_STATISTIC_INDEX } from '../../utils/constants';
import AbstractMetricAnalyzer from './AbstractMetricAnalyzer';

export default class DepartureTourMetricAnalyzer extends AbstractMetricAnalyzer {
  inputData: RequiredDynamoDBRecord;

  output?: DepartureTourStatistic;

  constructor(
    metricName: MetricName,
    tenant: string,
    data: RequiredDynamoDBRecord,
  ) {
    super(metricName, tenant);
    this.inputData = data;
  }

  async analyze(): Promise<void> {
    // Old / new DepartureTour data
    const { OldImage, NewImage } = this.inputData.dynamodb;
    const old = dynamoProvider.unmarshall(OldImage) as DepartureTour;
    const current = dynamoProvider.unmarshall(NewImage) as DepartureTour;

    // Analyze statistic data if operationStatus is changed to COMPLETED
    if (old.operationStatus !== current.operationStatus && current.operationStatus === 'COMPLETED') {
      const createdAt = current.createdAt?.toString() || Date.now().toString();
      const {
        totalRevenue: rv,
        totalCost: c,
        totalProfit: pf,
        name: dtN,
        code,
      } = current;
      this.output = {
        pk: `${TENANT_STATISTIC_INDEX}#${this.tenant}#${DEPARTURE_TOUR_STATISTIC_INDEX}`,
        sk: code,
        lsi1: createdAt,
        rv,
        c,
        pf,
        dtN,
      };
    }
  }
}

import { dynamoProvider } from 'core';
import { TourFillingRatioStatistic } from '../../models/statistic/TourFillingRatioStatistic';
import { MetricName } from '../../models/statistic/analyzer';
import { DepartureTour } from '../../models/tour/DepartureTour';
import { RequiredDynamoDBRecord } from '../../types/dynamodb';
import {
  BOOKING_FR_STATISTIC_INDEX,
  PADDING_ZERO_FOR_FILLING_RATIO_PREFIX_LENGTH,
  TENANT_STATISTIC_INDEX,
} from '../../utils/constants';
import { padZeroToLeft } from '../../utils/number';
import AbstractMetricAnalyzer from './AbstractMetricAnalyzer';

export default class TourFillingRatioMetricAnalyzer extends AbstractMetricAnalyzer {
  inputData: RequiredDynamoDBRecord;

  output?: TourFillingRatioStatistic;

  constructor(
    metricName: MetricName,
    tenant: string,
    data: RequiredDynamoDBRecord,
  ) {
    super(metricName, tenant);
    this.inputData = data;
  }

  async analyze(): Promise<void> {
    const ddb = this.inputData.dynamodb;
    const { NewImage, OldImage } = ddb;
    const old = dynamoProvider.unmarshall(OldImage) as DepartureTour;
    const current = dynamoProvider.unmarshall(NewImage) as DepartureTour;

    if (this.inputData.eventName === 'REMOVE') {
      // Statistic data should be deleted
      this.shouldBeDeleted = true;
      const pk = `${TENANT_STATISTIC_INDEX}#${this.tenant}#${BOOKING_FR_STATISTIC_INDEX}`;
      const { code: sk } = old;
      this.output = { pk, sk };
    } else {
      const { code: sk, name: dtN, fillingRatio } = current;
      const pk = `${TENANT_STATISTIC_INDEX}#${this.tenant}#${BOOKING_FR_STATISTIC_INDEX}`;

      // Analyze filling ratio
      const lsi1 = padZeroToLeft(fillingRatio, PADDING_ZERO_FOR_FILLING_RATIO_PREFIX_LENGTH);
      this.output = {
        pk,
        sk,
        lsi1,
        dtN,
      };
    }
  }
}

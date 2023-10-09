import { dynamoProvider } from 'core';
import { Booking } from '../../models/booking/Booking';
import { BookingStatistic } from '../../models/statistic/BookingStatistic';
import { RequiredDynamoDBRecord } from '../../types/dynamodb';
import { BOOKING_STATISTIC_INDEX, TENANT_STATISTIC_INDEX } from '../../utils/constants';
import AbstractMetricAnalyzer from './AbstractMetricAnalyzer';
import { MetricName } from '../../models/statistic/analyzer';

export default class BookingMetricAnalyzer extends AbstractMetricAnalyzer {
  inputData: RequiredDynamoDBRecord;

  output?: BookingStatistic;

  constructor(
    metricName: MetricName,
    tenant: string,
    data: RequiredDynamoDBRecord,
  ) {
    super(metricName, tenant);
    this.inputData = data;
  }

  async analyze(): Promise<void> {
    // Only new Booking data is analyzed
    if (this.inputData.eventName === 'INSERT') {
      const booking = dynamoProvider.unmarshall(this.inputData.dynamodb.NewImage) as Booking;
      const createdAt = booking.createdAt?.toString() || Date.now().toString();
      const {
        tourTemplateId: ttId,
        tourTemplateName: ttN,
        assigneeId, code, totalPayment: totalP,
      } = booking;
      this.output = {
        pk: `${TENANT_STATISTIC_INDEX}#${this.tenant}#${BOOKING_STATISTIC_INDEX}`,
        sk: code,
        lsi1: createdAt,
        lsi2: `${assigneeId}#${createdAt}`,
        ttId,
        ttN,
        totalP,
      };
    }
  }
}

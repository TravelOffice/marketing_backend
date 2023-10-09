import { dynamoProvider } from 'core';
import { Lead } from '../../models/Lead';
import { LeadStatistic } from '../../models/statistic/LeadStatistic';
import { MetricName } from '../../models/statistic/analyzer';
import { RequiredDynamoDBRecord } from '../../types/dynamodb';
import { LEAD_STATISTIC_INDEX, TENANT_STATISTIC_INDEX } from '../../utils/constants';
import AbstractMetricAnalyzer from './AbstractMetricAnalyzer';

export default class LeadMetricAnalyzer extends AbstractMetricAnalyzer {
  inputData: RequiredDynamoDBRecord;

  output?: LeadStatistic;

  constructor(
    metricName: MetricName,
    tenant: string,
    data: RequiredDynamoDBRecord,
  ) {
    super(metricName, tenant);
    this.inputData = data;
  }

  async analyze(): Promise<void> {
    // Only new Lead data is analyzed
    if (this.inputData.eventName === 'INSERT') {
      const lead = dynamoProvider.unmarshall(this.inputData.dynamodb.NewImage) as Lead;
      const createdAt = lead.createdAt?.toString() || Date.now().toString();
      const {
        locationId: lcId, locationName: lcN, assigneeId, code,
      } = lead;
      this.output = {
        pk: `${TENANT_STATISTIC_INDEX}#${this.tenant}#${LEAD_STATISTIC_INDEX}`,
        sk: code,
        lsi1: createdAt,
        lsi2: `${assigneeId}#${createdAt}`,
        lcId,
        lcN,
      };
    }
  }
}

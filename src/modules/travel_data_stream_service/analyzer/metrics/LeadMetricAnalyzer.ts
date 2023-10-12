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

  changeKeys?: string[];

  constructor(
    metricName: MetricName,
    tenant: string,
    data: RequiredDynamoDBRecord,
  ) {
    super(metricName, tenant);
    this.inputData = data;
    this.changeKeys = ['endingLocationCode', 'endingLocationName', 'assigneeId'];
  }

  async analyze(): Promise<void> {
    if (this.inputData.eventName === 'REMOVE') {
      // Statistic data should be deleted
      this.shouldBeDeleted = true;
      const pk = `${TENANT_STATISTIC_INDEX}#${this.tenant}#${LEAD_STATISTIC_INDEX}`;
      const { code: sk } = dynamoProvider.unmarshall(this.inputData.dynamodb.OldImage) as Lead;
      this.output = { pk, sk };
    } else if (this.inputData.eventName === 'INSERT' || this.isChangesDetected) {
      // Add or modify statistic data
      const lead = dynamoProvider.unmarshall(this.inputData.dynamodb.NewImage) as Lead;
      const createdAt = lead.createdAt?.toString() || Date.now().toString();
      const {
        assigneeId, code,
        endingLocationCode: lcId, endingLocationName: lcN,
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

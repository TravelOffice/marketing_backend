import { ChatSession } from '../../models/ChatSession';
import { AssigneeChatSessionStatistic } from '../../models/statistic';
import { MetricName } from '../../models/statistic/analyzer';
import { RequiredDynamoDBRecord } from '../../types/dynamodb';
import {
  ASSIGNEE_CHAT_SESSION_STATISTIC_INDEX,
  DURATION_PADDING_ZERO_LENGTH,
  RESPONSE_PADDING_ZERO_LENGTH,
  TENANT_STATISTIC_INDEX,
} from '../../utils/constants';
import { padZeroToLeft } from '../../utils/number';
import AbstractMetricAnalyzer from './AbstractMetricAnalyzer';

export default class AssigneeChatSessionMetricAnalyzer extends AbstractMetricAnalyzer {
  inputData: RequiredDynamoDBRecord;

  output?: AssigneeChatSessionStatistic;

  constructor(
    metricName: MetricName,
    tenant: string,
    data: RequiredDynamoDBRecord,
  ) {
    super(metricName, tenant);
    this.inputData = data;
  }

  async analyze(): Promise<void> {
    // Pk from Keys
    const { sk } = this.recordKeys;
    if (this.inputData.eventName === 'REMOVE') {
      // Statistic data should be deleted
      this.shouldBeDeleted = true;
      const { assigneeId } = this.oldImage as ChatSession;
      const pk = `${TENANT_STATISTIC_INDEX}#${this.tenant}#${assigneeId}#${ASSIGNEE_CHAT_SESSION_STATISTIC_INDEX}`;
      this.output = { pk, sk };
    } else {
      const {
        assigneeId, startTime, duration, status, responseTime,
      } = this.newImage as ChatSession;
      const pk = `${TENANT_STATISTIC_INDEX}#${this.tenant}#${assigneeId}#${ASSIGNEE_CHAT_SESSION_STATISTIC_INDEX}`;
      this.output = {
        pk,
        sk,
        lsi1: startTime.toString(),
        lsi3: status,
      };

      // Add duration as lsi2 if it exists
      if (duration) {
        this.output.lsi2 = padZeroToLeft(duration, DURATION_PADDING_ZERO_LENGTH);
      }

      // Add responseTime as lsi4 if it exists
      if (responseTime) {
        this.output.lsi4 = padZeroToLeft(responseTime, RESPONSE_PADDING_ZERO_LENGTH);
      }
    }
  }
}

import { ChatSession } from '../../models/ChatSession';
import { OrgChatSessionStatistic } from '../../models/statistic/OrgChatSessionStatistic';
import { MetricName } from '../../models/statistic/analyzer';
import { RequiredDynamoDBRecord } from '../../types/dynamodb';
import {
  DURATION_PADDING_ZERO_LENGTH,
  ORG_CHAT_SESSION_STATISTIC_INDEX,
  RESPONSE_PADDING_ZERO_LENGTH,
  TENANT_STATISTIC_INDEX,
} from '../../utils/constants';
import { padZeroToLeft } from '../../utils/number';
import AbstractMetricAnalyzer from './AbstractMetricAnalyzer';

export default class OrgChatSessionMetricAnalyzer extends AbstractMetricAnalyzer {
  inputData: RequiredDynamoDBRecord;

  output?: OrgChatSessionStatistic;

  constructor(
    metricName: MetricName,
    tenant: string,
    data: RequiredDynamoDBRecord,
  ) {
    super(metricName, tenant);
    this.inputData = data;
  }

  async analyze(): Promise<void> {
    const pk = `${TENANT_STATISTIC_INDEX}#${this.tenant}#${ORG_CHAT_SESSION_STATISTIC_INDEX}`;
    const { sk: sessionId } = this.recordKeys;
    const { conversationId } = this.oldImage as ChatSession;
    const sk = `${conversationId}#${sessionId}`;
    if (this.inputData.eventName === 'REMOVE') {
      // Statistic data should be deleted
      this.shouldBeDeleted = true;
      this.output = { pk, sk };
    } else {
      const {
        startTime, duration, status, responseTime,
      } = this.newImage as ChatSession;
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

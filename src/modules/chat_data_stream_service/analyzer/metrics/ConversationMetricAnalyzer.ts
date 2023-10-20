import { ConversationStatistic } from '../../models/statistic/ConversationStatistic';
import { MetricName } from '../../models/statistic/analyzer';
import { RequiredDynamoDBRecord } from '../../types/dynamodb';
import { CONVERSATION_STATISTIC_INDEX, TENANT_STATISTIC_INDEX } from '../../utils/constants';
import AbstractMetricAnalyzer from './AbstractMetricAnalyzer';

export default class ConversationMetricAnalyzer extends AbstractMetricAnalyzer {
  inputData: RequiredDynamoDBRecord;

  output?: ConversationStatistic;

  constructor(
    metricName: MetricName,
    tenant: string,
    data: RequiredDynamoDBRecord,
  ) {
    super(metricName, tenant);
    this.inputData = data;
  }

  async analyze(): Promise<void> {
    const pk = `${TENANT_STATISTIC_INDEX}#${this.tenant}#${CONVERSATION_STATISTIC_INDEX}`;
    const { pk: conversationPk, sk: conversationSk } = this.recordKeys;
    const [, conversationId] = conversationSk.split('#');
    if (this.inputData.eventName === 'REMOVE') {
      // Statistic data should be deleted
      this.shouldBeDeleted = true;
      this.output = { pk, sk: conversationId };
    } else {
      const [, , , chatPlatform, pageId] = conversationPk.split('#');
      this.output = {
        pk,
        sk: conversationId,
        lsi1: chatPlatform,
        lsi2: pageId,
      };
    }
  }
}

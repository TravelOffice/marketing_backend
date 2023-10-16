import { MetricName, SingleMetricInputData } from '../../models/statistic/analyzer';
import AbstractMetricAnalyzer from './AbstractMetricAnalyzer';
import AssigneeChatSessionMetricAnalyzer from './AssigneeChatSessionMetricAnalyzer';
import ConversationMetricAnalyzer from './ConversationMetricAnalyzer';
import OrgChatSessionMetricAnalyzer from './OrgChatSessionMetricAnalyzer';

export default class MetricAnalyzerBuilder {
  static build(
    metricName: MetricName,
    tenant: string,
    data: SingleMetricInputData,
  ): AbstractMetricAnalyzer {
    switch (metricName) {
      case 'CONVERSATION_METRIC':
        return new ConversationMetricAnalyzer(metricName, tenant, data);

      case 'ORG_SESSION_METRIC':
        return new OrgChatSessionMetricAnalyzer(metricName, tenant, data);

      case 'ASSIGNEE_SESSION_METRIC':
        return new AssigneeChatSessionMetricAnalyzer(metricName, tenant, data);

      default:
        throw new Error(`Unknown metric name: ${metricName}`);
    }
  }
}

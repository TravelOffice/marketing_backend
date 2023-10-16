import { MetricChatAnalyzerResult } from '../../models/statistic/TenantSaleAnalyzerResult';

export interface TenantSaleStatisticRepository {
  batchWriteSaleStatistics(items: MetricChatAnalyzerResult[]): Promise<void>,
  batchDeleteSaleStatistics(items: MetricChatAnalyzerResult[]): Promise<void>,
  deleteStatisticItem(pk: string, sk: string): Promise<void>,
}

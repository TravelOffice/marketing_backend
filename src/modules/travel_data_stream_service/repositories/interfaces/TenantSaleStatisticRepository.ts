import { MetricSaleAnalyzerResult } from '../../models/statistic/TenantSaleAnalyzerResult';

export interface TenantSaleStatisticRepository {
  batchWriteSaleStatistics(items: MetricSaleAnalyzerResult[]): Promise<void>,
  batchDeleteSaleStatistics(items: MetricSaleAnalyzerResult[]): Promise<void>,
  deleteStatisticItem(pk: string, sk: string): Promise<void>,
}

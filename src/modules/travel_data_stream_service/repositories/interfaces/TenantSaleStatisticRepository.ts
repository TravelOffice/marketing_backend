import { MetricSaleAnalyzerResult } from '../../models/statistic/TenantSaleAnalyzerResult';

export interface TenantSaleStatisticRepository {
  batchWriteSaleStatistics(items: MetricSaleAnalyzerResult[]): Promise<void>,
  deleteStatisticItem(pk: string, sk: string): Promise<void>,
}

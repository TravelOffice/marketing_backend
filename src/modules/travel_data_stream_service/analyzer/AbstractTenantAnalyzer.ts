import { TenantSaleAnalyzerResult } from '../models/statistic/TenantSaleAnalyzerResult';
import { MetricInputData } from '../models/statistic/analyzer';

export default abstract class AbstractTenantAnalyzer {
  // Tenant id
  tenant: string;

  // Input data that needs to be analyzed
  abstract inputData: MetricInputData;

  // Output data that is the result of analysis
  abstract output: TenantSaleAnalyzerResult;

  constructor(tenant: string) {
    this.tenant = tenant;
  }

  get analyzedData(): TenantSaleAnalyzerResult {
    return this.output;
  }

  get modifiedItems(): TenantSaleAnalyzerResult {
    return this.output
      .filter((item) => !item.shouldBeDeleted)
      .map((item) => {
        const { shouldBeDeleted, ...rest } = item;
        return rest;
      });
  }

  get deletedItems(): TenantSaleAnalyzerResult {
    return this.output
      .filter((item) => item.shouldBeDeleted)
      .map((item) => {
        const { shouldBeDeleted, ...rest } = item;
        return rest;
      });
  }

  abstract analyze(): Promise<void>;
}

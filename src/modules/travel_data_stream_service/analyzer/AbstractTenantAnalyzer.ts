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

  abstract analyze(): Promise<void>;
}

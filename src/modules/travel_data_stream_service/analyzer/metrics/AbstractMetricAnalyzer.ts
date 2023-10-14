import { MetricSaleAnalyzerResult } from '../../models/statistic/TenantSaleAnalyzerResult';
import { SingleMetricInputData, MetricName } from '../../models/statistic/analyzer';

export default abstract class AbstractMetricAnalyzer {
  // Tenant
  tenant: string;

  // Model to analyze
  metricName: MetricName;

  // Mark as deleted or not
  shouldBeDeleted = false;

  // Input data that needs to be analyzed
  abstract inputData: SingleMetricInputData;

  // Output data that is the result of analysis
  abstract output?: MetricSaleAnalyzerResult;

  constructor(metricName: MetricName, tenant: string) {
    this.metricName = metricName;
    this.tenant = tenant;
  }

  get analyzedValue(): MetricSaleAnalyzerResult | undefined {
    if (this.output) {
      return {
        ...this.output,
        shouldBeDeleted: this.shouldBeDeleted,
      };
    }
    return undefined;
  }

  abstract analyze(): Promise<void>;
}

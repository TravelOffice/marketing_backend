import { dynamoProvider } from 'core';
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

  abstract changeKeys?: string[];

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

  get isChangesDetected(): boolean {
    if (this.changeKeys && this.changeKeys.length > 0) {
      const { OldImage, NewImage } = this.inputData.dynamodb;
      const old = dynamoProvider.unmarshall(OldImage);
      const current = dynamoProvider.unmarshall(NewImage);
      // Any change in changeKeys will be triggered as a change
      for (let i = 0; i < this.changeKeys.length; i += 1) {
        const key = this.changeKeys[i];
        if (old[key] !== current[key]) {
          return true;
        }
      }
      return false;
    }

    // If changeKeys is not defined, we assume that there is a change
    return true;
  }

  abstract analyze(): Promise<void>;
}

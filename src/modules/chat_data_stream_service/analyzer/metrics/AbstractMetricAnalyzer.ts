import { dynamoProvider } from 'core';
import { MetricChatAnalyzerResult } from '../../models/statistic/TenantSaleAnalyzerResult';
import { MetricName, SingleMetricInputData } from '../../models/statistic/analyzer';
import { DdbItemKeys } from '../../models/DdbItemKeys';

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
  abstract output?: MetricChatAnalyzerResult;

  constructor(metricName: MetricName, tenant: string) {
    this.metricName = metricName;
    this.tenant = tenant;
  }

  get analyzedValue(): MetricChatAnalyzerResult | undefined {
    if (this.output) {
      return {
        ...this.output,
        shouldBeDeleted: this.shouldBeDeleted,
      };
    }
    return undefined;
  }

  get newImage(): any {
    const img = this.inputData.dynamodb.NewImage;
    return dynamoProvider.unmarshall(img);
  }

  get oldImage(): any {
    const img = this.inputData.dynamodb.OldImage;
    return dynamoProvider.unmarshall(img);
  }

  get recordKeys(): DdbItemKeys {
    return dynamoProvider.unmarshall(this.inputData.dynamodb.Keys) as DdbItemKeys;
  }

  abstract analyze(): Promise<void>;
}

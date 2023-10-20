import { MetricSaleAnalyzerResult, TenantSaleAnalyzerResult } from '../models/statistic/TenantSaleAnalyzerResult';
import { RequiredDynamoDBRecord } from '../types/dynamodb';
import { getMetricAnalyzers } from '../utils/streamRecords';
import AbstractTenantAnalyzer from './AbstractTenantAnalyzer';

export default class TenantSaleAnalyzer extends AbstractTenantAnalyzer {
  // Records to be analyzed
  inputData: RequiredDynamoDBRecord[];

  // Output data contains all metric analyzers' output
  output: TenantSaleAnalyzerResult;

  constructor(tenant: string, data: RequiredDynamoDBRecord[]) {
    super(tenant);
    this.inputData = data;
    this.output = [];
  }

  async analyze(): Promise<void> {
    const analyzers = getMetricAnalyzers(this.tenant, this.inputData);
    const promises = analyzers.map(async (analyzer) => {
      await analyzer.analyze();
      return analyzer.analyzedValue;
    });
    const results = await Promise.all(promises);
    this.output = results.filter((item) => item !== undefined) as MetricSaleAnalyzerResult[];
  }
}

import { TenantSaleStatistic } from '../models/statistic/TenantSaleStatistic';

export default abstract class AbstractTenantAnalyzer {
  tenant: string;

  constructor(tenant: string) {
    this.tenant = tenant;
  }

  abstract get analyzedData(): TenantSaleStatistic;

  abstract analyze(): Promise<void>;
}

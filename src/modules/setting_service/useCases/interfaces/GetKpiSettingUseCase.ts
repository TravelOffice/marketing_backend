import { KpiPeriod } from '../../models/kpi/KpiPeriod';
import { KpiSetting } from '../../models/kpi/KpiSetting';
import { OrgKpiMetric } from '../../models/kpi/OrgKpiType';

export interface GetKpiSettingUseCase {
  invoke(
    tenant: string,
    kpiMetric: OrgKpiMetric,
    period: KpiPeriod,
  ): Promise<Partial<KpiSetting> | undefined>,
}

import { CreateKpiSettingDto } from '../../models/dto/CreateKpiSettingDto';
import { KpiPeriod } from '../../models/kpi/KpiPeriod';
import { KpiSetting } from '../../models/kpi/KpiSetting';
import { OrgKpiMetric } from '../../models/kpi/OrgKpiType';

export interface KpiSettingRepository {
  create(
    tenant: string,
    kpiSetting: CreateKpiSettingDto,
  ): Promise<Partial<KpiSetting>>,

  get(
    tenant: string,
    metricName: OrgKpiMetric,
    period: KpiPeriod,
  ): Promise<Partial<KpiSetting> | undefined>,

  updateKpiSettingTarget(
    tenant: string,
    metricName: OrgKpiMetric,
    period: KpiPeriod,
    newTargetValue: number,
  ): Promise<Partial<KpiSetting> | undefined>,
}

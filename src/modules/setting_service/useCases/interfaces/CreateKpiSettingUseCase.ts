import { CreateKpiSettingDto } from '../../models/dto/CreateKpiSettingDto';
import { KpiSetting } from '../../models/kpi';

export interface CreateKpiSettingUseCase {
  invoke(tenant: string, kpiSetting: CreateKpiSettingDto): Promise<Partial<KpiSetting>>,
}

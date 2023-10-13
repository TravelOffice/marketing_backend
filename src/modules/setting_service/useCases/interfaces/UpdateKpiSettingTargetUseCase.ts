import { UpdateKpiSettingTargetDto } from '../../models/dto/UpdateKpiSettingTargetDto';
import { KpiSetting } from '../../models/kpi';

export interface UpdateKpiSettingTargetUseCase {
  invoke(
    tenant: string,
    updateKpiTarget: UpdateKpiSettingTargetDto,
  ): Promise<Partial<KpiSetting> | undefined>,
}

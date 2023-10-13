import { UpdateKpiSettingTargetDto } from '../models/dto/UpdateKpiSettingTargetDto';
import { kpiSettingRepository } from '../repositories';
import logger from '../utils/logger';
import { UpdateKpiSettingTargetUseCase } from './interfaces/UpdateKpiSettingTargetUseCase';

export default class UpdateKpiSettingTargetUseCaseImpl implements UpdateKpiSettingTargetUseCase {
  invoke = async (tenant: string, updateKpiSettingDto: UpdateKpiSettingTargetDto) => {
    const { kpiMetric, kpiValue, period } = updateKpiSettingDto;
    const kpiSetting = await kpiSettingRepository.updateKpiSettingTarget(
      tenant,
      kpiMetric,
      period,
      kpiValue,
    );

    logger.log(`Updated kpi setting for tenant ${tenant} with data: ${JSON.stringify(kpiSetting)}`);
    return kpiSetting;
  };
}

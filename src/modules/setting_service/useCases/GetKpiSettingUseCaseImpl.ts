import { KpiPeriod, OrgKpiMetric } from '../models/kpi';
import { kpiSettingRepository } from '../repositories';
import logger from '../utils/logger';
import { GetKpiSettingUseCase } from './interfaces/GetKpiSettingUseCase';

export default class GetKpiSettingUseCaseImpl implements GetKpiSettingUseCase {
  invoke = async (tenant: string, kpiMetric: OrgKpiMetric, period: KpiPeriod) => {
    const kpiSetting = await kpiSettingRepository.get(tenant, kpiMetric, period);

    logger.log(`Get kpi setting for tenant ${tenant} with data: ${JSON.stringify(kpiSetting)}`);
    return kpiSetting;
  };
}

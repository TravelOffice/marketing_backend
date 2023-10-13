import { CreateKpiSettingDto } from '../models/dto/CreateKpiSettingDto';
import { kpiSettingRepository } from '../repositories';
import logger from '../utils/logger';
import { CreateKpiSettingUseCase } from './interfaces/CreateKpiSettingUseCase';

export default class CreateKpiSettingUseCaseImpl implements CreateKpiSettingUseCase {
  invoke = async (tenant: string, createTourPostDto: CreateKpiSettingDto) => {
    const kpiSetting = await kpiSettingRepository.create(tenant, createTourPostDto);

    logger.log(`Created new kpi setting for tenant ${tenant} with data: ${JSON.stringify(kpiSetting)}`);
    return kpiSetting;
  };
}

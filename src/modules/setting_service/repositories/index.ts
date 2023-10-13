import KpiSettingRepositoryImpl from './KpiSettingRepositoryImpl';
import { KpiSettingRepository } from './interfaces/KpiSettingRepository';

interface Repositories {
  kpiSettingRepository: KpiSettingRepository,
}

const repositories: Repositories = {
  kpiSettingRepository: new KpiSettingRepositoryImpl(),
};

export const {
  kpiSettingRepository,
} = repositories;

import TenantSaleStatisticRepositoryImpl from './TenantSaleStatisticRepositoryImpl';
import { TenantSaleStatisticRepository } from './interfaces/TenantSaleStatisticRepository';

interface Repositories {
  tenantSaleStatisticRepository: TenantSaleStatisticRepository,
}

const repositories: Repositories = {
  tenantSaleStatisticRepository: new TenantSaleStatisticRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  tenantSaleStatisticRepository,
} = repositories;

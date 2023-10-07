// TODO: Declare repository objects which can be used in this service here

import TenantSaleStatisticRepositoryImpl from './TenantStatisticRepositoryImpl';
import { SaleStatisticRepository } from './interfaces/SaleStatisticRepository';
import SaleStatisticRepositoryImpl from './SaleStatisticRepositoryImpl';
import { TenantStatisticRepository } from './interfaces/TenantStatisticRepository';

interface Repositories {
  tenantStatisticRepository: TenantStatisticRepository,
  saleStatisticRepository: SaleStatisticRepository,
}

const repositories: Repositories = {
  tenantStatisticRepository: new TenantSaleStatisticRepositoryImpl(),
  saleStatisticRepository: new SaleStatisticRepositoryImpl(),
};

export const {
  tenantStatisticRepository,
  saleStatisticRepository,
} = repositories;

import SaleStatisticRepositoryImpl from './SaleStatisticRepositoryImpl';
import TenantChatStatisticRepositoryImpl from './TenantChatStatisticRepositoryImpl';
import TenantSaleStatisticRepositoryImpl from './TenantStatisticRepositoryImpl';
import { SaleStatisticRepository } from './interfaces/SaleStatisticRepository';
import { TenantChatStatisticRepository } from './interfaces/TenantChatStatisticRepository';
import { TenantStatisticRepository } from './interfaces/TenantStatisticRepository';

interface Repositories {
  tenantStatisticRepository: TenantStatisticRepository,
  saleStatisticRepository: SaleStatisticRepository,
  tenantChatStatisticRepository: TenantChatStatisticRepository,
}

const repositories: Repositories = {
  tenantStatisticRepository: new TenantSaleStatisticRepositoryImpl(),
  saleStatisticRepository: new SaleStatisticRepositoryImpl(),
  tenantChatStatisticRepository: new TenantChatStatisticRepositoryImpl(),
};

export const {
  tenantStatisticRepository,
  saleStatisticRepository,
  tenantChatStatisticRepository,
} = repositories;

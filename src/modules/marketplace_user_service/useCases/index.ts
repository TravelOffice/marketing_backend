import GetUserListUseCaseImpl from './GetTenantUserListUseCaseImpl';
import { GetTenantUserListUseCase } from './interfaces/GetTenantUserListUseCase';
import CreateMarketplaceUserUseCaseImpl from './CreateMarketplaceUserUseCaseImpl';
import { CreateMarketplaceUserUseCase } from './interfaces/CreateMarketplaceUserUseCase';
import { UpdateMarketplaceUserUseCase } from './interfaces/UpdateMarketplaceUserUseCase';
import UpdateMarketplaceUserUseCaseImpl from './UpdateMarketplaceUserUseCaseImpl';
import { EnableMarketplaceUserUseCase } from './interfaces/EnableMarketplaceUserUseCase';
import EnableMarketplaceuserUseCaseImpl from './EnableMarketplaceuserUseCaseImpl';
import { GetMarketplaceUserUseCase } from './interfaces/GetMarketplaceUserUseCase';
import GetMarketplaceUserUseCaseImpl from './GetMarketplaceUserUseCaseImpl';
import { CreateMultiMarketplaceUserUseCase } from './interfaces/CreateMultiMarketplaceUserUseCase';
import CreateMultiMarketplaceUserUseCaseImpl from './CreateMultiMarketplaceUserUseCaseImpl';

interface UseCases {
  getTenantUserListUseCase: GetTenantUserListUseCase,
  createMarketplaceUserUseCase: CreateMarketplaceUserUseCase,
  createMultiMarketplaceUserUseCase: CreateMultiMarketplaceUserUseCase,
  updateMarketplaceUserUseCase: UpdateMarketplaceUserUseCase,
  enableMarketplaceUserUseCase: EnableMarketplaceUserUseCase,
  getMarketplaceUserUseCase: GetMarketplaceUserUseCase,
}

const useCases: UseCases = {
  getTenantUserListUseCase: new GetUserListUseCaseImpl(),
  createMarketplaceUserUseCase: new CreateMarketplaceUserUseCaseImpl(),
  createMultiMarketplaceUserUseCase: new CreateMultiMarketplaceUserUseCaseImpl(),
  updateMarketplaceUserUseCase: new UpdateMarketplaceUserUseCaseImpl(),
  enableMarketplaceUserUseCase: new EnableMarketplaceuserUseCaseImpl(),
  getMarketplaceUserUseCase: new GetMarketplaceUserUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  getTenantUserListUseCase,
  createMarketplaceUserUseCase,
  updateMarketplaceUserUseCase,
  enableMarketplaceUserUseCase,
  getMarketplaceUserUseCase,
  createMultiMarketplaceUserUseCase,
} = useCases;

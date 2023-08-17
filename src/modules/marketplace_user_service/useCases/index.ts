import GetUserListUseCaseImpl from './GetTenantUserListUseCaseImpl';
import { GetTenantUserListUseCase } from './interfaces/GetTenantUserListUseCase';
import CreateMarketplaceUserUseCaseImpl from './CreateMarketplaceUserUseCaseImpl';
import { CreateMarketplaceUserUseCase } from './interfaces/CreateMarketplaceUserUseCase';
import { UpdateMarketplaceUserUseCase } from './interfaces/UpdateMarketplaceUserUseCase';
import UpdateMarketplaceUserUseCaseImpl from './UpdateMarketplaceUserUseCaseImpl';

interface UseCases {
  getTenantUserListUseCase: GetTenantUserListUseCase,
  createMarketplaceUserUseCase: CreateMarketplaceUserUseCase,
  updateMarketplaceUserUseCase: UpdateMarketplaceUserUseCase,
}

const useCases: UseCases = {
  getTenantUserListUseCase: new GetUserListUseCaseImpl(),
  createMarketplaceUserUseCase: new CreateMarketplaceUserUseCaseImpl(),
  updateMarketplaceUserUseCase: new UpdateMarketplaceUserUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  getTenantUserListUseCase,
  createMarketplaceUserUseCase,
  updateMarketplaceUserUseCase,
} = useCases;

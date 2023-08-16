import GetUserListUseCaseImpl from './GetTenantUserListUseCaseImpl';
import { GetTenantUserListUseCase } from './interfaces/GetTenantUserListUseCase';

interface UseCases {
  getTenantUserListUseCase: GetTenantUserListUseCase,
}

const useCases: UseCases = {
  getTenantUserListUseCase: new GetUserListUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  getTenantUserListUseCase,
} = useCases;

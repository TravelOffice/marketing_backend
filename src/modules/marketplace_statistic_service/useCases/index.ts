// TODO: Declare use cases which can be used in this service here

import GetMarketplaceStatisticListUseCaseImpl from './GetMarketplaceStatisticUseCaseImpl';
import GetOrganizationStatisticUseCaseImpl from './GetOrganizationStatisticUseCaseImpl';
import { GetMarketplaceStatisticUseCase } from './interfaces/GetMarketplaceStatisticUseCase';
import { GetOrganizationStatisticUseCase } from './interfaces/GetOrganizationStatisticUseCase';

interface UseCases {
  getOrganizationStatisticUseCase: GetOrganizationStatisticUseCase,
  getMarketplaceStatisticUseCase: GetMarketplaceStatisticUseCase,
}

const useCases : UseCases = {
  getOrganizationStatisticUseCase: new GetOrganizationStatisticUseCaseImpl(),
  getMarketplaceStatisticUseCase: new GetMarketplaceStatisticListUseCaseImpl(),
};

export const {
  getOrganizationStatisticUseCase,
  getMarketplaceStatisticUseCase,
} = useCases;

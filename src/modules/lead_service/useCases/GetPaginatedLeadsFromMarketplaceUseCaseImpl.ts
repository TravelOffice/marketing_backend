import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { leadRepository } from '../repositories';
import {
  GetPaginatedListFromMarketplaceUseCase,
} from './interfaces/GetPaginatedListFromMarketplaceUseCase';

export default class GetPaginatedListFromMarketplaceUseCaseImpl
implements GetPaginatedListFromMarketplaceUseCase {
  invoke = async (
    tenant: string,
    paginationParams: PaginationParams,
  ) => leadRepository.availableListForMarketplace(tenant, paginationParams);
}

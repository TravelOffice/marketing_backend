import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { tourTemplateRepository } from '../repositories';
import {
  GetPaginatedListFromMarketplaceUseCase,
} from './interfaces/GetPaginatedListFromMarketplaceUseCase';

export default class GetPaginatedListFromMarketplaceUseCaseImpl
implements GetPaginatedListFromMarketplaceUseCase {
  invoke = async (
    tenant: string,
    paginationParams: PaginationParams,
  ) => tourTemplateRepository.availableListForMarketplace(tenant, paginationParams);
}

import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { TourTemplate } from '../../models/TourTemplate';

export interface GetPaginatedListFromMarketplaceUseCase {
  invoke: (
    tenant: string,
    paginationParams: PaginationParams,
  ) => Promise<PaginationResponsePayload<TourTemplate> | undefined>,
}

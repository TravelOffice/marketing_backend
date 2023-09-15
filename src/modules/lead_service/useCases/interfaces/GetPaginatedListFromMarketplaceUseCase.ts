import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { Lead } from '../../models/Lead';

export interface GetPaginatedListFromMarketplaceUseCase {
  invoke: (
    tenant: string,
    paginationParams: PaginationParams,
  ) => Promise<PaginationResponsePayload<Lead> | undefined>,
}

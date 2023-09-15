import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import logger from './utils/logger';
import { getPaginatedListFromMarketplaceUseCase } from './useCases';

export interface GetLeadsFromMarketplaceEvent {
  organization: string,
  paginationParams: PaginationParams,
  fromUser: string,
}

// eslint-disable-next-line import/prefer-default-export
export const handler = async (
  {
    organization,
    paginationParams,
    fromUser,
  }: GetLeadsFromMarketplaceEvent,
) => {
  logger.log(`Receive request for get available leads for organization ${organization} by username ${fromUser}`);
  logger.log(`Pagination params: ${JSON.stringify(paginationParams)}`);
  const availableLeads = await getPaginatedListFromMarketplaceUseCase
    .invoke(organization, paginationParams);
  logger.log(`Available leads: ${JSON.stringify(availableLeads)}`);
  return availableLeads;
};

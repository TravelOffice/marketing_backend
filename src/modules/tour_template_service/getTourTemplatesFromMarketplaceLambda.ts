import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import logger from './utils/logger';
import { getPaginatedListFromMarketplaceUseCase } from './useCases';

export interface GetTourTemplatesFromMarketplaceEvent {
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
  }: GetTourTemplatesFromMarketplaceEvent,
) => {
  logger.log(`Receive request for get available tour templates for organization ${organization} by username ${fromUser}`);
  logger.log(`Pagination params: ${JSON.stringify(paginationParams)}`);
  const availableTourTemplates = await getPaginatedListFromMarketplaceUseCase
    .invoke(organization, paginationParams);
  logger.log(`Available tour templates: ${JSON.stringify(availableTourTemplates)}`);
  return availableTourTemplates;
};

handler({
  organization: 'pys',
  fromUser: 'anhnt',
  paginationParams: {},
});

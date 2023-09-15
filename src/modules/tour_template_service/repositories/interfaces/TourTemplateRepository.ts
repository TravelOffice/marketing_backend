import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { TourTemplate } from '../../models/TourTemplate';

export interface TourTemplateRepository {
  generateTourTemplateCode: (tenantId: string) => Promise<string>;
  list: (tenantId: string) => Promise<Array<TourTemplate>>;
  availableListForMarketplace: (
    tenant: string,
    paginationParams: PaginationParams,
  ) => Promise<PaginationResponsePayload<TourTemplate> | undefined>,
  create: (
    tenantId: string,
    tourTemplate: TourTemplate,
  ) => Promise<TourTemplate>;
  get: (
    tenantId: string,
    tourTemplateId: string,
  ) => Promise<TourTemplate | undefined>;
  update: (
    tenantId: string,
    tourTemplateId: string,
    tourTemplate: TourTemplate,
  ) => Promise<TourTemplate>;
  delete: (tenantId: string, tourTemplateId: string) => Promise<string>;
}

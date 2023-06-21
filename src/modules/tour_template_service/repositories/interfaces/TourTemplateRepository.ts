import { TourTemplate, TourTemplateWithId } from '../../models/TourTemplate';

export interface TourTemplateRepository {
  list: (tenantId: string) => Promise<Array<TourTemplateWithId>>;
  create: (
    tenantId: string,
    tourTemplate: TourTemplate
  ) => Promise<TourTemplateWithId>;
  get: (
    tenantId: string,
    tourTemplateId: string
  ) => Promise<TourTemplateWithId | undefined>;
  update: (
    tenantId: string,
    tourTemplateId: string,
    tourTemplate: TourTemplate
  ) => Promise<TourTemplateWithId>;
  delete: (tenantId: string, tourTemplateId: string) => Promise<string>;
}

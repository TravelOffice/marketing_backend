import { TourTemplate } from '../../models/tour/TourTemplate';

export interface TourTemplateRepository {
  get: (
    tenantId: string,
    tourTemplateId: string,
  ) => Promise<TourTemplate | undefined>;
}

import { TourTemplate } from '../../models/TourTemplate';

export interface GetTourTemplateUseCase {
  invoke: (
    tenantId: string,
    tourTemplateId: string,
  ) => Promise<TourTemplate | undefined>;
}

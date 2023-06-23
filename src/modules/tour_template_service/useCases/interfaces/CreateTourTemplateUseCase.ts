import { TourTemplate } from '../../models/TourTemplate';

export interface CreateTourTemplateUseCase {
  invoke: (
    tenantId: string,
    tourTemplate: TourTemplate,
  ) => Promise<TourTemplate>;
}

import { TourTemplate } from '../../models/TourTemplate';

export interface UpdateTourTemplateUseCase {
  invoke: (
    tenantId: string,
    tourTemplateId: string,
    tourTemplate: TourTemplate,
  ) => Promise<TourTemplate>;
}

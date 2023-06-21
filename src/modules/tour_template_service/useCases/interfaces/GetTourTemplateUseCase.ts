import { TourTemplateWithId } from '../../models/TourTemplate';

export interface GetTourTemplateUseCase {
  invoke: (
    tenantId: string,
    tourTemplateId: string
  ) => Promise<TourTemplateWithId | undefined>;
}

import { TourTemplate } from '../../models/TourTemplate';

export interface GetTourTemplateListUseCase {
  invoke: (tenantId: string) => Promise<Array<TourTemplate>>;
}
